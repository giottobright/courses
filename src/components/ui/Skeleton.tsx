// Skeleton loading components
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 border-2 border-gray-100">
      <Skeleton className="h-4 w-20 mb-4" />
      <Skeleton className="aspect-square rounded-2xl mb-4" />
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-10 w-full rounded-full" />
    </div>
  );
}

export function CourseListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Courses */}
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <CourseListSkeleton count={3} />
      </div>
    </div>
  );
}
