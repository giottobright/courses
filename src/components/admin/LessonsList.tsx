'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Plus, Edit, Trash2, Eye, Video, FileText, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: number;
  order: number;
  type: string;
  isPreview: boolean;
}

interface LessonsListProps {
  courseId: string;
  lessons: Lesson[];
  onLessonsChange: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onCreateLesson: () => void;
}

export function LessonsList({
  courseId,
  lessons,
  onLessonsChange,
  onEditLesson,
  onCreateLesson,
}: LessonsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(lessonId);

      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete lesson');

      toast.success('Lesson deleted successfully');
      onLessonsChange();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete lesson');
    } finally {
      setDeletingId(null);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Video size={18} className="text-primary-600" />;
      case 'text':
        return <FileText size={18} className="text-blue-600" />;
      case 'quiz':
        return <CheckSquare size={18} className="text-green-600" />;
      default:
        return <Video size={18} />;
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Course Lessons</h2>
          <p className="text-gray-600 text-sm mt-1">
            {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={onCreateLesson}>
          <Plus size={18} />
          Add Lesson
        </Button>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold mb-2">No lessons yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your course by adding lessons
          </p>
          <Button variant="primary" onClick={onCreateLesson}>
            <Plus size={18} />
            Create First Lesson
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-colors"
            >
              {/* Order */}
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 font-bold text-sm">
                {lesson.order}
              </div>

              {/* Type Icon */}
              <div>{getLessonIcon(lesson.type)}</div>

              {/* Lesson Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{lesson.title}</h4>
                  {lesson.isPreview && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                      Preview
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {lesson.description}
                </p>
              </div>

              {/* Duration */}
              <div className="text-sm text-gray-500 whitespace-nowrap">
                {lesson.duration} min
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditLesson(lesson)}
                  title="Edit"
                >
                  <Edit size={16} />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(lesson.id)}
                  disabled={deletingId === lesson.id}
                  className="text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  {deletingId === lesson.id ? (
                    <Spinner size="sm" className="border-red-600 border-r-transparent" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
