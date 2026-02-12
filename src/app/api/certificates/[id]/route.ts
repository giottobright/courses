// API Route: GET /api/certificates/[id]
// Get certificate details

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const certificate = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: certificate.id,
      userName: certificate.userName,
      courseName: certificate.courseName,
      instructorName: certificate.instructorName,
      certificateNumber: certificate.certificateNumber,
      verificationCode: certificate.verificationCode,
      issuedAt: certificate.issuedAt,
      pdfUrl: certificate.pdfUrl,
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}
