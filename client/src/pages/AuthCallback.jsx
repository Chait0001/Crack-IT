import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens, fetchProfile } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const refresh = params.get('refresh');
    const error = params.get('error');

    if (error) {
      const message = params.get('message') || 'Google login failed. Please try again.';
      toast.error(message);
      navigate('/login');
      return;
    }

    if (token) {
      setTokens(token, refresh);
      fetchProfile().then(() => {
        toast.success('Signed in with Google! 🎉');
        navigate('/dashboard');
      });
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 dark:text-slate-400">Signing you in...</p>
      </div>
    </div>
  );
}
