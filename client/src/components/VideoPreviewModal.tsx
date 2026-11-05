'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, ArrowRight } from 'lucide-react';
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
  const courseSlug = course.slug || String(course.id || course._id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Crisp Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75"
        />

        {/* Modal Dialog Shell */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center gap-2 min-w-0 pr-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                Preview Session
              </span>
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {course.title || course.courseTitle}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Player & Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto min-h-0">
            {/* Player Column */}
            <div className="lg:col-span-8 flex flex-col bg-black">
              <div className="relative aspect-video w-full bg-neutral-950">
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
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                    <Play className="w-8 h-8 text-neutral-500 mb-2 opacity-60" />
                    <p className="text-xs font-medium">Video trailer preview is ready to load.</p>
                  </div>
                )}
              </div>

              {/* Video Info Strip */}
              <div className="p-4 bg-white dark:bg-[#121215] border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Current Lecture
                    </span>
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                      {activeLesson?.title || 'Course Architecture & Syllabus Overview'}
                    </h4>
                  </div>
                  {activeLesson?.duration && (
                    <span className="flex items-center gap-1 text-[11px] text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded font-mono tabular-nums">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {activeLesson.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Syllabus Rail on Right */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Sample Modules
                  </span>
                  <span className="text-[10px] font-mono tabular-nums text-neutral-500">
                    {previewLessons.length} previewable
                  </span>
                </div>

                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {previewLessons.map((l, i) => (
                    <button
                      key={l.id || i}
                      onClick={() => setActiveLesson(l)}
                      className={`w-full text-left p-2 rounded text-xs transition-colors flex items-center justify-between ${
                        activeLesson?.id === l.id
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <span className="truncate pr-2">{l.title}</span>
                      <span className="text-[10px] opacity-70 tabular-nums font-mono">{l.duration || '10:00'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4 space-y-2">
                <Link
                  href={`/courses/${courseSlug}`}
                  onClick={onClose}
                  className="btn-primary w-full text-xs"
                >
                  <span>Open Full Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
