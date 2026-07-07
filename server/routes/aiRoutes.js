const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  generateSummaryController,
  generateSkillsController,
  generateProjectsController,
  generateCoverLetterController,
  checkATSController,
  checkATSFileController,
  getATSReports,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// All AI and ATS routes are protected
router.use(protect);

router.post('/summary', generateSummaryController);
router.post('/skills', generateSkillsController);
router.post('/projects', generateProjectsController);
router.post('/cover-letter', generateCoverLetterController);
router.post('/ats-check', checkATSController);
router.post('/ats-check-file', upload.single('file'), checkATSFileController);
router.get('/ats-reports', getATSReports);

module.exports = router;
