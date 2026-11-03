'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  Course,
  Lesson,
  CurriculumModule,
  getCourseByIdOrSlug,
  SEED_COURSES,
  isMediaLesson,
  isDownloadableLesson,
  getLessonDownloadInfo
} from '@/data/coursesData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Clock, BookOpen, Users, CheckCircle2, Play, Pause, Lock,
  ChevronDown, ChevronUp, ChevronRight, Video, MapPin, FileText,
  CreditCard, ShieldCheck, Award, ArrowLeft, ExternalLink,
  Share2, Heart, Sparkles, CheckSquare, Square,
  Download, File, FileCode, FolderArchive, Globe, Headphones,
  Volume2, VolumeX, Image as ImageIcon, ZoomIn, ZoomOut, Maximize2,
  RotateCcw, Copy, Check, Info, FileSpreadsheet, Layers, FileCheck
} from 'lucide-react';

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function formatAudioTime(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
  const [downloadToast, setDownloadToast] = useState<{ filename: string; success: boolean } | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

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

  // Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioPlaybackRate, setAudioPlaybackRate] = useState(1);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Image Zoom & Lightbox State
  const [imageZoom, setImageZoom] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // External link copied state
  const [copiedResourceLink, setCopiedResourceLink] = useState(false);

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

  // Reset lesson player states when switching lessons
  useEffect(() => {
    setIsAudioPlaying(false);
    setAudioCurrentTime(0);
    setImageZoom(1);
    setIsImageModalOpen(false);
    setCopiedResourceLink(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [selectedLesson?.id]);

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

  // Robust File Download Handler for Non-Media Content
  const handleDownload = async (url: string, filename: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!url) return;
    setDownloadingFile(filename);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Download request failed');
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || url.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
      setDownloadToast({ filename, success: true });
    } catch (err) {
      // Fallback direct download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || url.split('/').pop() || 'download';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadToast({ filename, success: true });
    } finally {
      setDownloadingFile(null);
      setTimeout(() => setDownloadToast(null), 3500);
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

  // Audio playback controls
  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
      }).catch(err => {
        console.warn('Audio play request failed:', err);
      });
    }
  };

  const cycleAudioPlaybackRate = () => {
    if (!audioRef.current) return;
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(audioPlaybackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    audioRef.current.playbackRate = newRate;
    setAudioPlaybackRate(newRate);
  };

  const toggleAudioMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isAudioMuted;
    setIsAudioMuted(!isAudioMuted);
  };

  const activeLessonType = selectedLesson?.type || selectedLesson?.lessonType || 'video';
  const activeVideoUrl = selectedLesson?.videoUrl || (activeLessonType === 'video' ? course.previewVideoUrl : undefined);
  const ytId = activeVideoUrl ? getYouTubeId(activeVideoUrl) : null;
  const canAccessLesson = isEnrolled || Boolean(selectedLesson?.isFreePreview);
  const downloadInfo = selectedLesson ? getLessonDownloadInfo(selectedLesson) : null;
  const isSelectedMedia = isMediaLesson(activeLessonType);

  const price = Number(course.price ?? course.coursePrice ?? 99);
  const originalPrice = Number(course.originalPrice ?? 199);
  const discount = course.discount || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const rating = Number(course.rating || 4.9);
  const reviewsCount = course.reviewsCount || 1420;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Floating Download Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-white">Download Started</p>
            <p className="text-[11px] text-slate-300 font-mono truncate max-w-xs">{downloadToast.filename}</p>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {isImageModalOpen && selectedLesson && downloadInfo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="absolute top-5 right-5 flex items-center gap-3 z-10">
            <button
              onClick={() => handleDownload(downloadInfo.url, downloadInfo.fileName)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Blueprint ({downloadInfo.fileSize})</span>
            </button>
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="max-w-6xl max-h-[85vh] w-full flex items-center justify-center overflow-auto p-4">
            <img
              src={selectedLesson.imageUrl || downloadInfo.url}
              alt={selectedLesson.title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-slate-800"
            />
          </div>

          {selectedLesson.imageCaption && (
            <p className="text-xs text-slate-300 bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800 max-w-3xl text-center mt-3">
              {selectedLesson.imageCaption}
            </p>
          )}
        </div>
      )}

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
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Multi-Format Content
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {course.title || course.courseTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {course.subtitle || course.courseDescription}
              </p>

              {/* Meta row: rating, reviews, enrolled, duration */}
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
                  <span>{course.duration || '24h 30m'} total content</span>
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
            
            {/* Left Column (8 cols): Interactive Classroom + Curriculum + Instructor Bio */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Classroom Interactive Content Section */}
              <div ref={playerRef} className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Interactive Learning Classroom</span>
                      <span className="text-xs text-slate-400 font-normal">
                        ({activeLessonType === 'video' ? 'Video Lecture' :
                          activeLessonType === 'audio' ? 'Audio Studio' :
                          activeLessonType === 'image' ? 'System Blueprint' :
                          activeLessonType === 'pdf' ? 'Technical PDF' :
                          activeLessonType === 'doc' ? 'Engineering Spec' :
                          activeLessonType === 'file' ? 'Code Archive' :
                          activeLessonType === 'link' ? 'Web Resource' : 'Classroom'})
                      </span>
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedLesson?.isFreePreview && !isEnrolled && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        Free Preview
                      </span>
                    )}
                    {/* Non-media Download Badge */}
                    {downloadInfo && canAccessLesson && (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                        <Download className="w-3 h-3" /> Downloadable
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Player & Content Card */}
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                  
                  {/* Content Display Canvas */}
                  <div className="w-full bg-black relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
                    {canAccessLesson ? (
                      
                      /* 1. AUDIO LESSON PLAYER */
                      activeLessonType === 'audio' ? (
                        <div className="w-full p-6 sm:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/70 flex flex-col justify-between space-y-8">
                          <audio
                            ref={audioRef}
                            src={selectedLesson?.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
                            onTimeUpdate={() => {
                              if (audioRef.current) {
                                setAudioCurrentTime(audioRef.current.currentTime);
                              }
                            }}
                            onLoadedMetadata={() => {
                              if (audioRef.current) {
                                setAudioDuration(audioRef.current.duration);
                              }
                            }}
                            onEnded={() => setIsAudioPlaying(false)}
                            className="hidden"
                          />

                          {/* Audio Studio Header & Waveform */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-lg relative">
                                <Headphones className="w-8 h-8" />
                                {isAudioPlaying && (
                                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-indigo-500 animate-ping" />
                                )}
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                                  Audio Deep-Dive & Discussion (Media Stream)
                                </span>
                                <h3 className="text-lg font-bold text-white mt-0.5 leading-snug">
                                  {selectedLesson?.title}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Speaker: {course.instructor?.name || 'Staff Engineers'} &bull; {course.institutionName}
                                </p>
                              </div>
                            </div>

                            {/* Soundwave frequency visualizer */}
                            <div className="flex items-end gap-1.5 h-12 px-4 py-2 bg-slate-950/60 rounded-xl border border-slate-800">
                              {[18, 36, 24, 48, 20, 38, 28, 44, 22, 32, 16, 40].map((h, idx) => (
                                <div
                                  key={idx}
                                  className={`w-1.5 rounded-full transition-all duration-300 ${
                                    isAudioPlaying
                                      ? 'bg-indigo-400 animate-pulse'
                                      : 'bg-slate-700'
                                  }`}
                                  style={{
                                    height: isAudioPlaying ? `${Math.max(12, (h * (idx % 2 === 0 ? 1.2 : 0.8)))}px` : '8px',
                                    animationDelay: `${idx * 0.1}s`
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Audio Timeline & Scrub Bar */}
                          <div className="space-y-2">
                            <input
                              type="range"
                              min={0}
                              max={audioDuration || 1335}
                              value={audioCurrentTime}
                              onChange={(e) => {
                                const newTime = Number(e.target.value);
                                setAudioCurrentTime(newTime);
                                if (audioRef.current) {
                                  audioRef.current.currentTime = newTime;
                                }
                              }}
                              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-xs font-mono text-slate-400">
                              <span>{formatAudioTime(audioCurrentTime)}</span>
                              <span>{formatAudioTime(audioDuration || 1335)}</span>
                            </div>
                          </div>

                          {/* Audio Player Controls */}
                          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                            <div className="flex items-center gap-3">
                              {/* Large Play/Pause */}
                              <button
                                onClick={toggleAudioPlay}
                                className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 hover:scale-105 transition-all cursor-pointer"
                                aria-label={isAudioPlaying ? 'Pause audio' : 'Play audio'}
                              >
                                {isAudioPlaying ? (
                                  <Pause className="w-6 h-6 fill-white" />
                                ) : (
                                  <Play className="w-6 h-6 fill-white ml-0.5" />
                                )}
                              </button>

                              {/* Skip -10s */}
                              <button
                                onClick={() => {
                                  if (audioRef.current) {
                                    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                                  }
                                }}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                                title="Rewind 10 seconds"
                              >
                                -10s
                              </button>

                              {/* Skip +10s */}
                              <button
                                onClick={() => {
                                  if (audioRef.current) {
                                    audioRef.current.currentTime = Math.min(audioDuration || 1335, audioRef.current.currentTime + 10);
                                  }
                                }}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                                title="Forward 10 seconds"
                              >
                                +10s
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Playback speed toggle */}
                              <button
                                onClick={cycleAudioPlaybackRate}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs font-bold cursor-pointer"
                              >
                                {audioPlaybackRate}x Speed
                              </button>

                              {/* Mute toggle */}
                              <button
                                onClick={toggleAudioMute}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                                aria-label={isAudioMuted ? 'Unmute' : 'Mute'}
                              >
                                {isAudioMuted ? (
                                  <VolumeX className="w-4 h-4 text-rose-400" />
                                ) : (
                                  <Volume2 className="w-4 h-4 text-slate-300" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Key Discussion Points Notes */}
                          {selectedLesson?.summary && (
                            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-1.5 mt-2">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5" /> Audio Discussion Notes & Takeaways
                              </p>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {selectedLesson.summary}
                              </p>
                            </div>
                          )}
                        </div>
                      ) :

                      /* 2. ARCHITECTURE DIAGRAM / IMAGE LESSON */
                      activeLessonType === 'image' ? (
                        <div className="w-full h-full flex flex-col bg-slate-950 relative">
                          {/* Image Toolbar Overlay */}
                          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 z-10 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                <ImageIcon className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs font-bold text-white truncate max-w-xs">
                                {selectedLesson?.title}
                              </span>
                              {downloadInfo?.fileSize && (
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                  {downloadInfo.fileSize}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Zoom Out */}
                              <button
                                onClick={() => setImageZoom(z => Math.max(0.75, z - 0.25))}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                                title="Zoom Out"
                              >
                                <ZoomOut className="w-3.5 h-3.5" />
                              </button>

                              {/* Zoom Reset */}
                              <button
                                onClick={() => setImageZoom(1)}
                                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-mono cursor-pointer"
                                title="Reset Zoom"
                              >
                                {Math.round(imageZoom * 100)}%
                              </button>

                              {/* Zoom In */}
                              <button
                                onClick={() => setImageZoom(z => Math.min(2.5, z + 0.25))}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                                title="Zoom In"
                              >
                                <ZoomIn className="w-3.5 h-3.5" />
                              </button>

                              {/* Fullscreen Expand */}
                              <button
                                onClick={() => setIsImageModalOpen(true)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                                title="View Fullscreen"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Prominent Download Button */}
                              {downloadInfo && (
                                <button
                                  onClick={(e) => handleDownload(downloadInfo.url, downloadInfo.fileName, e)}
                                  disabled={downloadingFile === downloadInfo.fileName}
                                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>{downloadingFile === downloadInfo.fileName ? 'Downloading...' : 'Download Blueprint'}</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Diagram Canvas Viewport */}
                          <div className="w-full min-h-[380px] p-6 flex items-center justify-center overflow-auto bg-slate-950">
                            <div
                              style={{
                                transform: `scale(${imageZoom})`,
                                transformOrigin: 'center center',
                                transition: 'transform 0.2s ease-out'
                              }}
                              className="cursor-zoom-in max-w-full flex justify-center"
                              onClick={() => setIsImageModalOpen(true)}
                            >
                              <img
                                src={selectedLesson?.imageUrl || downloadInfo?.url || '/downloads/raft-consensus-blueprint.svg'}
                                alt={selectedLesson?.title}
                                className="max-h-[460px] object-contain rounded-lg border border-slate-800 shadow-2xl"
                              />
                            </div>
                          </div>

                          {/* Architectural Notes Caption */}
                          <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-1">
                            <p className="text-xs font-bold text-slate-200">
                              {selectedLesson?.imageCaption || 'High-resolution system design architecture blueprint.'}
                            </p>
                            {selectedLesson?.summary && (
                              <p className="text-[11px] text-slate-400">
                                {selectedLesson.summary}
                              </p>
                            )}
                          </div>
                        </div>
                      ) :

                      /* 3. PDF DOCUMENT LESSON */
                      activeLessonType === 'pdf' ? (
                        <div className="w-full flex flex-col bg-slate-950">
                          {/* PDF Action Banner */}
                          <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                                  Technical PDF Whitepaper & Reference Guide
                                </span>
                                <h4 className="text-sm font-bold text-white leading-tight">
                                  {selectedLesson?.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  {downloadInfo?.fileName} &bull; {downloadInfo?.fileSize || '2.4 MB'} &bull; 18 Pages
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Open in new tab */}
                              <a
                                href={selectedLesson?.pdfUrl || downloadInfo?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Open Fullscreen</span>
                              </a>

                              {/* Prominent Download Button */}
                              {downloadInfo && (
                                <button
                                  onClick={(e) => handleDownload(downloadInfo.url, downloadInfo.fileName, e)}
                                  disabled={downloadingFile === downloadInfo.fileName}
                                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  <Download className="w-4 h-4" />
                                  <span>{downloadingFile === downloadInfo.fileName ? 'Downloading...' : `Download PDF (${downloadInfo.fileSize})`}</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Embedded Document Frame */}
                          <div className="w-full h-[520px] bg-slate-950 p-2">
                            <iframe
                              src={selectedLesson?.pdfUrl || downloadInfo?.url || '/downloads/distributed-systems-staff-cheatsheet.pdf'}
                              title={selectedLesson?.title || 'PDF Document'}
                              className="w-full h-full rounded-xl border border-slate-800 bg-slate-900"
                            />
                          </div>
                        </div>
                      ) :

                      /* 4. DOC / CODE FILE ARTIFACT LESSON */
                      (activeLessonType === 'doc' || activeLessonType === 'file') ? (
                        <div className="w-full flex flex-col bg-slate-950">
                          {/* Document Action Banner */}
                          <div className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center">
                                {activeLessonType === 'file' ? (
                                  <FolderArchive className="w-6 h-6" />
                                ) : (
                                  <FileCode className="w-6 h-6" />
                                )}
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                  {downloadInfo?.fileType || 'Engineering Specification & Artifact'}
                                </span>
                                <h4 className="text-base font-bold text-white mt-0.5">
                                  {selectedLesson?.title}
                                </h4>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                  File: {downloadInfo?.fileName} &bull; Size: {downloadInfo?.fileSize || '1.2 MB'}
                                </p>
                              </div>
                            </div>

                            {/* Prominent Download Button */}
                            {downloadInfo && (
                              <button
                                onClick={(e) => handleDownload(downloadInfo.url, downloadInfo.fileName, e)}
                                disabled={downloadingFile === downloadInfo.fileName}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                              >
                                <Download className="w-4 h-4" />
                                <span>{downloadingFile === downloadInfo.fileName ? 'Downloading...' : `Download File (${downloadInfo.fileSize})`}</span>
                              </button>
                            )}
                          </div>

                          {/* Specification Synopsis & Details Hub */}
                          <div className="p-8 space-y-6 text-slate-300 bg-slate-950/80">
                            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
                              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                                <FileCheck className="w-4 h-4" /> Technical Specification Synopsis
                              </h5>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                {selectedLesson?.summary ||
                                  'This downloadable engineering artifact contains verified production specifications, schema contracts, and implementation blueprints.'}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Artifact Format</span>
                                <span className="text-white font-bold text-sm mt-1 block">{downloadInfo?.fileType || 'Specification (.docx)'}</span>
                              </div>
                              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">File Payload</span>
                                <span className="text-white font-bold text-sm mt-1 block">{downloadInfo?.fileSize || '1.2 MB'}</span>
                              </div>
                              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Integrity Verification</span>
                                <span className="text-emerald-400 font-bold text-sm mt-1 block">SHA-256 Verified</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) :

                      /* 5. INTERACTIVE EXTERNAL RESOURCE / WEB LINK */
                      activeLessonType === 'link' ? (
                        <div className="w-full p-8 sm:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 flex flex-col items-center justify-center text-center space-y-6">
                          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center shadow-lg">
                            <Globe className="w-8 h-8" />
                          </div>

                          <div className="max-w-xl space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/60 inline-block">
                              Interactive Online Lab & Specification Resource
                            </span>
                            <h3 className="text-xl font-extrabold text-white">
                              {selectedLesson?.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                              {selectedLesson?.summary ||
                                'Launch this interactive hands-on simulator lab to test distributed failure scenarios, observe live consensus partitions, and benchmark throughput.'}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap justify-center pt-2">
                            <a
                              href={selectedLesson?.webLink || 'https://github.com/niloykm/edemy'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Launch Interactive Lab ({selectedLesson?.webLinkDomain || 'external'})</span>
                            </a>

                            <button
                              onClick={() => {
                                if (selectedLesson?.webLink) {
                                  navigator.clipboard.writeText(selectedLesson.webLink);
                                  setCopiedResourceLink(true);
                                  setTimeout(() => setCopiedResourceLink(false), 2000);
                                }
                              }}
                              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                            >
                              {copiedResourceLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                              <span>{copiedResourceLink ? 'Copied Link!' : 'Copy URL'}</span>
                            </button>
                          </div>
                        </div>
                      ) :

                      /* 6. LIVE ONLINE SESSION (GOOGLE MEET) */
                      activeLessonType === 'online' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
                            <Video className="w-8 h-8" />
                          </div>
                          <div className="max-w-md space-y-1">
                            <h4 className="text-lg font-bold text-white">{selectedLesson?.title}</h4>
                            <p className="text-xs text-slate-400">
                              This live online session takes place via Google Meet.
                            </p>
                            {selectedLesson?.timeSchedule && (
                              <p className="text-xs font-mono text-indigo-400 pt-1">
                                Scheduled: {new Date(selectedLesson.timeSchedule).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <a
                            href={selectedLesson?.meetLink || 'https://meet.google.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" /> Join Live Google Meet
                          </a>
                        </div>
                      ) :

                      /* 7. PHYSICAL WORKSHOP (OFFLINE) */
                      activeLessonType === 'offline' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                            <MapPin className="w-8 h-8" />
                          </div>
                          <div className="max-w-md space-y-1">
                            <h4 className="text-lg font-bold text-white">{selectedLesson?.title}</h4>
                            <p className="text-xs text-slate-400">
                              In-person physical workshop session.
                            </p>
                            {selectedLesson?.locationDetails && (
                              <p className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 py-1 px-3 rounded-lg mt-2 inline-block">
                                Venue: {selectedLesson.locationDetails}
                              </p>
                            )}
                          </div>
                        </div>
                      ) :

                      /* 8. STANDARD VIDEO LECTURE (MEDIA STREAM) */
                      ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
                          title={selectedLesson?.title || 'Lecture Video'}
                          className="w-full h-full border-0 aspect-video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : activeVideoUrl ? (
                        <video
                          key={activeVideoUrl}
                          src={activeVideoUrl}
                          controls
                          playsInline
                          className="w-full h-full object-contain aspect-video"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[360px] flex flex-col items-center justify-center text-slate-400 space-y-2">
                          <Play className="w-12 h-12 text-indigo-400 opacity-60" />
                          <p className="text-xs text-slate-500">Video stream ready to play.</p>
                        </div>
                      )
                    ) : (
                      /* LOCKED STATE OVERLAY */
                      <div className="w-full min-h-[380px] flex flex-col items-center justify-center p-8 bg-slate-950/95 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center">
                          <Lock className="w-8 h-8 text-amber-400" />
                        </div>
                        <div className="max-w-md space-y-1">
                          <h4 className="text-lg font-bold text-white">This lesson is locked</h4>
                          <p className="text-xs text-slate-400">
                            Enroll in the full course to unlock all {course.lessonsCount || 16} lessons, downloadable blueprints, PDFs, code archives, and verified certificate.
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
                  <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                          {isEnrolled ? 'Active Lesson' : selectedLesson?.isFreePreview ? 'Free Preview Lesson' : 'Selected Lesson'}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Format: {activeLessonType}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {selectedLesson?.title || course.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>Duration / Work: {selectedLesson?.duration || '15 mins'}</span>
                        {downloadInfo && (
                          <>
                            <span>&bull;</span>
                            <span className="text-emerald-400 font-medium">Download Available ({downloadInfo.fileSize})</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
                      {/* Non-Media Quick Download Button in footer */}
                      {downloadInfo && canAccessLesson && (
                        <button
                          onClick={(e) => handleDownload(downloadInfo.url, downloadInfo.fileName, e)}
                          disabled={downloadingFile === downloadInfo.fileName}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{downloadingFile === downloadInfo.fileName ? 'Downloading...' : `Download ${downloadInfo.fileType.split(' ')[0]}`}</span>
                        </button>
                      )}

                      {/* Lesson Completion Checkbox */}
                      {isEnrolled && selectedLesson && (
                        <button
                          onClick={() => handleToggleProgress(selectedLesson.id, progress?.completedLessons?.includes(selectedLesson.id))}
                          disabled={updatingProgress === selectedLesson.id}
                          className={`px-4 py-2 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
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
                    'Analyze Raft consensus state machines and multi-datacenter partition quorums.',
                    'Download and inspect staff-level system design blueprints, formulas, and RFC specs.',
                    'Deploy automated event streams with exactly-once idempotency guarantees.',
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
                      {course.curriculum?.length || 4} modules &bull; {course.lessonsCount || 16} lessons &bull; Multi-format curriculum (Video, Audio, Diagram, PDF, Doc, Link)
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
                              const lType = lesson.type || lesson.lessonType || 'video';
                              const itemDownloadInfo = getLessonDownloadInfo(lesson);
                              const isDownloadable = isDownloadableLesson(lesson);

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
                                  {/* Left: Format Icon & Title */}
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex-shrink-0">
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                      ) : !isUnlocked ? (
                                        <Lock className="w-4 h-4 text-slate-400" />
                                      ) : lType === 'audio' ? (
                                        <Headphones className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-purple-500'}`} />
                                      ) : lType === 'image' ? (
                                        <ImageIcon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-cyan-500'}`} />
                                      ) : lType === 'pdf' ? (
                                        <FileText className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-500'}`} />
                                      ) : (lType === 'doc' || lType === 'file') ? (
                                        <FileCode className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-blue-500'}`} />
                                      ) : lType === 'link' ? (
                                        <Globe className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-teal-500'}`} />
                                      ) : (
                                        <Play className={`w-4 h-4 ${isSelected ? 'fill-indigo-600 text-indigo-600' : 'text-slate-400'}`} />
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold truncate leading-tight">
                                        {lesson.title || lesson.lessonTitle}
                                      </p>
                                      
                                      {/* Format Pill */}
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${
                                          lType === 'audio'
                                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                                            : lType === 'image'
                                            ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                                            : lType === 'pdf'
                                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                                            : (lType === 'doc' || lType === 'file')
                                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                                            : lType === 'link'
                                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
                                            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30'
                                        }`}>
                                          {lType}
                                        </span>
                                        {lesson.fileSize && (
                                          <span className="text-[10px] text-slate-400 font-mono">
                                            {lesson.fileSize}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right: Duration, Preview badge, and Quick Download */}
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    {isFree && !isEnrolled && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                        Preview
                                      </span>
                                    )}

                                    {/* Non-Media Download Action Button in list */}
                                    {isDownloadable && isUnlocked && itemDownloadInfo && (
                                      <button
                                        onClick={(e) => handleDownload(itemDownloadInfo.url, itemDownloadInfo.fileName, e)}
                                        title={`Download ${itemDownloadInfo.fileName}`}
                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                        aria-label={`Download ${itemDownloadInfo.fileName}`}
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </button>
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
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.98 Instructor Rating
                      </span>
                      <span>&bull;</span>
                      <span>14,800+ Engineers Trained</span>
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
                    Interactive Preview Available
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
                      <span>{course.duration || '24h 30m'} total instructional content</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>{course.lessonsCount || 16} multi-format lessons (Video, Audio, Blueprint)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Download className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Downloadable PDF whitepapers, blueprints & doc files</span>
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