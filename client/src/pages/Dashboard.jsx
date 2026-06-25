import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, FileText, BadgeCheck, LogOut, User, Moon, Sun, Eye, Trash2, Copy, Clock, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import api from '../utils/api';
import { formatDistanceToNow } from 'date-fns';

function ScoreBadge({ score }) {
  const color = score >= 71 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400'
    : score >= 41 ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400'
    : 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      <BarChart2 className="w-3 h-3" />{score}
    </span>
  );
}

function ResumeCard({ resume, onDelete, onDuplicate }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete "${resume.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/resumes/${resume._id}`);
      onDelete(resume._id);
      toast.success('Resume deleted');
    } catch { toast.error('Delete failed'); } finally { setDeleting(false); }
  };

  const handleDuplicate = async (e) => {
    e.stopPropagation();
    setDuplicating(true);
    try {
      const { data } = await api.post('/resumes', { duplicateFrom: resume._id });
      onDuplicate(data.resume);
      toast.success('Resume duplicated!');
    } catch { toast.error('Duplicate failed'); } finally { setDuplicating(false); }
  };

  const templateColors = {
    modern: 'from-primary-500 to-violet-500',
    classic: 'from-slate-600 to-slate-800',
    minimal: 'from-gray-400 to-gray-600',
    creative: 'from-rose-500 to-orange-500',
    executive: 'from-amber-600 to-yellow-700',
  };

  return (
    <div
      onClick={() => navigate(`/builder/${resume._id}`)}
      className="card-hover cursor-pointer group overflow-hidden animate-fade-in"
    >
      {/* Thumbnail */}
      <div className={`h-36 bg-gradient-to-br ${templateColors[resume.template] || 'from-primary-500 to-violet-500'} relative flex items-center justify-center`}>
        <FileText className="w-14 h-14 text-white/30" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        {resume.isPublic && (
          <span className="absolute top-3 right-3 badge bg-emerald-500/90 text-white text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" /> Public
          </span>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="text-white/80 text-xs capitalize px-2 py-0.5 bg-black/20 rounded-full">{resume.template}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight truncate">{resume.title}</h3>
          <ScoreBadge score={resume.resumeScore || 0} />
        </div>

        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs mb-4">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
          {resume.viewCount > 0 && (
            <span className="ml-auto flex items-center gap-1"><Eye className="w-3 h-3" />{resume.viewCount}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDuplicate}
            disabled={duplicating}
            className="btn-ghost btn-sm flex-1 text-xs"
          >
            <Copy className="w-3 h-3" />
            {duplicating ? '...' : 'Duplicate'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn-ghost btn-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, toggleTheme, theme } = useAuthStore();
  const { resumes, setResumes, dashboardLoading, setDashboardLoading } = useResumeStore();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      setDashboardLoading(true);
      try {
        const { data } = await api.get('/resumes');
        setResumes(data.resumes);
      } catch { toast.error('Failed to load resumes'); }
      finally { setDashboardLoading(false); }
    };
    fetchResumes();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { data } = await api.post('/resumes', { title: 'Untitled Resume' });
      navigate(`/builder/${data.resume._id}`);
    } catch { toast.error('Failed to create resume'); setCreating(false); }
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    logout();
    navigate('/login');
  };

  const handleDelete = (id) => setResumes(resumes.filter(r => r._id !== id));
  const handleDuplicate = (resume) => setResumes([resume, ...resumes]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 glass border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-violet-600 rounded-lg flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">CRACK IT!</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost p-2 rounded-xl">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => navigate('/profile')} className="btn-ghost p-2 rounded-xl">
              <User className="w-4 h-4" />
            </button>
            <button onClick={handleLogout} className="btn-ghost p-2 rounded-xl text-red-500">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {resumes.length === 0 ? 'Create your first resume to get started' : `You have ${resumes.length} resume${resumes.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button onClick={handleCreate} disabled={creating} className="btn-primary gap-2 shrink-0">
            {creating ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
            New Resume
          </button>
        </div>

        {/* Content */}
        {dashboardLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-36 skeleton" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="text-8xl mb-6">📄</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No resumes yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
              Create your first AI-powered resume. It only takes minutes to build something that stands out.
            </p>
            <button onClick={handleCreate} disabled={creating} className="btn-primary btn-lg gap-2">
              <Plus className="w-5 h-5" /> Create My First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Create card */}
            <button
              onClick={handleCreate}
              disabled={creating}
              className="card border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all duration-300 flex flex-col items-center justify-center gap-3 min-h-[220px] cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">New Resume</span>
            </button>

            {resumes.map(r => (
              <ResumeCard key={r._id} resume={r} onDelete={handleDelete} onDuplicate={handleDuplicate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
