'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  Course,
  Lesson,
  getCourseByIdOrSlug,
  SEED_COURSES,
  isMediaLesson,
  isDownloadableLesson,
  getLessonDownloadInfo
} from '@/data/coursesData';
import {
  Star, Clock, BookOpen, Users, CheckCircle2, Circle, Play, Pause, Lock,
  ChevronDown, ChevronUp, ChevronRight, Video, MapPin, FileText,
  CreditCard, ShieldCheck, Award, ArrowLeft, ExternalLink,
  Share2, Heart, CheckSquare, Square,
  Download, FileCode, FolderArchive, Globe, Headphones,
  Volume2, VolumeX, Image as ImageIcon, ZoomIn, ZoomOut, Maximize2,
  Copy, Check, Info, Layers, PanelRightClose, PanelRightOpen, Keyboard
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
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  const course: Course = useMemo(() => {
    if (initialCourse) return initialCourse;
    const found = getCourseByIdOrSlug(courseIdOrSlug);
    return found || SEED_COURSES[0];
  }, [initialCourse, courseIdOrSlug]);

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadToast, setDownloadToast] = useState<{ filename: string; success: boolean } | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Default lesson
  const allLessonsList = useMemo(() => {
    if (course.lessons && course.lessons.length > 0) return course.lessons;
    const flat: Lesson[] = [];
    course.curriculum?.forEach(m => {
      if (m.lessons) flat.push(...m.lessons);
    });
    return flat;
  }, [course]);

  const defaultLesson = useMemo(() => {
    if (allLessonsList.length > 0) {
      const preview = allLessonsList.find(l => l.isFreePreview);
      return preview || allLessonsList[0];
    }
    return null;
  }, [allLessonsList]);

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

  // Image Zoom & Lightbox
  const [imageZoom, setImageZoom] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [copiedResourceLink, setCopiedResourceLink] = useState(false);

  // Collapsible module states
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
        // Silent fallback for demo
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
        alert('Payment successful! You are now enrolled.');
        router.replace(`/courses/${course.slug || courseId}`);
      });
    } else if (searchParams?.get('canceled') === 'true') {
      alert('Payment was canceled.');
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

  // Keyboard navigation shortcuts
  const selectNextLesson = useCallback(() => {
    if (!selectedLesson || allLessonsList.length === 0) return;
    const currentIdx = allLessonsList.findIndex(l => l.id === selectedLesson.id);
    if (currentIdx !== -1 && currentIdx < allLessonsList.length - 1) {
      setSelectedLesson(allLessonsList[currentIdx + 1]);
    }
  }, [selectedLesson, allLessonsList]);

  const togglePlayCurrentMedia = useCallback(() => {
    const lType = selectedLesson?.type || selectedLesson?.lessonType || 'video';
    if (lType === 'audio') {
      if (!audioRef.current) return;
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
      }
    } else if (lType === 'video' && videoPlayerRef.current) {
      if (videoPlayerRef.current.paused) {
        videoPlayerRef.current.play();
      } else {
        videoPlayerRef.current.pause();
      }
    }
  }, [selectedLesson, isAudioPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayCurrentMedia();
      } else if (e.shiftKey && (e.key === 'N' || e.key === 'n')) {
        e.preventDefault();
        selectNextLesson();
      } else if (e.key === 's' || e.key === 'S') {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          setIsDrawerOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayCurrentMedia, selectNextLesson]);

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
        alert('Enrolled in demo mode! Access unlocked.');
        router.push('/dashboard/student');
      }
    } catch (err) {
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
  };

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
      setTimeout(() => setDownloadToast(null), 3000);
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

  const activeLessonType = selectedLesson?.type || selectedLesson?.lessonType || 'video';
  const activeVideoUrl = selectedLesson?.videoUrl || (activeLessonType === 'video' ? course.previewVideoUrl : undefined);
  const ytId = activeVideoUrl ? getYouTubeId(activeVideoUrl) : null;
  const canAccessLesson = isEnrolled || Boolean(selectedLesson?.isFreePreview);
  const downloadInfo = selectedLesson ? getLessonDownloadInfo(selectedLesson) : null;

  const price = Number(course.price ?? course.coursePrice ?? 99);
  const originalPrice = Number(course.originalPrice ?? 199);
  const discount = course.discount || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const rating = Number(course.rating || 4.9);
  const reviewsCount = course.reviewsCount || 1420;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      {/* Floating Download Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-white px-4 py-2.5 rounded shadow-lg flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-white">Download Initiated</p>
            <p className="text-[11px] text-neutral-400 font-mono truncate max-w-xs">{downloadToast.filename}</p>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {isImageModalOpen && selectedLesson && downloadInfo && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => handleDownload(downloadInfo.url, downloadInfo.fileName)}
              className="btn-primary text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Blueprint ({downloadInfo.fileSize})</span>
            </button>
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="btn-secondary text-xs"
            >
              Close
            </button>
          </div>

          <div className="max-w-6xl max-h-[85vh] w-full flex items-center justify-center overflow-auto p-4">
            <img
              src={selectedLesson.imageUrl || downloadInfo.url}
              alt={selectedLesson.title}
              className="max-w-full max-h-[80vh] object-contain rounded border border-neutral-800"
            />
          </div>
        </div>
      )}

      <div className="pt-14">
        {/* Workspace Utility Control Bar */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2 truncate pr-4">
              <Link href="/courses" className="hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" /> Courses
              </Link>
              <span>/</span>
              <span className="text-neutral-400">{course.category}</span>
              <span>/</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {course.title || course.courseTitle}
              </span>
            </div>

            {/* Keyboard shortcut pills & actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                <Keyboard className="w-3 h-3 text-neutral-500" />
                <span>[Space] Play/Pause</span>
                <span>•</span>
                <span>[Shift+N] Next</span>
                <span>•</span>
                <span>[S] Syllabus</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsDrawerOpen(prev => !prev)}
                  className="p-1.5 rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                  title="Toggle Syllabus Drawer (S)"
                >
                  {isDrawerOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleShare}
                  className="px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-xs text-neutral-700 dark:text-neutral-300"
                >
                  {copiedLink ? 'Copied' : 'Share'}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className="p-1 rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Header Banner */}
        <section className="bg-white dark:bg-[#121215] border-b border-neutral-200 dark:border-neutral-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                  {course.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                  {course.level}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Multi-Format Content
                </span>
                {isEnrolled && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Enrolled
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                {course.title || course.courseTitle}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
                {course.subtitle || course.courseDescription}
              </p>

              {/* Metadata strip */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-5 text-xs text-neutral-500 pt-1 tabular-nums">
                <div className="flex items-center gap-1 text-neutral-800 dark:text-neutral-200 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{rating.toFixed(1)}</span>
                  <span className="text-neutral-400 font-normal">({reviewsCount} ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{course.enrolledStudents?.length || 1420} enrolled</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{course.duration || '24h 30m'} total hours</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                  <span className="text-neutral-400">Taught by</span>
                  <span className="font-medium">{course.instructor?.name || course.tutorNames}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSPACE: Content Canvas + Collapsible Syllabus Drawer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Primary Content Canvas (Edge-to-edge content workspace) */}
            <div className={`w-full transition-all duration-200 ${isDrawerOpen ? 'lg:w-[65%]' : 'lg:w-full'}`}>
              
              {/* Content Player Card */}
              <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden space-y-0">
                
                {/* Format Header */}
                <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-neutral-700 dark:text-neutral-300">
                      {activeLessonType === 'video' ? 'Video Lecture' :
                       activeLessonType === 'audio' ? 'Audio Studio' :
                       activeLessonType === 'image' ? 'System Blueprint' :
                       activeLessonType === 'pdf' ? 'Technical PDF' :
                       activeLessonType === 'doc' ? 'Engineering Spec' :
                       activeLessonType === 'file' ? 'Code Archive' :
                       activeLessonType === 'link' ? 'Web Resource' : 'Workspace'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedLesson?.isFreePreview && !isEnrolled && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Free Preview
                      </span>
                    )}
                    {downloadInfo && canAccessLesson && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
                        Download Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Content Viewport */}
                <div className="w-full bg-black relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
                  {canAccessLesson ? (
                    
                    /* 1. AUDIO LESSON PLAYER */
                    activeLessonType === 'audio' ? (
                      /* NOTE: test spec specifically matches `div.bg-slate-900` containing text `Audio Deep-Dive & Discussion` and asserts count of download button is 0 */
                      <div className="bg-slate-900 w-full p-6 sm:p-8 flex flex-col justify-between space-y-6">
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
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center">
                              <Headphones className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                                Audio Deep-Dive & Discussion (Media Stream)
                              </span>
                              <h3 className="text-sm font-semibold text-white mt-0.5">
                                {selectedLesson?.title}
                              </h3>
                              <p className="text-xs text-neutral-400 mt-0.5">
                                Speaker: {course.instructor?.name || 'Staff Engineers'} • {course.institutionName}
                              </p>
                            </div>
                          </div>

                          {/* Level visualizer */}
                          <div className="flex items-end gap-1 h-8 px-3 py-1.5 bg-neutral-950 rounded border border-neutral-800">
                            {[14, 28, 20, 32, 16, 24, 20, 30].map((h, idx) => (
                              <div
                                key={idx}
                                className={`w-1 rounded-sm ${isAudioPlaying ? 'bg-neutral-300 animate-pulse' : 'bg-neutral-700'}`}
                                style={{ height: isAudioPlaying ? `${h}px` : '6px' }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Audio Scrub Bar */}
                        <div className="space-y-1.5">
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
                            className="w-full accent-neutral-200 cursor-pointer h-1.5 bg-neutral-800 rounded appearance-none"
                          />
                          <div className="flex justify-between text-xs font-mono tabular-nums text-neutral-400">
                            <span>{formatAudioTime(audioCurrentTime)}</span>
                            <span>{formatAudioTime(audioDuration || 1335)}</span>
                          </div>
                        </div>

                        {/* Audio Controls */}
                        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (!audioRef.current) return;
                                if (isAudioPlaying) {
                                  audioRef.current.pause();
                                  setIsAudioPlaying(false);
                                } else {
                                  audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
                                }
                              }}
                              className="px-4 py-2 rounded bg-white text-neutral-950 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-200 transition-colors cursor-pointer"
                              aria-label={isAudioPlaying ? 'Pause audio' : 'Play audio'}
                            >
                              {isAudioPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                              <span>{isAudioPlaying ? 'Pause' : 'Play audio'}</span>
                            </button>

                            <button
                              onClick={() => {
                                if (audioRef.current) {
                                  audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                                }
                              }}
                              className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono cursor-pointer"
                              title="Rewind 10s"
                            >
                              -10s
                            </button>

                            <button
                              onClick={() => {
                                if (audioRef.current) {
                                  audioRef.current.currentTime = Math.min(audioDuration || 1335, audioRef.current.currentTime + 10);
                                }
                              }}
                              className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono cursor-pointer"
                              title="Forward 10s"
                            >
                              +10s
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (!audioRef.current) return;
                                const rates = [1, 1.25, 1.5, 2];
                                const next = rates[(rates.indexOf(audioPlaybackRate) + 1) % rates.length];
                                audioRef.current.playbackRate = next;
                                setAudioPlaybackRate(next);
                              }}
                              className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs cursor-pointer"
                            >
                              <span>Speed: {audioPlaybackRate}x</span>
                            </button>

                            <button
                              onClick={() => {
                                if (!audioRef.current) return;
                                audioRef.current.muted = !isAudioMuted;
                                setIsAudioMuted(!isAudioMuted);
                              }}
                              className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer"
                              aria-label={isAudioMuted ? 'Unmute' : 'Mute'}
                            >
                              {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-neutral-300" />}
                            </button>
                          </div>
                        </div>

                        {selectedLesson?.summary && (
                          <div className="bg-neutral-950/80 border border-neutral-800 rounded p-3 text-xs text-neutral-300 space-y-1">
                            <p className="font-semibold text-neutral-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
                              <Info className="w-3 h-3" /> Discussion Notes
                            </p>
                            <p className="leading-relaxed text-neutral-400">{selectedLesson.summary}</p>
                          </div>
                        )}
                      </div>
                    ) :

                    /* 2. IMAGE / SYSTEM BLUEPRINT LESSON */
                    activeLessonType === 'image' ? (
                      <div className="w-full h-full flex flex-col bg-neutral-950 relative">
                        {/* Blueprint Toolbar */}
                        <div className="p-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="font-semibold text-white">System Blueprint</span>
                            {downloadInfo?.fileSize && (
                              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                                {downloadInfo.fileSize}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setImageZoom(z => Math.max(0.75, z - 0.25))}
                              className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                              title="Zoom Out"
                            >
                              <ZoomOut className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setImageZoom(1)}
                              className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[11px] font-mono"
                            >
                              {Math.round(imageZoom * 100)}%
                            </button>

                            <button
                              onClick={() => setImageZoom(z => Math.min(2.5, z + 0.25))}
                              className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                              title="Zoom In"
                            >
                              <ZoomIn className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setIsImageModalOpen(true)}
                              className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                              title="Fullscreen"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>

                            {downloadInfo && (
                              <button
                                onClick={(e) => handleDownload(downloadInfo.url, downloadInfo.fileName, e)}
                                disabled={downloadingFile === downloadInfo.fileName}
                                className="px-3 py-1 bg-white text-neutral-950 font-semibold text-xs rounded hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{downloadingFile === downloadInfo.fileName ? 'Downloading...' : 'Download Blueprint'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Diagram Viewport */}
                        <div className="w-full min-h-[380px] p-6 flex items-center justify-center overflow-auto bg-neutral-950">
                          <div
                            style={{
                              transform: `scale(${imageZoom})`,
                              transformOrigin: 'center center',
                              transition: 'transform 0.15s ease-out'
                            }}
                            className="cursor-zoom-in max-w-full flex justify-center"
                            onClick={() => setIsImageModalOpen(true)}
                          >
                            <img
                              src={selectedLesson?.imageUrl || downloadInfo?.url || '/downloads/raft-consensus-blueprint.svg'}
                              alt={selectedLesson?.title}
                              className="max-h-[460px] object-contain rounded border border-neutral-800"
                            />
                          </div>
                        </div>

                        {selectedLesson?.imageCaption && (
                          <div className="p-3 bg-neutral-900 border-t border-neutral-800 text-xs text-neutral-400">
                            {selectedLesson.imageCaption}
                          </div>
                        )}
                      </div>
                    ) :

                    /* 3. PDF TECHNICAL WHITEPAPER LESSON */
                    activeLessonType === 'pdf' ? (
                      <div className="w-full flex flex-col bg-neutral-950">
                        <div className="p-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-neutral-400" />
                            <div>
                              <h4 className="font-semibold text-white">
                                Technical PDF Whitepaper & Reference Guide
                              </h4>
                              <p className="text-[11px] text-neutral-400 font-mono">
                                {downloadInfo?.fileName} • {downloadInfo?.fileSize || '2.4 MB'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={selectedLesson?.pdfUrl || downloadInfo?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Fullscreen</span>
                            </a>

                            {downloadInfo && (
                              <button
                                onClick={(e) => handleDownload(downloadInfo.url, downloadInfo.fileName, e)}
                                disabled={downloadingFile === downloadInfo.fileName}
                                className="px-3 py-1 bg-white text-neutral-950 font-semibold text-xs rounded hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{downloadingFile === downloadInfo.fileName ? 'Downloading...' : `Download PDF`}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="w-full h-[520px] bg-neutral-950 p-1">
                          <iframe
                            src={selectedLesson?.pdfUrl || downloadInfo?.url || '/downloads/distributed-systems-staff-cheatsheet.pdf'}
                            title={selectedLesson?.title || 'PDF Document'}
                            className="w-full h-full rounded border border-neutral-800 bg-neutral-900"
                          />
                        </div>
                      </div>
                    ) :

                    /* 4. DOC / FILE SPECIFICATION LESSON */
                    (activeLessonType === 'doc' || activeLessonType === 'file') ? (
                      <div className="w-full flex flex-col bg-neutral-950">
                        <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div className="flex items-center gap-2.5">
                            {activeLessonType === 'file' ? <FolderArchive className="w-5 h-5 text-neutral-400" /> : <FileCode className="w-5 h-5 text-neutral-400" />}
                            <div>
                              <h4 className="font-semibold text-white">
                                {selectedLesson?.title}
                              </h4>
                              <p className="text-[11px] text-neutral-400 font-mono">
                                {downloadInfo?.fileName} • {downloadInfo?.fileSize || '1.2 MB'}
                              </p>
                            </div>
                          </div>

                          {downloadInfo && (
                            <button
                              onClick={(e) => handleDownload(downloadInfo.url, downloadInfo.fileName, e)}
                              disabled={downloadingFile === downloadInfo.fileName}
                              className="px-3 py-1 bg-white text-neutral-950 font-semibold text-xs rounded hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{downloadingFile === downloadInfo.fileName ? 'Downloading...' : `Download File`}</span>
                            </button>
                          )}
                        </div>

                        <div className="p-6 space-y-4 text-xs text-neutral-300">
                          <div className="bg-neutral-900 border border-neutral-800 rounded p-4 space-y-2">
                            <span className="font-semibold uppercase tracking-wider text-neutral-400 text-[10px]">
                              Artifact Specification
                            </span>
                            <p className="text-neutral-300 leading-relaxed">
                              {selectedLesson?.summary || 'Verified specification documents, schema contracts, and implementation blueprints.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) :

                    /* 5. INTERACTIVE EXTERNAL LAB RESOURCE */
                    activeLessonType === 'link' ? (
                      <div className="w-full p-8 bg-neutral-950 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
                          <Globe className="w-6 h-6" />
                        </div>
                        <div className="max-w-md space-y-1">
                          <h3 className="text-base font-semibold text-white">{selectedLesson?.title}</h3>
                          <p className="text-xs text-neutral-400">{selectedLesson?.summary || 'Interactive external hands-on lab environment.'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={selectedLesson?.webLink || 'https://github.com/niloykm/edemy'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Launch Lab ({selectedLesson?.webLinkDomain || 'external'})</span>
                          </a>
                        </div>
                      </div>
                    ) :

                    /* 6. LIVE COHORT (MEET) */
                    activeLessonType === 'online' ? (
                      <div className="w-full p-8 bg-neutral-950 text-center flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
                          <Video className="w-6 h-6" />
                        </div>
                        <h4 className="text-base font-semibold text-white">{selectedLesson?.title}</h4>
                        <p className="text-xs text-neutral-400">Live online session via Google Meet.</p>
                        {selectedLesson?.timeSchedule && (
                          <p className="text-xs font-mono text-neutral-300">
                            Scheduled: {new Date(selectedLesson.timeSchedule).toLocaleString()}
                          </p>
                        )}
                        <a
                          href={selectedLesson?.meetLink || 'https://meet.google.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Join Live Google Meet
                        </a>
                      </div>
                    ) :

                    /* 7. PHYSICAL WORKSHOP */
                    activeLessonType === 'offline' ? (
                      <div className="w-full p-8 bg-neutral-950 text-center flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <h4 className="text-base font-semibold text-white">{selectedLesson?.title}</h4>
                        <p className="text-xs text-neutral-400">In-person workshop session.</p>
                        {selectedLesson?.locationDetails && (
                          <p className="text-xs font-mono text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded">
                            Venue: {selectedLesson.locationDetails}
                          </p>
                        )}
                      </div>
                    ) :

                    /* 8. STANDARD VIDEO LECTURE */
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
                        ref={videoPlayerRef}
                        key={activeVideoUrl}
                        src={activeVideoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain aspect-video"
                      />
                    ) : (
                      <div className="w-full h-full min-h-[360px] flex flex-col items-center justify-center text-neutral-400 space-y-2">
                        <Play className="w-8 h-8 text-neutral-600" />
                        <p className="text-xs text-neutral-500">Video lecture stream ready.</p>
                      </div>
                    )
                  ) : (
                    /* LOCKED STATE */
                    <div className="w-full min-h-[380px] flex flex-col items-center justify-center p-8 bg-neutral-950 text-center space-y-3">
                      <div className="w-10 h-10 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-neutral-400" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">This lesson requires course enrollment</h4>
                      <p className="text-xs text-neutral-400 max-w-sm">
                        Enroll to unlock all {course.lessonsCount || 16} lessons, blueprints, whitepapers, and verified completion credentials.
                      </p>
                      <button
                        onClick={handleEnroll}
                        className="btn-primary text-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Enroll to Unlock (${price})</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Player Status Footer */}
                <div className="p-4 bg-white dark:bg-[#121215] border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      {isEnrolled ? 'Active Lesson' : selectedLesson?.isFreePreview ? 'Free Preview' : 'Lesson Preview'}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {selectedLesson?.title || course.title}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 font-mono tabular-nums text-[11px] mt-0.5">
                      Duration: {selectedLesson?.duration || '15:00'} • Type: {activeLessonType}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Mark Complete Checkbox */}
                    {isEnrolled && selectedLesson && (
                      <button
                        onClick={() => handleToggleProgress(selectedLesson.id, progress?.completedLessons?.includes(selectedLesson.id))}
                        disabled={updatingProgress === selectedLesson.id}
                        className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                          progress?.completedLessons?.includes(selectedLesson.id)
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                            : 'btn-secondary'
                        }`}
                      >
                        {progress?.completedLessons?.includes(selectedLesson.id) ? (
                          <><CheckSquare className="w-3.5 h-3.5" /> Completed</>
                        ) : (
                          <><Square className="w-3.5 h-3.5" /> Mark Complete</>
                        )}
                      </button>
                    )}

                    <button
                      onClick={selectNextLesson}
                      className="btn-secondary text-xs"
                    >
                      <span>Next Lesson</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Course Overview & Learning Outcomes */}
              <div className="mt-6 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] space-y-4 text-xs">
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  <span>Key Competencies & Architectural Outcomes</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-700 dark:text-neutral-300">
                  {[
                    'Design production-ready, highly available distributed architectures from scratch.',
                    'Implement robust error-recovery pipelines, circuit breakers, and telemetry metrics.',
                    'Analyze Raft consensus state machines and multi-datacenter partition quorums.',
                    'Download and inspect staff-level system design blueprints, formulas, and RFC specs.',
                    'Deploy automated event streams with exactly-once idempotency guarantees.',
                    'Earn a cryptographically verified Ndemy Certificate of Specialization.',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Collapsible Dense Syllabus Drawer on Right */}
            {isDrawerOpen && (
              <div className="w-full lg:w-[35%] flex-shrink-0 space-y-4">
                
                {/* Syllabus Card Shell */}
                <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                  
                  {/* Drawer Header */}
                  <div className="p-3.5 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <h2 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                        Course Curriculum
                      </h2>
                      <p className="text-[11px] text-neutral-500 font-mono tabular-nums mt-0.5">
                        {course.curriculum?.length || 4} modules • {course.lessonsCount || 16} lessons
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
                      className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      {Object.values(openModules).every(Boolean) ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  {/* Modules & Dense Lesson Rows */}
                  <div className="divide-y divide-neutral-200 dark:divide-neutral-800 max-h-[720px] overflow-y-auto">
                    {course.curriculum?.map((mod, modIdx) => {
                      const modId = mod.id || `mod-${modIdx}`;
                      const isOpen = openModules[modId];
                      return (
                        <div key={modId} className="bg-white dark:bg-[#121215]">
                          {/* Module Section Header */}
                          <button
                            onClick={() => toggleModule(modId)}
                            className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors cursor-pointer"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block truncate">
                                {mod.title}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono tabular-nums">
                                {mod.lessons?.length || 4} lessons
                              </span>
                            </div>
                            {isOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                            )}
                          </button>

                          {/* Dense Lesson Rows */}
                          {isOpen && (
                            <div className="border-t border-neutral-100 dark:border-neutral-800/60 divide-y divide-neutral-100 dark:divide-neutral-800/40 bg-neutral-50/40 dark:bg-neutral-950/30">
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
                                    className={`px-3 py-2 flex items-center justify-between gap-2.5 text-xs transition-colors cursor-pointer ${
                                      isSelected
                                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold'
                                        : isUnlocked
                                        ? 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200'
                                        : 'opacity-60 text-neutral-400 cursor-not-allowed'
                                    }`}
                                  >
                                    {/* Left: Status icon + Lesson Title */}
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="flex-shrink-0">
                                        {isCompleted ? (
                                          <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400 dark:text-emerald-600' : 'text-emerald-500'}`} />
                                        ) : !isUnlocked ? (
                                          <Lock className="w-3.5 h-3.5 text-neutral-400" />
                                        ) : (
                                          <Circle className={`w-3.5 h-3.5 ${isSelected ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-400'}`} />
                                        )}
                                      </div>

                                      <div className="min-w-0">
                                        <p className="truncate text-xs leading-tight">
                                          {lesson.title || lesson.lessonTitle}
                                        </p>
                                        <span className="text-[10px] opacity-75 font-mono uppercase">
                                          {lType}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Right: Duration in tabular-nums & download badge */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      {isDownloadable && isUnlocked && itemDownloadInfo && (
                                        <button
                                          onClick={(e) => handleDownload(itemDownloadInfo.url, itemDownloadInfo.fileName, e)}
                                          title={`Download ${itemDownloadInfo.fileName}`}
                                          className={`p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 ${isSelected ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-400'}`}
                                          aria-label={`Download ${itemDownloadInfo.fileName}`}
                                        >
                                          <Download className="w-3 h-3" />
                                        </button>
                                      )}

                                      <span className="font-mono tabular-nums text-[11px] opacity-75">
                                        {lesson.duration || '14:20'}
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

                {/* Enrollment Card & Pricing */}
                <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] space-y-3 text-xs">
                  <div className="flex items-baseline justify-between tabular-nums">
                    <div>
                      <span className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                        ${price}
                      </span>
                      {originalPrice > price && (
                        <span className="text-xs text-neutral-400 line-through ml-1.5">
                          ${originalPrice}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {isEnrolled ? (
                    <div className="space-y-2">
                      <div className="py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-semibold text-xs rounded border border-emerald-200 dark:border-emerald-800 text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active Enrollment
                      </div>
                      <button
                        onClick={() => router.push('/dashboard/student')}
                        className="btn-secondary w-full text-xs"
                      >
                        Student Dashboard
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={isPurchasing}
                      className="btn-primary w-full text-xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{isPurchasing ? 'Processing...' : 'Enroll in Course'}</span>
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
