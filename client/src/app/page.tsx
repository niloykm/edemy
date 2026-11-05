'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import VideoPreviewModal from '@/components/VideoPreviewModal';
import { Course, SEED_COURSES } from '@/data/coursesData';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowRight, Search, Globe, BarChart2, Cpu, Smartphone,
  Cloud, Shield, Palette, Megaphone, Terminal, FileCode2,
  CheckCircle2, Laptop
} from 'lucide-react';

const TRACKS = [
  { name: 'Distributed Systems', icon: Terminal, count: '14 tracks' },
  { name: 'AI Engineering', icon: Cpu, count: '18 tracks' },
  { name: 'Frontend Architecture', icon: Globe, count: '24 tracks' },
  { name: 'Cloud Infrastructure', icon: Cloud, count: '16 tracks' },
  { name: 'Database Reliability', icon: BarChart2, count: '12 tracks' },
  { name: 'System Security', icon: Shield, count: '10 tracks' },
  { name: 'Native & Mobile', icon: Smartphone, count: '15 tracks' },
  { name: 'System Design', icon: FileCode2, count: '20 tracks' },
];

const PLATFORM_SPECS = [
  {
    icon: Laptop,
    title: 'Live Online Cohorts',
    desc: 'Interactive live engineering cohorts with Google Meet integration, real-time code reviews, and recorded sessions.'
  },
  {
    icon: Terminal,
    title: 'Physical In-Person Workshops',
    desc: 'Hands-on hardware labs, system benchmarking, and collaborative pair programming at designated campus hubs.'
  },
  {
    icon: FileCode2,
    title: 'Technical Specs & Blueprints',
    desc: 'Download verified architecture blueprints, RFC specs, whitepapers, and production code repositories directly.'
  },
  {
    icon: CheckCircle2,
    title: 'Structured Progress Verification',
    desc: 'Granular lesson-by-lesson completion records, module progress tracking, and parent/supervisor oversight.'
  }
];

const METRICS = [
  { value: '250+', label: 'Engineering Modules', detail: 'Curated by staff engineers' },
  { value: '14,200', label: 'Active Practitioners', detail: 'Across 48 countries' },
  { value: '98.4%', label: 'Completion Satisfaction', detail: 'Verified course ratings' },
  { value: '100%', label: 'Reproducible Labs', detail: 'Containerized artifacts' },
];

export default function Home() {
  const { api } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>(SEED_COURSES.slice(0, 8));
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/courses').then(res => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.slice(0, 8).map((c: any) => ({
          ...c,
          id: String(c._id || c.id),
          _id: String(c._id || c.id),
          title: c.courseTitle || c.title,
          courseTitle: c.courseTitle || c.title,
          subtitle: c.courseDescription || c.subtitle,
          thumbnailUrl: c.courseThumbnail || c.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
          previewVideoUrl: c.previewVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }));
        setFeaturedCourses(mapped);
      }
    }).catch(() => {
      // Fallback stays in place
    });
  }, [api]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      {/* ════════ HEADER / HERO WORKPLANE ════════ */}
      <section className="pt-24 pb-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                Educational Workstation & LMS
              </span>
              <span className="text-[11px] text-neutral-500 font-mono">v2.4 Production Catalog</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
              Learn skills that <span className="text-neutral-500 dark:text-neutral-400">move your engineering forward.</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
              High-density learning environment for software practitioners: live cohorts, physical labs, and production-tested curriculums with downloadable blueprints and code artifacts.
            </p>

            {/* Direct Search Bar Rail */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 pt-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search tracks by topic, instructor, or stack (e.g. Raft, Rust, K8s, Next.js)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs font-medium text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                />
              </div>
              <button
                type="submit"
                className="btn-primary py-2.5 px-5"
              >
                Search Catalog
              </button>
            </form>

            {/* Quick Track Shortcuts */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1 flex-wrap">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Quick Tracks:</span>
              {['Distributed Systems', 'React 19', 'Raft Consensus', 'Kubernetes', 'Python'].map(tag => (
                <Link
                  key={tag}
                  href={`/courses?search=${encodeURIComponent(tag)}`}
                  className="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 text-[11px] text-neutral-600 dark:text-neutral-400 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ REPUTATION / STANDARDS STRIP ════════ */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-neutral-500">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-neutral-600 dark:text-neutral-400">
              Curriculum standards informed by production systems at:
            </span>
            <div className="flex flex-wrap items-center gap-6 font-mono font-medium text-neutral-600 dark:text-neutral-400">
              {['Google', 'Netflix', 'AWS', 'Meta', 'Stripe', 'Cloudflare'].map(company => (
                <span key={company} className="tracking-tight">{company}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ CORE TRACKS ════════ */}
      <section className="py-12 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Curriculum Subjects
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Targeted specializations structured for senior engineers and engineering students.
              </p>
            </div>
            <Link
              href="/courses"
              className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline flex items-center gap-1"
            >
              <span>All Subjects</span> &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRACKS.map(track => (
              <Link
                key={track.name}
                href={`/courses?category=${encodeURIComponent(track.name)}`}
                className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <track.icon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-xs text-neutral-800 dark:text-neutral-200 truncate group-hover:text-neutral-900 dark:group-hover:text-white">
                      {track.name}
                    </p>
                    <p className="text-[10px] text-neutral-500 tabular-nums">
                      {track.count}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FEATURED COURSES ════════ */}
      <section className="py-12 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                Featured Curriculums
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                High-density, modular engineering coursework ready for enrollment.
              </p>
            </div>
            <Link
              href="/courses"
              className="btn-secondary text-xs"
            >
              Browse Complete Catalog ({featuredCourses.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCourses.map(course => (
              <CourseCard
                key={course.id || course._id}
                course={course}
                onPreview={selected => setPreviewCourse(selected)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PLATFORM WORKSPACE SPECS ════════ */}
      <section className="py-12 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Hybrid Workstation Architecture
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 max-w-xl">
              Engineered to combine modern online self-pacing with intensive live mentoring and downloadable engineering artifacts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORM_SPECS.map(spec => (
              <div
                key={spec.title}
                className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] space-y-2.5"
              >
                <div className="w-8 h-8 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
                  <spec.icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                  {spec.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {spec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ METRICS TABULAR OVERVIEW ════════ */}
      <section className="py-10 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {METRICS.map(metric => (
              <div key={metric.label} className="border-l-2 border-neutral-300 dark:border-neutral-700 pl-4 space-y-0.5">
                <div className="text-2xl font-semibold tabular-nums text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  {metric.label}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {metric.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="py-8 bg-white dark:bg-[#09090b] text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Ndemy" className="w-5 h-5 rounded object-contain" />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Ndemy Educational Workstation</span>
              <span className="text-neutral-400">•</span>
              <span>Production Platform</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <Link href="/courses" className="hover:text-neutral-900 dark:hover:text-neutral-200">Courses</Link>
              <Link href="/live-classes" className="hover:text-neutral-900 dark:hover:text-neutral-200">Live Classes</Link>
              <Link href="/workshops" className="hover:text-neutral-900 dark:hover:text-neutral-200">Workshops</Link>
              <Link href="/auth/login" className="hover:text-neutral-900 dark:hover:text-neutral-200">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Video Preview Modal */}
      <VideoPreviewModal
        course={previewCourse}
        isOpen={Boolean(previewCourse)}
        onClose={() => setPreviewCourse(null)}
      />
    </div>
  );
}
