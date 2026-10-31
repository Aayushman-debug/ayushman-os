import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Palette, 
  ShieldCheck, 
  Server, 
  Database, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  User, 
  Cpu, 
  Sliders, 
  LogOut,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePortfolioTheme } from '@/themes/usePortfolioTheme';
import { THEMES } from '@/themes/themeConfig';
import { PageTransition } from '@/components/ui/page-transition';

export const SettingsPage: React.FC = () => {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = usePortfolioTheme();
  const currentTheme = THEMES.find((item) => item.id === theme) ?? THEMES[0];

  const [activeTab, setActiveTab] = useState<'preferences' | 'security' | 'personal_os' | 'diagnostics' | 'export'>('preferences');
  const [health, setHealth] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Profile update form state
  const [editFullName, setEditFullName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  const fetchStatus = async () => {
    setRefreshing(true);
    try {
      const [hRes, pRes] = await Promise.all([
        fetch('/api/health', { credentials: 'include' }).then(r => r.json()).catch(() => ({ status: 'offline', database: 'unavailable' })),
        fetch('/api/auth/profile', { credentials: 'include' }).then(r => r.json()).catch(() => ({ user: null }))
      ]);
      setHealth(hRes);
      if (pRes.user) {
        setProfile(pRes.user);
        setEditFullName(pRes.user.fullName || '');
        setEditBio(pRes.user.bio || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [isAdmin]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPwError(data.message || 'Failed to change password.');
        return;
      }
      setPwSuccess('Password successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPwError('Failed to communicate with authentication server.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileUpdating(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullName: editFullName, bio: editBio }),
      });
      const data = await res.json();
      if (data.success) {
        setProfileSuccess('Profile updated successfully.');
        await fetchStatus();
      }
    } catch {
      console.error('Failed to update profile');
    } finally {
      setProfileUpdating(false);
    }
  };

  const handleDownloadFullBackup = async () => {
    if (!isAdmin) return;
    try {
      const [sems, checkins, anime, gaming, projects] = await Promise.all([
        fetch('/api/academics/semesters', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/productivity/checkins', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/entertainment/anime', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/gaming', { credentials: 'include' }).then(r => r.json()),
        fetch('/api/developer/projects', { credentials: 'include' }).then(r => r.json())
      ]);

      const fullBackup = {
        meta: {
          app: 'AYushMan OS',
          version: '3.0.0',
          exportedAt: new Date().toISOString(),
          profile: profile
        },
        data: {
          semesters: sems.semesters || [],
          checkins: checkins.checkins || [],
          anime: anime.anime || [],
          gaming: gaming.profiles || [],
          projects: projects.projects || []
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ayushman_os_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Backup error:', e);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        
        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-400 mb-3">
              <span className={`size-2 rounded-full ${isAdmin ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
              <span>{isAdmin ? 'ADMINISTRATOR MODE' : 'PUBLIC VISITOR MODE'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Personalize theme appearance, review secure credentials, and manage system operations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStatus}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition cursor-pointer"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-medium text-xs transition cursor-pointer"
              >
                <LogOut className="size-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
              activeTab === 'preferences'
                ? 'bg-white/10 text-white border border-white/15 font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Palette className="size-4 text-purple-400" />
            <span>Preferences & Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
              activeTab === 'security'
                ? 'bg-white/10 text-white border border-white/15 font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <ShieldCheck className="size-4 text-cyan-400" />
            <span>Admin Security</span>
            {!isAdmin && <Lock className="size-3 text-neutral-500 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('personal_os')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
              activeTab === 'personal_os'
                ? 'bg-white/10 text-white border border-white/15 font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Sliders className="size-4 text-amber-400" />
            <span>Personal OS Config</span>
            {!isAdmin && <Lock className="size-3 text-neutral-500 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
              activeTab === 'diagnostics'
                ? 'bg-white/10 text-white border border-white/15 font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Cpu className="size-4 text-emerald-400" />
            <span>System Diagnostics</span>
            {!isAdmin && <Lock className="size-3 text-neutral-500 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
              activeTab === 'export'
                ? 'bg-white/10 text-white border border-white/15 font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <Download className="size-4 text-rose-400" />
            <span>Data Export</span>
            {!isAdmin && <Lock className="size-3 text-neutral-500 ml-1" />}
          </button>
        </div>

        {/* TAB 1: Preferences & Appearance (PUBLIC) */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0b0e18] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Palette className="size-5 text-purple-400" />
                    <span>Active Theme Engine</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Select your preferred visual atmosphere across the entire AYushMan portfolio.
                  </p>
                </div>
                <span className="text-xs font-mono text-purple-300 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                  {currentTheme.name} Active
                </span>
              </div>

              {/* Theme Selector Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {THEMES.map((t) => {
                  const isSelected = currentTheme.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`p-4 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white/10 border-purple-400 shadow-lg shadow-purple-500/10'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="size-4 rounded-full ring-2 ring-white/20"
                          style={{ backgroundColor: t.preview[1] }}
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{t.name}</div>
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{t.id}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="size-4 text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0e18] border border-white/10 space-y-3">
              <h3 className="text-base font-bold text-white">Visual Motion & Performance</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Hardware-accelerated Three.js star particles and smooth scroll transitions are enabled. High frame rate animations adapt dynamically to GPU capabilities.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Administrator Security */}
        {activeTab === 'security' && (
          isAdmin ? (
            <div className="space-y-6">
              {/* Identity Details Card */}
              <div className="p-6 rounded-2xl bg-[#0b0e18] border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="size-5 text-cyan-400" />
                  <span>Authenticated Identity</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500">ACCOUNT</span>
                    <div className="text-white font-bold mt-1">Verified administrator</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500">AUTHORIZATION LEVEL</span>
                    <div className="text-emerald-400 font-bold mt-1">Full Root Administrator</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500">SESSION ARCHITECTURE</span>
                    <div className="text-purple-300 font-bold mt-1">HttpOnly signed session cookie</div>
                  </div>
                </div>
              </div>

              {/* Password Management */}
              <div className="p-6 rounded-2xl bg-[#0b0e18] border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <KeyRound className="size-5 text-purple-400" />
                  <span>Update Administrator Password</span>
                </h3>

                {pwError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{pwError}</span>
                  </div>
                )}
                {pwSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{pwSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">New Password (min 8 chars)</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {pwLoading ? 'Saving...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0b0e18] border border-white/10 text-center space-y-4">
              <Lock className="size-8 text-neutral-500 mx-auto" />
              <h3 className="text-base font-bold text-white">Administrator Security Area</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Sign in with the verified administrator account to manage credentials, audit sessions, and configure authentication parameters.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition"
              >
                Sign In as Administrator
              </Link>
            </div>
          )
        )}

        {/* TAB 3: Personal OS Config */}
        {activeTab === 'personal_os' && (
          isAdmin ? (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0b0e18] border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="size-5 text-amber-400" />
                  <span>Public Portfolio Details</span>
                </h3>

                {profileSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Short Biography</label>
                    <textarea
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={profileUpdating}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    {profileUpdating ? 'Saving...' : 'Save Public Details'}
                  </button>
                </form>
              </div>

              {/* Private Academic Identifiers (Only visible to admin) */}
              <div className="p-6 rounded-2xl bg-[#0b0e18] border border-white/10 space-y-3">
                <h3 className="text-base font-bold text-white">Private RTU Academic Identifiers</h3>
                <p className="text-xs text-neutral-400">
                  These records are strictly private and never exposed to unauthenticated visitors.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500">ROLL NUMBER</span>
                    <div className="text-cyan-400 font-bold mt-0.5">{profile?.rollNo || 'Not configured'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500">ENROLLMENT NUMBER</span>
                    <div className="text-purple-400 font-bold mt-0.5">{profile?.enrollmentNo || 'Not configured'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500">FATHER'S NAME</span>
                    <div className="text-neutral-200 font-bold mt-0.5">{profile?.fatherName || 'Not configured'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500">INSTITUTION</span>
                    <div className="text-neutral-200 font-bold mt-0.5">{profile?.collegeName || 'Not configured'}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0b0e18] border border-white/10 text-center space-y-4">
              <Lock className="size-8 text-neutral-500 mx-auto" />
              <h3 className="text-base font-bold text-white">Personal OS Configuration Area</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Sign in as administrator to manage private student identifiers and academic curriculum configurations.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition"
              >
                Sign In as Administrator
              </Link>
            </div>
          )
        )}

        {/* TAB 4: System Diagnostics */}
        {activeTab === 'diagnostics' && (
          isAdmin ? (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0b0e18] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Server className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">System & Storage Health</h3>
                      <p className="text-xs text-neutral-400">Zero sensitive secrets or connection strings are displayed.</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    <span>{health?.status === 'online' ? 'All Systems Operational' : 'Offline'}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono pt-2">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500">DATABASE STATUS</span>
                    <div className="text-emerald-400 font-bold mt-1">{health?.database || 'Standby Memory Cache'}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500">API VERSION</span>
                    <div className="text-white font-bold mt-1">AYushMan v3.0.0 (Express)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-500">TIMESTAMP</span>
                    <div className="text-neutral-400 font-bold mt-1">{health?.status === 'online' ? 'Online' : 'Unavailable'}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0b0e18] border border-white/10 text-center space-y-4">
              <Lock className="size-8 text-neutral-500 mx-auto" />
              <h3 className="text-base font-bold text-white">System Diagnostics Restricted</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Operational diagnostics and database telemetry are restricted to the verified administrator.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition"
              >
                Sign In as Administrator
              </Link>
            </div>
          )
        )}

        {/* TAB 5: Data Management & Export */}
        {activeTab === 'export' && (
          isAdmin ? (
            <div className="p-6 rounded-2xl bg-[#0b0e18] border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="size-5 text-rose-400" />
                <span>Full Personal OS Backup & Data Export</span>
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
                Export your entire encrypted snapshot including RTU marksheets, course syllabi, daily journal check-ins, anime & movie watchlists, and projects into a structured JSON file.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleDownloadFullBackup}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-500/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <Download className="size-4" />
                  <span>Download Full JSON Backup</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0b0e18] border border-white/10 text-center space-y-4">
              <Lock className="size-8 text-neutral-500 mx-auto" />
              <h3 className="text-base font-bold text-white">Data Export Restricted</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Personal data exports are strictly protected and only accessible to the authenticated owner.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition"
              >
                Sign In as Administrator
              </Link>
            </div>
          )
        )}

      </div>
    </PageTransition>
  );
};

export default SettingsPage;
