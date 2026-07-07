// Middleware to verify user is an admin
const protectAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied: Administrator privileges required' 
    });
  }
};

module.exports = { protectAdmin };
