const User = require('../models/User');
const Resume = require('../models/Resume');
const ATSReport = require('../models/ATSReport');
const dbFallback = require('../utils/dbFallback');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = dbFallback.isConnected()
      ? await User.find(query).select('-password')
      : await dbFallback.userDb.find(query);

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new user by Admin
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
  try {
    const { name, email, role, premiumStatus, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter all fields' });
    }

    // Check if user exists
    const userExists = dbFallback.isConnected()
      ? await User.findOne({ email })
      : await dbFallback.userDb.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const userFields = {
      name,
      email,
      role: role || 'user',
      premiumStatus: premiumStatus || 'none',
      password,
    };

    let newUser;
    if (dbFallback.isConnected()) {
      newUser = await User.create(userFields);
    } else {
      newUser = await dbFallback.userDb.create(userFields);
    }

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        premiumStatus: newUser.premiumStatus || 'none',
        profilePicture: newUser.profilePicture || '',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user details by Admin
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { name, email, role, premiumStatus, password } = req.body;
    const userId = req.params.id;

    let user = dbFallback.isConnected()
      ? await User.findById(userId)
      : await dbFallback.userDb.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (premiumStatus) user.premiumStatus = premiumStatus;

    if (password) {
      if (dbFallback.isConnected()) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      } else {
        user.password = password;
      }
    }

    let updatedUser;
    if (dbFallback.isConnected()) {
      updatedUser = await user.save();
    } else {
      updatedUser = await dbFallback.userDb.save(user);
    }

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        premiumStatus: updatedUser.premiumStatus || 'none',
        profilePicture: updatedUser.profilePicture || updatedUser.avatar || '',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user by Admin (Cascade Delete)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent self deletion
    if (userId.toString() === (req.user.id || req.user._id).toString()) {
      return res.status(400).json({ success: false, message: 'Administrators cannot delete their own profile account' });
    }

    let user = dbFallback.isConnected()
      ? await User.findById(userId)
      : await dbFallback.userDb.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Cascade delete resumes & reports
    if (dbFallback.isConnected()) {
      await Resume.deleteMany({ userId });
      await ATSReport.deleteMany({ userId });
      await User.findByIdAndDelete(userId);
    } else {
      // In-memory cascade delete
      dbFallback.memoryStore.resumes = dbFallback.memoryStore.resumes.filter(r => r.userId !== userId);
      dbFallback.memoryStore.atsReports = dbFallback.memoryStore.atsReports.filter(r => r.userId !== userId);
      await dbFallback.userDb.findByIdAndDelete(userId);
    }

    res.json({
      success: true,
      message: 'User and all associated resumes and reports successfully deleted',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
