import React, { useRef, useState } from 'react';
import { Camera, Link as LinkIcon, Phone, MapPin, Link2, Globe } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function PersonalInfo({ resumeId }) {
  const { sections, updateSection } = useResumeStore();
  const pi = sections?.personalInfo || {};
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  const update = (field, value) => {
    updateSection('personalInfo', { ...pi, [field]: value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const { data } = await api.post(`/resumes/${resumeId}/photo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      update('photo', data.photoUrl);
      toast.success('Photo uploaded!');
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  const photoSrc = pi.photo
    ? (pi.photo.startsWith('http://') || pi.photo.startsWith('https://')
      ? pi.photo
      : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${pi.photo}`)
    : null;

  return (
    <div className="space-y-3 pt-2">
      {/* Photo */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden">
            {photoSrc ? <img src={photoSrc} alt="Profile" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-slate-400" />}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 hover:bg-primary-700 transition-colors"
          >
            {uploading ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> : <Camera className="w-3 h-3 text-white" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </div>
        <div className="text-xs text-slate-400">Upload profile photo<br />(optional, max 5MB)</div>
      </div>

      <Field label="Full Name" value={pi.name} onChange={v => update('name', v)} placeholder="Alex Johnson" />
      <Field label="Email" value={pi.email} onChange={v => update('email', v)} placeholder="alex@email.com" type="email" />

      <div className="grid grid-cols-2 gap-2">
        <Field label="Phone" value={pi.phone} onChange={v => update('phone', v)} placeholder="+1 (555) 000-0000" icon={<Phone className="w-3 h-3" />} />
        <Field label="Location" value={pi.location} onChange={v => update('location', v)} placeholder="San Francisco, CA" icon={<MapPin className="w-3 h-3" />} />
      </div>
      <Field label="LinkedIn" value={pi.linkedin} onChange={v => update('linkedin', v)} placeholder="linkedin.com/in/you" icon={<Link2 className="w-3 h-3" />} />
      <Field label="Portfolio / Website" value={pi.portfolio} onChange={v => update('portfolio', v)} placeholder="yoursite.dev" icon={<Globe className="w-3 h-3" />} />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', icon }) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          type={type}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input ${icon ? 'pl-8' : ''}`}
        />
      </div>
    </div>
  );
}
