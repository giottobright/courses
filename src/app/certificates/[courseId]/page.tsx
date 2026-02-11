'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, Share2, Award, CheckCircle2, Home } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { courses } from '@/data/courses';

const mockUser = {
  name: 'Alex Johnson',
  completionDate: 'March 20, 2024',
};

export default function CertificatePage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Certificate not found</h1>
          <Link href="/dashboard">
            <Button className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const certificateId = `CERT-${courseId}-${Date.now().toString().slice(-6)}`;

  const handleDownload = async () => {
    try {
      const { generateCertificatePDF } = await import('@/lib/certificate');
      await generateCertificatePDF('certificate', {
        userName: mockUser.name,
        courseName: course.title,
        instructorName: course.instructor.name,
        completionDate: mockUser.completionDate,
        duration: course.duration,
        certificateId,
      });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      const { shareCertificate } = await import('@/lib/certificate');
      await shareCertificate(window.location.href, course.title);
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-cream">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-primary text-white py-12">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Award size={40} className="text-accent-yellow" />
            </div>
            <h1 className="text-5xl font-display font-bold mb-4">
              Congratulations! 🎉
            </h1>
            <p className="text-xl text-white/90">
              You've successfully completed the course
            </p>
          </motion.div>
        </div>
      </section>

      {/* Certificate */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Certificate Card */}
            <div id="certificate">
              <Card className="mb-8 p-0 overflow-hidden">
                <div className="relative bg-gradient-to-br from-primary-50 via-white to-accent-yellow/10 p-8 md:p-16">
                  {/* Decorative corners */}
                  <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-accent-orange rounded-tl-2xl"></div>
                  <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-accent-orange rounded-tr-2xl"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-accent-orange rounded-bl-2xl"></div>
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-accent-orange rounded-br-2xl"></div>

                  <div className="text-center relative z-10">
                    {/* Logo */}
                    <div className="mb-6">
                      <div className="text-3xl font-display font-bold">
                        Learn<span className="text-accent-orange">ify</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-dark mb-8">
                      Certificate of Completion
                    </h2>

                    {/* Divider */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="h-px w-24 bg-accent-orange"></div>
                      <Award className="text-accent-orange" size={32} />
                      <div className="h-px w-24 bg-accent-orange"></div>
                    </div>

                    {/* Recipient */}
                    <div className="mb-8">
                      <p className="text-gray-600 text-lg mb-2">This is to certify that</p>
                      <h3 className="text-4xl font-display font-bold text-neutral-dark mb-6">
                        {mockUser.name}
                      </h3>
                      <p className="text-gray-600 text-lg mb-2">has successfully completed</p>
                      <h4 className="text-3xl font-display font-bold text-primary-700 mb-6">
                        {course.title}
                      </h4>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Completion Date</p>
                        <p className="font-semibold text-neutral-dark">{mockUser.completionDate}</p>
                      </div>
                      <div className="hidden md:block w-px h-12 bg-gray-300"></div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Course Duration</p>
                        <p className="font-semibold text-neutral-dark">{course.duration}</p>
                      </div>
                      <div className="hidden md:block w-px h-12 bg-gray-300"></div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Certificate ID</p>
                        <p className="font-semibold text-neutral-dark font-mono text-sm">{certificateId}</p>
                      </div>
                    </div>

                    {/* Instructor Signature */}
                    <div className="flex items-center justify-center gap-12 mb-8">
                      <div className="text-center">
                        <div className="mb-2 border-t-2 border-neutral-dark pt-2 px-8">
                          <p className="font-bold text-neutral-dark">{course.instructor.name}</p>
                        </div>
                        <p className="text-sm text-gray-600">Instructor</p>
                      </div>
                    </div>

                    {/* Verification */}
                    <div className="bg-white/50 rounded-xl p-4 inline-block">
                      <p className="text-xs text-gray-600">
                        Verify this certificate at: <span className="font-mono font-semibold text-primary-600">learnify.com/verify/{certificateId}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleDownload}
              >
                <Download size={20} />
                Download Certificate
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleShare}
              >
                <Share2 size={20} />
                Share
              </Button>
            </div>

            {/* Success Message */}
            <Card className="bg-green-50 border-2 border-green-200">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">What's Next?</h3>
                  <p className="text-gray-700 mb-4">
                    Great job completing this course! Ready to continue your learning journey?
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        <Home size={16} />
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Link href="/courses">
                      <Button variant="primary" size="sm">
                        Explore More Courses
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
