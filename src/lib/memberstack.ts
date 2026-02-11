// Memberstack Integration with Payments
// This module provides utilities for integrating with Memberstack authentication and payments

interface MemberstackConfig {
  publicKey: string;
  appUrl: string;
}

interface MemberstackUser {
  id: string;
  auth: {
    email: string;
  };
  customFields?: {
    name?: string;
    avatar?: string;
    [key: string]: any;
  };
  planConnections?: Array<{
    id: string;
    planId: string;
    status: string;
  }>;
}

interface MemberstackPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval?: 'one-time' | 'monthly' | 'yearly';
}

interface PurchaseResult {
  success: boolean;
  error?: string;
  planConnection?: any;
}

/**
 * Initialize Memberstack
 * Call this in your app to set up Memberstack integration
 */
export function initMemberstack(): MemberstackConfig | null {
  const config: MemberstackConfig = {
    publicKey: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY || '',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  };

  if (!config.publicKey) {
    console.warn(
      'Memberstack public key not found. Please add NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY to your .env.local file.'
    );
    return null;
  }

  return config;
}

/**
 * Check if Memberstack is configured
 */
export function isMemberstackConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY;
}

/**
 * Get current Memberstack user
 * In production, this would interact with the Memberstack SDK
 */
export async function getCurrentMemberstackUser(): Promise<MemberstackUser | null> {
  // This is a placeholder for the actual Memberstack SDK call
  // In production, you would use:
  // const memberstack = window.$memberstackDom;
  // const { data: member } = await memberstack.getCurrentMember();
  // return member;

  console.log('Memberstack: Getting current user (mock)');
  
  // Mock user for development
  const mockUser: MemberstackUser = {
    id: 'user_123',
    auth: {
      email: 'demo@learnify.com',
    },
    customFields: {
      name: 'Demo User',
      avatar: '👤',
    },
  };

  return mockUser;
}

/**
 * Sign in with Memberstack
 * @param email - User email
 * @param password - User password
 */
export async function signInWithMemberstack(
  email: string,
  password: string
): Promise<{ success: boolean; user?: MemberstackUser; error?: string }> {
  // This is a placeholder for the actual Memberstack SDK call
  // In production, you would use:
  // const memberstack = window.$memberstackDom;
  // const { data: member } = await memberstack.loginMemberEmailPassword({ email, password });
  // return { success: true, user: member };

  console.log('Memberstack: Sign in attempt (mock)', { email });
  
  // Mock authentication
  return {
    success: true,
    user: {
      id: 'user_123',
      auth: { email },
      customFields: {
        name: 'Demo User',
        avatar: '👤',
      },
    },
  };
}

/**
 * Sign up with Memberstack
 * @param email - User email
 * @param password - User password
 * @param name - User name
 */
export async function signUpWithMemberstack(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; user?: MemberstackUser; error?: string }> {
  // This is a placeholder for the actual Memberstack SDK call
  // In production, you would use:
  // const memberstack = window.$memberstackDom;
  // const { data: member } = await memberstack.signupMemberEmailPassword({
  //   email,
  //   password,
  //   customFields: { name }
  // });
  // return { success: true, user: member };

  console.log('Memberstack: Sign up attempt (mock)', { email, name });
  
  return {
    success: true,
    user: {
      id: 'user_' + Date.now(),
      auth: { email },
      customFields: {
        name,
        avatar: '👤',
      },
    },
  };
}

/**
 * Sign out from Memberstack
 */
export async function signOutMemberstack(): Promise<void> {
  // This is a placeholder for the actual Memberstack SDK call
  // In production, you would use:
  // const memberstack = window.$memberstackDom;
  // await memberstack.logout();

  console.log('Memberstack: Sign out (mock)');
}

/**
 * Update Memberstack user profile
 * @param userId - User ID
 * @param updates - Profile updates
 */
export async function updateMemberstackProfile(
  userId: string,
  updates: Partial<MemberstackUser['customFields']>
): Promise<{ success: boolean; error?: string }> {
  // This is a placeholder for the actual Memberstack SDK call
  // In production, you would use:
  // const memberstack = window.$memberstackDom;
  // await memberstack.updateMemberJSON({ customFields: updates });

  console.log('Memberstack: Update profile (mock)', { userId, updates });
  
  return { success: true };
}

/**
 * Reset password via Memberstack
 * @param email - User email
 */
export async function resetPasswordMemberstack(
  email: string
): Promise<{ success: boolean; error?: string }> {
  // This is a placeholder for the actual Memberstack SDK call
  // In production, you would use:
  // const memberstack = window.$memberstackDom;
  // await memberstack.sendMemberResetPasswordEmail({ email });

  console.log('Memberstack: Password reset request (mock)', { email });
  
  return { success: true };
}

