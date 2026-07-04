const express = require('express');
const router = express.Router();
const {
  generateSummaryController,
  generateSkillsController,
  generateProjectsController,
  generateCoverLetterController,
  checkATSController,
  getATSReports,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// All AI and ATS routes are protected
router.use(protect);

router.post('/summary', generateSummaryController);
router.post('/skills', generateSkillsController);
router.post('/projects', generateProjectsController);
router.post('/cover-letter', generateCoverLetterController);
router.post('/ats-check', checkATSController);
router.get('/ats-reports', getATSReports);

module.exports = router;
