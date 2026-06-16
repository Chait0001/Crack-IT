import React, { useEffect, useState } from 'react';
import { X, Clock, RotateCcw, Tag } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useResumeStore } from '../../store/resumeStore';
import { formatDistanceToNow } from 'date-fns';

export default function VersionsModal({ resumeId, onClose }) {
  const { setResume } = useResumeStore();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);
  const [saveLabel, setSaveLabel] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/resumes/${resumeId}/versions`);
        setVersions(data.versions);
      } catch { toast.error('Failed to load versions'); } finally { setLoading(false); }
    };
    load();
  }, [resumeId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.post(`/resumes/${resumeId}/versions`, { label: saveLabel || undefined });
      setVersions([{ _id: data.version._id, label: data.version.label, savedAt: data.version.savedAt, isManual: true }, ...versions]);
      setSaveLabel('');
      toast.success('Version saved!');
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const handleRestore = async (versionId) => {
    if (!confirm('Restore this version? Your current changes will be replaced.')) return;
    setRestoring(versionId);
    try {
      const { data } = await api.post(`/resumes/${resumeId}/restore/${versionId}`);
      setResume(data.resume);
      toast.success('Version restored!');
      onClose();
    } catch { toast.error('Restore failed'); } finally { setRestoring(null); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-slate-900 dark:text-white">Version History</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-xl"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <label className="input-label">Save Current Version</label>
          <div className="flex gap-2 mt-1">
            <input value={saveLabel} onChange={e => setSaveLabel(e.target.value)} className="input flex-1" placeholder="Label (e.g. Before interview)" />
            <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm shrink-0">
              {saving ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save'}
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-6 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : versions.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">No versions saved yet.</div>
          ) : versions.map(v => (
            <div key={v._id} className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${v.isManual ? 'bg-primary-500' : 'bg-slate-300'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{v.label}</p>
                  <p className="text-xs text-slate-400">{formatDistanceToNow(new Date(v.savedAt), { addSuffix: true })}</p>
                </div>
              </div>
              <button
                onClick={() => handleRestore(v._id)}
                disabled={restoring === v._id}
                className="btn-secondary btn-sm shrink-0 gap-1 text-xs"
              >
                {restoring === v._id ? <span className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                Restore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
