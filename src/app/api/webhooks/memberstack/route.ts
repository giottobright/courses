// Memberstack Webhook Handler
// Handles events from Memberstack (including Stripe payments processed through Memberstack)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  sendEnrollmentEmail, 
  sendPaymentReceiptEmail 
} from '@/lib/email';

// Memberstack sends webhooks for various events
// Events we care about:
// - member.plan.purchased - When a user purchases a plan (course)
// - member.plan.cancelled - When a plan is cancelled
// - member.plan.updated - When a plan is updated

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body;

    console.log('Memberstack webhook received:', event.type);

    // Verify webhook signature (in production)
    const webhookSecret = process.env.MEMBERSTACK_WEBHOOK_SECRET;
    if (webhookSecret) {
      // Memberstack sends signature in headers
      const signature = request.headers.get('x-memberstack-signature');
      
      // Verify signature here (Memberstack provides verification method)
      // For now, we'll skip verification in development
      if (!signature) {
        console.warn('No Memberstack signature found');
      }
    }

    // Handle different event types
    switch (event.type) {
      case 'member.plan.purchased':
        await handlePlanPurchased(event.data);
        break;

      case 'member.plan.cancelled':
        await handlePlanCancelled(event.data);
        break;

      case 'member.plan.updated':
        await handlePlanUpdated(event.data);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Memberstack webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle plan purchased event
async function handlePlanPurchased(data: any) {
  try {
    const { memberId, planId, planConnectionId, metadata } = data;
    const courseId = metadata?.courseId;

    if (!courseId) {
      console.error('No courseId in plan purchase metadata');
      return;
    }

    // Get member data
    const memberEmail = data.member?.email || data.email;
    const memberName = data.member?.name || data.member?.customFields?.name || 'User';

    // Create enrollment in database
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: memberId,
        userName: memberName,
        userEmail: memberEmail,
        courseId: courseId,
        enrolledAt: new Date(),
        progress: 0,
        planConnectionId: planConnectionId,
      },
      include: {
        course: {
          include: {
            category: true,
          },
        },
      },
    });

    // Get course for payment record
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (course) {
      // Create payment record
      await prisma.payment.create({
        data: {
          userId: memberId,
          courseId: courseId,
          amount: course.price,
          currency: course.currency,
          status: 'COMPLETED',
          memberstackPlanId: planId,
          planConnectionId: planConnectionId,
          completedAt: new Date(),
        },
      });

      // Update course student count
      await prisma.course.update({
        where: { id: courseId },
        data: {
          studentsCount: {
            increment: 1,
          },
        },
      });

      // Send emails
      if (memberEmail && course) {
        try {
          await sendEnrollmentEmail(memberEmail, memberName, course.title, course.slug);
        } catch (emailError) {
          console.error('Failed to send enrollment email:', emailError);
        }
      }
    }

    console.log('Plan purchased processed:', {
      memberId,
      courseId,
      planConnectionId,
    });
  } catch (error) {
    console.error('Error handling plan purchased:', error);
    throw error;
  }
}

// Handle plan cancelled event
async function handlePlanCancelled(data: any) {
  try {
    const { memberId, planConnectionId } = data;

    // Find enrollment by planConnectionId
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: memberId,
        planConnectionId: planConnectionId,
      },
    });

    if (enrollment) {
      // Update enrollment status or mark as cancelled
      // For now, we'll just update lastAccessedAt
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          lastAccessedAt: new Date(),
          // In future, add cancelledAt field to schema
        },
      });

      console.log('Plan cancelled processed:', {
        memberId,
        planConnectionId,
        enrollmentId: enrollment.id,
      });
    }
  } catch (error) {
    console.error('Error handling plan cancelled:', error);
    throw error;
  }
}

// Handle plan updated event
async function handlePlanUpdated(data: any) {
  try {
    const { memberId, planConnectionId, status } = data;

    console.log('Plan updated:', {
      memberId,
      planConnectionId,
      status,
    });

    // Handle any plan updates if needed
    // For example, if status changes from ACTIVE to CANCELLED
  } catch (error) {
    console.error('Error handling plan updated:', error);
    throw error;
  }
}

// GET method to test webhook endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Memberstack webhook endpoint',
    status: 'active',
  });
}
