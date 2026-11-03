'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Clock, Users, Play, Heart, Sparkles, BookOpen, Video, MapPin, Download } from 'lucide-react';
import { Course, isMediaLesson } from '@/data/coursesData';
import { useAuth } from '@/context/AuthContext';

interface CourseCardProps {
  course: Course;
  onPreview?: (course: Course) => void;
}

export default function CourseCard({ course, onPreview }: CourseCardProps) {
  const router = useRouter();
  const { user, api, refreshProfile } = useAuth();

  const courseId = String(course.id || course._id);
  const courseSlug = course.slug || courseId;
  const isWishlisted = user?.wishlist?.includes(courseId);

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
  const instructorRole = course.instructor?.role || course.institutionName || 'Principal Engineer';

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
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 hover:-translate-y-1">
      {/* 16:9 Thumbnail with Overlay Controls */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={thumbnail}
          alt={course.title || course.courseTitle}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm flex items-center gap-1">
              {course.type === 'online' ? (
                <><Video className="w-3 h-3 text-indigo-400" /> Live</>
              ) : course.type === 'offline' ? (
                <><MapPin className="w-3 h-3 text-emerald-400" /> Workshop</>
              ) : (
                course.category || 'Tech'
              )}
            </span>
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-600 text-white shadow-sm">
                -{discountPercent}%
              </span>
            )}
          </div>

          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-950/75 backdrop-blur-md text-slate-200 border border-white/10">
            <Clock className="w-3 h-3 text-indigo-400" />
            {duration}
          </span>
        </div>

        {/* Center Hover Action: Watch Preview Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handlePreviewClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/40 backdrop-blur-sm border border-white/20 transition-all transform scale-95 group-hover:scale-100 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Watch Preview</span>
          </button>
        </div>

        {/* Bottom Bar on Thumbnail: Level & Wishlist */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
            {course.level || 'All Levels'}
          </span>

          <button
            onClick={handleToggleWishlist}
            className="p-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white hover:text-rose-500 hover:bg-slate-900 transition-colors cursor-pointer border border-white/10 shadow-sm"
            aria-label="Wishlist course"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <Link
        href={`/courses/${courseSlug}`}
        className="p-5 flex-1 flex flex-col justify-between space-y-4"
      >
        <div className="space-y-2.5">
          {/* Badge & Meta */}
          {course.badge && (
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{course.badge}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {course.title || course.courseTitle}
          </h3>

          {/* Subtitle snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {course.subtitle || course.courseDescription}
          </p>
        </div>

        {/* Instructor Row */}
        <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <img
            src={instructorAvatar}
            alt={instructorName}
            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {instructorName}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {instructorRole}
            </p>
          </div>
        </div>

        {/* Metrics Row: Star rating, reviews, lessons */}
        <div className="flex items-center justify-between text-xs pt-1 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">
              ({reviewsCount > 999 ? `${(reviewsCount / 1000).toFixed(1)}k` : reviewsCount})
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              {lessonsCount} lessons
            </span>
            {course.lessons?.some(l => !isMediaLesson(l.type || l.lessonType)) && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20" title="Includes downloadable files and blueprints">
                <Download className="w-2.5 h-2.5" /> Files
              </span>
            )}
          </div>
        </div>

        {/* Pricing Row */}
        <div className="flex items-baseline justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {price === 0 ? 'Free' : `$${price}`}
            </span>
            {originalPrice > price && (
              <span className="text-xs text-slate-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
            View Syllabus &rarr;
          </span>
        </div>
      </Link>
    </div>
  );
}
