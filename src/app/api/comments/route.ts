// API Route: GET /POST /api/comments
// Get or create lesson comments

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/comments?lessonId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID required' },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        lessonId,
        parentId: null, // Top-level comments only
      },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      comments: comments.map((comment) => ({
        id: comment.id,
        userId: comment.userId,
        userName: comment.userName,
        userAvatar: comment.userAvatar,
        content: comment.content,
        isEdited: comment.isEdited,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        replies: comment.replies.map((reply) => ({
          id: reply.id,
          userId: reply.userId,
          userName: reply.userName,
          userAvatar: reply.userAvatar,
          content: reply.content,
          isEdited: reply.isEdited,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
        })),
      })),
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userAvatar, lessonId, content, parentId } = body;

    if (!userId || !lessonId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        userName: userName || 'Anonymous',
        userAvatar,
        lessonId,
        content,
        parentId: parentId || null,
      },
    });

    return NextResponse.json({
      message: 'Comment posted successfully',
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
