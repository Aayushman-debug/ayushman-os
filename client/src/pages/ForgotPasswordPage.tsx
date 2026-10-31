import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/page-transition';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setMessage(data.message || 'If an account exists with that address, a reset link was sent.');
    } catch {
      setError('Unable to reach authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="relative max-w-md w-full rounded-2xl bg-[#090c15]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto size-12 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/25 ring-1 ring-white/20">
              <KeyRound className="size-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Password Recovery
            </h1>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              SECURE CREDENTIAL RESET REQUEST
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2.5">
              <AlertCircle className="size-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs text-emerald-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-200">
                  <CheckCircle2 className="size-4" />
                  <span>Instructions Dispatched</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">{message}</p>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition"
                >
                  <ChevronLeft className="size-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enter your account email address. We will verify your identity and send an expiring, single-use password reset link.
              </p>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Dispatching Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPasswordPage;
