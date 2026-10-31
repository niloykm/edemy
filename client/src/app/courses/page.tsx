import React from 'react';
import CoursesPageClient from './CoursesPageClient';
import { getCoursesServerSide } from '@/data/coursesService';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Engineering & AI Courses — Ndemy Learning Platform',
  description: 'Explore production-grade tech courses in AI Agent Engineering, Next.js 15, Distributed Systems, Rust, and Cloud Platforms.',
};

export default async function CoursesPage() {
  const initialCourses = await getCoursesServerSide('all');
  return <CoursesPageClient initialCourses={initialCourses} />;
}
