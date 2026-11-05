'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { registerEmail } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent' | 'admin'>('student');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await registerEmail(email, name, password, role);
      router.push(`/dashboard/${role === 'teacher' ? 'tutor' : role}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Registration error. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-md bg-white dark:bg-[#121215] rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Create Workstation Account
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Get access to the complete engineering course catalog and interactive classrooms.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Turing"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="developer@workstation.io"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Role Track
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="input cursor-pointer"
              >
                <option value="student">Student / Practitioner</option>
                <option value="teacher">Tutor / Engineering Lead</option>
                <option value="parent">Parent / Supervisor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-xs mt-2"
            >
              <span>{isSubmitting ? 'Registering...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
            <span>Already have an account? </span>
            <Link href="/auth/login" className="font-semibold text-neutral-900 dark:text-neutral-100 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
