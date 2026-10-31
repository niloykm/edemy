import React from 'react';
import CourseDetailsPageClient from './CourseDetailsPageClient';
import { getCourseByIdOrSlugServerSide } from '@/data/coursesService';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const course = await getCourseByIdOrSlugServerSide(params.id);
  if (!course) {
    return {
      title: 'Course Not Found — Ndemy',
      description: 'The requested course could not be located on Ndemy.',
    };
  }
  return {
    title: `${course.title || course.courseTitle} — Ndemy`,
    description: course.subtitle || course.courseDescription || 'Join this advanced engineering course on Ndemy.',
  };
}

export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
  const course = await getCourseByIdOrSlugServerSide(params.id);
  return <CourseDetailsPageClient initialCourse={course} courseIdOrSlug={params.id} />;
}
