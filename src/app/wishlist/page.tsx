'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Trash2, Star, Clock, Users, ShoppingCart } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CourseListSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/lib/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist
  useEffect(() => {
    async function loadWishlist() {
      if (!user) return;

      try {
        setLoading(true);

        const res = await fetch(`/api/wishlist?userId=${user.id}`);
        if (!res.ok) throw new Error('Failed to load wishlist');

        const data = await res.json();
        setWishlist(data.items || []);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadWishlist();
    }
  }, [user, authLoading]);

  // Remove from wishlist
  const handleRemove = async (courseId: string) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/wishlist/${courseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) throw new Error('Failed to remove from wishlist');

      setWishlist(prev => prev.filter(item => item.course.id !== courseId));
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-neutral-cream">
        <Navbar />
        <div className="container-custom py-16">
          <CourseListSkeleton count={4} />
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
          <Heart size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-display font-bold mb-4">Please log in</h2>
          <p className="text-gray-600 mb-6">Log in to view your wishlist</p>
          <Link href="/login">
            <Button variant="primary">Go to Login</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-cream">
      <Toaster position="top-right" />
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              My Wishlist
            </h1>
            <p className="text-xl text-white/90">
              {wishlist.length} {wishlist.length === 1 ? 'course' : 'courses'} saved for later
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="section-padding">
        <div className="container-custom">
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item, index) => {
                const course = item.course;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full group relative">
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(course.id)}
                        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>

                      <Link href={`/courses/${course.slug}`}>
                        {/* Course Image */}
                        <div 
                          className="aspect-video rounded-2xl mb-4 flex items-center justify-center text-6xl"
                          style={{ backgroundColor: course.category.color + '20' }}
                        >
                          {course.category.icon || '📚'}
                        </div>

                        {/* Course Info */}
                        <div className="mb-3">
                          <Badge style={{ backgroundColor: course.category.color + '20', color: course.category.color }}>
                            {course.category.name}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary-600 transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {course.shortDescription}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-accent-yellow" fill="currentColor" />
                            <span className="font-semibold text-neutral-dark">{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{Math.floor(course.duration / 60)}h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={16} />
                            <span>{course.studentsCount}</span>
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            {course.price > 0 ? (
                              <span className="text-2xl font-bold text-accent-orange">
                                ${course.price}
                              </span>
                            ) : (
                              <span className="text-2xl font-bold text-green-600">Free</span>
                            )}
                          </div>
                          
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              router.push(`/courses/${course.slug}`);
                            }}
                          >
                            <ShoppingCart size={16} />
                            View Course
                          </Button>
                        </div>
                      </Link>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-2xl font-display font-bold mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">
                Start adding courses you're interested in to your wishlist
              </p>
              <Link href="/courses">
                <Button variant="primary" size="lg">
                  Explore Courses
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
