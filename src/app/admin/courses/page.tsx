'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Users,
  DollarSign,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load courses
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        
        const res = await fetch('/api/courses');
        if (!res.ok) throw new Error('Failed to load courses');

        const data = await res.json();
        setCourses(data.courses || []);
        setFilteredCourses(data.courses || []);
      } catch (error) {
        console.error('Error loading courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  // Filter courses
  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((course) =>
        statusFilter === 'published' ? course.isPublished : !course.isPublished
      );
    }

    setFilteredCourses(filtered);
  }, [searchQuery, statusFilter, courses]);

  // Delete course
  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(courseId);

      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete course');

      setCourses(prev => prev.filter(c => c.id !== courseId));
      toast.success('Course deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (course: any) => {
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublished: !course.isPublished,
        }),
      });

      if (!res.ok) throw new Error('Failed to update course');

      setCourses(prev =>
        prev.map(c => c.id === course.id ? { ...c, isPublished: !c.isPublished } : c)
      );

      toast.success(
        course.isPublished
          ? 'Course unpublished'
          : 'Course published successfully'
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to update course');
    }
  };

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-dark mb-2">
            Courses Management
          </h1>
          <p className="text-gray-600">{courses.length} total courses</p>
        </div>

        <Link href="/admin/courses/new">
          <Button variant="primary" size="lg">
            <Plus size={20} />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-3 rounded-xl font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({courses.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-4 py-3 rounded-xl font-semibold transition-colors ${
                statusFilter === 'published'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Published ({courses.filter(c => c.isPublished).length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-4 py-3 rounded-xl font-semibold transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Drafts ({courses.filter(c => !c.isPublished).length})
            </button>
          </div>
        </div>
      </Card>

      {/* Courses List */}
      {loading ? (
        <div className="text-center py-16">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="space-y-4">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-center gap-6">
                  {/* Course Thumbnail */}
                  <div
                    className="w-32 h-20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: course.category?.color + '20' }}
                  >
                    {course.category?.icon || '📚'}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold truncate">{course.title}</h3>
                      {course.isPublished ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge className="bg-gray-200 text-gray-700">Draft</Badge>
                      )}
                      {course.isNew && <Badge variant="info">New</Badge>}
                      {course.isPopular && <Badge variant="warning">Popular</Badge>}
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-1 mb-3">
                      {course.shortDescription}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{course.studentsCount || 0} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        <span>{course.price > 0 ? `$${course.price}` : 'Free'}</span>
                      </div>
                      <span>•</span>
                      <span>{course.lessonsCount || 0} lessons</span>
                      <span>•</span>
                      <span className="capitalize">{course.level}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/courses/${course.slug}`} target="_blank">
                      <Button variant="outline" size="sm" title="View Course">
                        <Eye size={18} />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(course)}
                      title={course.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {course.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>

                    <Link href={`/admin/courses/${course.id}`}>
                      <Button variant="outline" size="sm" title="Edit">
                        <Edit size={18} />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                      disabled={deletingId === course.id}
                      className="text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      {deletingId === course.id ? (
                        <Spinner size="sm" className="border-red-600 border-r-transparent" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-display font-bold mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first course to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Link href="/admin/courses/new">
                <Button variant="primary" size="lg">
                  <Plus size={20} />
                  Create Course
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
