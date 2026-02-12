// API Route: GET /api/lessons/[id]
// Get single lesson details

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
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

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// PUT /api/lessons/[id] - Update lesson (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // TODO: Check if user is admin

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        content: body.content,
        videoUrl: body.videoUrl || null,
        vimeoId: body.vimeoId || null,
        vimeoHash: body.vimeoHash || null,
        duration: body.duration || 0,
        order: body.order,
        type: body.type || 'VIDEO',
        isPreview: body.isPreview === true,
        resources: body.resources || null,
      },
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error('Error updating lesson:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Lesson with this slug already exists in this course' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// DELETE /api/lessons/[id] - Delete lesson (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Check if user is admin

    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting lesson:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}
