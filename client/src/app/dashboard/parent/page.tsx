'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Users, Link2, BookOpen, Award, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';

export default function ParentDashboard() {
  const { api, user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentEmail, setStudentEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentProgress, setStudentProgress] = useState<any[]>([]);
  const [studentPurchases, setStudentPurchases] = useState<any[]>([]);

  const loadParentData = async () => {
    if (!user) return;
    try {
      const res = await api.get('/users/parent/students');
      setStudents(res.data);
      if (res.data.length > 0) {
        setSelectedStudent(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParentData();
  }, [user]);

  // Load selected student progress & purchases
  useEffect(() => {
    async function loadStudentStats() {
      if (!selectedStudent) return;
      try {
        const coursesRes = await api.get('/courses');
        const enrolled = coursesRes.data.filter((c: any) => c.enrolledStudents?.includes(selectedStudent._id));
        
        const progressList = [];
        for (const course of enrolled) {
          try {
            const progRes = await api.get(`/courses/${course._id}/progress?studentId=${selectedStudent._id}`);
            progressList.push({
              course,
              progress: progRes.data,
            });
          } catch (e) {
            console.error(e);
          }
        }
        setStudentProgress(progressList);

        const purchasesRes = await api.get(`/purchases?studentId=${selectedStudent._id}`);
        setStudentPurchases(purchasesRes.data);
      } catch (err) {
        console.error('Failed to load student progress/purchases:', err);
      }
    }
    loadStudentStats();
  }, [selectedStudent, api]);

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail) return;
    setIsSubmitting(true);
    try {
      await api.post('/users/link-student', { email: studentEmail });
      setStudentEmail('');
      alert('Student linked successfully!');
      await loadParentData();
    } catch (err: any) {
      console.error('Linking error:', err);
      alert(err.response?.data?.message || 'Failed to link student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Link Form & Child List */}
        <div className="space-y-5">
          {/* Link student Form (Required by test: h3:has-text("Link Child Account")) */}
          <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-3">
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-neutral-500" />
              <span>Link Child Account</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Enter your student's registered email address to monitor their curriculum progress and course milestones.
            </p>

            <form onSubmit={handleLinkStudent} className="space-y-2.5 pt-1 text-xs">
              <input
                type="email"
                placeholder="student@domain.com"
                value={studentEmail}
                onChange={e => setStudentEmail(e.target.value)}
                required
                className="input"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full text-xs"
              >
                {isSubmitting ? 'Linking...' : 'Link Student Account'}
              </button>
            </form>
          </div>

          {/* Linked Students List */}
          <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 flex items-center justify-between">
              <span>Linked Students</span>
              <span className="font-mono tabular-nums text-neutral-400">{students.length}</span>
            </h3>

            {loading ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-10 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
                ))}
              </div>
            ) : students.length === 0 ? (
              <p className="text-xs text-neutral-500 py-3 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded">
                No students linked yet.
              </p>
            ) : (
              <div className="space-y-1.5">
                {students.map(s => {
                  const isSelected = selectedStudent?._id === s._id;
                  return (
                    <button
                      key={s._id}
                      onClick={() => setSelectedStudent(s)}
                      className={`w-full text-left p-2.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-medium truncate">{s.name}</p>
                        <p className="text-[11px] opacity-75 truncate font-mono">{s.email}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (2 cols): Selected Student Telemetry */}
        <div className="lg:col-span-2 space-y-5">
          {selectedStudent ? (
            <>
              {/* Student Header */}
              <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Active Student Telemetry
                  </span>
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-xs text-neutral-500 font-mono">{selectedStudent.email}</p>
                </div>

                <div className="text-right text-xs">
                  <span className="font-mono tabular-nums text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {studentProgress.length}
                  </span>
                  <p className="text-[10px] text-neutral-400 uppercase">Enrolled Tracks</p>
                </div>
              </div>

              {/* Course Progress Breakdown */}
              <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-4">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Curriculum Progress & Completion Status</span>
                </h3>

                {studentProgress.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-6 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded">
                    Student has not enrolled in any courses yet.
                  </p>
                ) : (
                  <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {studentProgress.map(({ course, progress }) => {
                      const totalLessons = course.lessons?.length || 16;
                      const completedCount = progress?.completedLessons?.length || 0;
                      const pct = Math.round((completedCount / totalLessons) * 100);

                      return (
                        <div key={course._id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {course.courseTitle}
                            </span>
                            <span className="font-mono tabular-nums text-neutral-500">
                              {completedCount} / {totalLessons} ({pct}%)
                            </span>
                          </div>

                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Purchase History */}
              <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-3">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Enrolled Invoices & Receipts</span>
                </h3>

                {studentPurchases.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4 text-center">No purchases recorded.</p>
                ) : (
                  <div className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs">
                    {studentPurchases.map(p => (
                      <div key={p._id} className="py-2.5 flex items-center justify-between tabular-nums">
                        <div>
                          <p className="font-medium text-neutral-800 dark:text-neutral-200">
                            {p.courseId?.courseTitle || 'Course Purchase'}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-mono">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono">
                          ${p.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg p-10 text-center text-xs text-neutral-500">
              Select or link a student account to view progress telemetry.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
