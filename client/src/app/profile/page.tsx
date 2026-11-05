'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { 
  User as UserIcon, Mail, ShieldAlert, Award, BookOpen, Heart, Save, 
  RefreshCw, UserPlus, CheckCircle, LogOut, ArrowRight, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, token, api, refreshProfile, logout } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [activeTab, setActiveTab] = useState<'info' | 'activity' | 'actions'>('info');
  const [courses, setCourses] = useState<any[]>([]);
  const [linkedStudents, setLinkedStudents] = useState<any[]>([]);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      if (user.imageUrl && user.imageUrl.includes('seed=')) {
        const match = user.imageUrl.match(/seed=([^&]+)/);
        if (match) setAvatarSeed(match[1]);
      } else {
        setAvatarSeed(user.name || 'default');
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user || !token) return;

    const loadData = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses', err);
      }

      if (user.role === 'parent') {
        try {
          const res = await api.get('/users/parent/students');
          setLinkedStudents(res.data);
        } catch (err) {
          console.error('Failed to load linked students', err);
        }
      }
    };
    loadData();
  }, [user, token, api]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const generatedAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed || name}`;
      await api.put('/users/profile', {
        name,
        imageUrl: generatedAvatar
      });
      await refreshProfile();
      setSuccessMsg('Profile configuration updated successfully.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentEmail) return;
    setLinking(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post('/users/link-student', { email: newStudentEmail });
      setSuccessMsg(`Successfully linked student: ${newStudentEmail}`);
      setNewStudentEmail('');
      const res = await api.get('/users/parent/students');
      setLinkedStudents(res.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to link student account.');
    } finally {
      setLinking(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 flex flex-col justify-center items-center">
        <Navbar />
        <div className="p-8 border border-neutral-200 dark:border-neutral-800 rounded-lg text-center space-y-3 bg-white dark:bg-[#121215]">
          <ShieldAlert className="w-8 h-8 text-neutral-400 mx-auto" />
          <p className="text-xs text-neutral-500">Sign in to manage workstation settings.</p>
          <Link href="/auth/login" className="btn-primary text-xs">Sign In</Link>
        </div>
      </div>
    );
  }

  const enrolledCourseObjects = courses.filter(c =>
    user.enrolledCourses?.includes(String(c._id || c.id)) ||
    user.enrolledCourses?.includes(c.slug)
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden flex-shrink-0">
              <img
                src={user.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="btn-secondary text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded text-xs">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="error-banner text-xs">
            {errorMsg}
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs">
          {[
            { key: 'info', label: 'Account Credentials' },
            { key: 'activity', label: `Enrolled Curriculums (${enrolledCourseObjects.length})` },
            ...(user.role === 'parent' ? [{ key: 'actions', label: `Linked Students (${linkedStudents.length})` }] : []),
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-4 py-2.5 font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                activeTab === t.key
                  ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 1. Account Settings */}
        {activeTab === 'info' && (
          <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4 text-xs">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500">
              Update Profile Information
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-3 max-w-md">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="input opacity-60 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Avatar Seed Key
                </label>
                <input
                  type="text"
                  value={avatarSeed}
                  onChange={e => setAvatarSeed(e.target.value)}
                  className="input font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="btn-primary text-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{updating ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        )}

        {/* 2. Enrolled Tracks */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            {enrolledCourseObjects.length === 0 ? (
              <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 text-center text-xs text-neutral-500">
                No active courses enrolled. <Link href="/courses" className="font-semibold text-neutral-900 dark:text-white underline">Browse Catalog</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {enrolledCourseObjects.map(c => (
                  <div
                    key={c._id || c.id}
                    className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {c.courseTitle || c.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                        {c.category || 'Tech'} • {c.level || 'All'}
                      </p>
                    </div>
                    <Link href={`/courses/${c.slug || c._id || c.id}`} className="btn-secondary text-[11px] py-1 px-2.5">
                      Open &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Parent Link Actions */}
        {activeTab === 'actions' && user.role === 'parent' && (
          <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4 text-xs">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500">
              Link Child Account
            </h3>

            <form onSubmit={handleLinkStudent} className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="student@domain.com"
                value={newStudentEmail}
                onChange={e => setNewStudentEmail(e.target.value)}
                required
                className="input"
              />
              <button
                type="submit"
                disabled={linking}
                className="btn-primary text-xs whitespace-nowrap"
              >
                {linking ? 'Linking...' : 'Link Student'}
              </button>
            </form>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <h4 className="font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Currently Monitored Students ({linkedStudents.length})
              </h4>
              <div className="space-y-1.5">
                {linkedStudents.map(s => (
                  <div key={s._id} className="p-2.5 rounded border border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">{s.name}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">{s.email}</p>
                    </div>
                    <Link href="/dashboard/parent" className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold hover:underline">
                      View Progress &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
