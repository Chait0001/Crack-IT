import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Clock3,
  Copy,
  Eye,
  FileText,
  FilePlus2,
  LogOut,
  Moon,
  Plus,
  Sparkles,
  Sun,
  Trash2,
  UserRound,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import api from '../utils/api';

const TEMPLATE_LABELS = {
  modern: 'Modern',
  classic: 'Classic',
  minimal: 'Minimal',
  creative: 'Creative',
  executive: 'Executive',
};

function readinessCopy(score) {
  if (score >= 71) return { label: 'Ready to refine', tone: 'ready' };
  if (score >= 41) return { label: 'Taking shape', tone: 'progress' };
  return { label: 'Needs attention', tone: 'starting' };
}

function ResumeArtwork({ template = 'modern', title }) {
  return (
    <div className={`dashboard-artwork dashboard-artwork-${template}`} aria-hidden="true">
      <div className="dashboard-sheet">
        <div className="dashboard-sheet-rule" />
        <div className="dashboard-sheet-name">{title?.slice(0, 18) || 'Untitled Resume'}</div>
        <div className="dashboard-sheet-contact" />
        <div className="dashboard-sheet-label" />
        <div className="dashboard-sheet-line wide" />
        <div className="dashboard-sheet-line" />
        <div className="dashboard-sheet-line short" />
        <div className="dashboard-sheet-label second" />
        <div className="dashboard-sheet-line wide" />
        <div className="dashboard-sheet-line" />
      </div>
    </div>
  );
}

