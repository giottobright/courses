'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star, Users, BookOpen, Award, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { courses, stats } from '@/data/courses';

export default function HomePage() {
  const featuredCourses = courses.filter(c => c.isPopular || c.isNew).slice(0, 4);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-purple via-primary-300 to-primary-lilac">
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-10"></div>
        
        <div className="container-custom section-padding relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="info" className="mb-6 bg-white/20 text-white backdrop-blur-sm">
                <Sparkles size={16} />
                Certified teachers only
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Find the right{' '}
                <span className="text-accent-orange">course</span>{' '}
                for you
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-xl">
                See your personalised recommendations based on your interests and goals
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/courses">
                  <Button size="lg" variant="primary">
                    Find course <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-neutral-dark">
                    View our blog <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-white"
                >
                  <div className="badge bg-primary-200 text-primary-700 mb-2">Education</div>
                  <div className="text-2xl font-bold text-neutral-dark">+{stats.subjects}</div>
                  <div className="text-sm text-gray-600">subjects</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-white"
                >
                  <div className="badge bg-primary-300 text-primary-800 mb-2">Online</div>
                  <div className="text-2xl font-bold text-neutral-dark">+{stats.courses}</div>
                  <div className="text-sm text-gray-600">courses</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-accent-yellow rounded-2xl p-4 border-2 border-white"
                >
                  <div className="badge bg-white text-accent-orange mb-2 flex items-center gap-1">
                    <Star size={14} fill="currentColor" /> {stats.rating}
                  </div>
                  <div className="text-2xl font-bold text-neutral-dark">+{stats.reviews / 1000}k</div>
                  <div className="text-sm text-neutral-dark">learner reviews</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Illustration Placeholder */}
                <div className="relative z-10">
                  <svg viewBox="0 0 400 400" className="w-full h-auto">
                    {/* Person illustration */}
                    <g className="animate-float">
                      {/* Pencil */}
                      <rect x="50" y="200" width="300" height="80" rx="40" fill="#8b5cf6" transform="rotate(-20 200 240)" />
                      <polygon points="50,220 20,240 50,260" fill="#6d28d9" transform="rotate(-20 200 240)" />
                      
                      {/* Person */}
                      <ellipse cx="180" cy="150" rx="40" ry="50" fill="#2d2d2d" />
                      <circle cx="180" cy="120" r="30" fill="#f5d0c5" />
                      <path d="M150,150 Q180,180 210,150" stroke="#2d2d2d" strokeWidth="3" fill="none" />
                      <circle cx="170" cy="115" r="3" fill="#2d2d2d" />
                      <circle cx="190" cy="115" r="3" fill="#2d2d2d" />
                    </g>

                    {/* Floating stars */}
                    <g className="animate-bounce-gentle">
                      <path d="M100,80 L105,95 L120,95 L108,105 L113,120 L100,110 L87,120 L92,105 L80,95 L95,95 Z" fill="#ffc107" />
                    </g>
                    <g className="animate-bounce-gentle" style={{ animationDelay: '1s' }}>
                      <path d="M320,100 L323,108 L331,108 L325,113 L328,121 L320,116 L312,121 L315,113 L309,108 L317,108 Z" fill="#ffc107" />
                    </g>

                    {/* Cloud */}
                    <ellipse cx="350" cy="300" rx="40" ry="20" fill="#fff" opacity="0.8" />
                  </svg>
                </div>

                {/* Certified Badge */}
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute top-8 right-8 bg-white rounded-full p-4 shadow-card"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-accent-orange to-accent-yellow flex items-center justify-center text-white font-bold"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-accent-yellow flex items-center justify-center text-neutral-dark font-bold">
                      +135
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="section-padding bg-neutral-cream">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Take your <span className="text-accent-orange">knowledge</span><br />
                a degree further
              </h2>
              <p className="text-gray-600 text-lg">
                Make education work for you with flexible online courses from leading schools.
              </p>
            </div>

            <div className="mt-6 md:mt-0">
              <div className="badge bg-accent-yellow text-neutral-dark">Our courses</div>
            </div>
          </div>

          {/* Course Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="px-6 py-2 bg-neutral-dark text-white rounded-full font-semibold">
              New courses (12)
            </button>
            <button className="px-6 py-2 bg-white text-neutral-dark rounded-full font-semibold hover:bg-neutral-dark hover:text-white transition-colors">
              Recommended (8)
            </button>
            <button className="px-6 py-2 bg-white text-neutral-dark rounded-full font-semibold hover:bg-neutral-dark hover:text-white transition-colors">
              Most popular (22)
            </button>
          </div>

          {/* Course Pagination Indicator */}
          <div className="flex justify-end items-center gap-4 mb-8">
            <span className="text-sm text-gray-600">1/5</span>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border-2 border-neutral-dark flex items-center justify-center hover:bg-neutral-dark hover:text-white transition-colors">
                ←
              </button>
              <button className="w-10 h-10 rounded-full border-2 border-neutral-dark flex items-center justify-center hover:bg-neutral-dark hover:text-white transition-colors">
                →
              </button>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/courses/${course.slug}`}>
                  <Card variant="colored" colorScheme={course.colorScheme} className="h-full">
                    <div className="mb-4">
                      <Badge className={`${course.colorScheme === 'black' || course.colorScheme === 'purple' ? 'bg-white/20 text-white' : 'bg-white/80 text-neutral-dark'}`}>
                        {course.category}
                      </Badge>
                    </div>

                    {/* Course Illustration Placeholder */}
                    <div className="aspect-square bg-white/10 rounded-2xl mb-4 flex items-center justify-center">
                      <div className="text-6xl">
                        {course.category === 'Creative' && '✍️'}
                        {course.category === 'Communication' && '🎤'}
                        {course.category === 'Computer Science' && '📊'}
                        {course.category === 'Psychology' && '🧠'}
                      </div>
                    </div>

                    <h3 className={`text-xl font-display font-bold mb-4 ${course.colorScheme === 'black' || course.colorScheme === 'purple' ? 'text-white' : 'text-neutral-dark'}`}>
                      {course.title}
                    </h3>

                    <Button 
                      variant="primary" 
                      size="sm" 
                      fullWidth
                      className={course.colorScheme === 'black' ? 'bg-white text-neutral-dark hover:bg-gray-100' : ''}
                    >
                      More details <ArrowRight size={16} />
                    </Button>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-warm rounded-4xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="relative z-10 max-w-3xl">
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Ready to gain in-demand skills to kickstart your career?
              </h3>
              <p className="text-white/90 text-lg mb-6">
                The Learnify Click Start program offers 29 FREE online courses to help you get your first experience in your chosen profession
              </p>
              <Button size="lg" className="bg-neutral-dark text-white hover:bg-neutral-dark-soft">
                Start now <ArrowRight size={20} />
              </Button>
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <rect x="50" y="50" width="100" height="100" rx="20" fill="#fff" transform="rotate(15 100 100)" />
                <circle cx="100" cy="80" r="30" fill="#fff" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Why choose <span className="text-gradient">Learnify</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Learn practical skills that solve real problems, at your own pace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <BookOpen size={32} />, title: 'Short & Practical', desc: 'Courses designed to solve specific problems quickly', color: 'bg-primary-purple' },
              { icon: <Users size={32} />, title: 'Expert Teachers', desc: 'Learn from certified professionals with real experience', color: 'bg-accent-orange' },
              { icon: <Award size={32} />, title: 'Get Certified', desc: 'Earn certificates you can share and verify', color: 'bg-accent-yellow' },
              { icon: <Sparkles size={32} />, title: 'Learn Anywhere', desc: 'Access your courses on any device, anytime', color: 'bg-accent-pink' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className={`${feature.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-display font-bold text-accent-yellow mb-2">{stats.students / 1000}k+</div>
              <div className="text-white/80">Active Students</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-accent-orange mb-2">{stats.courses}+</div>
              <div className="text-white/80">Online Courses</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-accent-pink mb-2">{stats.subjects}+</div>
              <div className="text-white/80">Subjects</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold text-primary-300 mb-2">{stats.rating}</div>
              <div className="text-white/80 flex items-center justify-center gap-1">
                <Star size={16} fill="currentColor" /> Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
