'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, Award, Clock, TrendingUp, Play, 
  CheckCircle2, BarChart3, Target 
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/lib/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

interface Enrollment {
  id: string;
  progress: number;
  completedLessonsCount: number;
  currentLessonId: string | null;
  lastAccessedAt: string;
  course: any;
}

interface Stats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalHours: number;
  completedHours: number;
  certificatesEarned: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from API
  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch enrollments and progress in parallel
        const [enrollmentsRes, progressRes] = await Promise.all([
          fetch(`/api/enrollments?userId=${user.id}`),
          fetch(`/api/progress?userId=${user.id}`),
        ]);

        if (enrollmentsRes.ok) {
          const data = await enrollmentsRes.json();
          setEnrollments(data.enrollments || []);
        }

        if (progressRes.ok) {
          const data = await progressRes.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  // Loading state
  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-neutral-cream">
        <Navbar />
        <div className="container-custom py-16">
          <DashboardSkeleton />
        </div>
        <Footer />
      </main>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <main className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Please log in</h2>
          <Link href="/login">
            <Button variant="primary">Go to Login</Button>
          </Link>
        </div>
      </main>
    );
  }

  const completedEnrollments = enrollments.filter(e => e.progress === 100);
  const inProgressEnrollments = enrollments.filter(e => e.progress > 0 && e.progress < 100);

  return (
    <main className="min-h-screen bg-neutral-cream">
      <Toaster position="top-right" />
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-primary text-white py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                {user.avatar || '👤'}
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold mb-2">
                  Welcome back, {user.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-white/90">Ready to continue your learning journey?</p>
              </div>
            </div>
            <Link href="/courses">
              <Button variant="primary" size="lg" className="bg-white text-neutral-dark hover:bg-neutral-cream">
                Browse Courses
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="container-custom -mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <BookOpen size={24} />, label: 'Enrolled Courses', value: stats?.totalCourses || 0, color: 'bg-primary-purple' },
            { icon: <Award size={24} />, label: 'Certificates', value: stats?.certificatesEarned || 0, color: 'bg-accent-orange' },
            { icon: <Clock size={24} />, label: 'Learning Hours', value: stats?.completedHours || 0, color: 'bg-accent-yellow' },
            { icon: <TrendingUp size={24} />, label: 'Completed', value: stats?.completedCourses || 0, color: 'bg-accent-pink' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <div className={`${stat.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-neutral-dark mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="container-custom pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Courses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            {inProgressEnrollments.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-display font-bold">Continue Learning</h2>
                  <Link href="/courses" className="text-accent-orange hover:text-accent-orange-light font-semibold">
                    View all →
                  </Link>
                </div>

                <div className="space-y-4">
                  {inProgressEnrollments.map((enrollment, index) => {
                    const course = enrollment.course;
                    const nextLesson = course.totalLessons > enrollment.completedLessonsCount 
                      ? enrollment.currentLessonId 
                      : null;

                    return (
                      <motion.div
                        key={enrollment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card hover>
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Course Thumbnail */}
                            <div 
                              className="md:w-48 h-32 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                              style={{ backgroundColor: course.category.color + '20' }}
                            >
                              {course.category.icon}
                            </div>

                            {/* Course Info */}
                            <div className="flex-1">
                              <div className="mb-3">
                                <Badge style={{ backgroundColor: course.category.color + '20', color: course.category.color }}>
                                  {course.category.name}
                                </Badge>
                              </div>

                              <h3 className="text-xl font-display font-bold mb-2">
                                {course.title}
                              </h3>

                              <p className="text-gray-600 text-sm mb-4">
                                {enrollment.completedLessonsCount} of {course.totalLessons} lessons completed
                              </p>

                              <ProgressBar progress={enrollment.progress} showLabel={true} color="orange" />

                              <div className="mt-4 flex flex-wrap gap-3">
                                {nextLesson && (
                                  <Link href={`/learn/${course.slug}/${nextLesson}`}>
                                    <Button variant="primary" size="sm">
                                      <Play size={16} />
                                      Continue
                                    </Button>
                                  </Link>
                                )}
                                <Link href={`/courses/${course.slug}`}>
                                  <Button variant="outline" size="sm">
                                    View Course
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-display font-bold mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-6">Start learning by enrolling in a course</p>
                <Link href="/courses">
                  <Button variant="primary">Explore Courses</Button>
                </Link>
              </div>
            )}

            {/* Completed Courses */}
            {completedEnrollments.length > 0 && (
              <div>
                <h2 className="text-3xl font-display font-bold mb-6">Completed Courses</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {completedEnrollments.map((enrollment, index) => (
                    <motion.div
                      key={enrollment.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/certificates/${enrollment.course.id}`}>
                        <Card hover>
                          <div className="flex items-center gap-3 mb-3">
                            <CheckCircle2 className="text-green-600" size={24} />
                            <Badge variant="success">Completed</Badge>
                          </div>
                          <h4 className="font-display font-bold mb-2">{enrollment.course.title}</h4>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Certificate available</span>
                            <Award size={16} className="text-accent-orange" />
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Learning Goals */}
            {stats && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="text-accent-orange" size={24} />
                  <h3 className="text-xl font-display font-bold">Learning Progress</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">Lessons Completed</span>
                      <span className="text-gray-600">{stats.completedLessons}/{stats.totalLessons}</span>
                    </div>
                    <ProgressBar 
                      progress={stats.totalLessons > 0 ? (stats.completedLessons / stats.totalLessons) * 100 : 0} 
                      showLabel={false} 
                      color="primary" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">Learning Hours</span>
                      <span className="text-gray-600">{stats.completedHours}/{stats.totalHours}</span>
                    </div>
                    <ProgressBar 
                      progress={stats.totalHours > 0 ? (stats.completedHours / stats.totalHours) * 100 : 0}
                      showLabel={false} 
                      color="orange" 
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Learning Streak (placeholder for future feature) */}
            <Card className="bg-gradient-warm text-white">
              <h3 className="text-xl font-display font-bold mb-4">🔥 Keep Learning!</h3>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{inProgressEnrollments.length}</div>
                <div className="text-white/90">courses in progress</div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-sm text-white/90">Keep it up! You're doing great.</div>
              </div>
            </Card>

            {/* Certificates */}
            {completedEnrollments.length > 0 && (
              <Card className="bg-primary-purple text-white">
                <h3 className="text-xl font-display font-bold mb-4">Your Certificates</h3>
                <div className="space-y-3">
                  {completedEnrollments.slice(0, 3).map((enrollment) => (
                    <Link key={enrollment.id} href={`/certificates/${enrollment.course.id}`}>
                      <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Award size={16} />
                          <div className="font-semibold text-sm">{enrollment.course.title}</div>
                        </div>
                        <div className="text-white/80 text-xs">View Certificate →</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
