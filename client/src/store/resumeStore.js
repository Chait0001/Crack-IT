import { create } from 'zustand';
import { calculateResumeScore } from '../utils/ats-scorer';

const defaultSections = {
  personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', photo: null },
  summary: { text: '' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  customSection: [],
  sectionOrder: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'customSection'],
};

export const useResumeStore = create((set, get) => ({
  // Current resume
  resume: null,
  sections: defaultSections,
  title: 'Untitled Resume',
  template: 'modern',
  colorTheme: '#6366f1',
  fontFamily: 'Inter',
  spacing: 'standard',
  resumeScore: 0,
  atsScore: 0,
  scoreBreakdown: [],
  isPublic: false,
  shareId: null,
  viewCount: 0,
  isDirty: false,
  isSaving: false,

  // Dashboard
  resumes: [],
  dashboardLoading: false,

  setResume: (resume) => {
    set({
      resume,
      sections: resume.sections || defaultSections,
      title: resume.title,
      template: resume.template,
      colorTheme: resume.colorTheme,
      fontFamily: resume.fontFamily,
      spacing: resume.spacing,
      resumeScore: resume.resumeScore || 0,
      atsScore: resume.atsScore || 0,
      isPublic: resume.isPublic,
      shareId: resume.shareId,
      viewCount: resume.viewCount || 0,
      isDirty: false,
    });
    get().recalcScore();
  },

  updateSections: (updates) => {
    const newSections = { ...get().sections, ...updates };
    set({ sections: newSections, isDirty: true });
    get().recalcScore();
  },

  updateSection: (key, value) => {
    const newSections = { ...get().sections, [key]: value };
    set({ sections: newSections, isDirty: true });
    get().recalcScore();
  },

  setTemplate: (template) => set({ template, isDirty: true }),
  setColorTheme: (colorTheme) => set({ colorTheme, isDirty: true }),
  setFontFamily: (fontFamily) => set({ fontFamily, isDirty: true }),
  setSpacing: (spacing) => set({ spacing, isDirty: true }),
  setTitle: (title) => set({ title, isDirty: true }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setIsDirty: (isDirty) => set({ isDirty }),
  setAtsScore: (atsScore) => {
    set({ atsScore });
    get().recalcScore();
  },

  recalcScore: () => {
    const { sections, atsScore } = get();
    const { score, breakdown } = calculateResumeScore(sections, atsScore);
    set({ resumeScore: score, scoreBreakdown: breakdown });
  },

  resetResume: () => set({
    resume: null,
    sections: defaultSections,
    title: 'Untitled Resume',
    template: 'modern',
    colorTheme: '#6366f1',
    fontFamily: 'Inter',
    spacing: 'standard',
    resumeScore: 0,
    atsScore: 0,
    isDirty: false,
  }),

  setResumes: (resumes) => set({ resumes }),
  setDashboardLoading: (loading) => set({ dashboardLoading: loading }),
}));
