'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Clock, Users, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CourseListSkeleton } from '@/components/ui/Skeleton';
import toast, { Toaster } from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnailUrl: string;
  category: any;
  instructor: any;
  price: number;
  originalPrice?: number;
  currency: string;
  duration: number;
  level: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  lessonsCount: number;
  isPopular: boolean;
  isNew: boolean;
  colorScheme: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  coursesCount: number;
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);

  // Load courses and categories from API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Build query params
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory) params.append('category', selectedCategory);
        if (priceFilter !== 'all') params.append('isPaid', priceFilter === 'paid' ? 'true' : 'false');
        if (levelFilter !== 'all') params.append('level', levelFilter);
        params.append('sortBy', sortBy);
        params.append('order', 'desc');

        const res = await fetch(`/api/courses?${params.toString()}`);
        
        if (!res.ok) throw new Error('Failed to fetch courses');

        const data = await res.json();
        setCourses(data.courses || []);
        setTotalCourses(data.pagination?.total || 0);

        // Load categories if not loaded
        if (categories.length === 0) {
          // For MVP, use mock categories from data/courses
          // In production, fetch from /api/categories
          const { categories: mockCategories } = await import('@/data/courses');
          setCategories(mockCategories);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
        toast.error('Failed to load courses');
        
        // Fallback to mock data
        const { courses: mockCourses, categories: mockCategories } = await import('@/data/courses');
        setCourses(mockCourses as any);
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [searchQuery, selectedCategory, priceFilter, levelFilter, sortBy, categories.length]);

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
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Explore Our Courses
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover practical courses that solve real problems
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-4 rounded-full text-neutral-dark text-lg focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Courses */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 mb-8 lg:mb-0">
              <Card>
                <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                  <Filter size={20} />
                  Filters
                </h3>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Price</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={priceFilter === 'all'}
                        onChange={() => setPriceFilter('all')}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span>All Courses</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={priceFilter === 'free'}
                        onChange={() => setPriceFilter('free')}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span>Free</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        checked={priceFilter === 'paid'}
                        onChange={() => setPriceFilter('paid')}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span>Paid</span>
                    </label>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="font-semibold mb-3">Categories</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                        !selectedCategory ? 'bg-primary-100 text-primary-700 font-semibold' : 'hover:bg-gray-50'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                          selectedCategory === category.slug
                            ? 'bg-primary-100 text-primary-700 font-semibold'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                        <span className="text-gray-500 ml-1">({category.coursesCount})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Level</h4>
                  <div className="space-y-2">
                    {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          checked={levelFilter === level}
                          onChange={() => setLevelFilter(level)}
                          className="w-4 h-4 text-primary-600"
                        />
                        <span className="capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
                  >
                    <option value="createdAt">Newest</option>
                    <option value="studentsCount">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price">Price: Low to High</option>
                  </select>
                </div>
              </Card>
            </div>

            {/* Courses Grid */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold">
                    {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'All Courses'}
                  </h2>
                  <p className="text-gray-600">{totalCourses || courses.length} courses found</p>
                </div>
              </div>

              {loading ? (
                <CourseListSkeleton count={6} />
              ) : courses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-display font-bold mb-2">No courses found</h3>
                  <p className="text-gray-500 text-lg mb-6">Try adjusting your filters or search query</p>
                  <Button variant="primary" onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setPriceFilter('all');
                    setLevelFilter('all');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/courses/${course.slug}`}>
                      <Card className="h-full group">
                        {/* Course Image */}
                        <div className="relative aspect-video bg-gradient-soft rounded-2xl mb-4 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-6xl">
                            {course.category.icon || '📚'}
                          </div>
                          {(course.isNew || course.isPopular) && (
                            <div className="absolute top-3 right-3">
                              {course.isNew && (
                                <Badge variant="success" className="shadow-lg">New</Badge>
                              )}
                              {course.isPopular && !course.isNew && (
                                <Badge variant="warning" className="shadow-lg">Popular</Badge>
                              )}
                            </div>
                          )}
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
                            <span>({course.reviewsCount})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                          <Users size={16} />
                          <span>{course.studentsCount.toLocaleString()} students</span>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            {course.price > 0 ? (
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-accent-orange">
                                  ${course.price}
                                </span>
                                {course.originalPrice && (
                                  <span className="text-sm text-gray-400 line-through">
                                    ${course.originalPrice}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-2xl font-bold text-green-600">Free</span>
                            )}
                          </div>
                          <ArrowRight className="text-primary-600 group-hover:translate-x-1 transition-transform" size={20} />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
