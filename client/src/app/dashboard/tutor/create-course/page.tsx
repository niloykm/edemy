'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Upload, Trash, ArrowLeft, Video, FileText, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CreateCoursePage() {
  const { api, user } = useAuth();
  const router = useRouter();

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [coursePrice, setCoursePrice] = useState('99.99');
  const [courseDiscount, setCourseDiscount] = useState('0');
  const [courseCategory, setCourseCategory] = useState('Web Development');
  const [courseLevel, setCourseLevel] = useState('beginner');
  const [courseLanguage, setCourseLanguage] = useState('english');
  const [courseInstitution, setCourseInstitution] = useState('');
  const [courseTutors, setCourseTutors] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [uploadingVideoId, setUploadingVideoId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    const payload = {
      courseTitle,
      courseDescription,
      courseThumbnail,
      coursePrice: parseFloat(coursePrice) || 0,
      discount: parseInt(courseDiscount) || 0,
      category: courseCategory,
      level: courseLevel,
      language: courseLanguage,
      institutionName: courseInstitution,
      tutorNames: courseTutors,
      isPublished,
      lessons: courseLessons.map((l, idx) => ({
        ...l,
        sortOrder: idx,
        lessonId: l.lessonId || `lesson_${Date.now()}_${idx}`,
      })),
    };
    try {
      await api.post('/courses', payload);
      alert('Course blueprint established!');
      router.push('/dashboard/tutor');
    } catch (err) {
      console.error(err);
      alert('Error creating course.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLesson = () => {
    setCourseLessons(prev => [
      ...prev,
      {
        lessonId: `lesson_${Date.now()}`,
        lessonTitle: 'New Lesson',
        lessonType: 'video',
        videoUrl: '',
        pdfUrl: '',
        webLink: '',
        meetLink: '',
        locationDetails: '',
        timeSchedule: new Date().toISOString(),
        duration: 30,
      }
    ]);
  };

  const handleRemoveLesson = (idx: number) => {
    setCourseLessons(prev => prev.filter((_, i) => i !== idx));
  };

  const handleLessonChange = (idx: number, field: string, value: any) => {
    setCourseLessons(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };

  const handleVideoUpload = async (idx: number, file: File) => {
    const lesson = courseLessons[idx];
    setUploadingVideoId(lesson.lessonId);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.url) {
        handleLessonChange(idx, 'videoUrl', res.data.url);
        alert('Video uploaded successfully!');
      } else {
        alert('Upload failed: No URL returned');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setUploadingVideoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <Link href="/dashboard/tutor" className="p-1.5 rounded border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <ArrowLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Create Course Blueprint</h1>
            <p className="text-xs text-neutral-500">Configure syllabus architecture, pricing, and lesson artifacts.</p>
          </div>
        </div>

        <form onSubmit={handleSaveCourse} className="bg-white dark:bg-[#121215] p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">Course Title</label>
              <input
                type="text"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                className="input font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">Discount (%)</label>
              <input
                type="number"
                required
                value={courseDiscount}
                onChange={(e) => setCourseDiscount(e.target.value)}
                className="input font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">Category</label>
              <input
                type="text"
                required
                value={courseCategory}
                onChange={(e) => setCourseCategory(e.target.value)}
                placeholder="Web Development, Data Science"
                className="input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">Level</label>
              <select
                value={courseLevel}
                onChange={(e) => setCourseLevel(e.target.value)}
                className="input cursor-pointer"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">Language</label>
              <input
                type="text"
                required
                value={courseLanguage}
                onChange={(e) => setCourseLanguage(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">Institution Publisher</label>
              <input
                type="text"
                value={courseInstitution}
                onChange={(e) => setCourseInstitution(e.target.value)}
                placeholder="MIT, Google Academy"
                className="input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">Instructor Names</label>
              <input
                type="text"
                value={courseTutors}
                onChange={(e) => setCourseTutors(e.target.value)}
                placeholder="Jane Doe, John Smith"
                className="input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">Thumbnail URL</label>
              <input
                type="text"
                value={courseThumbnail}
                onChange={(e) => setCourseThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="input font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">Course Description & Outcomes</label>
            <textarea
              required
              rows={4}
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="input leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="cursor-pointer"
            />
            <label htmlFor="isPublished" className="text-xs font-medium cursor-pointer">
              Publish directly to public catalog
            </label>
          </div>

          {/* Lessons builder */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 text-xs">
                  Curriculum Modules ({courseLessons.length})
                </h3>
                <p className="text-[11px] text-neutral-500">Configure multi-format lectures, whitepapers, and live sessions.</p>
              </div>

              <button
                type="button"
                onClick={handleAddLesson}
                className="btn-secondary text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lesson</span>
              </button>
            </div>

            <div className="space-y-3">
              {courseLessons.map((l, idx) => (
                <div key={l.lessonId} className="p-4 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Module #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLesson(idx)}
                      className="text-neutral-400 hover:text-rose-500 p-1"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium text-neutral-500 mb-1">Title</label>
                      <input
                        type="text"
                        value={l.lessonTitle}
                        onChange={(e) => handleLessonChange(idx, 'lessonTitle', e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-neutral-500 mb-1">Lesson Type</label>
                      <select
                        value={l.lessonType}
                        onChange={(e) => handleLessonChange(idx, 'lessonType', e.target.value)}
                        className="input cursor-pointer"
                      >
                        <option value="video">Video Lecture</option>
                        <option value="audio">Audio Deep-Dive</option>
                        <option value="image">System Blueprint (Diagram)</option>
                        <option value="pdf">Technical PDF Whitepaper</option>
                        <option value="doc">Engineering Spec (.docx)</option>
                        <option value="file">Code Repository (.zip)</option>
                        <option value="link">Interactive Online Lab</option>
                        <option value="online">Live Class (Meet)</option>
                        <option value="offline">In-Person Workshop</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-neutral-500 mb-1">Duration (mins)</label>
                      <input
                        type="number"
                        value={l.duration}
                        onChange={(e) => handleLessonChange(idx, 'duration', parseInt(e.target.value))}
                        className="input font-mono tabular-nums"
                      />
                    </div>
                  </div>

                  {l.lessonType === 'video' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-medium text-neutral-500 mb-1">Video Stream URL</label>
                        <input
                          type="text"
                          value={l.videoUrl}
                          onChange={(e) => handleLessonChange(idx, 'videoUrl', e.target.value)}
                          placeholder="https://...mp4 or YouTube"
                          className="input font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-neutral-500 mb-1">Direct Upload</label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleVideoUpload(idx, file);
                          }}
                          className="input text-xs"
                        />
                        {uploadingVideoId === l.lessonId && (
                          <span className="text-[10px] text-amber-500 mt-1 block">Uploading video...</span>
                        )}
                      </div>
                    </div>
                  )}

                  {l.lessonType === 'pdf' && (
                    <div>
                      <label className="block text-[10px] font-medium text-neutral-500 mb-1">PDF URL</label>
                      <input
                        type="text"
                        value={l.pdfUrl}
                        onChange={(e) => handleLessonChange(idx, 'pdfUrl', e.target.value)}
                        placeholder="https://...pdf"
                        className="input font-mono text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
            <Link href="/dashboard/tutor" className="btn-secondary text-xs">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary text-xs"
            >
              {isSaving ? 'Establishing Blueprint...' : 'Publish Course Blueprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
