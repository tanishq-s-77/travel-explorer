import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, user, isSupabaseConfigured } = useAuth();

  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const redirectUrl = searchParams.get('redirect') || '/explore';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If already authenticated, redirect
  if (user) {
    navigate(redirectUrl, { replace: true });
    return null;
  }

  const setMode = (newMode) => {
    setErrorMsg('');
    setSuccessMsg('');
    setSearchParams({ mode: newMode, ...(searchParams.get('redirect') ? { redirect: searchParams.get('redirect') } : {}) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (mode === 'signup') {
      const { data, error } = await signUp(email, password, fullName);
      setLoading(false);
      if (error) {
        setErrorMsg(error.message || 'Failed to create account.');
      } else {
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate(redirectUrl);
        }, 1000);
      }
    } else {
      const { data, error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setErrorMsg(error.message || 'Invalid email or password.');
      } else {
        navigate(redirectUrl);
      }
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-4xl p-8 sm:p-10 border border-slatevibe-200/80 shadow-soft-hover space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-skyvibe-500 to-skyvibe-300 text-white flex items-center justify-center mx-auto shadow-md shadow-skyvibe-200">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slatevibe-900 tracking-tight">
            {mode === 'signup' ? 'Join Travel Explorer' : 'Welcome Back'}
          </h1>
          <p className="text-xs sm:text-sm text-slatevibe-500">
            {mode === 'signup'
              ? 'Create an account to save your favorite world wonderlands'
              : 'Sign in to access your personal wishlist and travel preferences'}
          </p>
        </div>

        {/* Supabase Notice if not configured yet */}
        {!isSupabaseConfigured && (
          <div className="p-3.5 rounded-2xl bg-skyvibe-50 border border-skyvibe-200 text-skyvibe-800 text-xs leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-skyvibe-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Developer Preview Active</span>
              You can test sign-up/login with any email & password while your Supabase keys are being configured in <code className="font-mono bg-skyvibe-100 px-1 py-0.5 rounded">.env</code>.
            </div>
          </div>
        )}

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-cream-200 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-slatevibe-900 shadow-sm'
                : 'text-slatevibe-600 hover:text-slatevibe-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white text-slatevibe-900 shadow-sm'
                : 'text-slatevibe-600 hover:text-slatevibe-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-meadow-50 border border-meadow-200 text-meadow-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slatevibe-600">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slatevibe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 rounded-2xl text-sm text-slatevibe-900 placeholder:text-slatevibe-400 border border-slatevibe-200 focus:outline-none focus:ring-2 focus:ring-skyvibe-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slatevibe-600">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slatevibe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@example.com"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 rounded-2xl text-sm text-slatevibe-900 placeholder:text-slatevibe-400 border border-slatevibe-200 focus:outline-none focus:ring-2 focus:ring-skyvibe-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slatevibe-600">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slatevibe-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 rounded-2xl text-sm text-slatevibe-900 placeholder:text-slatevibe-400 border border-slatevibe-200 focus:outline-none focus:ring-2 focus:ring-skyvibe-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-skyvibe-600 to-skyvibe-500 hover:from-skyvibe-700 hover:to-skyvibe-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create Free Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="pt-2 text-center text-xs text-slatevibe-500">
          {mode === 'login' ? (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-skyvibe-600 hover:text-skyvibe-700 font-bold"
              >
                Sign up free
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-skyvibe-600 hover:text-skyvibe-700 font-bold"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
