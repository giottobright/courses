// API Route: GET /api/certificates/verify?code=XXX
// Verify certificate by verification code

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code required' },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: { verificationCode: code },
    });

    if (!certificate) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid verification code',
      });
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        userName: certificate.userName,
        courseName: certificate.courseName,
        instructorName: certificate.instructorName,
        certificateNumber: certificate.certificateNumber,
        issuedAt: certificate.issuedAt,
      },
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return NextResponse.json(
      { error: 'Failed to verify certificate' },
      { status: 500 }
    );
  }
}
