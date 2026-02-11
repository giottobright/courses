import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-dark text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-display font-bold mb-4 block">
              Learn<span className="text-accent-orange">ify</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Real skills for real life. Learn what matters, when you need it.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent-orange transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-accent-orange transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-accent-orange transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-accent-orange transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-accent-orange transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/courses" className="text-gray-400 hover:text-white transition-colors">All Courses</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/courses?category=marketing" className="text-gray-400 hover:text-white transition-colors">Marketing</Link></li>
              <li><Link href="/courses?category=psychology" className="text-gray-400 hover:text-white transition-colors">Psychology</Link></li>
              <li><Link href="/courses?category=creative" className="text-gray-400 hover:text-white transition-colors">Creative</Link></li>
              <li><Link href="/courses?category=computer-science" className="text-gray-400 hover:text-white transition-colors">Computer Science</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Learnify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
