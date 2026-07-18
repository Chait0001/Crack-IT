import { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AuthShell from '../components/ui/AuthShell';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

export default function Signup() {
  const navigate = useNavigate(); const [params] = useSearchParams(); const { setTokens, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false); const [loading, setLoading] = useState(false); const { register, handleSubmit, formState: { errors } } = useForm();
  useEffect(() => { if (params.get('error')) { toast.error(params.get('message') || 'Sign-up failed. Please try again.'); navigate('/signup', { replace: true }); } }, [navigate, params]);
  const onSubmit = async (data) => { setLoading(true); try { const response = await api.post('/auth/register', data); setTokens(response.data.accessToken, response.data.refreshToken); setUser(response.data.user); toast.success(`Welcome, ${response.data.user.name}.`); navigate('/dashboard'); } catch (error) { toast.error(error.response?.data?.message || 'Unable to create your account'); } finally { setLoading(false); } };
  return <AuthShell eyebrow="Start here" title="Make the work speak for itself." description="A better first draft starts with the experience you already have.">
    <h2>Create your account</h2><p className="auth-form-intro">No credit card. Just a clearer way to get career-ready.</p>
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <label>Name<div className="auth-input-wrap"><UserRound aria-hidden="true" /><input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Enter at least 2 characters' } })} className="input" autoComplete="name" placeholder="Your name" /></div>{errors.name && <small>{errors.name.message}</small>}</label>
      <label>Email<div className="auth-input-wrap"><Mail aria-hidden="true" /><input {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' } })} className="input" type="email" autoComplete="email" placeholder="you@email.com" /></div>{errors.email && <small>{errors.email.message}</small>}</label>
      <label>Password<div className="auth-input-wrap"><Lock aria-hidden="true" /><input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Use at least 6 characters' } })} className="input" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Show or hide password">{showPassword ? <EyeOff /> : <Eye />}</button></div>{errors.password && <small>{errors.password.message}</small>}</label>
      <button className="btn-primary auth-submit" disabled={loading}>{loading ? 'Creating account…' : 'Create my account'}</button>
    </form>
    <div className="auth-divider"><span>or continue with</span></div><a className="btn-secondary auth-alt-button" href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}/api/auth/google`}>Continue with Google</a><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </AuthShell>;
}
