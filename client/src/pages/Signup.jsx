import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Eye, EyeOff, BadgeCheck, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTokens, setUser } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    if (error) {
      if (error === 'google_not_configured') {
        toast.error('Google Sign-In is not configured on the server. Please check environment variables.');
      } else {
        toast.error(message || 'Google authentication failed. Please try again.');
      }
      // Clean up search parameters in URL
      navigate('/signup', { replace: true });
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name: data.name, email: data.email, password: data.password });
      setTokens(res.data.accessToken, res.data.refreshToken);
      setUser(res.data.user);
      toast.success(`Welcome to CRACK IT!, ${res.data.user.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-slate-900 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-12 justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20">
            <BadgeCheck className="w-6 h-6 text-primary-500" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">CRACK IT!</span>
        </div>

        <div className="relative my-auto py-8 text-center">
          {/* Mockup Resume */}
          <div className="w-full max-w-[240px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden aspect-[1/1.4] mx-auto mb-8 transition-transform duration-300 hover:scale-[1.02]">
            {/* Header skeleton */}
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mb-1.5 mx-auto" />
            <div className="h-1.5 w-3/4 bg-slate-100 dark:bg-slate-800/60 rounded mb-5 mx-auto" />
            
            {/* Summary skeleton */}
            <div className="h-2 w-1/4 bg-primary-100 dark:bg-primary-900/30 rounded mb-2" />
            <div className="space-y-1 mb-4">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
              <div className="h-1.5 w-5/6 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>

            {/* Experience skeleton */}
            <div className="h-2 w-1/3 bg-primary-100 dark:bg-primary-900/30 rounded mb-2.5" />
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <div className="h-1.5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-1.5 w-1/6 bg-slate-100 dark:bg-slate-800/60 rounded" />
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
                  <div className="h-1.5 w-11/12 bg-slate-100 dark:bg-slate-800/60 rounded" />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-white text-3xl font-bold mb-3 tracking-tight">Start landing interviews today</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">Join thousands of job seekers who got hired with AI-powered resumes.</p>
        </div>

        <div className="relative grid grid-cols-3 gap-4 text-center">
          {[
            ['50K+', 'Resumes Built'],
            ['92%', 'ATS Pass Rate'],
            ['4.9★', 'User Rating']
          ].map(([n, l]) => (
            <div key={l} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
              <div className="text-white text-2xl font-bold tracking-tight">{n}</div>
              <div className="text-slate-500 text-xs mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">CRACK IT!</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create account</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Free forever — no credit card needed</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="input-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                  className="input pl-10"
                  placeholder="Alex Johnson"
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="input-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                  className="input pl-10"
                  placeholder="you@email.com"
                  type="email"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  type={showPw ? 'text' : 'password'}
                  className="input pl-10 pr-10"
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Free Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-950 px-2">OR</div>
          </div>

          <a
            href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/api/auth/google`}
            className="btn-secondary w-full py-3 text-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </a>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
