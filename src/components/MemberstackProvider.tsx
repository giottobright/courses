'use client';

import { useEffect } from 'react';

export default function MemberstackProvider() {
  useEffect(() => {
    console.log('🚀 [MemberstackProvider] Initializing...');
    
    // Only run on client side
    if (typeof window === 'undefined') {
      console.log('⚠️ [MemberstackProvider] Server-side, skipping...');
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;

    console.log('🔑 [MemberstackProvider] Public key:', publicKey ? `${publicKey.substring(0, 10)}...` : 'NOT FOUND');

    if (!publicKey) {
      console.error('❌ [MemberstackProvider] Memberstack public key not found!');
      console.error('💡 Add NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY to your .env.local file');
      return;
    }

    console.log('📦 [MemberstackProvider] Loading Memberstack SDK...');

    // Dynamically import Memberstack ONLY on client side
    import('@memberstack/dom')
      .then((memberstackModule) => {
        console.log('✅ [MemberstackProvider] Memberstack module loaded');
        
        const memberstackDOM = memberstackModule.default;
        
        // Initialize Memberstack
        const memberstack = memberstackDOM.init({
          publicKey,
        });

        console.log('✅ [MemberstackProvider] Memberstack initialized with config:', {
          publicKey: `${publicKey.substring(0, 10)}...`,
        });

        // Make it globally available
        (window as any).memberstack = memberstack;

        console.log('✅ [MemberstackProvider] Memberstack instance attached to window');
        
        // Log auth state
        memberstack.getCurrentMember().then(({ data }: any) => {
          if (data) {
            console.log('👤 [MemberstackProvider] User already logged in:', {
              id: data.id,
              email: data.auth?.email,
            });
          } else {
            console.log('ℹ️ [MemberstackProvider] No user logged in');
          }
        }).catch((err: any) => {
          console.log('ℹ️ [MemberstackProvider] Could not fetch current member:', err.message);
        });
      })
      .catch((error) => {
        console.error('❌ [MemberstackProvider] Failed to load Memberstack SDK:', error);
        console.error('💡 Make sure @memberstack/dom is installed: npm install @memberstack/dom');
      });
  }, []);

  return null;
}
