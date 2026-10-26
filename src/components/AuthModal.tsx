import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Eye, EyeOff, Compass, Lock, Mail, User as UserIcon, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register, loginDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordSubmitted, setForgotPasswordSubmitted] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authModalMode === 'register') {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      setIsSubmitting(true);
      const res = await register(fullName, email, password);
      setIsSubmitting(false);
      if (!res.success) {
        setError(res.message || 'Registration failed');
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Please enter email and password');
        return;
      }
      setIsSubmitting(true);
      const res = await login(email, password);
      setIsSubmitting(false);
      if (!res.success) {
        setError(res.message || 'Login failed');
      }
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setForgotPasswordSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F1A15] text-[#F3F6F4] rounded-3xl shadow-2xl border border-[#234233] overflow-hidden">
        
        {/* Header pattern */}
        <div className="bg-[#0A110E] p-6 text-center relative border-b border-[#1A2E24]">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#8A9C93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-[#1C362A] text-[#FBBF24] border border-[#2E5442] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Compass className="w-7 h-7 stroke-[2.2]" />
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#F3F6F4]">
            {showForgotPassword
              ? 'Reset Password'
              : authModalMode === 'register'
              ? 'Join Musafir'
              : 'Welcome Back'}
          </h3>
          <p className="text-xs text-[#8A9C93] mt-1">
            {showForgotPassword
              ? 'Enter your email to receive recovery instructions'
              : authModalMode === 'register'
              ? 'Har Safar, Aapke Andaaz Mein · Create your travel profile'
              : 'Sign in to access your saved trips and personalized plans'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300">
              {error}
            </div>
          )}

          {showForgotPassword ? (
            forgotPasswordSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
                <h4 className="font-semibold text-sm text-[#F3F6F4]">Reset Link Sent</h4>
                <p className="text-xs text-[#8A9C93]">
                  If an account exists for <strong>{email}</strong>, you will receive password reset instructions.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordSubmitted(false);
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-[#1C362A] text-white border border-[#2E5442]"
                >
                  Return to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D8E4DE] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7E75]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white hover:brightness-110 shadow-lg transition-all"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-center text-xs text-[#8A9C93] hover:underline"
                >
                  Cancel and Back to Log In
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authModalMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#D8E4DE] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7E75]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#D8E4DE] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7E75]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#D8E4DE]">
                    Password
                  </label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] text-[#F59E0B] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7E75]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#6B7E75] hover:text-[#F3F6F4]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authModalMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#D8E4DE] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7E75]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#223B2F] bg-[#0A110E] text-[#F3F6F4] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>{authModalMode === 'register' ? 'Create Account & Begin Onboarding' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={loginDemoUser}
                  className="w-full py-2 text-xs font-semibold rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#FBBF24] hover:bg-[#F59E0B]/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Demo Mode: 1-Click Sign In (Kabir Verma)</span>
                </button>
              </div>

              <div className="pt-3 text-center border-t border-[#182C23]">
                {authModalMode === 'register' ? (
                  <p className="text-xs text-[#8A9C93]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="font-semibold text-[#FBBF24] hover:underline"
                    >
                      Log In
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-[#8A9C93]">
                    New to Musafir?{' '}
                    <button
                      type="button"
                      onClick={() => openAuthModal('register')}
                      className="font-semibold text-[#FBBF24] hover:underline"
                    >
                      Create Free Account
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
