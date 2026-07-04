const express = require('express');
const router = express.Router();
const {
  getMyResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

// All resume routes are protected
router.use(protect);

router.route('/')
  .get(getMyResumes)
  .post(createResume);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

module.exports = router;
