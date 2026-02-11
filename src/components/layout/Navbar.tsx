'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display font-bold">
              Learn<span className="text-accent-orange">ify</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-neutral-dark hover:text-accent-orange transition-colors">
                Subjects <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-2">
                  <Link href="/courses?category=marketing" className="block px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">
                    📢 Marketing
                  </Link>
                  <Link href="/courses?category=psychology" className="block px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">
                    🧠 Psychology
                  </Link>
                  <Link href="/courses?category=computer-science" className="block px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">
                    💻 Computer Science
                  </Link>
                  <Link href="/courses?category=creative" className="block px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors">
                    🎨 Creative
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/courses" className="text-neutral-dark hover:text-accent-orange transition-colors">
              Courses
            </Link>

            <Link href="/about" className="text-neutral-dark hover:text-accent-orange transition-colors">
              About
            </Link>

            <Link href="/faq" className="text-neutral-dark hover:text-accent-orange transition-colors">
              FAQ
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/login">
              <Button variant="primary">Login</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-neutral-dark"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="container-custom py-4 space-y-4">
              <button
                onClick={() => setIsSubjectsOpen(!isSubjectsOpen)}
                className="w-full flex items-center justify-between text-left text-neutral-dark py-2"
              >
                Subjects <ChevronDown size={16} className={isSubjectsOpen ? 'rotate-180' : ''} />
              </button>
              {isSubjectsOpen && (
                <div className="pl-4 space-y-2">
                  <Link href="/courses?category=marketing" className="block py-2">📢 Marketing</Link>
                  <Link href="/courses?category=psychology" className="block py-2">🧠 Psychology</Link>
                  <Link href="/courses?category=computer-science" className="block py-2">💻 Computer Science</Link>
                  <Link href="/courses?category=creative" className="block py-2">🎨 Creative</Link>
                </div>
              )}

              <Link href="/courses" className="block text-neutral-dark py-2">Courses</Link>
              <Link href="/about" className="block text-neutral-dark py-2">About</Link>
              <Link href="/faq" className="block text-neutral-dark py-2">FAQ</Link>

              <div className="pt-4 space-y-3">
                <Link href="/dashboard" className="block">
                  <Button variant="outline" fullWidth>Dashboard</Button>
                </Link>
                <Link href="/login" className="block">
                  <Button variant="primary" fullWidth>Login</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
