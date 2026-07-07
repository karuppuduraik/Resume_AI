const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { protectAdmin } = require('../middleware/admin');

// Require authentication and administrator role for all routes under this controller
router.use(protect);
router.use(protectAdmin);

router.route('/users')
  .get(getAllUsers)
  .post(createUser);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
