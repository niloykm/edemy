'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, CheckCircle2, Star, Sparkles, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Course, Lesson } from '@/data/coursesData';

interface VideoPreviewModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function VideoPreviewModal({ course, isOpen, onClose }: VideoPreviewModalProps) {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Free preview lessons available in this course
  const previewLessons = course?.lessons?.filter(l => l.isFreePreview || l.type === 'video') || [];

  useEffect(() => {
    if (course && previewLessons.length > 0) {
      setActiveLesson(previewLessons[0]);
    } else {
      setActiveLesson(null);
    }
  }, [course]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const currentVideoUrl = activeLesson?.videoUrl || course.previewVideoUrl;
  const ytId = currentVideoUrl ? getYouTubeId(currentVideoUrl) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/60">
            <div className="flex items-center gap-2.5 min-w-0 pr-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-3 h-3" /> Free Preview
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {course.title || course.courseTitle}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Grid: Player on left (70%), Chapter list on right (30%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto min-h-0">
            {/* Player Column */}
            <div className="lg:col-span-8 flex flex-col bg-black">
              <div className="relative aspect-video w-full bg-slate-950">
                {ytId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                    title="Course Preview Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : currentVideoUrl ? (
                  <video
                    ref={videoRef}
                    key={currentVideoUrl}
                    src={currentVideoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                    <Play className="w-12 h-12 text-indigo-400 mb-3 opacity-60" />
                    <p className="text-sm font-medium">Video trailer preview is loading...</p>
                  </div>
                )}
              </div>

              {/* Video Info Strip */}
              <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800/80 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                      Now Playing
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      {activeLesson?.title || 'Course Overview & Curriculum Walkthrough'}
                    </h4>
                  </div>
                  {activeLesson?.duration && (
                    <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md font-mono flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {activeLesson.duration}
                    </span>
                  )}
                </div>

                {/* Instructor row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={course.instructor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={course.instructor?.name || 'Instructor'}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white leading-tight">
                        {course.instructor?.name || course.tutorNames}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {course.instructor?.role || course.institutionName || 'Lead Instructor'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{Number(course.rating || 4.9).toFixed(1)}</span>
                    <span className="text-slate-500 font-normal">({course.reviewsCount || 1200} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters / Free Preview Lessons Sidebar */}
            <div className="lg:col-span-4 bg-slate-950/70 border-t lg:border-t-0 lg:border-l border-slate-800/80 flex flex-col min-h-0">
              <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/50">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Free Preview Lessons ({previewLessons.length})
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Click any chapter to stream immediately
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2">
                {previewLessons.map((lesson, idx) => {
                  const isActive = activeLesson?.id === lesson.id;
                  return (
                    <button
                      key={lesson.id || idx}
                      onClick={() => setActiveLesson(lesson)}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                        isActive
                          ? 'bg-indigo-600/20 border border-indigo-500/50 text-white'
                          : 'bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800/50 text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isActive ? (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        ) : (
                          <span className="text-xs font-mono font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-400">
                            {lesson.isFreePreview ? 'Free Preview' : 'Lecture'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {lesson.duration}
                          </span>
                        </div>
                        <p className="text-xs font-semibold mt-0.5 line-clamp-2 leading-snug">
                          {lesson.title || lesson.lessonTitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom CTA in modal */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/80 space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-medium">Full Course Access</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-white">
                      ${course.price || course.coursePrice}
                    </span>
                    {course.originalPrice > course.price && (
                      <span className="text-xs text-slate-500 line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/courses/${course.slug || course.id || course._id}`}
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 text-center"
                >
                  <span>Go to Full Classroom</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
