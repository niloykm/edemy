import React from 'react';
import CoursesPageClient from '../courses/CoursesPageClient';
import { getCoursesServerSide } from '@/data/coursesService';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Live Online Classes & Cohorts — Ndemy',
  description: 'Join real-time interactive cohorts with expert engineering instructors via Google Meet. Live code reviews, breakout rooms, and recordings.',
};

export default async function LiveClassesPage() {
  const initialCourses = await getCoursesServerSide('online');
  return <CoursesPageClient initialCourses={initialCourses} forceType="online" />;
}
