'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Save, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { LessonsList } from '@/components/admin/LessonsList';
import { LessonForm } from '@/components/admin/LessonForm';

export default function AdminCourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const isNew = courseId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Lessons state
  const [lessons, setLessons] = useState<any[]>([]);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    thumbnailUrl: '',
    videoIntroUrl: '',
    categoryId: '',
    instructorId: '',
    instructorName: '',
    instructorAvatar: '',
    instructorBio: '',
    price: 0,
    originalPrice: 0,
    currency: 'USD',
    memberstackPlanId: '',
    duration: 0,
    level: 'beginner',
    tags: [] as string[],
    whatYouWillLearn: [] as string[],
    requirements: [] as string[],
    hasCertificate: true,
    isPaid: true,
    colorScheme: 'purple',
    isPublished: false,
    isPopular: false,
    isNew: false,
  });

  const [categories, setCategories] = useState<any[]>([]);

  // Load lessons
  const loadLessons = async () => {
    if (isNew) return;

    try {
      const res = await fetch(`/api/courses/${courseId}/lessons`);
      if (!res.ok) throw new Error('Failed to load lessons');

      const data = await res.json();
      setLessons(data.lessons || []);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

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
          thumbnailUrl: course.thumbnailUrl || '',
          videoIntroUrl: course.videoIntroUrl || '',
          categoryId: course.categoryId || '',
          instructorId: course.instructorId || '',
          instructorName: course.instructorName || '',
          instructorAvatar: course.instructorAvatar || '',
          instructorBio: course.instructorBio || '',
          price: course.price || 0,
          originalPrice: course.originalPrice || 0,
          currency: course.currency || 'USD',
          memberstackPlanId: course.memberstackPlanId || '',
          duration: course.duration || 0,
          level: course.level || 'beginner',
          tags: course.tags || [],
          whatYouWillLearn: course.whatYouWillLearn || [],
          requirements: course.requirements || [],
          hasCertificate: course.hasCertificate !== false,
          isPaid: course.isPaid !== false,
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
    loadLessons();
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

    if (!formData.title || !formData.slug || !formData.categoryId || 
        !formData.thumbnailUrl || !formData.instructorId || !formData.instructorName) {
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

  // Lesson handlers
  const handleCreateLesson = () => {
    setEditingLesson(null);
    setShowLessonForm(true);
  };

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setShowLessonForm(true);
  };

  const handleLessonSaved = () => {
    setShowLessonForm(false);
    setEditingLesson(null);
    loadLessons();
  };

  const handleCancelLessonForm = () => {
    setShowLessonForm(false);
    setEditingLesson(null);
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

        {/* Media */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Media</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Thumbnail URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                placeholder="https://example.com/thumbnail.jpg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Course cover image URL (recommended: 1200x630px)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Video Intro URL
              </label>
              <input
                type="url"
                value={formData.videoIntroUrl}
                onChange={(e) => handleChange('videoIntroUrl', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                placeholder="https://vimeo.com/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Promotional video URL (Vimeo or YouTube)
              </p>
            </div>
          </div>
        </Card>

        {/* Instructor Info */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Instructor Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Instructor ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.instructorId}
                onChange={(e) => handleChange('instructorId', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                placeholder="memberstack_user_id"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Memberstack user ID of the instructor
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Instructor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.instructorName}
                onChange={(e) => handleChange('instructorName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Instructor Avatar URL
              </label>
              <input
                type="url"
                value={formData.instructorAvatar}
                onChange={(e) => handleChange('instructorAvatar', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Instructor Bio
              </label>
              <textarea
                value={formData.instructorBio}
                onChange={(e) => handleChange('instructorBio', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none resize-none"
                rows={3}
                placeholder="Brief bio about the instructor..."
              />
            </div>
          </div>
        </Card>

        {/* Course Content */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Course Content</h2>

          <div className="space-y-6">
            {/* What You Will Learn */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                What You Will Learn
              </label>
              <div className="space-y-2">
                {formData.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...formData.whatYouWillLearn];
                        newItems[index] = e.target.value;
                        handleChange('whatYouWillLearn', newItems);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                      placeholder="e.g., Build full-stack applications"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newItems = formData.whatYouWillLearn.filter((_, i) => i !== index);
                        handleChange('whatYouWillLearn', newItems);
                      }}
                      className="text-red-600"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleChange('whatYouWillLearn', [...formData.whatYouWillLearn, '']);
                  }}
                >
                  + Add Learning Objective
                </Button>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Requirements
              </label>
              <div className="space-y-2">
                {formData.requirements.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...formData.requirements];
                        newItems[index] = e.target.value;
                        handleChange('requirements', newItems);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                      placeholder="e.g., Basic HTML/CSS knowledge"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newItems = formData.requirements.filter((_, i) => i !== index);
                        handleChange('requirements', newItems);
                      }}
                      className="text-red-600"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleChange('requirements', [...formData.requirements, '']);
                  }}
                >
                  + Add Requirement
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = formData.tags.filter((_, i) => i !== index);
                          handleChange('tags', newTags);
                        }}
                        className="hover:text-primary-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="tag-input"
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                    placeholder="Type a tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const value = input.value.trim();
                        if (value && !formData.tags.includes(value)) {
                          handleChange('tags', [...formData.tags, value]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Press Enter to add tags (e.g., react, javascript, frontend)
                </p>
              </div>
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

            <div>
              <label className="block text-sm font-semibold mb-2">
                Memberstack Plan ID
              </label>
              <input
                type="text"
                value={formData.memberstackPlanId}
                onChange={(e) => handleChange('memberstackPlanId', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                placeholder="pln_..."
              />
              <p className="text-xs text-gray-500 mt-1">
                For paid courses: Memberstack plan ID for subscriptions
              </p>
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
                checked={formData.isPaid}
                onChange={(e) => handleChange('isPaid', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              />
              <div>
                <div className="font-semibold">Paid Course</div>
                <div className="text-sm text-gray-600">
                  Require payment to access this course
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasCertificate}
                onChange={(e) => handleChange('hasCertificate', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              />
              <div>
                <div className="font-semibold">Award Certificate</div>
                <div className="text-sm text-gray-600">
                  Issue certificate upon course completion
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

        {/* Lessons Management */}
        {!isNew && (
          <>
            {showLessonForm ? (
              <LessonForm
                courseId={courseId}
                lesson={editingLesson}
                nextOrder={lessons.length + 1}
                onSave={handleLessonSaved}
                onCancel={handleCancelLessonForm}
              />
            ) : (
              <LessonsList
                courseId={courseId}
                lessons={lessons}
                onLessonsChange={loadLessons}
                onEditLesson={handleEditLesson}
                onCreateLesson={handleCreateLesson}
              />
            )}
          </>
        )}

        {isNew && (
          <Card className="bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Save the course first to add lessons
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
