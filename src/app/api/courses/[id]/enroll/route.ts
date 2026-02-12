// API Route: POST /api/courses/[id]/enroll
// Enroll user in a course

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEnrollmentEmail } from '@/lib/email';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: courseId } = params;
    const body = await request.json();
    
    // Get user info from request
    // TODO: Get userId from Memberstack session
    const { userId, userName, userEmail } = body;

    if (!userId || !userName || !userEmail) {
      return NextResponse.json(
        { error: 'User information required' },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
    });

    if (!course || !course.isPublished) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 409 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        userName,
        userEmail,
        courseId,
        currentLessonId: course.lessons[0]?.id,
      },
    });

    // Update course students count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        studentsCount: {
          increment: 1,
        },
      },
    });

    // Send enrollment confirmation email
    try {
      await sendEnrollmentEmail(userEmail, userName, course.title, course.slug);
    } catch (emailError) {
      console.error('Failed to send enrollment email:', emailError);
      // Don't fail the enrollment if email fails
    }

    return NextResponse.json({
      message: 'Successfully enrolled in course',
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}
