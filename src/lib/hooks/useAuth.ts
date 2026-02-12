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
      console.log('🔄 [useAuth] Loading user...');
      try {
        const memberstackUser = await getCurrentMemberstackUser();
        
        if (memberstackUser) {
          console.log('✅ [useAuth] User loaded successfully:', {
            id: memberstackUser.id,
            email: memberstackUser.auth.email,
            name: memberstackUser.customFields?.name,
          });
          
          setUser({
            id: memberstackUser.id,
            email: memberstackUser.auth.email,
            name: memberstackUser.customFields?.name || 'User',
            avatar: memberstackUser.customFields?.avatar,
          });
        } else {
          console.log('ℹ️ [useAuth] No user logged in');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ [useAuth] Failed to load user:', error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('✅ [useAuth] Auth check complete');
      }
    }

    loadUser();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
