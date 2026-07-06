const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resume-ai', {
      serverSelectionTimeoutMS: 2000 // fail fast if local db is down
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    console.log('WARNING: Operating in offline In-Memory fallback mode. Data will not persist across server restarts.');
  }
};

module.exports = connectDB;
