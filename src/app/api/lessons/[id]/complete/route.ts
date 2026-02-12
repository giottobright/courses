// API Route: POST /api/lessons/[id]/complete
// Mark lesson as completed and update progress

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendCertificateEmail } from '@/lib/email';
import { generateCertificateId } from '@/lib/certificate';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: lessonId } = params;
    const body = await request.json();
    
    const { userId, userName, userEmail } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get lesson and course info
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Get or create enrollment
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId,
        },
      },
      include: {
        lessonProgress: true,
      },
    });

    if (!enrollment) {
      // Auto-enroll if not enrolled (for free courses)
      enrollment = await prisma.enrollment.create({
        data: {
          userId,
          userName: userName || 'User',
          userEmail: userEmail || '',
          courseId: lesson.courseId,
          currentLessonId: lessonId,
        },
        include: {
          lessonProgress: true,
        },
      });
    }

    // Check if lesson already completed
    const existingProgress = enrollment.lessonProgress.find(
      (p) => p.lessonId === lessonId
    );

    if (!existingProgress) {
      // Create lesson progress
      await prisma.lessonProgress.create({
        data: {
          enrollmentId: enrollment.id,
          lessonId,
          completed: true,
          completedAt: new Date(),
        },
      });
    } else if (!existingProgress.completed) {
      // Update existing progress
      await prisma.lessonProgress.update({
        where: { id: existingProgress.id },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });
    }

    // Calculate new progress
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        enrollmentId: enrollment.id,
        completed: true,
      },
    });

    const totalLessons = lesson.course.lessons.length;
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
    const isCompleted = progressPercentage === 100;

    // Update enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: progressPercentage,
        completedAt: isCompleted ? new Date() : null,
        lastAccessedAt: new Date(),
      },
    });

    // If course completed, generate certificate
    let certificate = null;
    if (isCompleted && lesson.course.hasCertificate) {
      // Check if certificate already exists
      const existingCert = await prisma.certificate.findFirst({
        where: {
          userId,
          courseId: lesson.courseId,
        },
      });

      if (!existingCert) {
        const certificateNumber = generateCertificateId(lesson.courseId, userId);
        const verificationCode = generateCertificateId(lesson.courseId, userId).substring(0, 16);

        certificate = await prisma.certificate.create({
          data: {
            userId,
            userName: userName || 'User',
            courseId: lesson.courseId,
            courseName: lesson.course.title,
            instructorName: lesson.course.instructorName,
            certificateNumber,
            verificationCode,
          },
        });

        // Send certificate email
        try {
          await sendCertificateEmail(
            userEmail || '',
            userName || 'User',
            lesson.course.title,
            certificate.id
          );
        } catch (emailError) {
          console.error('Failed to send certificate email:', emailError);
        }
      } else {
        certificate = existingCert;
      }
    }

    return NextResponse.json({
      message: 'Lesson marked as complete',
      progress: {
        completed: completedLessons,
        total: totalLessons,
        percentage: progressPercentage,
        isCompleted,
      },
      certificate: certificate ? {
        id: certificate.id,
        certificateNumber: certificate.certificateNumber,
      } : null,
    });
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
