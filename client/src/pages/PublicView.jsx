import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import ResumePreview from '../components/preview/ResumePreview';
import { useResumeStore } from '../store/resumeStore';
import { BadgeCheck, Eye } from 'lucide-react';

export default function PublicView() {
  const { shareId } = useParams();
  const { setResume } = useResumeStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resume, setLocalResume] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/public/${shareId}`);
        setLocalResume(data.resume);
        setResume(data.resume);
      } catch (err) {
        setError(err.response?.data?.message || 'Resume not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shareId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center p-8">
      <div className="text-6xl mb-4">🔒</div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Resume Not Available</h2>
      <p className="text-slate-500">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-violet-600 text-white py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-4 h-4" />
          <span className="text-sm font-medium">Powered by CRACK IT! Resume Builder</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Eye className="w-3 h-3" />
          <span>Read-only view</span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <ResumePreview readonly />
      </div>
    </div>
  );
}
