import React from 'react';
import CoursesPageClient from '../courses/CoursesPageClient';
import { getCoursesServerSide } from '@/data/coursesService';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'In-Person Hands-on Workshops — Ndemy',
  description: 'Attend physical weekend workshops in San Francisco, New York, London, and Seattle. Hands-on hardware labs and mentor pair programming.',
};

export default async function WorkshopsPage() {
  const initialCourses = await getCoursesServerSide('offline');
  return <CoursesPageClient initialCourses={initialCourses} forceType="offline" />;
}
