// API Route: DELETE /api/wishlist/[courseId]
// Remove course from wishlist

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    await prisma.wishlist.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return NextResponse.json({
      message: 'Course removed from wishlist',
    });
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
