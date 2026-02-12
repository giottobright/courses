// API Route: GET /api/courses/[id]/lessons
// Get lessons for a course

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: courseId } = params;

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// POST /api/courses/[id]/lessons - Create new lesson (Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: courseId } = params;
    const body = await request.json();

    // TODO: Check if user is admin (via Memberstack)

    // Validate required fields
    const { title, slug, description, content, duration, order, type } = body;

    if (!title || !slug || !description || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        slug,
        description,
        content,
        videoUrl: body.videoUrl || null,
        vimeoId: body.vimeoId || null,
        vimeoHash: body.vimeoHash || null,
        duration: duration || 0,
        order: order || 1,
        type: type || 'VIDEO',
        isPreview: body.isPreview === true,
        resources: body.resources || null,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lesson:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Lesson with this slug already exists in this course' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
