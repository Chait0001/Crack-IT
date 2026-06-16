import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Save, Download, Share2, Zap, Moon, Sun,
  ChevronDown, Clock, RotateCcw, Eye, EyeOff, Layout
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import api from '../utils/api';
import EditorPanel from '../components/editor/EditorPanel';
import ResumePreview from '../components/preview/ResumePreview';
import ScoreWidget from '../components/ui/ScoreWidget';
import ATSScoreModal from '../components/ai/ATSScoreModal';
import CoverLetterModal from '../components/ai/CoverLetterModal';
import VersionsModal from '../components/ui/VersionsModal';
import ExportMenu from '../components/ui/ExportMenu';
import StylePanel from '../components/editor/StylePanel';

const TEMPLATES = ['modern', 'classic', 'minimal', 'creative', 'executive'];
const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
const FONTS = ['Inter', 'Georgia', 'Roboto', 'Playfair Display'];
const SPACINGS = ['compact', 'standard', 'spacious'];

export default function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAuthStore();
  const {
    resume, sections, title, template, colorTheme, fontFamily, spacing,
    isDirty, isSaving, resumeScore, setResume, setTitle, setIsSaving, setIsDirty,
  } = useResumeStore();

  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showATS, setShowATS] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const autoSaveTimer = useRef(null);

  // Load resume
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/resumes/${id}`);
        setResume(data.resume);
      } catch {
        toast.error('Resume not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => clearTimeout(autoSaveTimer.current);
  }, [id]);

  // Auto-save on changes
  const save = useCallback(async (silent = false) => {
    if (!isDirty || isSaving) return;
    setIsSaving(true);
    try {
      await api.put(`/resumes/${id}`, { title, template, colorTheme, fontFamily, spacing, sections });
      setIsDirty(false);
      if (!silent) toast.success('Saved ✓', { duration: 1500 });
    } catch {
      if (!silent) toast.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  }, [isDirty, isSaving, id, title, template, colorTheme, fontFamily, spacing, sections]);

  // Debounced auto-save every 3s of inactivity
  useEffect(() => {
    if (!isDirty) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => save(true), 3000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [isDirty, sections, title, template, colorTheme, fontFamily, spacing]);

  const handleShareToggle = async () => {
    try {
      const { data } = await api.put(`/resumes/${id}/share`);
      if (data.isPublic) {
        const url = `${window.location.origin}/resume/public/${data.shareId}`;
        await navigator.clipboard.writeText(url).catch(() => {});
        toast.success('Public link copied to clipboard!');
      } else {
        toast.success('Sharing disabled');
      }
    } catch { toast.error('Share toggle failed'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading your resume...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 glass border-b border-slate-200/50 dark:border-slate-800/50 h-14 flex items-center px-4 gap-3">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2 rounded-xl shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="bg-transparent border-0 outline-none font-semibold text-slate-900 dark:text-white text-sm w-48 truncate focus:bg-slate-100 dark:focus:bg-slate-800 focus:px-2 rounded-lg transition-all"
          onBlur={() => save(true)}
        />

        {isDirty && <span className="text-xs text-amber-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />Unsaved</span>}
        {isSaving && <span className="text-xs text-slate-400">Saving...</span>}

        <div className="flex-1" />

        {/* Score Widget mini */}
        <ScoreWidget mini />

        <div className="flex items-center gap-1">
          {/* Style panel */}
          <button onClick={() => setShowStylePanel(!showStylePanel)} className={`btn-ghost p-2 rounded-xl ${showStylePanel ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : ''}`} title="Customize style">
            <Layout className="w-4 h-4" />
          </button>

          {/* Save */}
          <button onClick={() => save(false)} disabled={!isDirty || isSaving} className="btn-secondary btn-sm gap-1">
            <Save className="w-3 h-3" /> Save
          </button>

          {/* Versions */}
          <button onClick={() => setShowVersions(true)} className="btn-ghost p-2 rounded-xl" title="Version history">
            <Clock className="w-4 h-4" />
          </button>

          {/* ATS */}
          <button onClick={() => setShowATS(true)} className="btn-ghost p-2 rounded-xl text-primary-600" title="ATS Job Match">
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Share */}
          <button onClick={handleShareToggle} className="btn-ghost p-2 rounded-xl" title="Share resume">
            <Share2 className="w-4 h-4" />
          </button>

          {/* Export */}
          <div className="relative">
            <button onClick={() => setShowExport(!showExport)} className="btn-primary btn-sm gap-1">
              <Download className="w-3 h-3" /> Export
            </button>
            {showExport && <ExportMenu resumeId={id} onClose={() => setShowExport(false)} />}
          </div>

          {/* Cover Letter */}
          <button onClick={() => setShowCoverLetter(true)} className="btn-ai btn-sm hidden sm:flex gap-1">
            <Zap className="w-3 h-3" /> Cover Letter
          </button>

          <button onClick={toggleTheme} className="btn-ghost p-2 rounded-xl">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile preview toggle */}
          <button onClick={() => setShowPreview(!showPreview)} className="btn-ghost p-2 rounded-xl md:hidden">
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Style panel sidebar */}
        {showStylePanel && (
          <div className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto animate-slide-in">
            <StylePanel onClose={() => setShowStylePanel(false)} />
          </div>
        )}

        {/* Editor */}
        <div className={`${showPreview ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[45%] lg:w-[40%] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto shrink-0`}>
          <EditorPanel resumeId={id} />
        </div>

        {/* Preview */}
        <div className={`${showPreview ? 'flex' : 'hidden md:flex'} flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900/50 flex-col items-center py-8 px-4`}>
          <ResumePreview />
        </div>
      </div>

      {/* Score breakdown panel fixed bottom-right */}
      <ScoreWidget />

      {/* Modals */}
      {showATS && <ATSScoreModal resumeId={id} onClose={() => setShowATS(false)} />}
      {showCoverLetter && <CoverLetterModal resumeId={id} onClose={() => setShowCoverLetter(false)} />}
      {showVersions && <VersionsModal resumeId={id} onClose={() => setShowVersions(false)} />}
    </div>
  );
}
