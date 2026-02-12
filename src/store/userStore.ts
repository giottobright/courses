import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  currentLesson: string;
  progress: number;
  lastAccessedAt: Date;
  startedAt: Date;
  completedAt?: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: string[];
  completedCourses: string[];
  joinedDate: Date;
}

interface UserState {
  user: User | null;
  userProgress: UserProgress[];
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
  enrollInCourse: (courseId: string) => void;
  markLessonComplete: (courseId: string, lessonId: string, totalLessons: number) => void;
  updateCurrentLesson: (courseId: string, lessonId: string) => void;
  completeCourse: (courseId: string) => void;
  getCourseProgress: (courseId: string) => UserProgress | undefined;
}

// Safe storage wrapper for SSR compatibility
const safeStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      userProgress: [],
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        userProgress: []
      }),

      enrollInCourse: (courseId) => set((state) => {
        if (!state.user) return state;

        // Check if already enrolled
        if (state.user.enrolledCourses.includes(courseId)) {
          return state;
        }

        // Add to enrolled courses
        const updatedUser = {
          ...state.user,
          enrolledCourses: [...state.user.enrolledCourses, courseId],
        };

        // Initialize progress
        const newProgress: UserProgress = {
          courseId,
          completedLessons: [],
          currentLesson: '',
          progress: 0,
          lastAccessedAt: new Date(),
          startedAt: new Date(),
        };

        return {
          user: updatedUser,
          userProgress: [...state.userProgress, newProgress],
        };
      }),

      markLessonComplete: (courseId, lessonId, totalLessons) => set((state) => {
        const progressIndex = state.userProgress.findIndex(p => p.courseId === courseId);
        
        if (progressIndex === -1) return state;

        const updatedProgress = [...state.userProgress];
        const courseProgress = updatedProgress[progressIndex];

        // Add lesson to completed if not already there
        if (!courseProgress.completedLessons.includes(lessonId)) {
          courseProgress.completedLessons = [...courseProgress.completedLessons, lessonId];
          courseProgress.progress = Math.round((courseProgress.completedLessons.length / totalLessons) * 100);
          courseProgress.lastAccessedAt = new Date();

          // Mark course as completed if all lessons done
          if (courseProgress.progress === 100) {
            courseProgress.completedAt = new Date();
          }
        }

        return { userProgress: updatedProgress };
      }),

      updateCurrentLesson: (courseId, lessonId) => set((state) => {
        const progressIndex = state.userProgress.findIndex(p => p.courseId === courseId);
        
        if (progressIndex === -1) return state;

        const updatedProgress = [...state.userProgress];
        updatedProgress[progressIndex].currentLesson = lessonId;
        updatedProgress[progressIndex].lastAccessedAt = new Date();

        return { userProgress: updatedProgress };
      }),

      completeCourse: (courseId) => set((state) => {
        if (!state.user) return state;

        // Add to completed courses
        const updatedUser = {
          ...state.user,
          completedCourses: [...state.user.completedCourses, courseId],
        };

        // Update progress
        const progressIndex = state.userProgress.findIndex(p => p.courseId === courseId);
        if (progressIndex !== -1) {
          const updatedProgress = [...state.userProgress];
          updatedProgress[progressIndex].completedAt = new Date();
          updatedProgress[progressIndex].progress = 100;
          
          return {
            user: updatedUser,
            userProgress: updatedProgress,
          };
        }

        return { user: updatedUser };
      }),

      getCourseProgress: (courseId) => {
        return get().userProgress.find(p => p.courseId === courseId);
      },
    }),
    {
      name: 'learnify-user-storage',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
