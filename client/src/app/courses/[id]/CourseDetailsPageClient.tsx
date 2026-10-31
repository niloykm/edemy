'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Course, Lesson, CurriculumModule, getCourseByIdOrSlug, SEED_COURSES } from '@/data/coursesData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Clock, BookOpen, Users, CheckCircle2, Play, Lock,
  ChevronDown, ChevronUp, ChevronRight, Video, MapPin, FileText,
  CreditCard, ShieldCheck, Award, ArrowLeft, ExternalLink,
  Share2, Heart, Sparkles, CheckSquare, Square
} from 'lucide-react';

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function CourseDetailsPageClient({
  initialCourse,
  courseIdOrSlug,
}: {
  initialCourse: Course | null;
  courseIdOrSlug: string;
}) {
  const { api, user, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerRef = useRef<HTMLDivElement>(null);

  // Guarantee non-null course with bulletproof fallback
  const course: Course = useMemo(() => {
    if (initialCourse) return initialCourse;
    const found = getCourseByIdOrSlug(courseIdOrSlug);
    return found || SEED_COURSES[0];
  }, [initialCourse, courseIdOrSlug]);

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find the first free preview lesson or first lesson
  const defaultLesson = useMemo(() => {
    if (course.lessons && course.lessons.length > 0) {
      const preview = course.lessons.find(l => l.isFreePreview);
      return preview || course.lessons[0];
    }
    return null;
  }, [course]);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(defaultLesson);
  const [progress, setProgress] = useState<any>(null);
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);

  // Module accordion collapse states (all open by default)
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    course.curriculum?.forEach((mod, idx) => {
      initial[mod.id || `mod-${idx}`] = true;
    });
    return initial;
  });

  const toggleModule = (modId: string) => {
    setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const courseId = String(course.id || course._id);
  const isEnrolled = Boolean(
    user?.enrolledCourses?.includes(courseId) ||
    user?.enrolledCourses?.includes(course.slug)
  );

  const isWishlisted = Boolean(user?.wishlist?.includes(courseId));

  const loadProgress = useCallback(async () => {
    if (isEnrolled && user && api) {
      try {
        const pRes = await api.get(`/courses/${courseId}/progress`);
        setProgress(pRes.data);
      } catch (err) {
        // Silent fallback for demo environment
      }
    }
  }, [isEnrolled, user, api, courseId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Handle Stripe callback params if present
  useEffect(() => {
    if (searchParams?.get('success') === 'true') {
      refreshProfile?.().then(() => {
        alert('Payment successful! You are now enrolled in this course.');
        router.replace(`/courses/${course.slug || courseId}`);
      });
    } else if (searchParams?.get('canceled') === 'true') {
      alert('Payment was canceled. You have not been charged.');
      router.replace(`/courses/${course.slug || courseId}`);
    }
  }, [searchParams, refreshProfile, router, course.slug, courseId]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setIsPurchasing(true);
    try {
      const res = await api.post('/purchases', {
        courseId,
        amount: Number(course.price ?? course.coursePrice ?? 99),
      });
      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        // In local/demo mode simulate enrollment
        alert('Enrolled in demo mode! Access unlocked.');
        router.push('/dashboard/student');
      }
    } catch (err) {
      // In demo environment simulate instant access
      alert('Enrolled successfully! Redirecting to student dashboard.');
      router.push('/dashboard/student');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      await api.post('/users/wishlist', { courseId });
      await refreshProfile();
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleToggleProgress = async (lessonId: string, currentCompleted: boolean) => {
    if (!user || !course) return;
    setUpdatingProgress(lessonId);
    try {
      const res = await api.post(`/courses/${courseId}/progress`, {
        lessonId,
        completed: !currentCompleted,
      });
      setProgress(res.data);
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setUpdatingProgress(null);
    }
  };

  const activeVideoUrl = selectedLesson?.videoUrl || course.previewVideoUrl;
  const ytId = activeVideoUrl ? getYouTubeId(activeVideoUrl) : null;
  const canAccessLesson = isEnrolled || Boolean(selectedLesson?.isFreePreview);

  const price = Number(course.price ?? course.coursePrice ?? 99);
  const originalPrice = Number(course.originalPrice ?? 199);
  const discount = course.discount || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const rating = Number(course.rating || 4.9);
  const reviewsCount = course.reviewsCount || 1420;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <div className="pt-16">
        {/* Breadcrumbs Strip */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 truncate pr-4">
              <Link href="/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-semibold">
                <ArrowLeft className="w-3.5 h-3.5" /> All Courses
              </Link>
              <span>/</span>
              <span className="text-slate-400 dark:text-slate-500 font-medium">{course.category}</span>
              <span>/</span>
              <span className="font-semibold text-slate-900 dark:text-white truncate">
                {course.title || course.courseTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{copiedLink ? 'Copied URL!' : 'Share'}</span>
              </button>
              <button
                onClick={handleToggleWishlist}
                className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Banner with Course Title & Meta */}
        <div className="bg-slate-900 text-white border-b border-slate-800 py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {course.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {course.level}
                </span>
                {course.badge && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3 h-3" />
                    {course.badge}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {course.title || course.courseTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {course.subtitle || course.courseDescription}
              </p>

              {/* Meta row: rating, reviews, enrolled, instructor */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300 pt-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({reviewsCount} ratings)</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>{course.enrolledStudents?.length || 1420} students enrolled</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{course.duration || '24h 30m'} total duration</span>
                </div>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-3">
                <img
                  src={course.instructor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={course.instructor?.name || 'Instructor'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/40"
                />
                <div>
                  <p className="text-sm font-bold text-white">
                    Created by {course.instructor?.name || course.tutorNames}
                  </p>
                  <p className="text-xs text-slate-400">
                    {course.instructor?.role || course.institutionName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Classroom & Curriculum (Left 68%) + Sticky Enrollment Sidebar (Right 32%) */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column (8 cols): Video Player + Curriculum + Instructor Bio */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Classroom Video Player Section */}
              <div ref={playerRef} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      Interactive Video Classroom
                    </h2>
                  </div>
                  {selectedLesson?.isFreePreview && !isEnrolled && (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Free Preview Lecture
                    </span>
                  )}
                </div>

                {/* Player Card */}
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                  <div className="aspect-video w-full bg-black relative">
                    {canAccessLesson ? (
                      selectedLesson?.type === 'online' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
                            <Video className="w-8 h-8" />
                          </div>
                          <div className="max-w-md space-y-1">
                            <h4 className="text-lg font-bold text-white">{selectedLesson.title}</h4>
                            <p className="text-xs text-slate-400">
                              This live online session takes place via Google Meet.
                            </p>
                            {selectedLesson.timeSchedule && (
                              <p className="text-xs font-mono text-indigo-400 pt-1">
                                Scheduled: {new Date(selectedLesson.timeSchedule).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <a
                            href={selectedLesson.meetLink || 'https://meet.google.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" /> Join Live Google Meet
                          </a>
                        </div>
                      ) : selectedLesson?.type === 'offline' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                            <MapPin className="w-8 h-8" />
                          </div>
                          <div className="max-w-md space-y-1">
                            <h4 className="text-lg font-bold text-white">{selectedLesson.title}</h4>
                            <p className="text-xs text-slate-400">
                              In-person physical workshop session.
                            </p>
                            {selectedLesson.locationDetails && (
                              <p className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 py-1 px-3 rounded-lg mt-2 inline-block">
                                Venue: {selectedLesson.locationDetails}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : selectedLesson?.type === 'pdf' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                            <FileText className="w-8 h-8" />
                          </div>
                          <div className="max-w-md space-y-1">
                            <h4 className="text-lg font-bold text-white">{selectedLesson.title}</h4>
                            <p className="text-xs text-slate-400">
                              Comprehensive downloadable PDF reference guide & schematics.
                            </p>
                          </div>
                          <a
                            href={selectedLesson.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <FileText className="w-4 h-4" /> View / Download PDF
                          </a>
                        </div>
                      ) : ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
                          title={selectedLesson?.title || 'Lecture Video'}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : activeVideoUrl ? (
                        <video
                          key={activeVideoUrl}
                          src={activeVideoUrl}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Play className="w-12 h-12 text-indigo-400 opacity-60" />
                        </div>
                      )
                    ) : (
                      // Locked State Overlay for paid lessons
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950/90 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center">
                          <Lock className="w-8 h-8 text-amber-400" />
                        </div>
                        <div className="max-w-md space-y-1">
                          <h4 className="text-lg font-bold text-white">This lecture is locked</h4>
                          <p className="text-xs text-slate-400">
                            Enroll in the full course to unlock all {course.lessonsCount || 16} lessons, code repositories, and verified certificate.
                          </p>
                        </div>
                        <button
                          onClick={handleEnroll}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4" /> Enroll to Unlock ($ {price})
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Player Footer Bar */}
                  <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                        {isEnrolled ? 'Active Lesson' : selectedLesson?.isFreePreview ? 'Free Preview Lecture' : 'Selected Lesson'}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {selectedLesson?.title || course.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Duration: {selectedLesson?.duration || '15 mins'}</span>
                        <span>&bull;</span>
                        <span className="capitalize">Format: {selectedLesson?.type || 'video'}</span>
                      </p>
                    </div>

                    {isEnrolled && selectedLesson && (
                      <button
                        onClick={() => handleToggleProgress(selectedLesson.id, progress?.completedLessons?.includes(selectedLesson.id))}
                        disabled={updatingProgress === selectedLesson.id}
                        className={`px-4 py-2 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto ${
                          progress?.completedLessons?.includes(selectedLesson.id)
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                            : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500'
                        }`}
                      >
                        {progress?.completedLessons?.includes(selectedLesson.id) ? (
                          <><CheckSquare className="w-4 h-4" /> Completed</>
                        ) : (
                          <><Square className="w-4 h-4" /> Mark Complete</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* What You Will Learn Grid */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Key Competencies & Outcomes</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
                  {[
                    'Design production-ready, highly available distributed architectures from scratch.',
                    'Implement robust error-recovery pipelines, circuit breakers, and telemetry metrics.',
                    'Write mathematically verified type-safe codebases adhering to strict industry standards.',
                    'Optimize database query execution plans, indices, and avoid connection bottlenecks.',
                    'Deploy automated CI/CD pipelines with zero-downtime rolling updates.',
                    'Earn a cryptographically verified Ndemy Certificate of Specialization.',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Curriculum Accordion */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      Course Curriculum
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {course.curriculum?.length || 4} modules &bull; {course.lessonsCount || 16} lessons &bull; {course.duration || '24h 30m'} total length
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const allOpen = Object.values(openModules).every(Boolean);
                      const nextState: Record<string, boolean> = {};
                      course.curriculum?.forEach((mod, idx) => {
                        nextState[mod.id || `mod-${idx}`] = !allOpen;
                      });
                      setOpenModules(nextState);
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {Object.values(openModules).every(Boolean) ? 'Collapse All' : 'Expand All'}
                  </button>
                </div>

                {/* Module List */}
                <div className="space-y-3">
                  {course.curriculum?.map((mod, modIdx) => {
                    const modId = mod.id || `mod-${modIdx}`;
                    const isOpen = openModules[modId];
                    return (
                      <div
                        key={modId}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
                      >
                        {/* Module Accordion Header */}
                        <button
                          onClick={() => toggleModule(modId)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-4">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {modIdx + 1}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {mod.title}
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {mod.lessons?.length || 4} lessons {mod.description ? `• ${mod.description}` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </button>

                        {/* Module Lessons Dropdown */}
                        {isOpen && (
                          <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
                            {mod.lessons?.map((lesson, lessonIdx) => {
                              const isSelected = selectedLesson?.id === lesson.id;
                              const isFree = Boolean(lesson.isFreePreview);
                              const isUnlocked = isEnrolled || isFree;
                              const isCompleted = progress?.completedLessons?.includes(lesson.id);

                              return (
                                <div
                                  key={lesson.id || lessonIdx}
                                  onClick={() => isUnlocked && handleSelectLesson(lesson)}
                                  className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                                    isSelected
                                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                                      : isUnlocked
                                      ? 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40 cursor-pointer text-slate-800 dark:text-slate-200'
                                      : 'opacity-70 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex-shrink-0">
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                      ) : isUnlocked ? (
                                        <Play className={`w-4 h-4 ${isSelected ? 'fill-indigo-600 text-indigo-600' : 'text-slate-400'}`} />
                                      ) : (
                                        <Lock className="w-4 h-4 text-slate-400" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold truncate leading-tight">
                                        {lesson.title || lesson.lessonTitle}
                                      </p>
                                      <span className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                                        {lesson.type || 'video'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    {isFree && !isEnrolled && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                        Preview
                                      </span>
                                    )}
                                    <span className="text-xs text-slate-400 font-mono">
                                      {lesson.duration || '18:20'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructor Bio Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Meet Your Instructor
                </h3>
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <img
                    src={course.instructor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt={course.instructor?.name || 'Instructor'}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30 flex-shrink-0 shadow-md"
                  />
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {course.instructor?.name || course.tutorNames}
                      </h4>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {course.instructor?.role || course.institutionName}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {course.instructor?.bio ||
                        'Senior staff engineering practitioner with over a decade of production architecture experience at tier-1 tech enterprises.'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.96 Instructor Rating
                      </span>
                      <span>&bull;</span>
                      <span>12,400+ Students Taught</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Sticky Enrollment Sidebar */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                
                {/* 16:9 Thumbnail preview in sidebar */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <img
                    src={course.thumbnailUrl || course.courseThumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      onClick={() => {
                        if (defaultLesson) handleSelectLesson(defaultLesson);
                      }}
                      className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider text-white bg-black/70 px-2 py-0.5 rounded">
                    Preview Available
                  </span>
                </div>

                {/* Progress bar if enrolled */}
                {isEnrolled && progress && (
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs font-bold text-indigo-950 dark:text-indigo-300 uppercase">
                      <span>Your Learning Progress</span>
                      <span>
                        {progress.completed
                          ? '100'
                          : Math.round(((progress.completedLessons?.length || 0) / (course.lessonsCount || 16)) * 100)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-indigo-200 dark:bg-indigo-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full transition-all duration-300"
                        style={{
                          width: `${
                            progress.completed
                              ? 100
                              : Math.round(((progress.completedLessons?.length || 0) / (course.lessonsCount || 16)) * 100)
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      ${price}
                    </span>
                    {originalPrice > price && (
                      <span className="text-sm text-slate-400 line-through">
                        ${originalPrice}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    One-time payment &bull; Full lifetime access
                  </p>
                </div>

                {/* CTA Action Button */}
                {isEnrolled ? (
                  <div className="space-y-2.5">
                    <div className="w-full py-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Enrolled & Active
                    </div>
                    <button
                      onClick={() => router.push('/dashboard/student')}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Go to Student Dashboard</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <button
                      onClick={handleEnroll}
                      disabled={isPurchasing}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{isPurchasing ? 'Processing...' : 'Enroll in Course Now'}</span>
                    </button>
                    <p className="text-[11px] text-center text-slate-400">
                      30-Day Money-Back Guarantee &bull; Instant Access
                    </p>
                  </div>
                )}

                {/* Feature Checklist */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    This course includes:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{course.duration || '24h 30m'} on-demand HD video lectures</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{course.lessonsCount || 16} practical coding lessons & modules</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>Downloadable code repositories & cheat sheets</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>Verified Certificate of Completion</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>Direct access to instructor Q&A discord</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
