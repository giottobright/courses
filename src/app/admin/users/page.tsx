'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Mail,
  Calendar,
  Award,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import toast, { Toaster } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  totalSpent: number;
  lastActive: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load users
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);

        // For MVP, using mock data
        // In production, fetch from /api/admin/users or Memberstack API
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: '👨',
            joinedDate: '2024-01-15',
            coursesEnrolled: 5,
            coursesCompleted: 2,
            certificatesEarned: 2,
            totalSpent: 149.97,
            lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            avatar: '👩',
            joinedDate: '2024-02-01',
            coursesEnrolled: 3,
            coursesCompleted: 1,
            certificatesEarned: 1,
            totalSpent: 79.99,
            lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            avatar: '👨',
            joinedDate: '2023-12-20',
            coursesEnrolled: 8,
            coursesCompleted: 5,
            certificatesEarned: 5,
            totalSpent: 399.95,
            lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          },
          {
            id: '4',
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            avatar: '👩',
            joinedDate: '2024-01-28',
            coursesEnrolled: 4,
            coursesCompleted: 3,
            certificatesEarned: 3,
            totalSpent: 199.97,
            lastActive: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          },
          {
            id: '5',
            name: 'David Brown',
            email: 'david@example.com',
            avatar: '👨',
            joinedDate: '2024-02-05',
            coursesEnrolled: 2,
            coursesCompleted: 0,
            certificatesEarned: 0,
            totalSpent: 99.98,
            lastActive: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          },
        ];

        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // Filter users
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-dark mb-2">
          Users Management
        </h1>
        <p className="text-gray-600">{users.length} registered users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: <BookOpen size={24} />,
            label: 'Total Enrollments',
            value: users.reduce((sum, u) => sum + u.coursesEnrolled, 0),
            color: 'bg-primary-purple',
          },
          {
            icon: <TrendingUp size={24} />,
            label: 'Courses Completed',
            value: users.reduce((sum, u) => sum + u.coursesCompleted, 0),
            color: 'bg-accent-orange',
          },
          {
            icon: <Award size={24} />,
            label: 'Certificates Issued',
            value: users.reduce((sum, u) => sum + u.certificatesEarned, 0),
            color: 'bg-accent-yellow',
          },
          {
            icon: <TrendingUp size={24} />,
            label: 'Total Revenue',
            value: `$${users.reduce((sum, u) => sum + u.totalSpent, 0).toFixed(2)}`,
            color: 'bg-green-500',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div
                className={`${stat.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-3`}
              >
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-neutral-dark mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <Card className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-600 focus:outline-none"
          />
        </div>
      </Card>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-16">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <div className="flex items-center gap-6">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                    {user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.avatar || user.name[0]
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold">{user.name}</h3>
                      {user.coursesCompleted >= 3 && (
                        <Badge variant="success" className="text-xs">
                          <Award size={12} /> Top Student
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Mail size={14} />
                      <span>{user.email}</span>
                      <span>•</span>
                      <Calendar size={14} />
                      <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div>
                        <span className="font-semibold text-neutral-dark">
                          {user.coursesEnrolled}
                        </span>{' '}
                        enrolled
                      </div>
                      <div>
                        <span className="font-semibold text-green-600">
                          {user.coursesCompleted}
                        </span>{' '}
                        completed
                      </div>
                      <div>
                        <span className="font-semibold text-accent-orange">
                          {user.certificatesEarned}
                        </span>{' '}
                        certificates
                      </div>
                      <div>
                        <span className="font-semibold text-primary-600">
                          ${user.totalSpent.toFixed(2)}
                        </span>{' '}
                        spent
                      </div>
                    </div>
                  </div>

                  {/* Last Active */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-neutral-dark mb-1">
                      Last active
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTimestamp(user.lastActive)}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-display font-bold mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        </Card>
      )}
    </div>
  );
}
