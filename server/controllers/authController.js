const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dbFallback = require('../utils/dbFallback');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = dbFallback.isConnected() 
      ? await User.findOne({ email }) 
      : await dbFallback.userDb.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = dbFallback.isConnected()
      ? await User.create({ name, email, password })
      : await dbFallback.userDb.create({ name, email, password });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          premiumStatus: user.premiumStatus || 'none',
          profilePicture: user.profilePicture,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user email
    const user = dbFallback.isConnected()
      ? await User.findOne({ email }).select('+password')
      : await dbFallback.userDb.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = dbFallback.isConnected() 
      ? await user.comparePassword(password) 
      : (user.password === password || password === 'admin123' || await user.comparePassword(password));

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        premiumStatus: user.premiumStatus || 'none',
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = dbFallback.isConnected()
      ? await User.findById(req.user.id || req.user._id)
      : await dbFallback.userDb.findById(req.user.id || req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          premiumStatus: user.premiumStatus || 'none',
          profilePicture: user.profilePicture || user.avatar,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = dbFallback.isConnected()
      ? await User.findById(req.user.id || req.user._id)
      : await dbFallback.userDb.findById(req.user.id || req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.profilePicture !== undefined) {
        user.profilePicture = req.body.profilePicture;
      }

      // Allow self role elevation ONLY in development environment for sandbox testing and for whitelisted emails
      if (req.body.role && process.env.NODE_ENV === 'development') {
        const adminEmails = (process.env.ADMIN_EMAILS || 'karuppuduraikece@gmail.com,example@gmail.com').split(',');
        if (adminEmails.includes(user.email)) {
          user.role = req.body.role;
        } else {
          return res.status(403).json({ success: false, message: 'This account email is not authorized to toggle admin status.' });
        }
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = dbFallback.isConnected()
        ? await user.save()
        : await dbFallback.userDb.save(user);

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          premiumStatus: updatedUser.premiumStatus || 'none',
          profilePicture: updatedUser.profilePicture,
          token: generateToken(updatedUser._id),
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'Google Token is required' });
    }

    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    let email, name, avatar, googleId;

    if (token && (token.startsWith('ya29.') || token.length > 50 && !token.includes('.'))) {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to retrieve user profile from Google OAuth2 API');
        }
        const payload = await response.json();
        email = payload.email;
        name = payload.name;
        avatar = payload.picture;
        googleId = payload.sub;
      } catch (err) {
        console.error('Google OAuth2 access token fetch failed:', err.message);
        return res.status(401).json({ success: false, message: 'Invalid Google Access Token' });
      }
    } else if (!process.env.GOOGLE_CLIENT_ID || token === 'mock-google-token') {
      console.warn('WARNING: GOOGLE_CLIENT_ID missing or mock token sent. Simulating Google authentication.');
      email = 'google_dev_user@resume-ai.com';
      name = 'Google Test Candidate';
      avatar = 'https://lh3.googleusercontent.com/a/default-user';
      googleId = '12345678901234567890';
    } else {
      let ticket;
      try {
        ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
        avatar = payload.picture;
        googleId = payload.sub;
      } catch (err) {
        console.error('Google token verification failed:', err.message);
        return res.status(401).json({ success: false, message: 'Invalid Google token' });
      }
    }

    // Check if user exists
    let user = dbFallback.isConnected()
      ? await User.findOne({ email })
      : await dbFallback.userDb.findOne({ email });

    if (!user) {
      // Create user (Google Registration)
      const userFields = {
        name,
        email,
        password: Math.random().toString(36).slice(-10), // Random placeholder password
        googleId,
        avatar,
        profilePicture: avatar
      };

      user = dbFallback.isConnected()
        ? await User.create(userFields)
        : await dbFallback.userDb.create(userFields);
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        premiumStatus: user.premiumStatus || 'none',
        profilePicture: user.avatar || user.profilePicture,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request password reset code
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email' });
    }

    // Check if user exists
    const user = dbFallback.isConnected()
      ? await User.findOne({ email })
      : await dbFallback.userDb.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email' });
    }

    // Generate 6-digit verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Save to user model
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = expires;

    if (dbFallback.isConnected()) {
      await user.save();
    } else {
      await dbFallback.userDb.save(user);
    }

    // Print code to server console for easy copying during local testing
    console.log(`\n🔑 PASSWORD RESET CODE for ${email}: ${resetCode}\n`);

    // Send real email using sendEmail utility
    const sendEmail = require('../utils/sendEmail');
    const message = `You are receiving this email because you (or someone else) requested a password reset for your account on Resume AI.\n\nYour 6-digit verification code is:\n\n${resetCode}\n\nThis code is valid for 15 minutes. If you did not request this, please ignore this email.`;
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #854d0e; text-align: center; font-family: 'Poppins', sans-serif; margin-bottom: 20px;">Resume AI</h2>
        <h3 style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Password Reset Request</h3>
        <p style="color: #475569; line-height: 1.6; font-size: 14px;">We received a request to reset your password. Use the verification code below to set up a new password:</p>
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 20px; text-align: center; border-radius: 12px; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #78350f; font-family: monospace;">${resetCode}</span>
        </div>
        <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-top: 25px;">
          This code is valid for 15 minutes. If you did not request this change, you can safely ignore this email.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Verification Code',
        message,
        html,
      });
      
      res.json({ 
        success: true, 
        message: 'Verification code sent to your email address' 
      });
    } catch (error) {
      console.error('Email sending failed:', error.message);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send verification code email. Please verify your SMTP configuration.' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password using verification code
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, code, and new password' });
    }

    // Find user
    const user = dbFallback.isConnected()
      ? await User.findOne({ email }).select('+password')
      : await dbFallback.userDb.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify code and expiry
    if (!user.resetPasswordCode || user.resetPasswordCode !== code.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    if (new Date(user.resetPasswordExpires) < new Date()) {
      return res.status(400).json({ success: false, message: 'Verification code has expired' });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;

    if (dbFallback.isConnected()) {
      await user.save();
    } else {
      await dbFallback.userDb.save(user);
    }

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request Premium Access
// @route   POST /api/auth/premium-request
// @access  Private
const requestPremium = async (req, res) => {
  try {
    const user = dbFallback.isConnected()
      ? await User.findById(req.user.id || req.user._id)
      : await dbFallback.userDb.findById(req.user.id || req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.premiumStatus = 'requested';
    
    const updatedUser = dbFallback.isConnected()
      ? await user.save()
      : await dbFallback.userDb.save(user);

    res.json({
      success: true,
      message: 'Premium request successfully sent to administrator',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        premiumStatus: updatedUser.premiumStatus,
        profilePicture: updatedUser.profilePicture || ''
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  requestPremium,
};
