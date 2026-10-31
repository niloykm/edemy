'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import VideoPreviewModal from '@/components/VideoPreviewModal';
import { Course, SEED_COURSES, ALL_COURSES } from '@/data/coursesData';
import {
  Search, Filter, ChevronDown, BookOpen, SlidersHorizontal,
  X, Video, MapPin, Sparkles, RotateCcw, ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'All',
  'Artificial Intelligence',
  'Web Development',
  'Database Design',
  'Cloud Computing',
  'Data Science',
  'Cybersecurity',
  'Mobile Development',
  'UI/UX Design',
];

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: 9999 },
  { label: 'Free ($0)', min: 0, max: 0 },
  { label: 'Under $50', min: 1, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100+', min: 100, max: 9999 },
];

const RATING_OPTIONS = [
  { label: 'All Ratings', min: 0 },
  { label: '4.9 & Up', min: 4.9 },
  { label: '4.8 & Up', min: 4.8 },
  { label: '4.5 & Up', min: 4.5 },
];

const DURATION_OPTIONS = [
  { label: 'All Durations', minMinutes: 0, maxMinutes: 999999 },
  { label: 'Short (< 10 hrs)', minMinutes: 0, maxMinutes: 600 },
  { label: 'Medium (10–20 hrs)', minMinutes: 600, maxMinutes: 1200 },
  { label: 'Long (20+ hrs)', minMinutes: 1200, maxMinutes: 999999 },
];

const PAGE_SIZE_OPTIONS = [12, 24, 48];

