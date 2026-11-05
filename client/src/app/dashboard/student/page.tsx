'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen, CheckCircle, Award, Play, ChevronRight, Heart, AlertCircle,
  ChevronLeft, Calendar, FileText, CheckCircle2, Clock
} from 'lucide-react';

const PAGE_SIZE = 6;

interface DeadlineItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
}

const SAMPLE_DEADLINES: DeadlineItem[] = [
  { id: 'd1', title: 'Raft State Machine Log Replication Lab', course: 'Distributed Systems Design', dueDate: '2026-11-12', status: 'pending' },
  { id: 'd2', title: 'Next.js 15 Server Action Middleware Benchmark', course: 'Production Next.js 15', dueDate: '2026-11-16', status: 'pending' },
  { id: 'd3', title: 'Autonomous Multi-Agent Memory Orchestration', course: 'AI Agent Architecture', dueDate: '2026-11-20', status: 'pending' },
  { id: 'd4', title: 'Zero-Copy Ring Buffer in Rust', course: 'Systems Programming in Rust', dueDate: '2026-11-25', status: 'submitted' },
];

function Pagination({
  page, totalPages, onPageChange,
}: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 pt-6">
      <button
        className="pagination-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          className={`pagination-btn ${page === p ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="pagination-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function StudentDashboard() {
  const { user, api, refreshProfile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [wishlistedCourses, setWishlistedCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'learning' | 'deadlines' | 'wishlist'>('learning');
  const [enrolledPage, setEnrolledPage] = useState(1);
  const [wishlistPage, setWishlistPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await api.get('/courses');
        const allCourses = res.data;

        const enrolled = allCourses.filter((c: any) =>
          (c.enrolledStudents || []).includes((user as any).id || (user as any).sub)
        );
        setEnrolledCourses(enrolled);

        const wish = allCourses.filter((c: any) =>
          user.wishlist?.includes(String(c._id || c.id))
        );
        setWishlistedCourses(wish);

        const progressData: Record<string, any> = {};
        await Promise.all(
          enrolled.map(async (c: any) => {
            try {
              const pRes = await api.get(`/courses/${c._id || c.id}/progress`);
              progressData[c._id || c.id] = pRes.data;
            } catch {
              // Non-critical
            }
          })
        );
        setProgress(progressData);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err?.response?.data?.message || 'Failed to load dashboard data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, api]);

  const handleRemoveWishlist = async (courseId: string) => {
    try {
      await api.post('/users/wishlist', { courseId });
      await refreshProfile();
      setWishlistedCourses(prev => prev.filter(c => String(c._id || c.id) !== courseId));
    } catch (err: any) {
      setErrorMsg('Failed to remove from wishlist.');
      console.error(err);
    }
  };

  const completedCount = Object.values(progress).filter((p: any) => p?.completed).length;
  const totalLessonsCompleted = Object.values(progress).reduce(
    (sum: number, p: any) => sum + (p?.completedLessons?.length || 0), 0
  );

  const enrolledTotalPages = Math.max(1, Math.ceil(enrolledCourses.length / PAGE_SIZE));
  const wishlistTotalPages = Math.max(1, Math.ceil(wishlistedCourses.length / PAGE_SIZE));
  const paginatedEnrolled = useMemo(
    () => enrolledCourses.slice((enrolledPage - 1) * PAGE_SIZE, enrolledPage * PAGE_SIZE),
    [enrolledCourses, enrolledPage]
  );
  const paginatedWishlist = useMemo(
    () => wishlistedCourses.slice((wishlistPage - 1) * PAGE_SIZE, wishlistPage * PAGE_SIZE),
    [wishlistedCourses, wishlistPage]
  );

  const stats = [
    { label: 'Active Curriculums', value: enrolledCourses.length, sub: 'In progress' },
    { label: 'Completed Tracks', value: completedCount, sub: '100% verified' },
    { label: 'Lessons Completed', value: totalLessonsCompleted, sub: 'Across all modules' },
    { label: 'Certificates Earned', value: completedCount, sub: 'Cryptographic credentials' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="pt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Workstation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Student Workstation & Overview
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight mt-0.5">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/courses" className="btn-secondary text-xs">
              Explore Catalog
            </Link>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="error-banner text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dense Progress Overview (Replaces decorative stat cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(s => (
            <div
              key={s.label}
              className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] space-y-1"
            >
              <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                {s.label}
              </div>
              <div className="text-2xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100 tracking-tight">
                {s.value}
              </div>
              <div className="text-[10px] text-neutral-400">
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Workstation Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 text-xs">
          {[
            { key: 'learning', label: `Active Courses (${enrolledCourses.length})` },
            { key: 'deadlines', label: `Milestones & Deadlines (${SAMPLE_DEADLINES.length})` },
            { key: 'wishlist', label: `Saved Wishlist (${wishlistedCourses.length})` },
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

        {/* 1. ACTIVE COURSES TAB */}
        {activeTab === 'learning' && (
          <div className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-[#121215] space-y-3">
                    <div className="aspect-video w-full bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-10 text-center bg-white dark:bg-[#121215] space-y-3">
                <BookOpen className="w-8 h-8 text-neutral-400 mx-auto" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    No active course enrollments
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Select a specialization from our catalog to begin your syllabus.
                  </p>
                </div>
                <Link href="/courses" className="btn-primary text-xs mt-2">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedEnrolled.map(course => {
                    const courseId = course._id || course.id;
                    const prog = progress[courseId];
                    const totalLessons = course.lessons?.length || 16;
                    const completedLessons = prog?.completedLessons?.length || 0;
                    const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                    return (
                      <div
                        key={courseId}
                        className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-[#121215] flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-video w-full bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                            <img
                              src={course.courseThumbnail || 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'}
                              alt={course.courseTitle}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'; }}
                            />
                            {prog?.completed && (
                              <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded">
                                Completed
                              </span>
                            )}
                          </div>

                          <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between text-[11px] text-neutral-500">
                              <span className="font-semibold uppercase tracking-wider">{course.category || 'Engineering'}</span>
                              <span className="font-mono tabular-nums">{course.level || 'Staff'}</span>
                            </div>

                            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug">
                              {course.courseTitle}
                            </h3>

                            {/* Linear Progress Bar */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex items-center justify-between text-xs text-neutral-500 tabular-nums">
                                <span>{completedLessons} of {totalLessons} lessons</span>
                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{pct}%</span>
                              </div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Explicit Resume Lesson CTA */}
                        <div className="p-4 pt-0">
                          <Link
                            href={`/courses/${courseId}`}
                            className="btn-primary w-full text-xs flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Resume Lesson</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Pagination
                  page={enrolledPage}
                  totalPages={enrolledTotalPages}
                  onPageChange={p => { setEnrolledPage(p); window.scrollTo({ top: 200, behavior: 'smooth' }); }}
                />
              </>
            )}
          </div>
        )}

        {/* 2. TABULAR CHECKLIST: DEADLINES & ASSIGNMENTS */}
        {activeTab === 'deadlines' && (
          <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  Curriculum Milestones & Submissions
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Tabular roadmap of scheduled architecture checkpoints and project reviews.
                </p>
              </div>
              <span className="text-xs font-mono tabular-nums text-neutral-500">
                {SAMPLE_DEADLINES.length} deadlines tracked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Milestone Title</th>
                    <th className="py-2.5 px-4">Course Track</th>
                    <th className="py-2.5 px-4">Due Date</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {SAMPLE_DEADLINES.map(d => (
                    <tr key={d.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 px-4">
                        {d.status === 'submitted' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        {d.title}
                      </td>
                      <td className="py-3 px-4 text-neutral-500">
                        {d.course}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                        {d.dueDate}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`Opening submission workspace for ${d.title}`)}
                          className="btn-secondary text-[11px] py-1 px-2.5 cursor-pointer"
                        >
                          {d.status === 'submitted' ? 'Review' : 'Open Lab'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedCourses.length === 0 ? (
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-10 text-center bg-white dark:bg-[#121215] space-y-3">
                <Heart className="w-8 h-8 text-neutral-400 mx-auto" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Your wishlist is empty
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Save courses to revisit when ready to enroll.</p>
                </div>
                <Link href="/courses" className="btn-primary text-xs mt-2">
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedWishlist.map(course => {
                    const courseId = course._id || course.id;
                    return (
                      <div
                        key={courseId}
                        className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-[#121215] flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-video w-full bg-neutral-100 dark:bg-neutral-900">
                            <img
                              src={course.courseThumbnail || 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'}
                              alt={course.courseTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 space-y-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                              {course.category || 'Tech'}
                            </span>
                            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 line-clamp-2">
                              {course.courseTitle}
                            </h3>
                            <p className="text-xs font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                              ${course.coursePrice || 99}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 flex gap-2">
                          <Link href={`/courses/${courseId}`} className="btn-primary flex-1 text-xs">
                            View Syllabus
                          </Link>
                          <button
                            onClick={() => handleRemoveWishlist(courseId)}
                            className="btn-secondary text-xs px-2.5"
                            title="Remove from wishlist"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Pagination
                  page={wishlistPage}
                  totalPages={wishlistTotalPages}
                  onPageChange={p => { setWishlistPage(p); window.scrollTo({ top: 200, behavior: 'smooth' }); }}
                />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
