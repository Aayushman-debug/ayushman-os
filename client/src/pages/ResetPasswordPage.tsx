import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '@/components/ui/page-transition';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Missing password reset token in URL parameters.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to reset password.');
        return;
      }

      setSuccess('Your password has been successfully updated! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch {
      setError('Unable to reach security server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="relative max-w-md w-full rounded-2xl bg-[#090c15]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="text-center mb-6">
            <div className="mx-auto size-12 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/25 ring-1 ring-white/20">
              <KeyRound className="size-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Set New Password
            </h1>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              ESTABLISH NEW CREDENTIALS
            </p>
          </div>

          {!token ? (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300 space-y-3">
              <p>No reset token was detected in your link URL.</p>
              <Link to="/forgot-password" className="text-cyan-400 underline block">
                Request a new password reset link →
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2.5">
                  <AlertCircle className="size-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    New Password (min 8 chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-4 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPasswordPage;
