const Resume = require('../models/Resume');
const dbFallback = require('../utils/dbFallback');

// @desc    Get all user resumes (Search, Sort, Pagination supported)
// @route   GET /api/resume
// @access  Private
const getMyResumes = async (req, res) => {
  try {
    const { search, sort, page = 1, limit = 10 } = req.query;
    
    // STRICT DATA ISOLATION: filter by req.user.id
    const query = { userId: req.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
        { 'skills.name': { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { updatedAt: -1 }; // Default: Newest first
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'atsScore') {
      sortOption = { atsScore: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    }

    if (dbFallback.isConnected()) {
      const skipIndex = (parseInt(page) - 1) * parseInt(limit);
      const total = await Resume.countDocuments(query);
      const resumes = await Resume.find(query)
        .sort(sortOption)
        .limit(parseInt(limit))
        .skip(skipIndex);

      return res.json({
        success: true,
        data: resumes,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } else {
      // In-Memory operations
      const list = await dbFallback.resumeDb.find(query, sortOption);
      const total = list.length;
      const skipIndex = (parseInt(page) - 1) * parseInt(limit);
      const pageList = list.slice(skipIndex, skipIndex + parseInt(limit));

      return res.json({
        success: true,
        data: pageList,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resume/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const query = { _id: req.params.id, userId: req.user.id };
    
    const resume = dbFallback.isConnected()
      ? await Resume.findOne(query)
      : await dbFallback.resumeDb.findOne(query);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new resume
// @route   POST /api/resume
// @access  Private
const createResume = async (req, res) => {
  try {
    const { title, template } = req.body;

    const resumeFields = {
      userId: req.user.id,
      title: title || 'Untitled Resume',
      template: template || 'modern',
      personalInfo: {
        fullName: req.user.name,
        email: req.user.email,
        phone: '',
        address: '',
        linkedin: '',
        github: '',
        portfolio: '',
        photoUrl: '',
      },
      education: [],
      experience: [],
      projects: [],
      skills: [],
      certifications: [],
      languages: [],
      achievements: [],
    };

    const resume = dbFallback.isConnected()
      ? await Resume.create(resumeFields)
      : await dbFallback.resumeDb.create(resumeFields);

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user resume
// @route   PUT /api/resume/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    const query = { _id: req.params.id, userId: req.user.id };

    let resume = dbFallback.isConnected()
      ? await Resume.findOne(query)
      : await dbFallback.resumeDb.findOne(query);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Update fields
    const fieldsToUpdate = [
      'title',
      'template',
      'personalInfo',
      'summary',
      'education',
      'experience',
      'projects',
      'skills',
      'certifications',
      'languages',
      'achievements',
      'interests',
      'references',
      'atsScore',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        resume[field] = req.body[field];
      }
    });

    const updatedResume = dbFallback.isConnected()
      ? await resume.save()
      : await dbFallback.resumeDb.save(resume);

    res.json({ success: true, data: updatedResume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user resume
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const query = { _id: req.params.id, userId: req.user.id };

    const resume = dbFallback.isConnected()
      ? await Resume.findOneAndDelete(query)
      : await dbFallback.resumeDb.findOneAndDelete(query);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found or not authorized' });
    }

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
