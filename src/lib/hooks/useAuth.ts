// Custom hook for Memberstack authentication
'use client';

import { useEffect, useState } from 'react';
import { getCurrentMemberstackUser } from '@/lib/memberstack';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  membershipTier?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const memberstackUser = await getCurrentMemberstackUser();
        if (memberstackUser) {
          setUser({
            id: memberstackUser.id,
            email: memberstackUser.auth.email,
            name: memberstackUser.customFields?.name || 'User',
            avatar: memberstackUser.customFields?.avatar,
          });
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
