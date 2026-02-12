// API Route: GET /POST /api/wishlist
// Get or add to wishlist

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/wishlist?userId=xxx
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

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        addedAt: 'desc',
      },
    });

    const response = wishlist.map((item) => ({
      id: item.id,
      addedAt: item.addedAt,
      course: {
        id: item.course.id,
        title: item.course.title,
        slug: item.course.slug,
        shortDescription: item.course.shortDescription,
        thumbnailUrl: item.course.thumbnailUrl,
        category: {
          name: item.course.category.name,
          slug: item.course.category.slug,
          color: item.course.category.color,
        },
        instructor: {
          name: item.course.instructorName,
          avatar: item.course.instructorAvatar,
        },
        price: Number(item.course.price),
        originalPrice: item.course.originalPrice ? Number(item.course.originalPrice) : null,
        currency: item.course.currency,
        rating: item.course.rating,
        studentsCount: item.course.studentsCount,
        duration: item.course.duration,
        level: item.course.level.toLowerCase(),
        colorScheme: item.course.colorScheme.toLowerCase(),
      },
    }));

    return NextResponse.json({ wishlist: response });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId } = body;

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'User ID and Course ID required' },
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

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Course already in wishlist' },
        { status: 409 }
      );
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        courseId,
      },
    });

    return NextResponse.json({
      message: 'Course added to wishlist',
      wishlistItem: {
        id: wishlistItem.id,
        courseId: wishlistItem.courseId,
        addedAt: wishlistItem.addedAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}
