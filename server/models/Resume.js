import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const personalInfoSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  photo: { type: String, default: null },
}, { _id: false });

const summarySchema = new mongoose.Schema({
  text: { type: String, default: '' },
}, { _id: false });

const experienceItemSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  bullets: [{ type: String }],
  order: { type: Number, default: 0 },
});

const educationItemSchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  field: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gpa: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const skillItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Intermediate' },
  order: { type: Number, default: 0 },
});

const projectItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  techStack: [{ type: String }],
  link: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const certificationItemSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  link: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const customSectionItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const sectionsSchema = new mongoose.Schema({
  personalInfo: { type: personalInfoSchema, default: () => ({}) },
  summary: { type: summarySchema, default: () => ({}) },
  experience: [experienceItemSchema],
  education: [educationItemSchema],
  skills: [skillItemSchema],
  projects: [projectItemSchema],
  certifications: [certificationItemSchema],
  customSection: [customSectionItemSchema],
  sectionOrder: {
    type: [String],
    default: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'customSection'],
  },
}, { _id: false });

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
      default: 'Untitled Resume',
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    template: {
      type: String,
      enum: ['modern', 'classic', 'minimal', 'creative', 'executive'],
      default: 'modern',
    },
    colorTheme: {
      type: String,
      default: '#6366f1',
    },
    fontFamily: {
      type: String,
      enum: ['Inter', 'Georgia', 'Roboto', 'Playfair Display'],
      default: 'Inter',
    },
    spacing: {
      type: String,
      enum: ['compact', 'standard', 'spacious'],
      default: 'standard',
    },
    sections: {
      type: sectionsSchema,
      default: () => ({}),
    },
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    resumeScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true,
      default: () => uuidv4(),
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    lastAutoSaved: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for public access
resumeSchema.index({ shareId: 1, isPublic: 1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
