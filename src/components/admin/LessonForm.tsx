'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Lesson {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  videoUrl: string;
  duration: number;
  order: number;
  type: string;
  isPreview: boolean;
}

interface LessonFormProps {
  courseId: string;
  lesson?: Lesson | null;
  nextOrder: number;
  onSave: () => void;
  onCancel: () => void;
}

export function LessonForm({
  courseId,
  lesson,
  nextOrder,
  onSave,
  onCancel,
}: LessonFormProps) {
  const isNew = !lesson?.id;
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Lesson>({
    title: '',
    slug: '',
    description: '',
    content: '',
    videoUrl: '',
    duration: 0,
    order: nextOrder,
    type: 'video',
    isPreview: false,
  });

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        slug: lesson.slug || '',
        description: lesson.description || '',
        content: lesson.content || '',
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration || 0,
        order: lesson.order || nextOrder,
        type: lesson.type?.toLowerCase() || 'video',
        isPreview: lesson.isPreview || false,
      });
    }
  }, [lesson, nextOrder]);

  // Auto-generate slug from title
  useEffect(() => {
    if (isNew && formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, formData.slug, isNew]);

  const handleChange = (field: keyof Lesson, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.description || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      const url = isNew
        ? `/api/courses/${courseId}/lessons`
        : `/api/lessons/${lesson?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: formData.type.toUpperCase(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save lesson');
      }

      toast.success(isNew ? 'Lesson created successfully!' : 'Lesson updated successfully!');
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {isNew ? 'Create New Lesson' : 'Edit Lesson'}
        </h2>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X size={18} />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                placeholder="e.g. Introduction to React Hooks"
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
                placeholder="introduction-to-react-hooks"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none resize-none"
              rows={2}
              placeholder="Brief description of the lesson"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none resize-none font-mono text-sm"
              rows={10}
              placeholder="Lesson content (supports Markdown)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You can use Markdown formatting for rich text
            </p>
          </div>
        </div>

        {/* Video & Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => handleChange('videoUrl', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
              placeholder="https://vimeo.com/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Vimeo or YouTube video URL
            </p>
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
              placeholder="15"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => handleChange('order', parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
              min="1"
              placeholder="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Position in course (1, 2, 3...)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Lesson Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
              <option value="mixed">Mixed</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
        </div>

        {/* Options */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPreview}
              onChange={(e) => handleChange('isPreview', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            />
            <div>
              <div className="font-semibold">Free Preview</div>
              <div className="text-sm text-gray-600">
                Allow students to preview this lesson without purchasing the course
              </div>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={saving}
          >
            {saving ? (
              <Spinner size="sm" />
            ) : (
              <>
                <Save size={20} />
                {isNew ? 'Create Lesson' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
