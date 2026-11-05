'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { ALL_COURSES } from '@/data/coursesData';
import CourseCard from '@/components/CourseCard';
import Link from 'next/link';
import { Star, Clock, BookOpen, Users, Award, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function InstructorProfilePage() {
  const { id } = useParams();
  const { api } = useAuth();
  
  const [instructor, setInstructor] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const educatorId = String(id).replace('educator_', '');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userRes = await api.get(`/users/${educatorId}`);
        setInstructor(userRes.data);

        const coursesRes = await api.get('/courses');
        const tutorCourses = coursesRes.data.filter((c: any) => String(c.educator) === educatorId);
        setCourses(tutorCourses.length > 0 ? tutorCourses : ALL_COURSES.slice(0, 3));
      } catch (err) {
        const matchingCourse = ALL_COURSES.find(c =>
          c.instructor?.name.toLowerCase().includes(educatorId.toLowerCase()) ||
          c.tutorNames?.toLowerCase().includes(educatorId.toLowerCase())
        ) || ALL_COURSES[0];

        setInstructor({
          name: matchingCourse.instructor?.name || 'Dr. Sophia Vance',
          role: matchingCourse.instructor?.role || 'Principal AI Architect at Anthropic Labs',
          imageUrl: matchingCourse.instructor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          bio: matchingCourse.instructor?.bio || 'Senior software engineering architect and researcher.',
          rating: 4.96,
          studentsCount: 14200,
          coursesCount: 3,
        });

        setCourses(ALL_COURSES.filter(c => c.instructor?.name === matchingCourse.instructor?.name).length > 0
          ? ALL_COURSES.filter(c => c.instructor?.name === matchingCourse.instructor?.name)
          : ALL_COURSES.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [educatorId, api]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 flex flex-col justify-center items-center">
        <Navbar />
        <span className="text-xs font-semibold text-neutral-500 font-mono animate-pulse uppercase tracking-wider">
          Loading Instructor Credentials...
        </span>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 flex flex-col justify-center items-center gap-3">
        <Navbar />
        <ShieldAlert className="w-8 h-8 text-neutral-400" />
        <p className="text-neutral-500 font-semibold text-xs uppercase tracking-wider">Instructor profile not found.</p>
        <Link href="/courses" className="btn-secondary text-xs">Browse All Courses</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 space-y-6">
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to courses
        </Link>

        {/* Instructor Workstation Profile Card */}
        <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            <img
              src={instructor.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${instructor.name}`}
              alt={instructor.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                Verified Instructor
              </span>
            </div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {instructor.name}
            </h1>
            <p className="text-xs font-medium text-neutral-500">
              {instructor.role}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl pt-1">
              {instructor.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-2 tabular-nums">
              <span className="flex items-center gap-1 font-semibold text-neutral-800 dark:text-neutral-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {instructor.rating || 4.95} Rating
              </span>
              <span>•</span>
              <span>{(instructor.studentsCount || 14200).toLocaleString()} Practitioners Trained</span>
              <span>•</span>
              <span>{courses.length} Published Tracks</span>
            </div>
          </div>
        </div>

        {/* Authored Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Authored Specializations ({courses.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(c => (
              <CourseCard key={c.id || c._id} course={c} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
