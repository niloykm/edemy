import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Top Bar Skeleton */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="w-28 h-6 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse" />
        <div className="hidden md:flex gap-4">
          <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-3">
          <div className="w-48 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="w-96 max-w-full h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-pulse flex flex-col"
            >
              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
              <div className="p-5 space-y-3 flex-1">
                <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="w-full h-5 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded pt-2" />
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
