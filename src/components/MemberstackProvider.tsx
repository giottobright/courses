'use client';

import { useEffect } from 'react';

export default function MemberstackProvider() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;

    if (!publicKey) {
      console.warn('Memberstack public key not found. Add NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY to your .env file');
      return;
    }

    // Dynamically import Memberstack ONLY on client side
    import('@memberstack/dom')
      .then((memberstackModule) => {
        const memberstackDOM = memberstackModule.default;
        
        // Initialize Memberstack
        const memberstack = memberstackDOM.init({
          publicKey,
        });

        // Make it globally available
        (window as any).memberstack = memberstack;

        console.log('Memberstack initialized successfully');
      })
      .catch((error) => {
        console.error('Failed to load Memberstack:', error);
      });
  }, []);

  return null;
}
