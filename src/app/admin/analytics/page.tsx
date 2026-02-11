'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import {
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  Award,
  Eye,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-dark mb-2">
          Analytics & Insights
        </h1>
        <p className="text-gray-600">Monitor platform performance and user engagement</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            icon: <Users size={24} />,
            label: 'New Users This Month',
            value: '127',
            change: '+12%',
            positive: true,
            color: 'bg-primary-purple',
          },
          {
            icon: <DollarSign size={24} />,
            label: 'Revenue This Month',
            value: '$4,239',
            change: '+23%',
            positive: true,
            color: 'bg-green-500',
          },
          {
            icon: <BookOpen size={24} />,
            label: 'Enrollments This Month',
            value: '342',
            change: '+8%',
            positive: true,
            color: 'bg-accent-orange',
          },
        ].map((stat, index) => (
          <Card key={index}>
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className={`text-sm font-semibold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </div>
            </div>
            <div className="text-3xl font-bold text-neutral-dark mb-1">{stat.value}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Course Performance */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Top Performing Courses</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-3 font-semibold text-gray-700">Course</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Students</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Completion</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Revenue</th>
                <th className="pb-3 font-semibold text-gray-700 text-center">Rating</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'Creative Writing',
                  students: 1234,
                  completion: 67,
                  revenue: 24680,
                  rating: 4.8,
                },
                {
                  name: 'Digital Illustration',
                  students: 987,
                  completion: 72,
                  revenue: 19740,
                  rating: 4.9,
                },
                {
                  name: 'Public Speaking',
                  students: 856,
                  completion: 58,
                  revenue: 17120,
                  rating: 4.7,
                },
              ].map((course, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-4 font-semibold">{course.name}</td>
                  <td className="py-4 text-center">{course.students.toLocaleString()}</td>
                  <td className="py-4 text-center">{course.completion}%</td>
                  <td className="py-4 text-center text-green-600 font-semibold">
                    ${course.revenue.toLocaleString()}
                  </td>
                  <td className="py-4 text-center">⭐ {course.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* User Engagement */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">User Engagement</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <Eye className="text-primary-600" size={20} />
                <span className="font-semibold">Active Users (30 days)</span>
              </div>
              <span className="text-2xl font-bold text-neutral-dark">2,847</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-accent-orange" size={20} />
                <span className="font-semibold">Avg. Session Duration</span>
              </div>
              <span className="text-2xl font-bold text-neutral-dark">42m</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Award className="text-accent-yellow" size={20} />
                <span className="font-semibold">Completion Rate</span>
              </div>
              <span className="text-2xl font-bold text-neutral-dark">64%</span>
            </div>
          </div>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Revenue Breakdown</h2>
          <div className="space-y-4">
            {[
              { category: 'Creative', amount: 12340, percentage: 35 },
              { category: 'Communication', amount: 9870, percentage: 28 },
              { category: 'Computer Science', amount: 8760, percentage: 25 },
              { category: 'Other', amount: 4230, percentage: 12 },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{item.category}</span>
                  <span className="text-green-600 font-bold">${item.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
