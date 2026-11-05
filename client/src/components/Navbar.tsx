'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LogOut, User, LayoutDashboard, Search,
  ChevronDown, Menu, X, Sun, Moon
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const getDashboardHref = () => {
    if (!user) return '/auth/login';
    const roleMap: Record<string, string> = {
      admin: '/dashboard/admin',
      teacher: '/dashboard/tutor',
      parent: '/dashboard/parent',
      student: '/dashboard/student',
    };
    return roleMap[user.role] || '/dashboard/student';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Ndemy"
                className="w-7 h-7 rounded object-contain"
              />
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
                Ndemy
              </span>
            </Link>

            {/* Workstation Navigation Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: '/courses', label: 'Courses' },
                { href: '/live-classes', label: 'Live Classes' },
                { href: '/workshops', label: 'Workshops' },
              ].map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Rail */}
          <div className="flex items-center gap-2">
            {/* Direct Quick Search */}
            <Link
              href="/courses"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-6 h-6 rounded object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                    </div>
                  )}
                  <span className="hidden sm:block text-xs font-medium text-neutral-800 dark:text-neutral-200 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-[#18181b] rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden z-50 origin-top-right text-xs"
                    >
                      <div className="px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{user.name}</p>
                        <p className="text-neutral-500 dark:text-neutral-400 truncate text-[11px] mt-0.5">{user.email}</p>
                        <span className="mt-1 inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded border border-neutral-200 dark:border-neutral-700">
                          {user.role}
                        </span>
                      </div>

                      <div className="p-1 space-y-0.5">
                        <Link
                          href={getDashboardHref()}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-neutral-500" /> Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                        >
                          <User className="w-3.5 h-3.5 text-neutral-500" /> Profile & Settings
                        </Link>
                        <button
                          onClick={() => { setProfileOpen(false); logout(); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/login"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#09090b] px-4 py-3 space-y-1 text-xs">
          {[
            { href: '/courses', label: 'Courses' },
            { href: '/live-classes', label: 'Live Classes' },
            { href: '/workshops', label: 'Workshops' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
