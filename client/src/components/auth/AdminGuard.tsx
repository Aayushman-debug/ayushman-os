import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" aria-label="Loading">
        <div className="size-8 rounded-full border border-purple-500/30 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  const redirect = `${location.pathname}${location.search}`;
  return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
};
