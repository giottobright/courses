// API Route: GET /api/courses
// Get list of courses with filtering and search

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const search = searchParams.get('search') || '';
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const isPaid = searchParams.get('isPaid');
    const isPopular = searchParams.get('isPopular');
    const isNew = searchParams.get('isNew');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build where clause
    const where: any = {
      isPublished: true,
    };

    // Filter by slug (for single course lookup)
    if (slug) {
      where.slug = slug;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (level) {
      where.level = level.toUpperCase();
    }

    if (isPaid !== null) {
      where.isPaid = isPaid === 'true';
    }

    if (isPopular === 'true') {
      where.isPopular = true;
    }

    if (isNew === 'true') {
      where.isNew = true;
    }

    // Get total count for pagination
    const total = await prisma.course.count({ where });

    // Get courses
    const courses = await prisma.course.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
            icon: true,
            color: true,
          },
        },
        _count: {
          select: {
            lessons: true,
            reviews: true,
            enrollments: true,
          },
        },
      },
      orderBy: {
        [sortBy]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform data for response
    const transformedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      shortDescription: course.shortDescription,
      thumbnailUrl: course.thumbnailUrl,
      category: course.category,
      instructor: {
        name: course.instructorName,
        avatar: course.instructorAvatar,
      },
      price: Number(course.price),
      originalPrice: course.originalPrice ? Number(course.originalPrice) : null,
      currency: course.currency,
      duration: course.duration,
      level: course.level.toLowerCase(),
      rating: course.rating,
      reviewsCount: course._count.reviews,
      studentsCount: course._count.enrollments,
      lessonsCount: course._count.lessons,
      isPopular: course.isPopular,
      isNew: course.isNew,
      colorScheme: course.colorScheme.toLowerCase(),
    }));

    return NextResponse.json({
      courses: transformedCourses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create new course (Admin only)
export async function POST(request: NextRequest) {
  try {
    // TODO: Check if user is admin (via Memberstack)
    // For now, we'll skip auth check

    const body = await request.json();

    // Validate required fields
    const {
      title,
      slug,
      description,
      shortDescription,
      thumbnailUrl,
      categoryId,
      instructorId,
      instructorName,
      price,
      duration,
    } = body;

    if (!title || !slug || !description || !categoryId || !instructorId || !instructorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDescription: shortDescription || description.substring(0, 150),
        thumbnailUrl: thumbnailUrl || '',
        videoIntroUrl: body.videoIntroUrl || null,
        categoryId,
        instructorId,
        instructorName,
        instructorAvatar: body.instructorAvatar || null,
        instructorBio: body.instructorBio || null,
        price: price || 0,
        originalPrice: body.originalPrice || null,
        currency: body.currency || 'USD',
        memberstackPlanId: body.memberstackPlanId || null,
        duration: duration || 0,
        level: body.level || 'BEGINNER',
        tags: body.tags || [],
        whatYouWillLearn: body.whatYouWillLearn || [],
        requirements: body.requirements || [],
        hasCertificate: body.hasCertificate !== false,
        isPaid: body.isPaid !== false,
        isPublished: body.isPublished === true,
        isPopular: body.isPopular === true,
        isNew: body.isNew === true,
        colorScheme: body.colorScheme || 'PURPLE',
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error('Error creating course:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Course with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
