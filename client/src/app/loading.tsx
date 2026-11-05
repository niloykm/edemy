import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-neutral-900 dark:text-neutral-100">
      {/* Top Workstation Bar Skeleton */}
      <div className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#09090b] px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-5 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="hidden md:flex gap-3">
            <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="w-24 h-7 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Geometry-Matching Catalog & Player Skeleton Screen */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header rail skeleton */}
        <div className="space-y-2 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="w-40 h-3 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="w-72 h-6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>

        {/* Catalog layout with filter rail and cards */}
        <div className="flex gap-6 items-start">
          {/* Left filter rail */}
          <div className="hidden lg:block w-56 p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] space-y-4">
            <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-6 bg-neutral-100 dark:bg-neutral-900 rounded animate-pulse" />
              ))}
            </div>
          </div>

          {/* Cards grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden flex flex-col"
              >
                <div className="aspect-video w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                <div className="p-4 space-y-3 flex-1">
                  <div className="w-20 h-3 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-between">
                    <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
