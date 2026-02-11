'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Heart, Zap, Users } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-cream">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-primary text-white section-padding">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              About <span className="text-accent-orange">Learnify</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              We're on a mission to make learning practical, accessible, and actually useful for everyday life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Card>
            <h2 className="text-3xl font-display font-bold mb-6 text-center">Our Philosophy</h2>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Learnify isn't a traditional online academy. We don't believe in long, theoretical courses that take months to complete. Instead, we focus on <strong>real problems</strong> that real people face every day.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Think of us as <strong>Netflix for life skills</strong> - short, practical, slightly humorous courses that solve specific challenges. Whether you need to improve your public speaking, learn creative writing, or master time management, we've got you covered.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our approach is simple: <strong>clarity, speed, and real usefulness</strong>. No pressure. No hype. No long theory. Just practical skills you can apply immediately.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-display font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Target size={32} />,
                color: 'bg-primary-purple',
                title: 'Problem-Focused',
                desc: 'Every course solves a specific, real-world problem'
              },
              {
                icon: <Zap size={32} />,
                color: 'bg-accent-yellow',
                title: 'Quick & Practical',
                desc: 'Short lessons that respect your time and deliver results'
              },
              {
                icon: <Heart size={32} />,
                color: 'bg-accent-pink',
                title: 'Human-Centered',
                desc: 'Friendly, approachable content that feels like a conversation'
              },
              {
                icon: <Users size={32} />,
                color: 'bg-accent-orange',
                title: 'Expert-Led',
                desc: 'Learn from certified professionals with real experience'
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className={`${value.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    {value.icon}
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-warm text-white">
              <h2 className="text-3xl font-display font-bold mb-6">Our Story</h2>
              <p className="text-white/90 text-lg leading-relaxed mb-4">
                Learnify was born from a simple frustration: traditional online courses are too long, too theoretical, and too disconnected from real life.
              </p>
              <p className="text-white/90 text-lg leading-relaxed mb-4">
                We asked ourselves: "What if learning could be like watching a great tutorial video, but structured as a complete skill-building journey?"
              </p>
              <p className="text-white/90 text-lg leading-relaxed">
                Today, we're proud to serve thousands of learners who want practical skills without the BS. We're not building an online university - we're building a tool that helps you solve real problems, fast.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
