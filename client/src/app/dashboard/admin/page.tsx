'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Shield, ArrowUpRight } from 'lucide-react';

export default function AdminRedirectPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'http://localhost:3001';
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
        </div>
        <h2 className="text-base font-semibold uppercase text-neutral-900 dark:text-neutral-100 tracking-wider">
          Admin Portal Moved
        </h2>
        <p className="text-xs text-neutral-500 max-w-sm">
          The administration workstation has been partitioned into a dedicated port.
          Redirecting automatically:
        </p>
        <a
          href="http://localhost:3001"
          className="btn-secondary text-xs flex items-center gap-1.5 font-mono"
        >
          <span>Open admin portal (Port 3001)</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </main>
    </div>
  );
}
