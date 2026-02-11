// Prisma Seed Script
// Run: npx prisma db seed

import { PrismaClient, CourseLevel, ColorScheme } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'marketing' },
      update: {},
      create: {
        name: 'Marketing',
        slug: 'marketing',
        icon: '📢',
        color: '#b4a0d8',
        description: 'Learn digital marketing, social media, SEO, and advertising',
        coursesCount: 0,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'psychology' },
      update: {},
      create: {
        name: 'Psychology',
        slug: 'psychology',
        icon: '🧠',
        color: '#ffc107',
        description: 'Understand human behavior and mental processes',
        coursesCount: 0,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'computer-science' },
      update: {},
      create: {
        name: 'Computer Science',
        slug: 'computer-science',
        icon: '💻',
        color: '#2d2d2d',
        description: 'Programming, algorithms, and software development',
        coursesCount: 0,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'education' },
      update: {},
      create: {
        name: 'Education',
        slug: 'education',
        icon: '📚',
        color: '#ff5722',
        description: 'Teaching methods, learning strategies, and personal development',
        coursesCount: 0,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'communication' },
      update: {},
      create: {
        name: 'Communication',
        slug: 'communication',
        icon: '💬',
        color: '#ff6b9d',
        description: 'Public speaking, writing, and interpersonal skills',
        coursesCount: 0,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'creative' },
      update: {},
      create: {
        name: 'Creative',
        slug: 'creative',
        icon: '🎨',
        color: '#8b5cf6',
        description: 'Art, design, writing, and creative expression',
        coursesCount: 0,
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create sample courses
  const creativeWriting = await prisma.course.upsert({
    where: { slug: 'creative-writing-beginners' },
    update: {},
    create: {
      title: 'Creative Writing for Beginners',
      slug: 'creative-writing-beginners',
      description:
        'Learn the fundamentals of creative writing and storytelling. Discover techniques used by professional writers to craft compelling narratives, develop memorable characters, and find your unique voice. This course covers everything from brainstorming ideas to editing your final draft.',
      shortDescription: 'Master storytelling basics and find your voice',
      thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
      videoIntroUrl: '',
      categoryId: categories[5].id, // Creative
      instructorId: 'inst_emma_thompson',
      instructorName: 'Emma Thompson',
      instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      instructorBio: 'Published author and writing coach with 10 years of experience',
      price: 49.00,
      originalPrice: 79.00,
      currency: 'USD',
      duration: 210, // 3.5 hours in minutes
      level: CourseLevel.BEGINNER,
      tags: ['writing', 'creativity', 'storytelling', 'fiction'],
      rating: 4.8,
      reviewsCount: 0,
      studentsCount: 0,
      whatYouWillLearn: [
        'Develop your unique writing voice',
        'Create compelling characters',
        'Structure engaging narratives',
        'Overcome writer\'s block',
        'Edit your work professionally',
      ],
      requirements: [
        'No prior writing experience needed',
        'Willingness to practice regularly',
        'Open mind and creativity',
      ],
      hasCertificate: true,
      isPaid: true,
      isPublished: true,
      isPopular: true,
      isNew: false,
      colorScheme: ColorScheme.PURPLE,
    },
  });

  // Create lessons for Creative Writing course
  await Promise.all([
    prisma.lesson.create({
      data: {
        courseId: creativeWriting.id,
        title: 'Introduction to Creative Writing',
        slug: 'intro-creative-writing',
        description: 'What is creative writing and why it matters',
        content: 'Creative writing is the art of crafting original narratives...',
        duration: 15,
        order: 1,
        type: 'VIDEO',
        isPreview: true,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: creativeWriting.id,
        title: 'Finding Your Writing Voice',
        slug: 'finding-voice',
        description: 'Discover what makes your writing unique',
        content: 'Your writing voice is your fingerprint...',
        duration: 22,
        order: 2,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: creativeWriting.id,
        title: 'Character Development',
        slug: 'character-development',
        description: 'Create memorable, three-dimensional characters',
        content: 'Great characters drive great stories...',
        duration: 28,
        order: 3,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: creativeWriting.id,
        title: 'Plot Structure Basics',
        slug: 'plot-structure',
        description: 'Learn the three-act structure and story arcs',
        content: 'Every story needs a beginning, middle, and end...',
        duration: 25,
        order: 4,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: creativeWriting.id,
        title: 'Writing Practice Exercise',
        slug: 'writing-exercise',
        description: 'Apply what you learned in a practical exercise',
        content: 'Write a 500-word short story using the techniques...',
        duration: 30,
        order: 5,
        type: 'TEXT',
        isPreview: false,
      },
    }),
  ]);

  // Create more courses
  const publicSpeaking = await prisma.course.create({
    data: {
      title: 'Public Speaking and Leadership',
      slug: 'public-speaking-leadership',
      description:
        'Overcome stage fright and become a confident speaker. Learn proven techniques to engage audiences, deliver impactful presentations, and lead with your voice.',
      shortDescription: 'Speak confidently in front of any audience',
      thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
      categoryId: categories[4].id, // Communication
      instructorId: 'inst_marcus_johnson',
      instructorName: 'Marcus Johnson',
      instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      instructorBio: 'TEDx speaker and corporate communication trainer',
      price: 69.00,
      originalPrice: 99.00,
      currency: 'USD',
      duration: 240, // 4 hours
      level: CourseLevel.INTERMEDIATE,
      tags: ['speaking', 'leadership', 'communication', 'confidence'],
      rating: 4.9,
      whatYouWillLearn: [
        'Overcome public speaking anxiety',
        'Use body language effectively',
        'Engage any audience',
        'Handle tough questions gracefully',
        'Project confidence and authority',
      ],
      requirements: ['Basic communication skills', 'Willingness to practice speaking'],
      hasCertificate: true,
      isPaid: true,
      isPublished: true,
      isPopular: true,
      colorScheme: ColorScheme.YELLOW,
    },
  });

  const dataViz = await prisma.course.create({
    data: {
      title: 'Data Visualization Techniques',
      slug: 'data-visualization',
      description:
        'Transform complex data into clear, compelling visual stories. Learn to choose the right charts, design for impact, and communicate insights effectively.',
      shortDescription: 'Turn data into visual stories',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      categoryId: categories[2].id, // Computer Science
      instructorId: 'inst_sarah_chen',
      instructorName: 'Sarah Chen',
      instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      instructorBio: 'Data visualization expert and UX designer',
      price: 0,
      currency: 'USD',
      duration: 120, // 2 hours
      level: CourseLevel.BEGINNER,
      tags: ['data', 'visualization', 'design', 'analytics'],
      rating: 4.7,
      whatYouWillLearn: [
        'Choose appropriate chart types',
        'Apply color theory effectively',
        'Design accessible visualizations',
        'Tell stories with data',
      ],
      requirements: ['Basic understanding of data', 'No design experience needed'],
      hasCertificate: true,
      isPaid: false,
      isPublished: true,
      isNew: true,
      colorScheme: ColorScheme.GRAY,
    },
  });

  console.log('✅ Sample courses created');

  // Update category course counts
  for (const category of categories) {
    const count = await prisma.course.count({
      where: { categoryId: category.id },
    });
    await prisma.category.update({
      where: { id: category.id },
      data: { coursesCount: count },
    });
  }

  console.log('✅ Category counts updated');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
