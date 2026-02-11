'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Save, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function AdminCourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const isNew = courseId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    categoryId: '',
    instructorId: '',
    price: 0,
    originalPrice: 0,
    currency: 'USD',
    duration: 0,
    level: 'beginner',
    colorScheme: 'purple',
    isPublished: false,
    isPopular: false,
    isNew: false,
  });

  const [categories, setCategories] = useState<any[]>([]);

  // Load course data for editing
  useEffect(() => {
    async function loadCourse() {
      if (isNew) return;

      try {
        setLoading(true);

        const res = await fetch(`/api/courses/${courseId}`);
        if (!res.ok) throw new Error('Course not found');

        const data = await res.json();
        const course = data.course;

        setFormData({
          title: course.title || '',
          slug: course.slug || '',
          shortDescription: course.shortDescription || '',
          description: course.description || '',
          categoryId: course.categoryId || '',
          instructorId: course.instructorId || '',
          price: course.price || 0,
          originalPrice: course.originalPrice || 0,
          currency: course.currency || 'USD',
          duration: course.duration || 0,
          level: course.level || 'beginner',
          colorScheme: course.colorScheme || 'purple',
          isPublished: course.isPublished || false,
          isPopular: course.isPopular || false,
          isNew: course.isNew || false,
        });
      } catch (error) {
        console.error('Error loading course:', error);
        toast.error('Failed to load course');
        router.push('/admin/courses');
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseId, isNew, router]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        // For MVP, use mock categories
        const { categories: mockCategories } = await import('@/data/courses');
        setCategories(mockCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }

    loadCategories();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (isNew && formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, formData.slug, isNew]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      const url = isNew ? '/api/courses' : `/api/courses/${courseId}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save course');
      }

      const data = await res.json();
      
      toast.success(isNew ? 'Course created successfully!' : 'Course updated successfully!');
      
      setTimeout(() => {
        router.push('/admin/courses');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  // Handle input change
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading course...</p>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft size={18} />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-neutral-dark mb-2">
              {isNew ? 'Create New Course' : 'Edit Course'}
            </h1>
            <p className="text-gray-600">
              {isNew ? 'Fill in the details to create a new course' : 'Update course information'}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? <Spinner size="sm" /> : (
            <>
              <Save size={20} />
              {isNew ? 'Create Course' : 'Save Changes'}
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                placeholder="e.g. Complete Web Development Bootcamp"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none font-mono text-sm"
                placeholder="complete-web-development-bootcamp"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly version of the title (lowercase, hyphens only)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none resize-none"
                rows={2}
                placeholder="Brief one-liner about the course (shown in cards)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none resize-none"
                rows={6}
                placeholder="Detailed description of what students will learn..."
              />
            </div>
          </div>
        </Card>

        {/* Course Details */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Course Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Set to 0 for free courses</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Original Price ($)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">For showing discounts (optional)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                min="0"
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Color Scheme
              </label>
              <select
                value={formData.colorScheme}
                onChange={(e) => handleChange('colorScheme', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
              >
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
                <option value="pink">Pink</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Status & Flags */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Status & Visibility</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => handleChange('isPublished', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              />
              <div>
                <div className="font-semibold">Published</div>
                <div className="text-sm text-gray-600">
                  Make this course visible to students
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => handleChange('isPopular', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              />
              <div>
                <div className="font-semibold">Mark as Popular</div>
                <div className="text-sm text-gray-600">
                  Show "Popular" badge on this course
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => handleChange('isNew', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              />
              <div>
                <div className="font-semibold">Mark as New</div>
                <div className="text-sm text-gray-600">
                  Show "New" badge on this course
                </div>
              </div>
            </label>
          </div>
        </Card>

        {/* Note about lessons */}
        {!isNew && (
          <Card className="bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> To manage lessons for this course, you'll need to use the database
              or create a separate lesson editor. For MVP, lessons can be added via Prisma seed or directly in the database.
            </p>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/courses">
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </Link>
          
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={saving}
          >
            {saving ? <Spinner size="sm" /> : (
              <>
                <Save size={20} />
                {isNew ? 'Create Course' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
