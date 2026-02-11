// SendGrid Email Service

import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'hello@learnify.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Learnify Platform';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send generic email
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured. Email not sent:', { to, subject });
    return;
  }

  try {
    await sgMail.send({
      to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
  const subject = `Welcome to ${FROM_NAME}! 🎓`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2d2d2d; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #b4a0d8 0%, #8b5cf6 100%); padding: 40px; text-align: center; border-radius: 12px; }
          .header h1 { color: white; margin: 0; font-size: 32px; }
          .content { padding: 30px 20px; background: #faf8f5; border-radius: 12px; margin-top: 20px; }
          .button { display: inline-block; padding: 14px 28px; background: #ff5722; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Learnify!</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName}! 👋</h2>
            <p>We're excited to have you on board! You're now part of a community of learners passionate about gaining new skills.</p>
            <p>Here's what you can do next:</p>
            <ul>
              <li>📚 Browse our catalog of 100+ courses</li>
              <li>🎯 Set your learning goals</li>
              <li>🏆 Earn certificates for completed courses</li>
              <li>💬 Engage with instructors and fellow learners</li>
            </ul>
            <a href="${APP_URL}/courses" class="button">Explore Courses</a>
          </div>
          <div class="footer">
            <p>Need help? Reply to this email or visit our <a href="${APP_URL}/faq">FAQ page</a></p>
            <p>&copy; ${new Date().getFullYear()} Learnify. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html });
}

/**
 * Send course enrollment confirmation email
 */
export async function sendEnrollmentEmail(
  userEmail: string,
  userName: string,
  courseName: string,
  courseSlug: string
): Promise<void> {
  const subject = `You're enrolled in ${courseName}! 🎉`;
  const courseUrl = `${APP_URL}/courses/${courseSlug}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2d2d2d; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff5722 0%, #ffc107 100%); padding: 40px; text-align: center; border-radius: 12px; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { padding: 30px 20px; background: #faf8f5; border-radius: 12px; margin-top: 20px; }
          .button { display: inline-block; padding: 14px 28px; background: #ff5722; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; margin-top: 20px; }
          .course-box { background: white; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Enrollment Confirmed! 🎓</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName}!</h2>
            <p>Great news! You're now enrolled in:</p>
            <div class="course-box">
              <h3 style="margin-top: 0; color: #8b5cf6;">${courseName}</h3>
              <p>Start learning at your own pace and earn your certificate upon completion.</p>
            </div>
            <p><strong>What's next?</strong></p>
            <ul>
              <li>Access all course lessons immediately</li>
              <li>Track your progress in the dashboard</li>
              <li>Engage with course materials and comments</li>
              <li>Earn your certificate when you complete the course</li>
            </ul>
            <a href="${courseUrl}" class="button">Start Learning</a>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
            <p>View your dashboard: <a href="${APP_URL}/dashboard">My Courses</a></p>
            <p>&copy; ${new Date().getFullYear()} Learnify. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html });
}

/**
 * Send payment receipt email
 */
export async function sendPaymentReceiptEmail(
  userEmail: string,
  userName: string,
  courseName: string,
  amount: number,
  currency: string = 'USD'
): Promise<void> {
  const subject = `Payment Received - ${courseName}`;
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2d2d2d; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2d2d2d; padding: 30px; text-align: center; border-radius: 12px; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px 20px; background: #faf8f5; border-radius: 12px; margin-top: 20px; }
          .receipt-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-size: 20px; font-weight: bold; color: #8b5cf6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Receipt 💳</h1>
          </div>
          <div class="content">
            <h2>Thank you for your purchase, ${userName}!</h2>
            <p>Your payment has been successfully processed.</p>
            <div class="receipt-box">
              <div class="receipt-row">
                <span>Course:</span>
                <span><strong>${courseName}</strong></span>
              </div>
              <div class="receipt-row">
                <span>Amount:</span>
                <span class="total">${formattedAmount}</span>
              </div>
              <div class="receipt-row">
                <span>Date:</span>
                <span>${new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <p>You now have lifetime access to this course.</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
            <p>Questions? Contact us at ${FROM_EMAIL}</p>
            <p>&copy; ${new Date().getFullYear()} Learnify. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html });
}

/**
 * Send certificate earned email
 */
export async function sendCertificateEmail(
  userEmail: string,
  userName: string,
  courseName: string,
  certificateId: string
): Promise<void> {
  const subject = `🎉 Your Certificate is Ready!`;
  const certificateUrl = `${APP_URL}/certificates/${certificateId}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2d2d2d; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ffc107 0%, #ff6b9d 100%); padding: 40px; text-align: center; border-radius: 12px; }
          .header h1 { color: white; margin: 0; font-size: 32px; }
          .trophy { font-size: 64px; margin: 20px 0; }
          .content { padding: 30px 20px; background: #faf8f5; border-radius: 12px; margin-top: 20px; text-align: center; }
          .button { display: inline-block; padding: 14px 28px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; margin-top: 20px; }
          .share-buttons { margin-top: 20px; }
          .share-buttons a { display: inline-block; margin: 0 10px; color: #8b5cf6; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="trophy">🏆</div>
            <h1>Congratulations!</h1>
          </div>
          <div class="content">
            <h2>You Did It, ${userName}!</h2>
            <p>You've successfully completed <strong>${courseName}</strong> and earned your certificate!</p>
            <p>This is a significant achievement. You've demonstrated dedication and acquired valuable skills.</p>
            <a href="${certificateUrl}" class="button">View Certificate</a>
            <div class="share-buttons">
              <p><strong>Share your achievement:</strong></p>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}">LinkedIn</a> |
              <a href="https://twitter.com/intent/tweet?text=I%20just%20completed%20${encodeURIComponent(courseName)}%20on%20Learnify!&url=${encodeURIComponent(certificateUrl)}">Twitter</a> |
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateUrl)}">Facebook</a>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
            <p>Keep learning: <a href="${APP_URL}/courses">Explore more courses</a></p>
            <p>&copy; ${new Date().getFullYear()} Learnify. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  userEmail: string,
  resetToken: string
): Promise<void> {
  const subject = 'Reset Your Password';
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2d2d2d; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { padding: 30px 20px; background: #faf8f5; border-radius: 12px; }
          .button { display: inline-block; padding: 14px 28px; background: #ff5722; color: white; text-decoration: none; border-radius: 25px; font-weight: bold; margin-top: 20px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password for your Learnify account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong></p>
              <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
            </div>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
            <p>Need help? Contact ${FROM_EMAIL}</p>
            <p>&copy; ${new Date().getFullYear()} Learnify. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({ to: userEmail, subject, html });
}
