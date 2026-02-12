'use client';

import { useEffect } from 'react';
import memberstackDOM from '@memberstack/dom';

export default function MemberstackProvider() {
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;

    if (!publicKey) {
      console.warn('Memberstack public key not found. Add NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY to your .env file');
      return;
    }

    // Initialize Memberstack
    const memberstack = memberstackDOM.init({
      publicKey,
    });

    // Make it globally available
    if (typeof window !== 'undefined') {
      (window as any).memberstack = memberstack;
    }

    console.log('Memberstack initialized successfully');
  }, []);

  return null;
}