/**
 * Load Memberstack script
 * Call this in your root layout or _app file
 */
export function loadMemberstackScript(): void {
  if (typeof window === 'undefined') return;
  
  const config = initMemberstack();
  if (!config) return;

  // Check if script already loaded
  if (document.querySelector('script[src*="memberstack"]')) {
    return;
  }

  // Load Memberstack script
  const script = document.createElement('script');
  script.src = 'https://static.memberstack.com/scripts/v1/memberstack.js';
  script.async = true;
  script.setAttribute('data-memberstack-id', config.publicKey);
  document.head.appendChild(script);

  console.log('Memberstack script loaded');
}

/**
 * Get Memberstack DOM instance
 * Only works on client-side
 */
export function getMemberstackInstance() {
  if (typeof window === 'undefined') return null;
  return (window as any).$memberstackDom;
}

/**
 * Purchase a course through Memberstack
 * This will trigger Stripe checkout via Memberstack
 * @param planId - Memberstack Plan ID (configured in Memberstack Dashboard)
 * @param courseId - Course ID to associate with purchase
 */
export async function purchaseCourseWithMemberstack(
  planId: string,
  courseId: string
): Promise<PurchaseResult> {
  try {
    const memberstack = getMemberstackInstance();
    
    if (!memberstack) {
      console.warn('Memberstack not loaded, using mock purchase');
      // Mock purchase for development
      return {
        success: true,
        planConnection: {
          id: 'pc_' + Date.now(),
          planId,
          status: 'ACTIVE',
        },
      };
    }

    // In production, Memberstack handles Stripe checkout
    // The planId should be created in Memberstack Dashboard with Stripe price
    const { data } = await memberstack.purchaseMembershipPlan({
      planId,
      metadata: {
        courseId, // Store courseId for webhook processing
      },
    });

    return {
      success: true,
      planConnection: data,
    };
  } catch (error: any) {
    console.error('Memberstack purchase error:', error);
    return {
      success: false,
      error: error.message || 'Purchase failed',
    };
  }
}

/**
 * Check if user has purchased a specific course (via plan)
 * @param userId - User ID
 * @param planId - Plan ID associated with course
 */
export async function hasUserPurchasedCourse(
  userId: string,
  planId: string
): Promise<boolean> {
  try {
    const memberstack = getMemberstackInstance();
    
    if (!memberstack) {
      // Mock check for development
      console.log('Mock: Checking course purchase', { userId, planId });
      return false;
    }

    const { data: member } = await memberstack.getCurrentMember();
    
    if (!member || !member.planConnections) {
      return false;
    }

    // Check if user has active plan connection
    return member.planConnections.some(
      (pc: any) => pc.planId === planId && pc.status === 'ACTIVE'
    );
  } catch (error) {
    console.error('Error checking course purchase:', error);
    return false;
  }
}

/**
 * Get user's purchased plans (courses)
 */
export async function getUserPurchasedPlans(): Promise<Array<{ planId: string; status: string }>> {
  try {
    const memberstack = getMemberstackInstance();
    
    if (!memberstack) {
      console.log('Mock: Getting user plans');
      return [];
    }

    const { data: member } = await memberstack.getCurrentMember();
    
    if (!member || !member.planConnections) {
      return [];
    }

    return member.planConnections.map((pc: any) => ({
      planId: pc.planId,
      status: pc.status,
    }));
  } catch (error) {
    console.error('Error getting user plans:', error);
    return [];
  }
}

/**
 * Cancel a membership plan (course access)
 * @param planConnectionId - Plan connection ID to cancel
 */
export async function cancelMembershipPlan(
  planConnectionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const memberstack = getMemberstackInstance();
    
    if (!memberstack) {
      console.log('Mock: Canceling plan', planConnectionId);
      return { success: true };
    }

    await memberstack.cancelMembershipPlan({ planConnectionId });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error canceling plan:', error);
    return {
      success: false,
      error: error.message || 'Cancellation failed',
    };
  }
}

/**
 * Open Memberstack payment portal
 * Allows users to manage their subscriptions/payments
 */
export async function openPaymentPortal(): Promise<void> {
  try {
    const memberstack = getMemberstackInstance();
    
    if (!memberstack) {
      console.log('Mock: Opening payment portal');
      window.alert('Payment portal would open here (Memberstack + Stripe)');
      return;
    }

    // Opens Stripe Customer Portal via Memberstack
    await memberstack.openPaymentPortal();
  } catch (error) {
    console.error('Error opening payment portal:', error);
  }
}
