const geminiService = require('../services/geminiService');
const Resume = require('../models/Resume');
const ATSReport = require('../models/ATSReport');
const dbFallback = require('../utils/dbFallback');

// @desc    Generate professional summary
// @route   POST /api/ai/summary
// @access  Private
const generateSummaryController = async (req, res) => {
  try {
    const { title, skills } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a job title' });
    }

    const summary = await geminiService.generateSummary({ title, skills });
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate suggested skills
// @route   POST /api/ai/skills
// @access  Private
const generateSkillsController = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a job title' });
    }

    const skills = await geminiService.generateSkills({ title });
    res.json({ success: true, data: skills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate project descriptions
// @route   POST /api/ai/projects
// @access  Private
const generateProjectsController = async (req, res) => {
  try {
    const { title, technologies } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a project title' });
    }

    const bullets = await geminiService.generateProjectDescription({ title, technologies });
    res.json({ success: true, data: bullets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate cover letter
// @route   POST /api/ai/cover-letter
// @access  Private
const generateCoverLetterController = async (req, res) => {
  try {
    const { name, title, company, jobDescription, skills } = req.body;

    if (!title || !jobDescription) {
      return res.status(400).json({ success: false, message: 'Please provide at least a job title and job description' });
    }

    const coverLetter = await geminiService.generateCoverLetter({
      name: name || req.user.name,
      title,
      company,
      jobDescription,
      skills,
    });
    res.json({ success: true, data: coverLetter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check ATS Score & feedback
// @route   POST /api/ats/check
// @access  Private
const checkATSController = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ success: false, message: 'Please provide both resumeId and jobDescription' });
    }

    // STRICT DATA ISOLATION: verify the resume belongs to the user
    const query = { _id: resumeId, userId: req.user.id };
    const resume = dbFallback.isConnected()
      ? await Resume.findOne(query)
      : await dbFallback.resumeDb.findOne(query);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Construct resume text representation for AI matching
    let resumeText = `Name: ${resume.personalInfo.fullName}\nEmail: ${resume.personalInfo.email}\n`;
    resumeText += `Summary:\n${resume.summary}\n\n`;
    
    resumeText += `Experience:\n`;
    resume.experience.forEach(exp => {
      resumeText += `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}\n`;
    });

    resumeText += `\nEducation:\n`;
    resume.education.forEach(edu => {
      resumeText += `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.school}\n`;
    });

    resumeText += `\nSkills:\n${resume.skills.map(s => s.name).join(', ')}\n`;
    
    resumeText += `\nProjects:\n`;
    resume.projects.forEach(proj => {
      resumeText += `- ${proj.title} using ${proj.technologies}: ${proj.description}\n`;
    });

    // Run AI / Mock analysis
    const analysis = await geminiService.checkATS(resumeText, jobDescription);

    // Save report to database
    const reportFields = {
      userId: req.user.id,
      resumeId: resume._id,
      jobTitle: resume.title,
      jobDescription,
      score: analysis.score,
      keywordMatch: analysis.keywordMatch,
      formatting: analysis.formatting,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
    };

    const report = dbFallback.isConnected()
      ? await ATSReport.create(reportFields)
      : await dbFallback.atsDb.create(reportFields);

    // Update the resume's ATS score in DB
    resume.atsScore = analysis.score;
    
    if (dbFallback.isConnected()) {
      await resume.save();
    } else {
      await dbFallback.resumeDb.save(resume);
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check ATS Score of uploaded resume file
// @route   POST /api/ai/ats-check-file
// @access  Private
const checkATSFileController = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const mongoose = require('mongoose');

    if (!req.file || !jobDescription) {
      return res.status(400).json({ success: false, message: 'Please provide both a resume file and a job description' });
    }

    let resumeText = '';
    if (req.file.mimetype === 'application/pdf') {
      const pdfParseModule = require('pdf-parse');
      if (pdfParseModule.PDFParse) {
        const parser = new pdfParseModule.PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        resumeText = pdfData.text;
      } else {
        const pdf = typeof pdfParseModule === 'function' ? pdfParseModule : (pdfParseModule.default || pdfParseModule);
        const pdfData = await pdf(req.file.buffer);
        resumeText = pdfData.text;
      }
    } else if (req.file.mimetype === 'text/plain') {
      resumeText = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported file format. Please upload PDF or TXT.' });
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ success: false, message: 'Could not extract text from the file.' });
    }

    // Call AI/Mock checkATS
    const analysis = await geminiService.checkATS(resumeText, jobDescription);

    // Save report to database
    const reportFields = {
      userId: req.user.id,
      resumeId: new mongoose.Types.ObjectId(), // Create dummy ID since it's uploaded directly
      jobTitle: req.file.originalname,
      jobDescription,
      score: analysis.score,
      keywordMatch: analysis.keywordMatch,
      formatting: analysis.formatting,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
    };

    const report = dbFallback.isConnected()
      ? await ATSReport.create(reportFields)
      : await dbFallback.atsDb.create(reportFields);

    res.json({ success: true, data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all ATS reports for the user
// @route   GET /api/ats/reports
// @access  Private
const getATSReports = async (req, res) => {
  try {
    const query = { userId: req.user.id };
    const reports = dbFallback.isConnected()
      ? await ATSReport.find(query).sort({ createdAt: -1 })
      : await dbFallback.atsDb.find(query);

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateSummaryController,
  generateSkillsController,
  generateProjectsController,
  generateCoverLetterController,
  checkATSController,
  checkATSFileController,
  getATSReports,
};