function ResumeCard({ resume, onDelete, onDuplicate }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const readiness = readinessCopy(resume.resumeScore || 0);

  const handleDelete = async (event) => {
    event.stopPropagation();
    if (!window.confirm(`Delete “${resume.title}”? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/resumes/${resume._id}`);
      onDelete(resume._id);
      toast.success('Resume deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async (event) => {
    event.stopPropagation();
    setDuplicating(true);
    try {
      const { data } = await api.post('/resumes', { duplicateFrom: resume._id });
      onDuplicate(data.resume);
      toast.success('Resume duplicated');
    } catch {
      toast.error('Duplicate failed');
    } finally {
      setDuplicating(false);
    }
  };

  return (
    <article className="dashboard-resume-card" onClick={() => navigate(`/builder/${resume._id}`)}>
      <ResumeArtwork template={resume.template} title={resume.title} />
      <div className="dashboard-card-body">
        <div className="dashboard-card-heading">
          <div>
            <p className="dashboard-template-label">{TEMPLATE_LABELS[resume.template] || 'Modern'} template</p>
            <h2>{resume.title}</h2>
          </div>
          <span className={`dashboard-readiness dashboard-readiness-${readiness.tone}`}>{readiness.label}</span>
        </div>

        <div className="dashboard-card-meta">
          <span><Clock3 aria-hidden="true" /> Updated {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}</span>
          {resume.isPublic && <span><Eye aria-hidden="true" /> {resume.viewCount || 0} views</span>}
        </div>

        <div className="dashboard-card-footer">
          <div className="dashboard-score" aria-label={`Resume score: ${resume.resumeScore || 0} out of 100`}>
            <span>Readiness</span><strong>{resume.resumeScore || 0}</strong>
          </div>
          <div className="dashboard-card-actions" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={handleDuplicate} disabled={duplicating} aria-label={`Duplicate ${resume.title}`}>
              <Copy aria-hidden="true" /> <span>{duplicating ? 'Copying' : 'Duplicate'}</span>
            </button>
            <button type="button" onClick={handleDelete} disabled={deleting} className="dashboard-delete-button" aria-label={`Delete ${resume.title}`}>
              <Trash2 aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function LoadingCard() {
  return <div className="dashboard-loading-card"><div /><span /><span /><small /></div>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, theme, toggleTheme } = useAuthStore();
  const { resumes, setResumes, dashboardLoading, setDashboardLoading } = useResumeStore();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      setDashboardLoading(true);
      try {
        const { data } = await api.get('/resumes');
        setResumes(data.resumes);
      } catch {
        toast.error('Failed to load resumes');
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchResumes();
  }, [setDashboardLoading, setResumes]);

  const averageScore = useMemo(() => {
    if (!resumes.length) return 0;
    return Math.round(resumes.reduce((sum, resume) => sum + (resume.resumeScore || 0), 0) / resumes.length);
  }, [resumes]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const { data } = await api.post('/resumes', { title: 'Untitled Resume' });
      navigate(`/builder/${data.resume._id}`);
    } catch {
      toast.error('Failed to create resume');
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Clear the local session even if the server is unavailable.
    }
    logout();
    navigate('/login');
  };

  const handleDelete = (id) => setResumes(resumes.filter((resume) => resume._id !== id));
  const handleDuplicate = (resume) => setResumes([resume, ...resumes]);
  const firstName = user?.name?.trim().split(' ')[0] || 'there';

  return (
    <main className="dashboard-page">
      <header className="dashboard-nav">
        <div className="dashboard-shell dashboard-nav-inner">
          <Link to="/dashboard" className="dashboard-brand" aria-label="Crack IT dashboard">
            <span><BadgeCheck aria-hidden="true" /></span> CRACK IT<span>!</span>
          </Link>
          <div className="dashboard-nav-controls">
            <button type="button" onClick={toggleTheme} className="dashboard-icon-button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
            <button type="button" onClick={() => navigate('/profile')} className="dashboard-profile-button" aria-label="Open profile settings">
              <span>{user?.avatar ? <img src={user.avatar} alt="" /> : <UserRound aria-hidden="true" />}</span>
              <span className="dashboard-profile-name">{firstName}</span>
            </button>
            <button type="button" onClick={handleLogout} className="dashboard-icon-button dashboard-logout-button" aria-label="Sign out"><LogOut aria-hidden="true" /></button>
          </div>
        </div>
      </header>

      <section className="dashboard-shell dashboard-intro" aria-labelledby="dashboard-title">
        <div>
          <p className="dashboard-eyebrow"><Sparkles aria-hidden="true" /> Your career workspace</p>
          <h1 id="dashboard-title">Good to see you, {firstName}.</h1>
          <p>Keep the work you are proud of organized, clear, and ready for the right opportunity.</p>
        </div>
        <button type="button" onClick={handleCreate} disabled={creating} className="dashboard-create-button">
          {creating ? <span className="dashboard-spinner" aria-hidden="true" /> : <Plus aria-hidden="true" />}
          {creating ? 'Creating resume' : 'New resume'}
        </button>
      </section>

      {!dashboardLoading && resumes.length > 0 && (
        <section className="dashboard-shell dashboard-overview" aria-label="Resume overview">
          <div className="dashboard-overview-card">
            <span className="dashboard-overview-icon"><FileText aria-hidden="true" /></span>
            <div><strong>{resumes.length}</strong><p>{resumes.length === 1 ? 'resume in progress' : 'resumes in progress'}</p></div>
          </div>
          <div className="dashboard-overview-card">
            <span className="dashboard-overview-icon"><BarChart3 aria-hidden="true" /></span>
            <div><strong>{averageScore}</strong><p>average readiness score</p></div>
          </div>
          <div className="dashboard-overview-card dashboard-overview-note">
            <span className="dashboard-overview-icon"><Sparkles aria-hidden="true" /></span>
            <p>{averageScore >= 71 ? 'Your foundation is strong. Tailor a version for the next role you want.' : 'Small improvements add up. Open a resume to see the clearest next step.'}</p>
          </div>
        </section>
      )}

      <section className="dashboard-shell dashboard-library" aria-labelledby="resume-library-title">
        <div className="dashboard-library-header">
          <div><p className="dashboard-eyebrow">Your documents</p><h2 id="resume-library-title">Resume library</h2></div>
          {resumes.length > 0 && <p>{resumes.length} total</p>}
        </div>

        {dashboardLoading ? (
          <div className="dashboard-resume-grid" aria-label="Loading resumes"><LoadingCard /><LoadingCard /><LoadingCard /></div>
        ) : resumes.length === 0 ? (
          <div className="dashboard-empty-state">
            <div className="dashboard-empty-art"><FilePlus2 aria-hidden="true" /><span /></div>
            <p className="dashboard-eyebrow">Start where you are</p>
            <h2>Your next opportunity deserves a strong first draft.</h2>
            <p>You do not need perfect wording to begin. Add the work you remember, then shape it into something clear and convincing.</p>
            <button type="button" onClick={handleCreate} disabled={creating} className="dashboard-create-button">
              {creating ? <span className="dashboard-spinner" aria-hidden="true" /> : <Plus aria-hidden="true" />}
              Create my first resume
            </button>
          </div>
        ) : (
          <div className="dashboard-resume-grid">
            <button type="button" onClick={handleCreate} disabled={creating} className="dashboard-new-card">
              <span><Plus aria-hidden="true" /></span>
              <strong>Create another version</strong>
              <small>Tailor your story for a new role</small>
              <ArrowUpRight aria-hidden="true" />
            </button>
            {resumes.map((resume) => <ResumeCard key={resume._id} resume={resume} onDelete={handleDelete} onDuplicate={handleDuplicate} />)}
          </div>
        )}
      </section>
    </main>
  );
}
