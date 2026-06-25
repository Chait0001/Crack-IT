import React, { useRef, useEffect } from 'react';
import { FileText, FileCode2, Loader } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function ExportMenu({ resumeId, onClose }) {
  const ref = useRef();
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const handle = (e) => { if (!ref.current?.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const downloadFile = async (format) => {
    setLoading(format);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || '/api'}/export/${resumeId}/${format}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = format === 'pdf' ? 'resume.pdf' : 'resume.docx';
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} exported!`);
      onClose();
    } catch (e) {
      toast.error(`Export failed: ${e.message}`);
    } finally { setLoading(null); }
  };

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-48 card shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-slide-up">
      <button
        onClick={() => downloadFile('pdf')}
        disabled={!!loading}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {loading === 'pdf' ? <Loader className="w-4 h-4 animate-spin text-primary-500" /> : <FileText className="w-4 h-4 text-red-500" />}
        Download PDF
      </button>
      <div className="border-t border-slate-100 dark:border-slate-800" />
      <button
        onClick={() => downloadFile('docx')}
        disabled={!!loading}
        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {loading === 'docx' ? <Loader className="w-4 h-4 animate-spin text-primary-500" /> : <FileCode2 className="w-4 h-4 text-blue-500" />}
        Download DOCX
      </button>
    </div>
  );
}
