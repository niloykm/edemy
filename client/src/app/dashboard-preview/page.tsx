'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  BookOpen, Clock, Award, Play, CheckCircle, ChevronRight,
  Square, CheckSquare, FileText, Download, ExternalLink, Terminal
} from 'lucide-react';

const SAMPLE_COURSES = [
  {
    id: 'preview_1',
    title: 'Advanced React Architecture & Performance',
    category: 'Frontend Engineering',
    tutor: 'Sarah Chen (Google)',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop',
    lessons: [
      { id: 'l1', title: 'Course Overview & Hydration Mechanics', type: 'video', duration: 15, videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
      { id: 'l2', title: 'React Server Components Deep-Dive', type: 'video', duration: 25, videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
      { id: 'l3', title: 'Optimal Caching & Data Mutation Rules', type: 'pdf', duration: 10, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'l4', title: 'Interactive QA with Instructors', type: 'online', duration: 60 }
    ]
  },
  {
    id: 'preview_2',
    title: 'Modern Data Engineering & Pipeline Design',
    category: 'Data Infrastructure',
    tutor: 'Marcus Johnson (Netflix)',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    lessons: [
      { id: 'l5', title: 'Introduction to Data Warehouses', type: 'video', duration: 20, videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
      { id: 'l6', title: 'Building DBT Transformations', type: 'pdf', duration: 15, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ]
  }
];

export default function DashboardPreviewPage() {
  const [selectedCourse, setSelectedCourse] = useState(SAMPLE_COURSES[0]);
  const [selectedLesson, setSelectedLesson] = useState(SAMPLE_COURSES[0].lessons[0]);
  const [completedLessons, setCompletedLessons] = useState<string[]>(['l1']);

  const handleToggleComplete = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => prev.filter(id => id !== lessonId));
    } else {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  const totalLessons = SAMPLE_COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
  const lessonsCompletedCount = completedLessons.length;
  const progressPercent = Math.round((lessonsCompletedCount / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 space-y-6">
        {/* Banner */}
        <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                Sandbox Environment
              </span>
              <span className="text-xs font-mono text-neutral-500">Live Simulation Mode</span>
            </div>
            <h2 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Interactive Dashboard Sandbox
            </h2>
            <p className="text-xs text-neutral-500">
              Test progress tracking telemetry, syllabus transitions, and multi-format lesson workspaces.
            </p>
          </div>

          <Link href="/auth/login" className="btn-primary text-xs whitespace-nowrap">
            Create Full Account <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Progress Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'Sandbox Tracks', value: SAMPLE_COURSES.length, sub: 'Active modules' },
            { label: 'Completion Rate', value: `${progressPercent}%`, sub: 'Calculated progress' },
            { label: 'Lessons Verified', value: `${lessonsCompletedCount} / ${totalLessons}`, sub: 'Completed' },
            { label: 'Simulated Credentials', value: progressPercent === 100 ? '1 Ready' : '0 Ready', sub: 'Certificates' },
          ].map(s => (
            <div
              key={s.label}
              className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] space-y-1"
            >
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                {s.label}
              </span>
              <div className="text-xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100 tracking-tight">
                {s.value}
              </div>
              <div className="text-[10px] text-neutral-400">
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Player Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                {selectedLesson.type === 'video' ? (
                  <iframe
                    src="https://www.youtube.com/embed/Ke90Tje7VS0?autoplay=0"
                    title={selectedLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-neutral-400 p-8 text-center space-y-3">
                    <FileText className="w-10 h-10 text-neutral-500 mx-auto" />
                    <div>
                      <h4 className="font-semibold text-white text-sm">{selectedLesson.title}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">Study guide document loaded in sandbox</p>
                    </div>
                    <div className="flex justify-center gap-2 pt-2 text-xs">
                      <a
                        href={(selectedLesson as any).pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                        download
                        className="btn-secondary text-xs"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Document
                      </a>
                      <a
                        href={(selectedLesson as any).pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Open in Browser
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Status footer */}
              <div className="p-4 bg-white dark:bg-[#121215] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Active Demo Lesson
                  </span>
                  <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {selectedLesson.title}
                  </h3>
                  <p className="text-neutral-500 text-[11px] font-mono tabular-nums mt-0.5">
                    Duration: {selectedLesson.duration}m • Track: {selectedCourse.title}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleComplete(selectedLesson.id)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    completedLessons.includes(selectedLesson.id)
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                      : 'btn-secondary'
                  }`}
                >
                  {completedLessons.includes(selectedLesson.id) ? (
                    <><CheckSquare className="w-3.5 h-3.5" /> Completed</>
                  ) : (
                    <><Square className="w-3.5 h-3.5" /> Mark Complete</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Syllabus Drawer Rail (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 text-[11px]">
                  Sandbox Modules
                </span>
                <span className="text-[10px] font-mono text-neutral-400">2 Tracks</span>
              </div>

              <div className="p-2 space-y-3">
                {SAMPLE_COURSES.map(course => (
                  <div key={course.id} className="space-y-1">
                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-2 pt-1">
                      {course.title}
                    </p>
                    <div className="space-y-0.5">
                      {course.lessons.map(lesson => {
                        const isCurrent = selectedLesson.id === lesson.id;
                        const isDone = completedLessons.includes(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setSelectedCourse(course);
                              setSelectedLesson(lesson);
                            }}
                            className={`w-full text-left p-2 rounded transition-colors flex items-center justify-between cursor-pointer ${
                              isCurrent
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <span className="truncate pr-2">{lesson.title}</span>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {isDone && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                              <span className="font-mono text-[10px] opacity-75 tabular-nums">{lesson.duration}m</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
