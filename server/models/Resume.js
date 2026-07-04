const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'My Resume',
      trim: true,
    },
    template: {
      type: String,
      default: 'modern', // e.g. modern, minimal, professional, developer
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      photoUrl: { type: String, default: '' },
    },
    summary: { type: String, default: '' },
    education: [
      {
        school: { type: String, default: '' },
        degree: { type: String, default: '' },
        fieldOfStudy: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' },
        grade: { type: String, default: '' },
      },
    ],
    experience: [
      {
        company: { type: String, default: '' },
        position: { type: String, default: '' },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        current: { type: Boolean, default: false },
        description: { type: String, default: '' },
      },
    ],
    projects: [
      {
        title: { type: String, default: '' },
        role: { type: String, default: '' },
        technologies: { type: String, default: '' }, // comma separated or string
        link: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    skills: [
      {
        name: { type: String, default: '' },
        level: { type: String, default: 'Intermediate' }, // Beginner, Intermediate, Expert
      },
    ],
    certifications: [
      {
        name: { type: String, default: '' },
        issuer: { type: String, default: '' },
        date: { type: String, default: '' },
        link: { type: String, default: '' },
      },
    ],
    languages: [
      {
        name: { type: String, default: '' },
        proficiency: { type: String, default: '' }, // Native, Fluent, Professional, Conversational
      },
    ],
    achievements: [
      {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    interests: [
      {
        type: String,
      },
    ],
    references: [
      {
        name: { type: String, default: '' },
        company: { type: String, default: '' },
        contact: { type: String, default: '' },
      },
    ],
    atsScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