export default function CoursesPageClient({
  initialCourses,
  forceType,
}: {
  initialCourses: Course[];
  forceType?: 'online' | 'offline' | 'all';
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = forceType || searchParams.get('type') || 'all';

  // Ensure courses is never empty
  const rawCourses = useMemo(() => {
    if (initialCourses && initialCourses.length > 0) return initialCourses;
    return typeParam === 'all' ? ALL_COURSES : SEED_COURSES;
  }, [initialCourses, typeParam]);

  const [courses] = useState<Course[]>(rawCourses);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All Levels');
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [ratingFilter, setRatingFilter] = useState(RATING_OPTIONS[0]);
  const [durationFilter, setDurationFilter] = useState(DURATION_OPTIONS[0]);
  const [sort, setSort] = useState('popular');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Video trailer modal state
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  // Dynamic filter counts calculator based on current courses pool
  const counts = useMemo(() => {
    let pool = [...courses];
    if (typeParam === 'online') {
      pool = pool.filter(c => c.type === 'online' || c.lessons?.some((l: any) => l.lessonType === 'online'));
    } else if (typeParam === 'offline') {
      pool = pool.filter(c => c.type === 'offline' || c.lessons?.some((l: any) => l.lessonType === 'offline'));
    }

    const catCounts: Record<string, number> = { All: pool.length };
    CATEGORIES.slice(1).forEach(cat => {
      catCounts[cat] = pool.filter(c => c.category === cat).length;
    });

    const levelCounts: Record<string, number> = { 'All Levels': pool.length };
    LEVELS.slice(1).forEach(lvl => {
      levelCounts[lvl] = pool.filter(c => c.level === lvl).length;
    });

    const priceCounts: Record<string, number> = {};
    PRICE_RANGES.forEach(pr => {
      priceCounts[pr.label] = pool.filter(c => {
        const p = Number(c.price ?? c.coursePrice ?? 0);
        return p >= pr.min && p <= pr.max;
      }).length;
    });

    const ratingCounts: Record<string, number> = {};
    RATING_OPTIONS.forEach(r => {
      ratingCounts[r.label] = pool.filter(c => Number(c.rating || 4.9) >= r.min).length;
    });

    const durationCounts: Record<string, number> = {};
    DURATION_OPTIONS.forEach(d => {
      durationCounts[d.label] = pool.filter(c => {
        const mins = Number(c.durationMinutes || 900);
        return mins >= d.minMinutes && mins <= d.maxMinutes;
      }).length;
    });

    return { catCounts, levelCounts, priceCounts, ratingCounts, durationCounts };
  }, [courses, typeParam]);

  // Filtered courses
  const filtered = useMemo(() => {
    let result = [...courses];

    if (typeParam === 'online') {
      result = result.filter(c => c.type === 'online' || c.lessons?.some((l: any) => l.lessonType === 'online'));
    } else if (typeParam === 'offline') {
      result = result.filter(c => c.type === 'offline' || c.lessons?.some((l: any) => l.lessonType === 'offline'));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(c => {
        const t = (c.title || c.courseTitle || '').toLowerCase();
        const s = (c.subtitle || c.courseDescription || '').toLowerCase();
        const cat = (c.category || '').toLowerCase();
        const inst = (c.instructor?.name || c.tutorNames || '').toLowerCase();
        const org = (c.institutionName || '').toLowerCase();
        return t.includes(q) || s.includes(q) || cat.includes(q) || inst.includes(q) || org.includes(q);
      });
    }

    if (category !== 'All') {
      result = result.filter(c => c.category === category);
    }

    if (level !== 'All Levels') {
      result = result.filter(c => c.level === level);
    }

    result = result.filter(c => {
      const p = Number(c.price ?? c.coursePrice ?? 0);
      return p >= priceRange.min && p <= priceRange.max;
    });

    result = result.filter(c => {
      const r = Number(c.rating || 4.9);
      return r >= ratingFilter.min;
    });

    result = result.filter(c => {
      const mins = Number(c.durationMinutes || 900);
      return mins >= durationFilter.minMinutes && mins <= durationFilter.maxMinutes;
    });

    if (sort === 'popular') {
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sort === 'rating') {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (sort === 'price-low') {
      result.sort((a, b) => Number(a.price ?? a.coursePrice ?? 0) - Number(b.price ?? b.coursePrice ?? 0));
    } else if (sort === 'price-high') {
      result.sort((a, b) => Number(b.price ?? b.coursePrice ?? 0) - Number(a.price ?? a.coursePrice ?? 0));
    }

    return result;
  }, [courses, typeParam, search, category, level, priceRange, ratingFilter, durationFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const clearFilters = useCallback(() => {
    setCategory('All');
    setLevel('All Levels');
    setPriceRange(PRICE_RANGES[0]);
    setRatingFilter(RATING_OPTIONS[0]);
    setDurationFilter(DURATION_OPTIONS[0]);
    setSearch('');
    setPage(1);
  }, []);

  const hasActiveFilters = category !== 'All' || level !== 'All Levels' || priceRange.label !== 'All Prices' || ratingFilter.label !== 'All Ratings' || durationFilter.label !== 'All Durations' || search.trim() !== '';

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Category
          </h3>
        </div>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {CATEGORIES.map(c => {
            const count = counts.catCounts[c] ?? 0;
            const isSelected = category === c;
            return (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="truncate pr-2">{c}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Level */}
      <div>
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
          Experience Level
        </h3>
        <div className="space-y-1">
          {LEVELS.map(l => {
            const count = counts.levelCounts[l] ?? 0;
            const isSelected = level === l;
            return (
              <button
                key={l}
                onClick={() => { setLevel(l); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{l}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
          Price Range
        </h3>
        <div className="space-y-1">
          {PRICE_RANGES.map(p => {
            const count = counts.priceCounts[p.label] ?? 0;
            const isSelected = priceRange.label === p.label;
            return (
              <button
                key={p.label}
                onClick={() => { setPriceRange(p); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{p.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
          Rating
        </h3>
        <div className="space-y-1">
          {RATING_OPTIONS.map(r => {
            const count = counts.ratingCounts[r.label] ?? 0;
            const isSelected = ratingFilter.label === r.label;
            return (
              <button
                key={r.label}
                onClick={() => { setRatingFilter(r); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{r.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div>
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
          Duration
        </h3>
        <div className="space-y-1">
          {DURATION_OPTIONS.map(d => {
            const count = counts.durationCounts[d.label] ?? 0;
            const isSelected = durationFilter.label === d.label;
            return (
              <button
                key={d.label}
                onClick={() => { setDurationFilter(d); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{d.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <div className="pt-16">
        {/* Page Header / Hero Banner */}
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 mb-3">
                  {typeParam === 'online' ? (
                    <><Video className="w-3.5 h-3.5" /> Live Cohorts & Webinars</>
                  ) : typeParam === 'offline' ? (
                    <><MapPin className="w-3.5 h-3.5" /> Physical Classroom Hubs</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> Complete Curriculum Library</>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {typeParam === 'online' ? (
                    'Upcoming Live Online Classes'
                  ) : typeParam === 'offline' ? (
                    'In-Person Hands-on Workshops'
                  ) : (
                    'Production Engineering & AI Courses'
                  )}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                  {typeParam === 'online'
                    ? 'Interactive real-time cohorts streamed directly to your browser with live code reviews and mentor office hours.'
                    : typeParam === 'offline'
                    ? 'Hands-on hardware labs, system benchmarking, and collaborative pair programming in physical tech campuses.'
                    : 'Battle-tested software engineering, distributed systems, and AI agent architectures designed for senior practitioners.'}
                </p>
              </div>

              {/* Quick Tab Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start md:self-end">
                {[
                  { href: '/courses', label: 'All Courses', key: 'all' },
                  { href: '/live-classes', label: 'Live Classes', key: 'online' },
                  { href: '/workshops', label: 'Workshops', key: 'offline' },
                ].map(tab => {
                  const isActive = (forceType ? forceType === tab.key : typeParam === tab.key) || (!forceType && tab.key === 'all' && typeParam === 'all');
                  return (
                    <button
                      key={tab.key}
                      onClick={() => router.push(tab.href)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Bar & Sorting Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by topic, instructor, stack (e.g. Next.js, LangGraph, Rust, K8s)..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); setPage(1); }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative min-w-[200px]">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="popular">Sort: Most Popular</option>
                  <option value="newest">Sort: Newest First</option>
                  <option value="rating">Sort: Highest Rated</option>
                  <option value="price-low">Sort: Price (Low to High)</option>
                  <option value="price-high">Sort: Price (High to Low)</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters {hasActiveFilters && '(Active)'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8 items-start">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-indigo-500" />
                    <span>Filter Catalog</span>
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <FilterPanel />
              </div>
            </aside>

            {/* Mobile Slide-over Drawer */}
            <AnimatePresence>
              {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative ml-auto w-full max-w-xs bg-white dark:bg-slate-900 h-full p-6 shadow-2xl overflow-y-auto flex flex-col z-10"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                      <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <Filter className="w-4 h-4 text-indigo-500" />
                        <span>Filter Catalog</span>
                      </h2>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <FilterPanel />
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                      >
                        Show {filtered.length} Courses
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Course Grid Area */}
            <div className="flex-1 min-w-0">
              {/* Count & Status Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {filtered.length === 0 ? (
                    <span className="font-semibold text-slate-900 dark:text-white">0 courses found</span>
                  ) : (
                    <>
                      Showing{' '}
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}
                      </span>{' '}
                      of{' '}
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {filtered.length}
                      </span>{' '}
                      production courses
                      {category !== 'All' && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">
                          in {category}
                        </span>
                      )}
                    </>
                  )}
                </p>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Filters
                  </button>
                )}
              </div>

              {/* Course Card Grid or Empty State */}
              {filtered.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      No matching courses found
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                      We couldn't find any courses matching your selected filter criteria or search query.
                    </p>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginated.map(course => (
                      <CourseCard
                        key={course.id || course._id}
                        course={course}
                        onPreview={selected => setPreviewCourse(selected)}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-200 dark:border-slate-800 mt-10">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>Items per page:</span>
                        <select
                          value={pageSize}
                          onChange={e => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-2 text-xs font-semibold cursor-pointer"
                        >
                          {PAGE_SIZE_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={safePage === 1}
                          onClick={() => {
                            setPage(safePage - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Previous Page"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                          const p = i + 1;
                          return (
                            <button
                              key={p}
                              onClick={() => {
                                setPage(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                safePage === p
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}

                        <button
                          disabled={safePage === totalPages}
                          onClick={() => {
                            setPage(safePage + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Next Page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Interactive Video Preview Modal */}
      <VideoPreviewModal
        course={previewCourse}
        isOpen={Boolean(previewCourse)}
        onClose={() => setPreviewCourse(null)}
      />
    </div>
  );
}
