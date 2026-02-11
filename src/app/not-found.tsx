import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center bg-neutral-cream px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-display font-bold text-primary-purple mb-4">
              404
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-dark mb-4">
              Page not found
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg">
                Go to Homepage
              </Button>
            </Link>
            
            <Link href="/courses">
              <Button variant="outline" size="lg">
                Browse Courses
              </Button>
            </Link>
          </div>

          {/* Decorative illustration */}
          <div className="mt-12 opacity-20">
            <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto">
              <circle cx="100" cy="100" r="80" fill="#b4a0d8" />
              <circle cx="300" cy="100" r="80" fill="#ffc107" />
              <rect x="140" y="60" width="120" height="80" rx="10" fill="#ff5722" />
            </svg>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
