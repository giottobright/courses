export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: string[];
  completedCourses: string[];
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  illustration?: string;
  category: string;
  instructor: {
    name: string;
    avatar: string;
    bio?: string;
  };
  price: number;
  originalPrice?: number;
  currency: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  lessons: Lesson[];
  whatYouWillLearn: string[];
  requirements: string[];
  hasCertificate: boolean;
  isPaid: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  colorScheme: 'purple' | 'yellow' | 'orange' | 'pink' | 'gray' | 'black';
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: string;
  order: number;
  type: 'video' | 'text' | 'mixed' | 'quiz';
  isPreview: boolean;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'file';
  url: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLesson: string;
  progress: number;
  lastAccessedAt: Date;
  startedAt: Date;
  completedAt?: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  userName: string;
  courseName: string;
  completionDate: Date;
  certificateUrl?: string;
  verificationCode: string;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  coursesCount: number;
  color: string;
}
