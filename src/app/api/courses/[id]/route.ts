// API Route: GET /api/courses/[id]
// Get single course details

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            duration: true,
            order: true,
            type: true,
            isPreview: true,
          },
        },
        reviews: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!course || !course.isPublished) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Transform data
    const response = {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      shortDescription: course.shortDescription,
      thumbnailUrl: course.thumbnailUrl,
      videoIntroUrl: course.videoIntroUrl,
      category: {
        id: course.category.id,
        name: course.category.name,
        slug: course.category.slug,
        icon: course.category.icon,
        color: course.category.color,
      },
      instructor: {
        id: course.instructorId,
        name: course.instructorName,
        avatar: course.instructorAvatar,
        bio: course.instructorBio,
      },
      price: Number(course.price),
      originalPrice: course.originalPrice ? Number(course.originalPrice) : null,
      currency: course.currency,
      duration: course.duration,
      level: course.level.toLowerCase(),
      tags: course.tags,
      rating: course.rating,
      reviewsCount: course._count.reviews,
      studentsCount: course._count.enrollments,
      whatYouWillLearn: course.whatYouWillLearn,
      requirements: course.requirements,
      hasCertificate: course.hasCertificate,
      isPaid: course.isPaid,
      isPopular: course.isPopular,
      isNew: course.isNew,
      colorScheme: course.colorScheme.toLowerCase(),
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        duration: lesson.duration,
        order: lesson.order,
        type: lesson.type.toLowerCase(),
        isPreview: lesson.isPreview,
      })),
      reviews: course.reviews.map((review) => ({
        id: review.id,
        userName: review.userName,
        userAvatar: review.userAvatar,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Update course (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // TODO: Check if user is admin

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
      },
    });

    return NextResponse.json(course);
  } catch (error: any) {
    console.error('Error updating course:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete course (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Check if user is admin

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting course:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
