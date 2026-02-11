// Certificate generation utilities
// This module handles PDF certificate generation using jsPDF and html2canvas

export interface CertificateData {
  userName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  duration: string;
  certificateId: string;
}

/**
 * Generate a PDF certificate from an HTML element
 * Requires jsPDF and html2canvas to be installed
 * 
 * @param elementId - The ID of the HTML element to convert to PDF
 * @param certificateData - Data to include in the certificate
 * @returns Promise<void>
 */
export async function generateCertificatePDF(
  elementId: string,
  certificateData: CertificateData
): Promise<void> {
  try {
    // Dynamic imports to keep bundle size small
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    // Get the certificate element
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Certificate element not found');
    }

    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Download the PDF
    const fileName = `Learnify_Certificate_${certificateData.courseName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);

    console.log('Certificate PDF generated successfully');
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    throw error;
  }
}

/**
 * Generate a unique certificate ID
 * @param courseId - The course ID
 * @param userId - The user ID
 * @returns A unique certificate ID
 */
export function generateCertificateId(courseId: string, userId?: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  const userPart = userId ? userId.substring(0, 4) : 'ANON';
  
  return `LEARN-${courseId}-${userPart}-${timestamp}-${random}`.toUpperCase();
}

/**
 * Share certificate on social media
 * @param certificateUrl - URL of the certificate
 * @param courseName - Name of the completed course
 */
export async function shareCertificate(
  certificateUrl: string,
  courseName: string
): Promise<void> {
  const shareData = {
    title: `I completed ${courseName}!`,
    text: `I just earned my certificate for ${courseName} on Learnify! 🎓`,
    url: certificateUrl,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(certificateUrl);
      alert('Certificate link copied to clipboard!');
    }
  } catch (error) {
    console.error('Error sharing certificate:', error);
  }
}

/**
 * Verify a certificate by its ID
 * In production, this would call an API endpoint
 * @param certificateId - The certificate ID to verify
 * @returns Promise with verification status
 */
export async function verifyCertificate(certificateId: string): Promise<{
  isValid: boolean;
  data?: CertificateData;
}> {
  // In production, this would be an API call
  // For now, return mock data
  return {
    isValid: true,
    data: {
      userName: 'Alex Johnson',
      courseName: 'Creative Writing for Beginners',
      instructorName: 'Emma Thompson',
      completionDate: new Date().toLocaleDateString(),
      duration: '3.5 hours',
      certificateId,
    },
  };
}
