import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PageTransition } from '@/components/ui/page-transition';

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (element: HTMLElement, options: { theme: string; size: string; width: string }) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAdmin, login, loginWithGoogle } = useAuth();

  const requestedRedirect = searchParams.get('redirect') || '/dashboard';
  const redirectUrl = requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//')
    ? requestedRedirect
    : '/dashboard';
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailUnverified, setEmailUnverified] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationSentMsg, setVerificationSentMsg] = useState('');
  const [authConfig, setAuthConfig] = useState({ googleEnabled: false, registrationEnabled: false });
  const [googleButton, setGoogleButton] = useState<HTMLDivElement | null>(null);
  const loginWithGoogleRef = useRef(loginWithGoogle);
  loginWithGoogleRef.current = loginWithGoogle;

  useEffect(() => {
    fetch('/api/auth/config')
      .then((response) => response.json())
      .then((data) => setAuthConfig({
        googleEnabled: Boolean(data.googleEnabled),
        registrationEnabled: Boolean(data.registrationEnabled),
      }))
      .catch(() => setAuthConfig({ googleEnabled: false, registrationEnabled: false }));
  }, []);

  useEffect(() => {
    if (!authConfig.googleEnabled || !googleClientId || !googleButton) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          const result = await loginWithGoogleRef.current(credential);
          if (result.success) {
            navigate(redirectUrl, { replace: true });
          } else {
            setError(result.message || 'Google sign-in failed.');
          }
        },
      });
      window.google.accounts.id.renderButton(googleButton, {
        theme: 'outline',
        size: 'large',
        width: '360',
      });
    };
    document.head.appendChild(script);
    return () => script.remove();
  }, [authConfig.googleEnabled, googleClientId, googleButton, navigate, redirectUrl]);

  // If already logged in as admin, redirect immediately
  useEffect(() => {
    if (isAdmin) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAdmin, navigate, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setEmailUnverified(false);
    setVerificationSentMsg('');

    if (!email.trim() || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        setSuccess('Authentication successful. Initializing session...');
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 600);
      } else {
        setError(res.message || 'Authentication failed.');
        if (res.emailUnverified) {
          setEmailUnverified(true);
        }
      }
    } catch {
      setError('An unexpected error occurred connecting to the security server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setResendingVerification(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setVerificationSentMsg(data.message || 'Verification link dispatched.');
    } catch {
      setVerificationSentMsg('Failed to dispatch verification email.');
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="relative max-w-md w-full rounded-2xl bg-[#090c15]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Cyber glowing orbs */}
          <div className="absolute -top-32 -left-32 size-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 size-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto size-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/25 ring-1 ring-white/20">
              <ShieldCheck className="size-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Admin sign in</h1>
            <p className="text-xs text-neutral-400 mt-1">Sign in to manage the private workspace.</p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="size-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{error}</p>
                {emailUnverified && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendingVerification}
                    className="mt-2 text-xs font-semibold text-rose-200 underline hover:text-white transition cursor-pointer"
                  >
                    {resendingVerification ? 'Sending link...' : 'Resend Verification Email'}
                  </button>
                )}
              </div>
            </div>
          )}

          {verificationSentMsg && (
            <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>{verificationSentMsg}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-purple-400 hover:text-purple-300 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-[#090c15] px-2 text-neutral-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-in button */}
          {authConfig.googleEnabled && googleClientId ? (
            <div ref={setGoogleButton} className="flex justify-center min-h-10" />
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/10 text-neutral-500 text-xs font-medium cursor-not-allowed"
              title="Google sign-in is not configured"
            >
              Google sign-in not configured
            </button>
          )}

          {/* Footer links */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-neutral-400">
            {authConfig.registrationEnabled && (
              <>
                <span>Need an account? </span>
                <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition">
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="mt-2 text-center text-xs text-neutral-500">
            <Link to="/" className="hover:text-neutral-300 transition">
              ← Return to public portfolio
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
