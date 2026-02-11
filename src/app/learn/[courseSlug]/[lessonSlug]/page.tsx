'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MessageCircle,
  Share2,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/lib/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseSlug = params.courseSlug as string;
  const lessonSlug = params.lessonSlug as string;

  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [completing, setCompleting] = useState(false);

  const playerRef = useRef<any>(null);

  // Load course and lesson data
  useEffect(() => {
    async function loadData() {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);

        // Get course
        const courseRes = await fetch(`/api/courses?slug=${courseSlug}`);
        let course = null;

        if (courseRes.ok) {
          const courseData = await courseRes.json();
          course = courseData.courses?.[0];
        }

        // Fallback to mock data if not found in database
        if (!course) {
          console.log('Course not found in database, loading mock data...');
          const { courses: mockCourses, categories } = await import('@/data/courses');
          const mockCourse = mockCourses.find((c: any) => c.slug === courseSlug);
          
          if (mockCourse) {
            const mockCategory = categories.find((cat: any) => cat.name === mockCourse.category);
            course = {
              ...mockCourse,
              category: mockCategory || { name: mockCourse.category, icon: '📚', color: '#8b5cf6' },
              duration: typeof mockCourse.duration === 'string' 
                ? parseInt(mockCourse.duration.replace(/[^0-9]/g, '')) * 60 
                : mockCourse.duration,
              lessonsCount: mockCourse.lessons?.length || 0,
            };
            
            // For demo purposes, allow access to mock courses without enrollment
            toast('Demo mode: Using sample course data', { duration: 3000, icon: 'ℹ️' });
          }
        }
        
        if (!course) {
          router.push('/404');
          return;
        }

        // Check enrollment (skip for mock courses in demo mode)
        let userEnrollment = null;
        const isMockCourse = !course.id || course.id.toString().startsWith('mock') || typeof course.id === 'number';
        
        if (!isMockCourse) {
          const enrollRes = await fetch(`/api/enrollments?userId=${user.id}`);
          if (enrollRes.ok) {
            const enrollData = await enrollRes.json();
            userEnrollment = enrollData.enrollments?.find(
              (e: any) => e.course.id === course.id
            );
          }

          if (!userEnrollment) {
            router.push(`/courses/${courseSlug}`);
            return;
          }
        } else {
          // Mock enrollment for demo courses
          userEnrollment = {
            id: 'demo-enrollment',
            progress: 0,
            enrolledAt: new Date(),
          };
        }

        setCourse(course);
        setEnrollment(userEnrollment);

        // Find current lesson
        const lesson = course.lessons?.find((l: any) => l.slug === lessonSlug);
        if (!lesson) {
          router.push('/404');
          return;
        }

        setCurrentLesson(lesson);

        // Get completed lessons
        // In real app, this would come from LessonProgress table
        const completed = new Set<string>();
        // Mock: mark all lessons before current as completed for demo
        const currentIndex = course.lessons.indexOf(lesson);
        const lessonsToMark = course.lessons.slice(0, currentIndex);
        lessonsToMark.forEach((l: any) => {
          completed.add(l.id);
        });
        setCompletedLessons(completed);
      } catch (error) {
        console.error('Error loading lesson:', error);
        
        // Fallback to mock data on error
        try {
          const { courses: mockCourses, categories } = await import('@/data/courses');
          const mockCourse = mockCourses.find((c: any) => c.slug === courseSlug);
          
          if (mockCourse) {
            const mockCategory = categories.find((cat: any) => cat.name === mockCourse.category);
            const course = {
              ...mockCourse,
              category: mockCategory || { name: mockCourse.category, icon: '📚', color: '#8b5cf6' },
              duration: typeof mockCourse.duration === 'string' 
                ? parseInt(mockCourse.duration.replace(/[^0-9]/g, '')) * 60 
                : mockCourse.duration,
              lessonsCount: mockCourse.lessons?.length || 0,
            };
            
            const lesson = course.lessons?.find((l: any) => l.slug === lessonSlug);
            if (lesson) {
              setCourse(course);
              setCurrentLesson(lesson);
              setEnrollment({
                id: 'demo-enrollment',
                progress: 0,
                enrolledAt: new Date(),
              });
              
              toast.success('Loading demo data (database unavailable)');
              
              // Set completed lessons
              const completed = new Set<string>();
              const currentIndex = course.lessons.indexOf(lesson);
              const lessonsToMark = course.lessons.slice(0, currentIndex);
              lessonsToMark.forEach((l: any) => {
                completed.add(l.id);
              });
              setCompletedLessons(completed);
            } else {
              toast.error('Lesson not found');
            }
          } else {
            toast.error('Course not found');
          }
        } catch (fallbackError) {
          toast.error('Failed to load lesson');
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [courseSlug, lessonSlug, user, router]);

  // Handle lesson completion
  const handleCompleteLesson = async () => {
    if (!user || !currentLesson || !enrollment) return;

    const isMockCourse = !course?.id || course.id.toString().startsWith('mock') || typeof course.id === 'number';

    try {
      setCompleting(true);

      // For mock courses, just update local state
      if (isMockCourse) {
        setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
        toast.success('Lesson completed! (Demo mode)');

        // Check if all lessons are completed
        const allLessons = course.lessons || [];
        const allCompleted = allLessons.every((l: any) => 
          completedLessons.has(l.id) || l.id === currentLesson.id
        );

        if (allCompleted) {
          toast.success('🎉 Congratulations! You completed the course! (Demo mode)', {
            duration: 5000,
          });
        } else {
          // Move to next lesson
          const nextLesson = getNextLesson();
          if (nextLesson) {
            setTimeout(() => {
              router.push(`/learn/${courseSlug}/${nextLesson.slug}`);
            }, 1000);
          }
        }
        return;
      }

      // For real courses, call API
      const res = await fetch(`/api/lessons/${currentLesson.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) throw new Error('Failed to mark as complete');

      const data = await res.json();

      setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
      toast.success('Lesson completed!');

      // Check if course is complete
      if (data.courseCompleted) {
        toast.success('🎉 Congratulations! You completed the course!', {
          duration: 5000,
        });
        setTimeout(() => {
          router.push(`/certificates/${course.id}`);
        }, 2000);
      } else {
        // Move to next lesson
        const nextLesson = getNextLesson();
        if (nextLesson) {
          setTimeout(() => {
            router.push(`/learn/${courseSlug}/${nextLesson.slug}`);
          }, 1000);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete lesson');
    } finally {
      setCompleting(false);
    }
  };

  // Get previous/next lesson
  const getPreviousLesson = () => {
    if (!course || !currentLesson) return null;
    const currentIndex = course.lessons.findIndex((l: any) => l.id === currentLesson.id);
    return currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  };

  const getNextLesson = () => {
    if (!course || !currentLesson) return null;
    const currentIndex = course.lessons.findIndex((l: any) => l.id === currentLesson.id);
    return currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;
  };

  const isLessonCompleted = (lessonId: string) => completedLessons.has(lessonId);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-dark flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="border-white border-r-transparent" />
          <p className="mt-4 text-white">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return null;
  }

  const previousLesson = getPreviousLesson();
  const nextLesson = getNextLesson();
  const currentLessonCompleted = isLessonCompleted(currentLesson.id);

  return (
    <div className="min-h-screen bg-neutral-dark text-white">
      <Toaster position="top-right" />

      {/* Top Bar */}
      <div className="bg-neutral-dark border-b border-gray-700">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
              >
                <Menu size={24} />
              </button>
              
              <Link href={`/courses/${courseSlug}`}>
                <Button variant="outline" size="sm" className="text-white border-gray-600">
                  <ChevronLeft size={16} />
                  Back to course
                </Button>
              </Link>

              <div className="hidden md:block">
                <h1 className="font-bold text-lg">{course.title}</h1>
                <p className="text-sm text-gray-400">
                  Lesson {course.lessons.indexOf(currentLesson) + 1} of {course.lessons.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:block min-w-[200px]">
                <ProgressBar progress={enrollment.progress} showLabel={true} color="primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Course Content */}
        <div
          className={`${
            showSidebar ? 'block' : 'hidden'
          } lg:block w-full lg:w-80 bg-gray-900 border-r border-gray-700 h-[calc(100vh-73px)] overflow-y-auto`}
        >
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4">Course Content</h3>
            <div className="space-y-2">
              {course.lessons.map((lesson: any, index: number) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isCurrent = lesson.id === currentLesson.id;

                return (
                  <Link key={lesson.id} href={`/learn/${courseSlug}/${lesson.slug}`}>
                    <div
                      className={`p-3 rounded-lg transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 size={20} className="text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{lesson.title}</div>
                          <div className="text-xs text-gray-400">
                            {lesson.duration} min • {lesson.type}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Video Player */}
        <div className="flex-1 h-[calc(100vh-73px)] overflow-y-auto">
          <div className="container-custom py-6 max-w-5xl">
            {/* Video Player */}
            <div className="mb-6">
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
                {currentLesson.vimeoId ? (
                  <iframe
                    ref={playerRef}
                    src={`https://player.vimeo.com/video/${currentLesson.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    style={{ width: '100%', height: '100%' }}
                    title={currentLesson.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <BookOpen size={48} className="mx-auto mb-2" />
                      <p>Video coming soon</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    {currentLesson.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{currentLesson.duration} minutes</span>
                    <span>•</span>
                    <span className="capitalize">{currentLesson.type}</span>
                  </div>
                </div>

                {!currentLessonCompleted && (
                  <Button
                    variant="primary"
                    onClick={handleCompleteLesson}
                    disabled={completing}
                  >
                    {completing ? <Spinner size="sm" /> : (
                      <>
                        <CheckCircle2 size={18} />
                        Mark as Complete
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Lesson Description */}
            <Card className="mb-6 bg-gray-900 border-gray-700">
              <h3 className="text-xl font-bold mb-3">About this lesson</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {currentLesson.description || 'No description available for this lesson.'}
              </p>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              {previousLesson ? (
                <Link href={`/learn/${courseSlug}/${previousLesson.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full border-gray-600 text-white">
                    <ChevronLeft size={18} />
                    <span className="truncate">Previous: {previousLesson.title}</span>
                  </Button>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {nextLesson ? (
                <Link href={`/learn/${courseSlug}/${nextLesson.slug}`} className="flex-1">
                  <Button variant="primary" className="w-full">
                    <span className="truncate">Next: {nextLesson.title}</span>
                    <ChevronRight size={18} />
                  </Button>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>

            {/* Additional Resources (placeholder for MVP) */}
            <Card className="mt-6 bg-gray-900 border-gray-700">
              <h3 className="text-xl font-bold mb-3">Resources</h3>
              <p className="text-gray-400">Additional resources for this lesson will be available soon.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
