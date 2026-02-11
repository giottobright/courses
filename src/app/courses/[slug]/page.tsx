'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  Clock,
  Users,
  Award,
  Play,
  CheckCircle2,
  BookOpen,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/lib/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [course, setCourse] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load course data
  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        
        const res = await fetch(`/api/courses?slug=${slug}`);
        let courseData = null;

        if (res.ok) {
          const data = await res.json();
          courseData = data.courses?.[0];
        }
        
        // Fallback to mock data if not found in database
        if (!courseData) {
          console.log('Course not found in database, loading mock data...');
          const { courses: mockCourses, categories } = await import('@/data/courses');
          const mockCourse = mockCourses.find((c: any) => c.slug === slug);
          
          if (mockCourse) {
            // Transform mock course to match API format
            const mockCategory = categories.find((cat: any) => cat.name === mockCourse.category);
            courseData = {
              ...mockCourse,
              category: mockCategory || { name: mockCourse.category, icon: '📚', color: '#8b5cf6' },
              duration: typeof mockCourse.duration === 'string' 
                ? parseInt(mockCourse.duration.replace(/[^0-9]/g, '')) * 60 
                : mockCourse.duration,
              lessonsCount: mockCourse.lessons?.length || 0,
            };
          }
        }
        
        if (!courseData) {
          router.push('/404');
          return;
        }
        
        setCourse(courseData);

        // Load reviews (only if course is from database)
        if (courseData.id && !courseData.id.startsWith('mock')) {
          const reviewsRes = await fetch(`/api/reviews?courseId=${courseData.id}`);
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            setReviews(reviewsData.reviews || []);
          }
        }

        // Check enrollment if logged in (only for database courses)
        if (user && courseData.id && !courseData.id.startsWith('mock')) {
          const enrollRes = await fetch(`/api/enrollments?userId=${user.id}`);
          if (enrollRes.ok) {
            const enrollData = await enrollRes.json();
            const userEnrollment = enrollData.enrollments?.find(
              (e: any) => e.course.id === courseData.id
            );
            setEnrollment(userEnrollment || null);
          }

          // Check wishlist
          const wishlistRes = await fetch(`/api/wishlist?userId=${user.id}`);
          if (wishlistRes.ok) {
            const wishlistData = await wishlistRes.json();
            setIsInWishlist(
              wishlistData.items?.some((item: any) => item.course.id === courseData.id)
            );
          }
        }
      } catch (error) {
        console.error('Error loading course:', error);
        
        // Fallback to mock data on error
        try {
          const { courses: mockCourses, categories } = await import('@/data/courses');
          const mockCourse = mockCourses.find((c: any) => c.slug === slug);
          
          if (mockCourse) {
            const mockCategory = categories.find((cat: any) => cat.name === mockCourse.category);
            const courseData = {
              ...mockCourse,
              category: mockCategory || { name: mockCourse.category, icon: '📚', color: '#8b5cf6' },
              duration: typeof mockCourse.duration === 'string' 
                ? parseInt(mockCourse.duration.replace(/[^0-9]/g, '')) * 60 
                : mockCourse.duration,
              lessonsCount: mockCourse.lessons?.length || 0,
            };
            setCourse(courseData);
            toast.success('Loading demo data (database unavailable)');
          } else {
            toast.error('Course not found');
          }
        } catch (fallbackError) {
          toast.error('Failed to load course');
        }
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [slug, user, router]);

  // Handle enrollment
  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll');
      router.push('/login');
      return;
    }

    try {
      setEnrolling(true);

      if (course.price > 0) {
        // Purchase course through Memberstack (which uses Stripe)
        // The memberstackPlanId should be set in course metadata
        const planId = course.memberstackPlanId || `plan_${course.id}`;
        
        // Use dynamic import to avoid SSR issues
        const { purchaseCourseWithMemberstack } = await import('@/lib/memberstack');
        
        const result = await purchaseCourseWithMemberstack(planId, course.id);
        
        if (!result.success) {
          throw new Error(result.error || 'Purchase failed');
        }

        // After successful purchase, create enrollment
        const res = await fetch(`/api/courses/${course.id}/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user.id,
            planConnectionId: result.planConnection?.id,
          }),
        });

        if (!res.ok) throw new Error('Failed to create enrollment');

        toast.success('Purchase successful! You now have access to the course.');
        
        // Reload data
        setTimeout(() => window.location.reload(), 1000);
      } else {
        // Direct enrollment for free courses
        const res = await fetch(`/api/courses/${course.id}/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!res.ok) throw new Error('Failed to enroll');

        toast.success('Successfully enrolled!');
        
        // Reload data
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please log in to add to wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        const res = await fetch(`/api/wishlist/${course.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!res.ok) throw new Error('Failed to remove from wishlist');
        
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, courseId: course.id }),
        });

        if (!res.ok) throw new Error('Failed to add to wishlist');
        
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!user || !enrollment) {
      toast.error('Please enroll in the course to leave a review');
      return;
    }

    try {
      setSubmittingReview(true);

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: course.id,
          rating: reviewRating,
          content: reviewContent,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit review');

      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewContent('');
      
      // Reload reviews
      const reviewsRes = await fetch(`/api/reviews?courseId=${course.id}`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-cream">
        <Navbar />
        <div className="container-custom py-16 text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <main className="min-h-screen bg-neutral-cream">
      <Toaster position="top-right" />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Badge className="mb-4" style={{ backgroundColor: 'white', color: course.category.color }}>
                  {course.category.name}
                </Badge>

                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                  {course.title}
                </h1>

                <p className="text-xl text-white/90 mb-6">
                  {course.shortDescription}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="text-accent-yellow" fill="currentColor" />
                    <span className="font-bold">{course.rating}</span>
                    <span className="text-white/80">({course.reviewsCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <span>{course.studentsCount.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span>{course.lessonsCount} lessons</span>
                  </div>
                </div>

                {/* Instructor */}
                {course.instructor && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                      {course.instructor.avatar || '👤'}
                    </div>
                    <div>
                      <div className="text-sm text-white/70">Instructor</div>
                      <div className="font-semibold">{course.instructor.name}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Action Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="sticky top-24">
                  {/* Course Preview */}
                  <div 
                    className="aspect-video rounded-2xl mb-6 flex items-center justify-center text-6xl"
                    style={{ backgroundColor: course.category.color + '20' }}
                  >
                    {course.category.icon || '📚'}
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    {course.price > 0 ? (
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-accent-orange">
                          ${course.price}
                        </span>
                        {course.originalPrice && (
                          <span className="text-xl text-gray-400 line-through">
                            ${course.originalPrice}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-green-600">Free</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {enrollment ? (
                      <>
                        <div className="mb-4">
                          <div className="text-sm text-gray-600 mb-2">
                            Your Progress: {enrollment.progress}%
                          </div>
                          <ProgressBar progress={enrollment.progress} showLabel={false} color="primary" />
                        </div>
                        <Link href={`/learn/${course.slug}`}>
                          <Button variant="primary" size="lg" className="w-full">
                            <Play size={20} />
                            Continue Learning
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={handleEnroll}
                        disabled={enrolling}
                      >
                        {enrolling ? <Spinner size="sm" /> : 'Enroll Now'}
                      </Button>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleWishlistToggle}
                      >
                        <Heart size={18} className={isInWishlist ? 'fill-current text-red-500' : ''} />
                        {isInWishlist ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: course.title,
                              text: course.shortDescription,
                              url: window.location.href,
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success('Link copied to clipboard!');
                          }
                        }}
                      >
                        <Share2 size={18} />
                      </Button>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-bold mb-3">This course includes:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        {course.lessonsCount} video lessons
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Lifetime access
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Certificate of completion
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Mobile and desktop access
                      </li>
                    </ul>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <h2 className="text-2xl font-display font-bold mb-4">About this course</h2>
                <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
              </Card>

              {/* Curriculum */}
              <Card>
                <h2 className="text-2xl font-display font-bold mb-4">Course curriculum</h2>
                <div className="space-y-2">
                  {course.lessons?.map((lesson: any, index: number) => (
                    <div
                      key={lesson.id}
                      className="border rounded-xl p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{lesson.title}</h4>
                            <p className="text-sm text-gray-600">
                              {lesson.duration} min • {lesson.type}
                            </p>
                          </div>
                        </div>
                        {expandedModules[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                      {expandedModules[index] && (
                        <div className="mt-3 pt-3 border-t text-sm text-gray-700">
                          {lesson.description || 'No description available'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Reviews */}
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-display font-bold">Student reviews</h2>
                  {enrollment && !showReviewForm && (
                    <Button variant="outline" size="sm" onClick={() => setShowReviewForm(true)}>
                      Write a review
                    </Button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-6 p-4 border-2 border-primary-200 rounded-xl">
                    <h4 className="font-bold mb-3">Your review</h4>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="text-2xl"
                          >
                            <Star
                              className={star <= reviewRating ? 'text-accent-yellow' : 'text-gray-300'}
                              fill={star <= reviewRating ? 'currentColor' : 'none'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">Review</label>
                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none resize-none"
                        rows={4}
                        placeholder="Share your experience with this course..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        onClick={handleSubmitReview}
                        disabled={submittingReview || !reviewContent}
                      >
                        {submittingReview ? <Spinner size="sm" /> : 'Submit Review'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review: any) => (
                      <div key={review.id} className="pb-4 border-b last:border-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            {review.user?.name?.[0] || '?'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{review.user?.name || 'Anonymous'}</span>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < review.rating ? 'text-accent-yellow' : 'text-gray-300'}
                                    fill={i < review.rating ? 'currentColor' : 'none'}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">{review.content}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No reviews yet. Be the first to review this course!
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Instructor Card */}
              {course.instructor && (
                <Card>
                  <h3 className="text-xl font-display font-bold mb-4">Your Instructor</h3>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-4xl mx-auto mb-3">
                      {course.instructor.avatar || '👤'}
                    </div>
                    <h4 className="font-bold text-lg mb-1">{course.instructor.name}</h4>
                    {course.instructor.title && (
                      <p className="text-gray-600 text-sm mb-3">{course.instructor.title}</p>
                    )}
                    {course.instructor.bio && (
                      <p className="text-sm text-gray-700">{course.instructor.bio}</p>
                    )}
                  </div>
                </Card>
              )}

              {/* Course Stats */}
              <Card>
                <h3 className="text-xl font-display font-bold mb-4">Course details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level</span>
                    <span className="font-semibold capitalize">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">
                      {Math.floor(course.duration / 60)}h {course.duration % 60}m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-semibold">{course.lessonsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students</span>
                    <span className="font-semibold">{course.studentsCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-semibold">English</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
