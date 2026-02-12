// API Route: GET /api/enrollments
// Get user's enrolled courses

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

    // Get user's enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                slug: true,
                duration: true,
                order: true,
              },
            },
          },
        },
        lessonProgress: {
          where: { completed: true },
        },
      },
      orderBy: {
        lastAccessedAt: 'desc',
      },
    });

    // Transform data
    const response = enrollments.map((enrollment) => ({
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      lastAccessedAt: enrollment.lastAccessedAt,
      progress: enrollment.progress,
      currentLessonId: enrollment.currentLessonId,
      completedLessonsCount: enrollment.lessonProgress.length,
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        slug: enrollment.course.slug,
        shortDescription: enrollment.course.shortDescription,
        thumbnailUrl: enrollment.course.thumbnailUrl,
        category: {
          name: enrollment.course.category.name,
          slug: enrollment.course.category.slug,
          color: enrollment.course.category.color,
        },
        instructor: {
          name: enrollment.course.instructorName,
          avatar: enrollment.course.instructorAvatar,
        },
        totalLessons: enrollment.course.lessons.length,
        duration: enrollment.course.duration,
        hasCertificate: enrollment.course.hasCertificate,
        colorScheme: enrollment.course.colorScheme.toLowerCase(),
      },
    }));

    return NextResponse.json({ enrollments: response });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}
