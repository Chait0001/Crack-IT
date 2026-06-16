import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, User, Camera, Save, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const fileRef = useRef();

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (fileRef.current?.files?.[0]) formData.append('avatar', fileRef.current.files[0]);

      const { data } = await api.put('/auth/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); } finally { setSaving(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const avatarSrc = avatarPreview?.startsWith('blob:') ? avatarPreview
    : avatarPreview ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${avatarPreview}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <nav className="glass border-b border-slate-200/50 dark:border-slate-800/50 h-14 flex items-center px-4 gap-3">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-primary-600 to-violet-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold gradient-text">CRACK IT!</span>
        </div>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <span className="text-slate-600 dark:text-slate-400 text-sm">Profile</span>
      </nav>

      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="card p-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Profile Settings</h1>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center overflow-hidden">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 hover:bg-primary-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
              {user?.googleId && <span className="badge badge-blue mt-1">Google Account</span>}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="input-label">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Your name" />
            </div>
            <div>
              <label className="input-label">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                className="input resize-none" placeholder="Short bio or professional headline..." />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input value={user?.email || ''} disabled className="input opacity-60 cursor-not-allowed" />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3 mt-8 gap-2">
            {saving ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
