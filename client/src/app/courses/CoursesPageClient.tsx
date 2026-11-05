'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import VideoPreviewModal from '@/components/VideoPreviewModal';
import { Course, SEED_COURSES, ALL_COURSES } from '@/data/coursesData';
import {
  Search, Filter, ChevronDown, BookOpen, SlidersHorizontal,
  X, RotateCcw, ChevronLeft, ChevronRight, Grid, List
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
  { label: 'Short (< 10h)', minMinutes: 0, maxMinutes: 600 },
  { label: 'Medium (10–20h)', minMinutes: 600, maxMinutes: 1200 },
  { label: 'Long (20h+)', minMinutes: 1200, maxMinutes: 999999 },
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
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  // Dynamic counts for facet badges
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

  const FilterRail = () => (
    <div className="space-y-5 text-xs">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px] mb-2">
          Category / Track
        </h3>
        <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
          {CATEGORIES.map(c => {
            const count = counts.catCounts[c] ?? 0;
            const isSelected = category === c;
            return (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(1); }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span className="truncate pr-2">{c}</span>
                <span className="font-mono text-[10px] tabular-nums opacity-75">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px] mb-2">
          Skill Level
        </h3>
        <div className="space-y-0.5">
          {LEVELS.map(l => {
            const count = counts.levelCounts[l] ?? 0;
            const isSelected = level === l;
            return (
              <button
                key={l}
                onClick={() => { setLevel(l); setPage(1); }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{l}</span>
                <span className="font-mono text-[10px] tabular-nums opacity-75">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px] mb-2">
          Duration
        </h3>
        <div className="space-y-0.5">
          {DURATION_OPTIONS.map(d => {
            const count = counts.durationCounts[d.label] ?? 0;
            const isSelected = durationFilter.label === d.label;
            return (
              <button
                key={d.label}
                onClick={() => { setDurationFilter(d); setPage(1); }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{d.label}</span>
                <span className="font-mono text-[10px] tabular-nums opacity-75">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px] mb-2">
          Pricing
        </h3>
        <div className="space-y-0.5">
          {PRICE_RANGES.map(p => {
            const count = counts.priceCounts[p.label] ?? 0;
            const isSelected = priceRange.label === p.label;
            return (
              <button
                key={p.label}
                onClick={() => { setPriceRange(p); setPage(1); }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{p.label}</span>
                <span className="font-mono text-[10px] tabular-nums opacity-75">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2 px-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-4"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <div className="pt-14">
        {/* Compact Utility Header Bar */}
        <section className="bg-white dark:bg-[#121215] border-b border-neutral-200 dark:border-neutral-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    {typeParam === 'online' ? 'Real-Time Cohorts' : typeParam === 'offline' ? 'In-Person Hubs' : 'Complete Engineering Syllabus'}
                  </span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-xs font-mono tabular-nums text-neutral-500">
                    {filtered.length} courses
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {typeParam === 'online'
                    ? 'Live Classes & Cohorts'
                    : typeParam === 'offline'
                    ? 'In-Person Workshops & Labs'
                    : 'Production Course Catalog'}
                </h1>
              </div>

              {/* Top View Toggle Tabs */}
              <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 self-start md:self-auto text-xs">
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
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm font-semibold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Immediate Filter Rail / Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter by title, stack, instructor (e.g. Next.js, Raft, Rust, AWS)..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-8 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(''); setPage(1); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative min-w-[180px]">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="w-full appearance-none bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2 pr-8 text-xs font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer focus:outline-none focus:border-neutral-900"
                >
                  <option value="popular">Sort: Popular</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="rating">Sort: Highest Rated</option>
                  <option value="price-low">Sort: Price (Asc)</option>
                  <option value="price-high">Sort: Price (Desc)</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs font-semibold text-neutral-700 dark:text-neutral-200 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters && '(Active)'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Catalog Main Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6 items-start">
            {/* Desktop Left Filter Rail */}
            <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-20">
              <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter Rail</span>
                  </span>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-[10px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <FilterRail />
              </div>
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
              {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60"
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.2 }}
                    className="relative ml-auto w-full max-w-xs bg-white dark:bg-[#121215] h-full p-5 overflow-y-auto flex flex-col z-10 border-l border-neutral-200 dark:border-neutral-800"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
                      <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                        <Filter className="w-4 h-4" />
                        <span>Filter Rail</span>
                      </span>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <FilterRail />
                    </div>

                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4">
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="btn-primary w-full text-xs"
                      >
                        View {filtered.length} Courses
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Course Content Area */}
            <div className="flex-1 min-w-0">
              {/* Density Bar */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                <span className="tabular-nums">
                  {filtered.length === 0 ? (
                    '0 results'
                  ) : (
                    <>
                      Showing <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">{(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}</strong> of <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">{filtered.length}</strong> modules
                    </>
                  )}
                </span>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>

              {/* Actionable Empty State */}
              {filtered.length === 0 ? (
                <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-10 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="w-10 h-10 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      No courses found under this category
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
                      Try relaxing your filter parameters or resetting the search query.
                    </p>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="btn-secondary text-xs mt-2"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* High-Density Course Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginated.map(course => (
                      <CourseCard
                        key={course.id || course._id}
                        course={course}
                        onPreview={selected => setPreviewCourse(selected)}
                      />
                    ))}
                  </div>

                  {/* Tabular Pagination Rail */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800 mt-8 text-xs">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <span>Rows per page:</span>
                        <select
                          value={pageSize}
                          onChange={e => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                          }}
                          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-2 py-1 font-mono tabular-nums text-xs"
                        >
                          {PAGE_SIZE_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          disabled={safePage === 1}
                          onClick={() => {
                            setPage(safePage - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="pagination-btn"
                          aria-label="Previous Page"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
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
                              className={`pagination-btn ${safePage === p ? 'active' : ''}`}
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
                          className="pagination-btn"
                          aria-label="Next Page"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
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
