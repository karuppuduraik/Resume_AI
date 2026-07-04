const mongoose = require('mongoose');

const atsReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobTitle: {
      type: String,
      default: '',
    },
    jobDescription: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    keywordMatch: {
      score: { type: Number, default: 0 },
      matchingKeywords: [{ type: String }],
      missingKeywords: [{ type: String }],
    },
    formatting: {
      score: { type: Number, default: 0 },
      feedback: [{ type: String }],
    },
    missingSkills: [{ type: String }],
    suggestions: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ATSReport', atsReportSchema);
