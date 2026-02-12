// API Route: GET /api/progress
// Get user's progress across all courses

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get all enrollments with progress
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
        lessonProgress: {
          where: { completed: true },
        },
      },
    });

    // Calculate statistics
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.completedAt).length;
    const inProgressCourses = totalCourses - completedCourses;
    
    const totalLessons = enrollments.reduce(
      (sum, e) => sum + e.course.lessons.length,
      0
    );
    const completedLessons = enrollments.reduce(
      (sum, e) => sum + e.lessonProgress.length,
      0
    );

    const totalHours = enrollments.reduce(
      (sum, e) => sum + e.course.duration,
      0
    );
    const completedHours = enrollments.reduce(
      (sum, e) => {
        const courseCompleted = e.completedAt !== null;
        return sum + (courseCompleted ? e.course.duration : Math.round(e.course.duration * (e.progress / 100)));
      },
      0
    );

    // Get certificates earned
    const certificates = await prisma.certificate.count({
      where: { userId },
    });

    return NextResponse.json({
      stats: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        totalLessons,
        completedLessons,
        totalHours: Math.round(totalHours / 60), // Convert to hours
        completedHours: Math.round(completedHours / 60),
        certificatesEarned: certificates,
      },
      recentActivity: enrollments
        .sort((a, b) => 
          new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
        )
        .slice(0, 5)
        .map((e) => ({
          courseId: e.courseId,
          courseTitle: e.course.title,
          courseSlug: e.course.slug,
          progress: e.progress,
          lastAccessed: e.lastAccessedAt,
        })),
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
