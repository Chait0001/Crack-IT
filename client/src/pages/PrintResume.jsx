import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import ResumePreview from '../components/preview/ResumePreview';
import api from '../utils/api';

// This page is loaded headlessly by Puppeteer for PDF generation
export default function PrintResume() {
  const { id } = useParams();
  const { setResume } = useResumeStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/resumes/${id}`);
        setResume(data.resume);
        setLoaded(true);
      } catch (err) {
        console.error('Print load failed', err);
        setLoaded(true);
      }
    };
    load();
  }, [id]);

  return (
    <div id="resume-print-root" className="bg-white min-h-screen">
      {loaded ? <ResumePreview print /> : (
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
