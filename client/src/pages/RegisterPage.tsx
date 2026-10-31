import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  Mail, 
  KeyRound, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PageTransition } from '@/components/ui/page-transition';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(email.trim(), password, fullName.trim());
      if (res.success) {
        setSuccessMsg(res.message || 'Registration successful! Please check your email for the verification link.');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch {
      setError('Unable to reach registration server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="relative max-w-md w-full rounded-2xl bg-[#090c15]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Cyber glowing aura */}
          <div className="absolute -top-32 -left-32 size-64 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 size-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto size-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
              <UserPlus className="size-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Create Account
            </h1>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              VISITOR PORTFOLIO ACCESS REGISTRATION
            </p>
          </div>

          {/* Privacy & Admin policy notice */}
          <div className="mb-5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-xs text-neutral-300 flex items-start gap-2.5">
            <Info className="size-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-white">Access Policy:</span> Standard registrations receive verified Visitor status for commenting and viewing public portfolio assets. Administrative access is restricted to the owner.
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="size-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs text-emerald-300 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-semibold text-emerald-200">
                <CheckCircle2 className="size-4" />
                <span>Verification Link Dispatched</span>
              </div>
              <p className="text-neutral-300 leading-relaxed">
                {successMsg}
              </p>
            </div>
          )}

          {!successMsg ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

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
                    placeholder="visitor@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Password (min 8 characters)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
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
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}

          {/* Footer links */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-neutral-400">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
