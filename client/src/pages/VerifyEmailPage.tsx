import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PageTransition } from '@/components/ui/page-transition';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { refreshSession } = useAuth();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'visitor' | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setMessage('No verification token found in URL.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSuccess(true);
          setMessage(data.message || 'Your email address has been verified successfully!');
          if (data.user?.role) {
            setUserRole(data.user.role);
          }
          await refreshSession();
        } else {
          setSuccess(false);
          setMessage(data.message || 'Verification token is invalid or has expired.');
        }
      } catch {
        setSuccess(false);
        setMessage('Unable to connect to verification server.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, refreshSession]);

  return (
    <PageTransition>
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        <div className="relative max-w-md w-full rounded-2xl bg-[#090c15]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden text-center">
          {loading ? (
            <div className="py-8 space-y-4">
              <div className="mx-auto size-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
              <h2 className="text-lg font-bold text-white">Validating Verification Token...</h2>
              <p className="text-xs font-mono text-neutral-400">Verifying cryptographic claim with server</p>
            </div>
          ) : success ? (
            <div className="space-y-5 animate-fadeIn">
              <div className="mx-auto size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 ring-8 ring-emerald-500/5">
                <CheckCircle2 className="size-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Email Address Verified
                </h2>
                <p className="text-xs font-mono text-emerald-400 mt-1 uppercase tracking-wider">
                  {userRole === 'admin' ? 'Administrator Mode Activated' : 'Visitor Session Active'}
                </p>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {message}
              </p>

              <div className="pt-3">
                <Link
                  to={userRole === 'admin' ? '/dashboard' : '/developer'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                >
                  <ShieldCheck className="size-4" />
                  <span>{userRole === 'admin' ? 'Enter Personal OS Dashboard' : 'Explore Public Portfolio'}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-fadeIn">
              <div className="mx-auto size-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 ring-8 ring-rose-500/5">
                <AlertCircle className="size-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Verification Failed
                </h2>
                <p className="text-xs font-mono text-rose-400 mt-1 uppercase tracking-wider">
                  TOKEN EXPIRED OR INVALID
                </p>
              </div>

              <p className="text-sm text-neutral-400 leading-relaxed">
                {message}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition"
                >
                  <span>Go to Sign In</span>
                  <ArrowRight className="size-3.5" />
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium hover:text-white transition"
                >
                  <span>Return Home</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default VerifyEmailPage;
