import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import ResumePreview from '../components/preview/ResumePreview';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// This page is loaded headlessly by Puppeteer for PDF generation
export default function PrintResume() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { setResume } = useResumeStore();
  const [status, setStatus] = useState('loading');
  const [printScale, setPrintScale] = useState(1);
  const contentRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Puppeteer does not have the user's localStorage. The export service
        // supplies this short-lived token specifically for the print request.
        const token = searchParams.get('token');
        const response = await fetch(`${API_BASE}/resumes/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) throw new Error(`Resume request failed (${response.status})`);
        const data = await response.json();
        setResume(data.resume);
        setStatus('fitting');
      } catch (err) {
        console.error('Print load failed', err);
        setStatus('error');
      }
    };
    load();
  }, [id, searchParams, setResume]);

  useLayoutEffect(() => {
    if (status !== 'fitting' || !contentRef.current) return undefined;

    let cancelled = false;
    const fitToOnePage = () => {
      const content = contentRef.current;
      if (!content || cancelled) return;

      // A4's aspect ratio. Measuring relative to rendered width makes this
      // work at both local and Vercel/Puppeteer viewport sizes.
      const onePageHeight = content.clientWidth * (297 / 210);
      const requiredHeight = content.scrollHeight;
      const scale = requiredHeight > onePageHeight
        ? Math.min(1, onePageHeight / requiredHeight)
        : 1;

      setPrintScale(scale);
      setStatus('ready');
    };

    const timer = window.setTimeout(fitToOnePage, 250);
    (document.fonts?.ready || Promise.resolve()).then(fitToOnePage).catch(() => {});
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [status]);

  return (
    <div id="resume-print-root" className="bg-white min-h-screen">
      {status === 'ready' || status === 'fitting' ? (
        <div
          ref={contentRef}
          data-print-ready={status === 'ready' ? 'true' : undefined}
          style={{
            // Keep the document's width while shrinking its complete layout.
            // The visual scale is only below 1 for overlong resumes.
            zoom: printScale,
            width: `${100 / printScale}%`,
            visibility: status === 'fitting' ? 'hidden' : 'visible',
          }}
        >
          <ResumePreview print />
        </div>
      ) : status === 'error' ? (
        <div className="flex items-center justify-center h-screen text-slate-600 text-sm">Unable to load this resume for export.</div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
