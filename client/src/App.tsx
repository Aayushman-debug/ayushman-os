import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import CommandPalette from './components/CommandPalette';

import LandingPage from './pages/LandingPage';
import IslandGamePage from './pages/IslandGamePage';
import GamePage from './pages/GamePage';
import DashboardPage from './pages/DashboardPage';
import AcademicsPage from './pages/AcademicsPage';
import ProductivityPage from './pages/ProductivityPage';
import EntertainmentPage from './pages/EntertainmentPage';
import MusicPage from './pages/MusicPage';
import GamingPage from './pages/GamingPage';
import DeveloperPage from './pages/DeveloperPage';
import SocialPage from './pages/SocialPage';
import VaultPage from './pages/VaultPage';
import SettingsPage from './pages/SettingsPage';

// Authentication Pages & Guards
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import { AdminGuard } from './components/auth/AdminGuard';

import CursorSpotlight from './components/ui/cursor-spotlight';
import { ThemeProvider } from './themes/ThemeEngine';
import { AuthProvider } from './context/AuthContext';

function AppLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();

  // 3D Island Life World isolated in /world and /game
  const isIslandWorld = location.pathname === '/world' || location.pathname === '/game';
  // Preserved Cyberpunk city preserved in /cyberpunk
  const isCyberpunk = location.pathname === '/cyberpunk';
  const isLanding = location.pathname === '/' || location.pathname === '/landing';
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname);

  // ── Island Life 3D World (Roblox-style open world) ─────────────────
  if (isIslandWorld) {
    return (
      <Routes>
        <Route path="/world" element={<IslandGamePage />} />
        <Route path="/game" element={<IslandGamePage />} />
      </Routes>
    );
  }

  // ── Preserved Cyberpunk World ───────────────────────────────────────
  if (isCyberpunk) {
    return (
      <Routes>
        <Route path="/cyberpunk" element={<GamePage />} />
      </Routes>
    );
  }

  // ── Standard OS layout (Classic Portfolio) ──────────────────────────
  return (
    <div className="portfolio-app min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans relative">
      <CursorSpotlight />
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      <div className="flex flex-1">
        {/* Render Sidebar when inside the OS modules (and not on auth or landing pages) */}
        {!isLanding && !isAuthPage && <Sidebar />}

        <main className={`flex-1 transition-all duration-300 ${!isLanding && !isAuthPage ? 'lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8' : 'w-full'}`}>
          <Routes>
            {/* Classic Portfolio & Landing */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/dashboard" element={<AdminGuard><DashboardPage /></AdminGuard>} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/settings" element={<AdminGuard><SettingsPage /></AdminGuard>} />

            {/* Authentication Gateway */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Protected Administrator-Only Personal OS Modules */}
            <Route
              path="/academics"
              element={
                <AdminGuard>
                  <AcademicsPage />
                </AdminGuard>
              }
            />
            <Route
              path="/productivity"
              element={
                <AdminGuard>
                  <ProductivityPage />
                </AdminGuard>
              }
            />
            <Route path="/entertainment" element={<EntertainmentPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/gaming" element={<GamingPage />} />
            <Route
              path="/vault"
              element={
                <AdminGuard>
                  <VaultPage />
                </AdminGuard>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
