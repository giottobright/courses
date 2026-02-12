'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { signInWithMemberstack, signUpWithMemberstack } from '@/lib/memberstack';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-purple via-primary-300 to-primary-lilac flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-white hidden lg:block"
        >
          <Link href="/" className="inline-block mb-8">
            <div className="text-4xl font-display font-bold">
              Learn<span className="text-accent-orange">ify</span>
            </div>
          </Link>
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
            Welcome to your learning journey
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of learners mastering real-life skills
          </p>
          <div className="space-y-4">
            {[
              '📚 120+ practical courses',
              '⭐ 5.0 average rating',
              '🎓 Earn verified certificates',
              '📱 Learn on any device',
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 text-lg"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  ✓
                </div>
                {feature}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-8">
            {/* Mobile Logo */}
            <Link href="/" className="inline-block mb-6 lg:hidden">
              <div className="text-3xl font-display font-bold text-center">
                Learn<span className="text-accent-orange">ify</span>
              </div>
            </Link>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-2">
                {isLogin ? 'Welcome back!' : 'Create account'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Enter your credentials to continue' 
                  : 'Start your learning journey today'
                }
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-red-900">
                    <strong>Error:</strong> {error}
                  </div>
                </div>
              </div>
            )}

            <form 
              className="space-y-4" 
              onSubmit={async (e) => {
                e.preventDefault();
                console.log('📝 [LoginPage] Form submitted:', { isLogin, email });
                
                setError(null);
                setLoading(true);

                try {
                  if (isLogin) {
                    // Login
                    console.log('🔐 [LoginPage] Attempting login...');
                    const result = await signInWithMemberstack(email, password);
                    
                    if (result.success) {
                      console.log('✅ [LoginPage] Login successful, redirecting...');
                      // Redirect to dashboard or home
                      router.push('/courses');
                      router.refresh(); // Refresh to update auth state
                    } else {
                      console.error('❌ [LoginPage] Login failed:', result.error);
                      setError(result.error || 'Login failed. Please check your credentials.');
                    }
                  } else {
                    // Signup
                    console.log('📝 [LoginPage] Attempting signup...');
                    const result = await signUpWithMemberstack(email, password, name);
                    
                    if (result.success) {
                      console.log('✅ [LoginPage] Signup successful, redirecting...');
                      // Redirect to dashboard or home
                      router.push('/courses');
                      router.refresh(); // Refresh to update auth state
                    } else {
                      console.error('❌ [LoginPage] Signup failed:', result.error);
                      setError(result.error || 'Signup failed. Please try again.');
                    }
                  }
                } catch (err: any) {
                  console.error('❌ [LoginPage] Unexpected error:', err);
                  setError(err.message || 'An unexpected error occurred. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Alex Johnson"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="input pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input pl-12 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button 
                variant="primary" 
                size="lg" 
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" fullWidth>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" fullWidth>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  GitHub
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-gray-600 hover:text-neutral-dark"
                disabled={loading}
              >
                {isLogin ? (
                  <>Don't have an account? <span className="text-primary-600 font-semibold">Sign up</span></>
                ) : (
                  <>Already have an account? <span className="text-primary-600 font-semibold">Sign in</span></>
                )}
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
