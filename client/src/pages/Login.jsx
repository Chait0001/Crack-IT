import { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AuthShell from '../components/ui/AuthShell';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

export default function Login() {
  const navigate = useNavigate(); const [params] = useSearchParams(); const { setTokens, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false); const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  useEffect(() => { const error = params.get('error'); if (error) { toast.error(params.get('message') || (error === 'google_not_configured' ? 'Google Sign-In is not configured.' : 'Sign-in failed. Please try again.')); navigate('/login', { replace: true }); } }, [navigate, params]);
  const finish = (data) => { setTokens(data.accessToken, data.refreshToken); setUser(data.user); toast.success(`Welcome back, ${data.user.name}.`); navigate('/dashboard'); };
  const onSubmit = async (data) => { setLoading(true); try { finish((await api.post('/auth/login', data)).data); } catch (error) { toast.error(error.response?.data?.message || 'Unable to sign in'); } finally { setLoading(false); } };
  const demo = async () => { setLoading(true); try { finish((await api.post('/auth/login', { email: 'demo@crackit.dev', password: 'demo1234' })).data); } catch { toast.error('Demo account is unavailable.'); } finally { setLoading(false); } };
  return <AuthShell eyebrow="Welcome back" title="Bring your next opportunity into focus." description="Pick up where you left off and keep shaping the work you are proud of.">
    <h2>Sign in to Crack IT</h2><p className="auth-form-intro">Your resumes, versions, and progress are waiting.</p>
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <label>Email<div className="auth-input-wrap"><Mail aria-hidden="true" /><input {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' } })} className="input" type="email" autoComplete="email" placeholder="you@email.com" /></div>{errors.email && <small>{errors.email.message}</small>}</label>
      <label>Password<div className="auth-input-wrap"><Lock aria-hidden="true" /><input {...register('password', { required: 'Password is required' })} className="input" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Show or hide password">{showPassword ? <EyeOff /> : <Eye />}</button></div>{errors.password && <small>{errors.password.message}</small>}</label>
      <button className="btn-primary auth-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <div className="auth-divider"><span>or continue with</span></div><button type="button" className="btn-secondary auth-alt-button" disabled={loading} onClick={demo}>Try the demo account</button>
    <a className="btn-secondary auth-alt-button" href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}/api/auth/google`}>Continue with Google</a>
    <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
  </AuthShell>;
}
