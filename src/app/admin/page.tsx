'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Eye,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import toast, { Toaster } from 'react-hot-toast';

interface DashboardStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  newStudentsThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalEnrollments: number;
  certificatesIssued: number;
  averageRating: number;
  totalReviews: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'review' | 'course' | 'payment';
  message: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        // Fetch platform stats
        // In production, create /api/admin/stats endpoint
        // For MVP, using mock data and aggregating from existing endpoints

        // Get all courses
        const coursesRes = await fetch('/api/courses');
        const coursesData = await coursesRes.json();
        const courses = coursesData.courses || [];

        // Mock stats for MVP
        const mockStats: DashboardStats = {
          totalCourses: courses.length,
          publishedCourses: courses.filter((c: any) => c.isPublished).length,
          draftCourses: courses.filter((c: any) => !c.isPublished).length,
          totalStudents: courses.reduce((sum: number, c: any) => sum + (c.studentsCount || 0), 0),
          newStudentsThisMonth: Math.floor(Math.random() * 50) + 10,
          totalRevenue: courses.reduce((sum: number, c: any) => sum + ((c.price || 0) * (c.studentsCount || 0)), 0),
          revenueThisMonth: Math.floor(Math.random() * 5000) + 1000,
          totalEnrollments: courses.reduce((sum: number, c: any) => sum + (c.studentsCount || 0), 0),
          certificatesIssued: Math.floor(Math.random() * 100) + 50,
          averageRating: courses.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) / courses.length || 0,
          totalReviews: courses.reduce((sum: number, c: any) => sum + (c.reviewsCount || 0), 0),
        };

        setStats(mockStats);
        setRecentCourses(courses.slice(0, 5));

        // Mock recent activity
        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'enrollment',
            message: 'New enrollment in "Creative Writing"',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          },
          {
            id: '2',
            type: 'review',
            message: 'New 5-star review on "Digital Illustration"',
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          },
          {
            id: '3',
            type: 'payment',
            message: 'Payment received: $49.99',
            timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          },
          {
            id: '4',
            type: 'course',
            message: 'Course "Time Management" published',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          },
          {
            id: '5',
            type: 'enrollment',
            message: 'New enrollment in "Excel Mastery"',
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          },
        ];

        setRecentActivity(mockActivity);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-dark mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>

        <Link href="/admin/courses/new">
          <Button variant="primary" size="lg">
            <Plus size={20} />
            New Course
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: <BookOpen size={24} />,
            label: 'Total Courses',
            value: stats.totalCourses,
            subtext: `${stats.publishedCourses} published`,
            color: 'bg-primary-purple',
          },
          {
            icon: <Users size={24} />,
            label: 'Total Students',
            value: stats.totalStudents.toLocaleString(),
            subtext: `+${stats.newStudentsThisMonth} this month`,
            color: 'bg-accent-orange',
          },
          {
            icon: <DollarSign size={24} />,
            label: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            subtext: `$${stats.revenueThisMonth} this month`,
            color: 'bg-green-500',
          },
          {
            icon: <Award size={24} />,
            label: 'Certificates',
            value: stats.certificatesIssued,
            subtext: 'Issued',
            color: 'bg-accent-yellow',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className={`${stat.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-neutral-dark mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</div>
              <div className="text-gray-500 text-xs">{stat.subtext}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Recent Courses</h2>
              <Link href="/admin/courses">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {recentCourses.map((course) => (
                <Link key={course.id} href={`/admin/courses/${course.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: course.category?.color + '20' }}
                    >
                      {course.category?.icon || '📚'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate">{course.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{course.studentsCount || 0} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{course.lessonsCount || 0} lessons</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg text-accent-orange">
                        {course.price > 0 ? `$${course.price}` : 'Free'}
                      </div>
                      {course.isPublished ? (
                        <Badge variant="success" className="text-xs">Published</Badge>
                      ) : (
                        <Badge className="text-xs bg-gray-200 text-gray-700">Draft</Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Platform Stats */}
          <Card className="mt-6">
            <h2 className="text-2xl font-display font-bold mb-6">Platform Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-neutral-dark mb-1">
                  {stats.totalEnrollments}
                </div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-neutral-dark mb-1">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Avg. Rating</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-neutral-dark mb-1">
                  {stats.totalReviews}
                </div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-neutral-dark mb-1">
                  {stats.certificatesIssued}
                </div>
                <div className="text-sm text-gray-600">Certificates</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-2xl font-display font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'enrollment'
                        ? 'bg-primary-100 text-primary-700'
                        : activity.type === 'review'
                        ? 'bg-accent-yellow/20 text-accent-yellow'
                        : activity.type === 'payment'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-accent-orange/20 text-accent-orange'
                    }`}
                  >
                    {activity.type === 'enrollment' && <Users size={16} />}
                    {activity.type === 'review' && <TrendingUp size={16} />}
                    {activity.type === 'payment' && <DollarSign size={16} />}
                    {activity.type === 'course' && <BookOpen size={16} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-dark">{activity.message}</p>
                    <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full mt-6">
                View All Activity
              </Button>
            </Link>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/admin/courses/new">
                <Button variant="outline" className="w-full justify-start">
                  <Plus size={18} />
                  Create New Course
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users size={18} />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp size={18} />
                  View Analytics
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
