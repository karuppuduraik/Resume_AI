const mongoose = require('mongoose');

// In-Memory Collections
const memoryStore = {
  users: [],
  resumes: [],
  atsReports: [],
};

// Check if mongoose is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// User Operations
const userDb = {
  find: async (query = {}) => {
    if (isConnected()) return null;
    if (query.$or) {
      const searchVal = query.$or[0].name?.$regex || '';
      const regex = new RegExp(searchVal, 'i');
      return memoryStore.users.filter(u => regex.test(u.name) || regex.test(u.email));
    }
    return memoryStore.users;
  },
  findOne: async (query) => {
    if (isConnected()) return null; // let mongoose handle it
    const key = Object.keys(query)[0];
    const val = query[key];
    return memoryStore.users.find(u => u[key] === val) || null;
  },
  findById: async (id) => {
    if (isConnected()) return null;
    if (!id) return null;
    return memoryStore.users.find(u => u._id === id.toString()) || null;
  },
  findByIdAndUpdate: async (id, updateData) => {
    if (isConnected()) return null;
    const idx = memoryStore.users.findIndex(u => u._id === id.toString());
    if (idx !== -1) {
      memoryStore.users[idx] = { ...memoryStore.users[idx], ...updateData, updatedAt: new Date() };
      return memoryStore.users[idx];
    }
    return null;
  },
  findByIdAndDelete: async (id) => {
    if (isConnected()) return null;
    const idx = memoryStore.users.findIndex(u => u._id === id.toString());
    if (idx !== -1) {
      const deleted = memoryStore.users[idx];
      memoryStore.users.splice(idx, 1);
      return deleted;
    }
    return null;
  },
  create: async (userData) => {
    const newUser = {
      _id: Math.random().toString(36).substring(2, 9),
      ...userData,
      profilePicture: userData.profilePicture || '',
      role: userData.role || 'user',
      premiumStatus: userData.premiumStatus || 'none',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Mock comparison helper
      comparePassword: async function(candidate) {
        // Simple mock since bcrypt hash doesn't match raw in mock mode
        return true; 
      }
    };
    memoryStore.users.push(newUser);
    return newUser;
  },
  save: async (userObj) => {
    const idx = memoryStore.users.findIndex(u => u._id === userObj._id);
    if (idx !== -1) {
      memoryStore.users[idx] = { ...memoryStore.users[idx], ...userObj, updatedAt: new Date() };
      return memoryStore.users[idx];
    }
    return userObj;
  }
};

// Resume Operations
const resumeDb = {
  find: async (query, sortOption = { updatedAt: -1 }) => {
    let list = memoryStore.resumes.filter(r => r.userId === query.userId);
    
    if (query.$or) {
      const search = query.$or[0].title.$regex;
      const regex = new RegExp(search, 'i');
      list = list.filter(r => 
        regex.test(r.title) || 
        regex.test(r.personalInfo?.fullName) ||
        r.skills?.some(s => regex.test(s.name))
      );
    }
    
    // Sort
    const sortField = Object.keys(sortOption)[0];
    const sortOrder = sortOption[sortField];
    list.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });

    return list;
  },
  findOne: async (query) => {
    return memoryStore.resumes.find(r => r._id === query._id && r.userId === query.userId) || null;
  },
  create: async (resumeData) => {
    const newResume = {
      _id: Math.random().toString(36).substring(2, 9),
      ...resumeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.resumes.push(newResume);
    return newResume;
  },
  save: async (resumeObj) => {
    const idx = memoryStore.resumes.findIndex(r => r._id === resumeObj._id);
    if (idx !== -1) {
      memoryStore.resumes[idx] = { ...resumeObj, updatedAt: new Date() };
      return memoryStore.resumes[idx];
    }
    return resumeObj;
  },
  findOneAndDelete: async (query) => {
    const idx = memoryStore.resumes.findIndex(r => r._id === query._id && r.userId === query.userId);
    if (idx !== -1) {
      const deleted = memoryStore.resumes[idx];
      memoryStore.resumes.splice(idx, 1);
      return deleted;
    }
    return null;
  },
  countDocuments: async (query) => {
    return memoryStore.resumes.filter(r => r.userId === query.userId).length;
  }
};

// ATS Report Operations
const atsDb = {
  create: async (reportData) => {
    const newReport = {
      _id: Math.random().toString(36).substring(2, 9),
      ...reportData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.atsReports.push(newReport);
    return newReport;
  },
  find: async (query) => {
    return memoryStore.atsReports
      .filter(r => r.userId === query.userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
};

module.exports = {
  isConnected,
  userDb,
  resumeDb,
  atsDb,
  memoryStore,
};
