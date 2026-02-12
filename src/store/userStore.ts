import { create } from 'zustand';

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

// Store definition with proper typing (NO PERSIST - SSR compatible)
export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  userProgress: [],
  isAuthenticated: false,

  setUser: (user: User | null) => set({ 
    user, 
    isAuthenticated: !!user 
  }),

  logout: () => set({ 
    user: null, 
    isAuthenticated: false,
    userProgress: []
  }),

  enrollInCourse: (courseId: string) => set((state: UserState) => {
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

  markLessonComplete: (courseId: string, lessonId: string, totalLessons: number) => set((state: UserState) => {
    const progressIndex = state.userProgress.findIndex((p) => p.courseId === courseId);
    
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

  updateCurrentLesson: (courseId: string, lessonId: string) => set((state: UserState) => {
    const progressIndex = state.userProgress.findIndex((p) => p.courseId === courseId);
    
    if (progressIndex === -1) return state;

    const updatedProgress = [...state.userProgress];
    updatedProgress[progressIndex].currentLesson = lessonId;
    updatedProgress[progressIndex].lastAccessedAt = new Date();

    return { userProgress: updatedProgress };
  }),

  completeCourse: (courseId: string) => set((state: UserState) => {
    if (!state.user) return state;

    // Add to completed courses
    const updatedUser = {
      ...state.user,
      completedCourses: [...state.user.completedCourses, courseId],
    };

    // Update progress
    const progressIndex = state.userProgress.findIndex((p) => p.courseId === courseId);
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

  getCourseProgress: (courseId: string) => {
    return get().userProgress.find((p) => p.courseId === courseId);
  },
}));
