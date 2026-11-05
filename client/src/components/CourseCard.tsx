'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, BookOpen, Download, Heart, Play, Layers } from 'lucide-react';
import { Course, isMediaLesson } from '@/data/coursesData';
import { useAuth } from '@/context/AuthContext';

interface CourseCardProps {
  course: Course;
  onPreview?: (course: Course) => void;
  dense?: boolean;
}

export default function CourseCard({ course, onPreview }: CourseCardProps) {
  const router = useRouter();
  const { user, api, refreshProfile } = useAuth();

  const courseId = String(course.id || course._id);
  const courseSlug = course.slug || courseId;
  const isWishlisted = user?.wishlist?.includes(courseId);
  const isEnrolled = Boolean(
    user?.enrolledCourses?.includes(courseId) ||
    user?.enrolledCourses?.includes(course.slug)
  );

  const price = Number(course.price ?? course.coursePrice ?? 0);
  const originalPrice = Number(course.originalPrice ?? (course.discount ? price / (1 - course.discount / 100) : price));
  const discountPercent = course.discount || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  const rating = Number(course.rating || 4.9);
  const reviewsCount = course.reviewsCount || (course.ratings?.length ? course.ratings.length * 40 : 1240);
  const duration = course.duration || `${Math.round((course.durationMinutes || 720) / 60)}h`;
  const lessonsCount = course.lessonsCount || course.lessons?.length || 16;
  const studentsCount = course.enrolledStudents?.length || 1200;

  const thumbnail = course.thumbnailUrl || course.courseThumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';
  const instructorAvatar = course.instructor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
  const instructorName = course.instructor?.name || course.tutorNames || 'Lead Instructor';

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPreview) {
      onPreview(course);
    } else {
      router.push(`/courses/${courseSlug}`);
    }
  };

  return (
    <div className="course-card group relative bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden flex flex-col transition-colors hover:border-neutral-400 dark:hover:border-neutral-600">
      {/* 16:9 Thumbnail Header with 1px border separator */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <img
          src={thumbnail}
          alt={course.title || course.courseTitle}
          className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Crisp Top Meta Bar */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-neutral-950/85 text-neutral-200 border border-neutral-800">
              {course.type === 'online' ? 'Live Cohort' : course.type === 'offline' ? 'In-Person' : (course.category || 'Engineering')}
            </span>
            {course.level && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-neutral-900/80 text-neutral-300 border border-neutral-800">
                {course.level}
              </span>
            )}
          </div>

          <button
            onClick={handleToggleWishlist}
            className="pointer-events-auto p-1.5 rounded bg-neutral-950/80 text-neutral-300 hover:text-rose-400 hover:bg-neutral-900 border border-neutral-800 transition-colors"
            aria-label="Wishlist course"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-300'}`} />
          </button>
        </div>

        {/* Bottom Bar: Duration & Preview button */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-neutral-950/80 text-neutral-300 tabular-nums border border-neutral-800">
            <Clock className="w-3 h-3 text-neutral-400" />
            {duration}
          </span>

          <button
            onClick={handlePreviewClick}
            className="pointer-events-auto flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-950/90 hover:bg-neutral-900 text-neutral-100 text-[11px] font-medium border border-neutral-700 transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 fill-neutral-300" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Structured Course Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Functional status indicator if enrolled */}
          {isEnrolled && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Enrolled
              </span>
            </div>
          )}

          {/* Title */}
          <Link href={`/courses/${courseSlug}`} className="block">
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              {course.title || course.courseTitle}
            </h3>
          </Link>

          {/* Instructor & Track */}
          <div className="flex items-center gap-2 pt-0.5">
            <img
              src={instructorAvatar}
              alt={instructorName}
              className="w-5 h-5 rounded-full object-cover border border-neutral-300 dark:border-neutral-700 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
              }}
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
              {instructorName}
            </span>
          </div>
        </div>

        {/* Structured Metadata (Total Hours, Module Count, Skill Tags) */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center justify-between tabular-nums">
            <span className="flex items-center gap-1 text-[11px]">
              <BookOpen className="w-3 h-3 text-neutral-400" />
              {lessonsCount} lessons
            </span>

            <div className="flex items-center gap-1 text-[11px]">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">{rating.toFixed(1)}</span>
              <span>({reviewsCount > 999 ? `${(reviewsCount / 1000).toFixed(1)}k` : reviewsCount})</span>
            </div>
          </div>

          {/* Downloadable / multi-format flag */}
          {course.lessons?.some(l => !isMediaLesson(l.type || l.lessonType)) && (
            <div className="flex items-center gap-1 text-[10px] text-neutral-600 dark:text-neutral-400 font-mono">
              <Download className="w-2.5 h-2.5" />
              <span>Includes blueprints & whitepapers</span>
            </div>
          )}
        </div>

        {/* Bottom Action / Price Row */}
        <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1.5 tabular-nums">
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {price === 0 ? 'Free' : `$${price}`}
            </span>
            {originalPrice > price && (
              <span className="text-xs text-neutral-400 line-through">
                ${originalPrice}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                -{discountPercent}%
              </span>
            )}
          </div>

          <Link
            href={`/courses/${courseSlug}`}
            className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline inline-flex items-center gap-1"
          >
            {isEnrolled ? 'Resume' : 'View Syllabus'} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
