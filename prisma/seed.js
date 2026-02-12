// Prisma Seed Script
// Run: npx prisma db seed

const { PrismaClient, CourseLevel, ColorScheme } = require('@prisma/client');

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
        content: 'Creative writing is the art of crafting original narratives that express ideas, emotions, and experiences through imaginative storytelling. Whether you want to write novels, short stories, poetry, or memoirs, this course will give you the foundation you need to succeed. In this lesson, we explore what makes creative writing different from other forms of writing, why it matters in our lives, and how you can develop your skills as a writer. We will also discuss the mindset needed to become a successful creative writer and overcome common obstacles like writer\'s block and self-doubt.',
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
        content: 'Your writing voice is your fingerprint - it\'s what makes your work uniquely yours. In this lesson, you\'ll learn techniques to discover and develop your authentic voice. We\'ll explore different writing styles, how to experiment with tone and perspective, and why embracing your individuality is key to standing out as a writer. You\'ll also learn how to balance originality with readability, and how to let your personality shine through your words.',
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
        content: 'Great characters drive great stories. In this comprehensive lesson, learn how to create compelling, believable characters that readers will remember long after they finish your story. We cover character motivation, backstory development, character arcs, showing vs telling personality traits, and techniques for making your characters feel real. You\'ll learn the difference between flat and round characters, protagonists and antagonists, and how to use character flaws to create conflict and growth.',
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
        content: 'Every story needs a beginning, middle, and end - but how you structure these elements can make or break your narrative. In this lesson, we explore the classic three-act structure, story arcs, plot points, climax and resolution. You\'ll learn about different plot structures including the Hero\'s Journey, linear and non-linear storytelling, and how to create tension and pacing. We\'ll also discuss common plot pitfalls and how to avoid them.',
        duration: 25,
        order: 4,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: creativeWriting.id,
        title: 'Dialogue Writing Masterclass',
        slug: 'dialogue-writing',
        description: 'Write natural, engaging dialogue that reveals character',
        content: 'Dialogue is one of the most powerful tools in a writer\'s arsenal. Learn how to write conversations that sound natural, reveal character, advance the plot, and keep readers engaged. We cover dialogue tags, subtext, voice differentiation, and how to format dialogue correctly. You\'ll also learn when to use dialogue vs narrative, how to avoid common dialogue mistakes, and techniques for making each character\'s speech patterns unique.',
        duration: 26,
        order: 5,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: creativeWriting.id,
        title: 'Show Don\'t Tell: Description Techniques',
        slug: 'show-dont-tell',
        description: 'Master the art of vivid, sensory description',
        content: 'One of the most important principles in creative writing is "show, don\'t tell." In this lesson, you\'ll learn how to use sensory details, specific imagery, and concrete examples to bring your writing to life. We explore techniques for describing settings, emotions, and actions in ways that immerse readers in your story. You\'ll learn how to balance description with action, avoid purple prose, and use metaphors and similes effectively.',
        duration: 24,
        order: 6,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: creativeWriting.id,
        title: 'Editing and Revision Process',
        slug: 'editing-revision',
        description: 'Transform your first draft into polished prose',
        content: 'Writing is rewriting. Learn professional editing techniques to transform your rough drafts into polished, publication-ready work. This lesson covers self-editing strategies, what to look for in revision, how to cut unnecessary words, strengthen weak passages, and polish your prose. We\'ll discuss the difference between developmental editing and line editing, how to get feedback, and when to know your work is ready.',
        duration: 30,
        order: 7,
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
        content: 'Now it\'s time to put everything you\'ve learned into practice! In this hands-on exercise, you\'ll write a complete 1000-word short story using all the techniques covered in this course. Follow the step-by-step guide to plan your story, develop your characters, structure your plot, write engaging dialogue, and revise your work. This exercise includes prompts, templates, and a checklist to ensure you apply each principle effectively.',
        duration: 40,
        order: 8,
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
        'Overcome stage fright and become a confident speaker. Learn proven techniques to engage audiences, deliver impactful presentations, and lead with your voice. This comprehensive course covers everything from managing anxiety to delivering powerful keynotes. You\'ll learn body language secrets, vocal techniques, storytelling methods, and how to handle tough questions with grace. Perfect for professionals, entrepreneurs, and anyone who wants to communicate more effectively.',
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
      duration: 270, // 4.5 hours
      level: CourseLevel.INTERMEDIATE,
      tags: ['speaking', 'leadership', 'communication', 'confidence'],
      rating: 4.9,
      reviewsCount: 0,
      studentsCount: 0,
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

  // Create lessons for Public Speaking course
  await Promise.all([
    prisma.lesson.create({
      data: {
        courseId: publicSpeaking.id,
        title: 'Welcome to Public Speaking Mastery',
        slug: 'welcome-public-speaking',
        description: 'Course overview and what to expect',
        content: 'Welcome to Public Speaking and Leadership! In this introductory lesson, we\'ll explore what you\'ll learn throughout this course, how to get the most out of each lesson, and why public speaking is one of the most valuable skills you can develop. Whether you\'re preparing for a presentation at work, a wedding toast, or a conference talk, this course will give you the tools and confidence you need to succeed.',
        duration: 12,
        order: 1,
        type: 'VIDEO',
        isPreview: true,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: publicSpeaking.id,
        title: 'Understanding and Overcoming Stage Fright',
        slug: 'overcoming-stage-fright',
        description: 'Practical techniques to manage speaking anxiety',
        content: 'Stage fright is normal - even experienced speakers feel nervous. In this lesson, you\'ll learn the psychology behind public speaking anxiety and proven techniques to manage it. We cover breathing exercises, visualization, reframing negative thoughts, and physical techniques to calm your nerves. You\'ll discover how to turn nervous energy into positive performance energy and why some anxiety can actually improve your presentations.',
        duration: 28,
        order: 2,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: publicSpeaking.id,
        title: 'Crafting Your Core Message',
        slug: 'crafting-core-message',
        description: 'Structure your presentation for maximum impact',
        content: 'Every great speech starts with a clear message. Learn how to identify your core message, structure your content using the problem-solution framework, create memorable openings and closings, and use the rule of three. We\'ll explore different presentation structures including chronological, topical, and persuasive formats. You\'ll also learn how to adapt your message for different audiences and time constraints.',
        duration: 32,
        order: 3,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: publicSpeaking.id,
        title: 'Body Language and Stage Presence',
        slug: 'body-language-presence',
        description: 'Master non-verbal communication',
        content: 'Your body language speaks louder than your words. Learn how to use posture, gestures, eye contact, and movement to command attention and project confidence. This lesson covers power poses, how to use the stage effectively, what to do with your hands, and how to maintain engaging eye contact with large audiences. We\'ll also discuss common body language mistakes and how to avoid them.',
        duration: 30,
        order: 4,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: publicSpeaking.id,
        title: 'Vocal Techniques and Delivery',
        slug: 'vocal-techniques',
        description: 'Use your voice as a powerful tool',
        content: 'Your voice is your instrument. Discover how to use pace, pitch, volume, and pauses to keep audiences engaged. Learn vocal warm-up exercises, how to project without shouting, techniques for varying your delivery, and how to use silence effectively. We\'ll also cover how to avoid vocal strain during long presentations and tips for staying hydrated.',
        duration: 26,
        order: 5,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: publicSpeaking.id,
        title: 'Storytelling for Speakers',
        slug: 'storytelling-speakers',
        description: 'Connect with audiences through stories',
        content: 'Stories are the most powerful way to connect with an audience. Learn how to select and craft stories that support your message, use personal anecdotes effectively, structure stories for impact, and incorporate humor naturally. We\'ll explore the elements of a compelling story and how to make abstract concepts concrete through narrative.',
        duration: 34,
        order: 6,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: publicSpeaking.id,
        title: 'Handling Q&A and Difficult Questions',
        slug: 'handling-qa',
        description: 'Stay composed under pressure',
        content: 'Q&A sessions can be intimidating, but with the right techniques, they become opportunities to shine. Learn how to prepare for questions, handle hostile or off-topic questions, admit when you don\'t know something, and keep Q&A sessions productive. We\'ll also cover techniques for managing time during Q&A and how to bridge back to your core message.',
        duration: 28,
        order: 7,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: publicSpeaking.id,
        title: 'Using Visual Aids Effectively',
        slug: 'visual-aids',
        description: 'Design slides that enhance your message',
        content: 'Slides should support your message, not be your message. Learn principles of effective slide design, how to avoid death by PowerPoint, when to use visuals vs text, and how to integrate slides smoothly into your presentation. We\'ll cover best practices for fonts, colors, images, and animations, plus how to present without slides when needed.',
        duration: 30,
        order: 8,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: publicSpeaking.id,
        title: 'Practice and Feedback Exercise',
        slug: 'practice-exercise',
        description: 'Prepare and record your own presentation',
        content: 'It\'s time to put everything into practice! In this final exercise, you\'ll prepare a 5-minute presentation on a topic of your choice, record yourself delivering it, and evaluate your performance using the rubric provided. This lesson includes a detailed checklist covering all aspects of public speaking we\'ve covered, from content structure to delivery techniques. You\'ll also learn how to self-critique and continue improving after the course ends.',
        duration: 50,
        order: 9,
        type: 'TEXT',
        isPreview: false,
      },
    }),
  ]);

  const dataViz = await prisma.course.create({
    data: {
      title: 'Data Visualization Techniques',
      slug: 'data-visualization',
      description:
        'Transform complex data into clear, compelling visual stories. Learn to choose the right charts, design for impact, and communicate insights effectively. This free course covers fundamental principles of data visualization, color theory, accessibility, and storytelling with data. Perfect for analysts, marketers, and anyone who works with data.',
      shortDescription: 'Turn data into visual stories',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      categoryId: categories[2].id, // Computer Science
      instructorId: 'inst_sarah_chen',
      instructorName: 'Sarah Chen',
      instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      instructorBio: 'Data visualization expert and UX designer',
      price: 0,
      currency: 'USD',
      duration: 180, // 3 hours
      level: CourseLevel.BEGINNER,
      tags: ['data', 'visualization', 'design', 'analytics'],
      rating: 4.7,
      reviewsCount: 0,
      studentsCount: 0,
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

  // Create lessons for Data Visualization course
  await Promise.all([
    prisma.lesson.create({
      data: {
        courseId: dataViz.id,
        title: 'Introduction to Data Visualization',
        slug: 'intro-data-viz',
        description: 'Why visualization matters and basic principles',
        content: 'Data visualization is the graphical representation of information and data. By using visual elements like charts, graphs, and maps, data visualization tools provide an accessible way to see and understand trends, outliers, and patterns in data. In this lesson, we explore why visualization is crucial in the data age, the history of data visualization, and fundamental principles that guide effective design.',
        duration: 20,
        order: 1,
        type: 'VIDEO',
        isPreview: true,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: dataViz.id,
        title: 'Choosing the Right Chart Type',
        slug: 'choosing-chart-types',
        description: 'Match your data to the perfect visualization',
        content: 'Not all charts are created equal. Learn when to use bar charts vs line charts, pie charts vs treemaps, scatter plots vs heatmaps. This lesson covers the strengths and weaknesses of common chart types, how to match visualization types to your data structure, and how to choose based on your audience and message. We\'ll also explore less common but powerful chart types like sankey diagrams and chord diagrams.',
        duration: 35,
        order: 2,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: dataViz.id,
        title: 'Color Theory for Data',
        slug: 'color-theory',
        description: 'Use color to enhance understanding',
        content: 'Color is one of the most powerful tools in data visualization - when used correctly. Learn color theory basics, how to choose color palettes that work, using color to highlight insights, and avoiding common color mistakes. We\'ll cover sequential vs diverging vs categorical color schemes, colorblind-friendly palettes, and cultural considerations in color choice.',
        duration: 28,
        order: 3,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: dataViz.id,
        title: 'Designing Accessible Visualizations',
        slug: 'accessible-visualizations',
        description: 'Make your visuals usable for everyone',
        content: 'Accessibility in data visualization ensures that everyone can understand your insights, regardless of abilities. Learn how to design for colorblindness, add proper labels and descriptions, ensure sufficient contrast, provide alternative text for screen readers, and follow WCAG guidelines. We\'ll also discuss how accessible design benefits all users, not just those with disabilities.',
        duration: 24,
        order: 4,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: dataViz.id,
        title: 'Data Storytelling Fundamentals',
        slug: 'data-storytelling',
        description: 'Craft narratives that drive action',
        content: 'Data doesn\'t speak for itself - you need to tell its story. Learn how to structure data narratives, guide viewers through insights, use annotations effectively, and create dashboards that answer key questions. We\'ll explore the narrative arc in data presentation, how to build tension and resolution with data, and techniques for making abstract numbers meaningful and memorable.',
        duration: 30,
        order: 5,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: dataViz.id,
        title: 'Best Practices and Common Pitfalls',
        slug: 'best-practices',
        description: 'Avoid mistakes and follow proven principles',
        content: 'Learn from the mistakes of others! This lesson covers common data visualization mistakes like misleading axes, chartjunk, 3D effects, and poor labeling. We\'ll discuss best practices for titles, legends, gridlines, and annotations. You\'ll also learn about the data-ink ratio, how to declutter your visualizations, and when to break the rules.',
        duration: 26,
        order: 6,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: dataViz.id,
        title: 'Data Visualization Project',
        slug: 'visualization-project',
        description: 'Create your own data visualization',
        content: 'Now it\'s your turn! In this hands-on project, you\'ll take a provided dataset and create a complete data visualization that tells a compelling story. Follow the step-by-step guide to explore the data, identify insights, choose appropriate chart types, apply color theory, ensure accessibility, and present your findings. This project includes templates, datasets, and a detailed rubric for self-evaluation.',
        duration: 45,
        order: 7,
        type: 'TEXT',
        isPreview: false,
      },
    }),
  ]);

  // Course 4: Digital Marketing Fundamentals
  const digitalMarketing = await prisma.course.create({
    data: {
      title: 'Digital Marketing Fundamentals',
      slug: 'digital-marketing-fundamentals',
      description:
        'Master the essentials of digital marketing in today\'s online world. Learn SEO, social media marketing, content strategy, email marketing, and analytics. This comprehensive course covers everything you need to build and execute successful digital marketing campaigns. Perfect for entrepreneurs, small business owners, and aspiring marketers who want to grow their online presence and reach their target audience effectively.',
      shortDescription: 'Complete guide to online marketing success',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      categoryId: categories[0].id, // Marketing
      instructorId: 'inst_alex_rivera',
      instructorName: 'Alex Rivera',
      instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      instructorBio: 'Digital marketing strategist with 12+ years experience',
      price: 79.00,
      originalPrice: 129.00,
      currency: 'USD',
      duration: 320, // 5+ hours
      level: CourseLevel.BEGINNER,
      tags: ['marketing', 'seo', 'social-media', 'content', 'analytics'],
      rating: 4.8,
      reviewsCount: 0,
      studentsCount: 0,
      whatYouWillLearn: [
        'Build comprehensive marketing strategies',
        'Master SEO and content marketing',
        'Run effective social media campaigns',
        'Use analytics to measure success',
        'Create email marketing campaigns',
        'Understand paid advertising basics',
      ],
      requirements: ['Basic internet and computer skills', 'No marketing experience needed'],
      hasCertificate: true,
      isPaid: true,
      isPublished: true,
      isPopular: true,
      isNew: false,
      colorScheme: ColorScheme.PURPLE,
    },
  });

  // Create lessons for Digital Marketing course
  await Promise.all([
    prisma.lesson.create({
      data: {
        courseId: digitalMarketing.id,
        title: 'Welcome to Digital Marketing',
        slug: 'welcome-digital-marketing',
        description: 'Course overview and the digital marketing landscape',
        content: 'Welcome to Digital Marketing Fundamentals! In this introduction, we\'ll explore the current state of digital marketing, why it\'s essential for businesses of all sizes, and what you\'ll learn throughout this course. We\'ll discuss the major digital marketing channels, how they work together, and the skills you\'ll develop to succeed in this dynamic field.',
        duration: 15,
        order: 1,
        type: 'VIDEO',
        isPreview: true,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: digitalMarketing.id,
        title: 'Understanding Your Target Audience',
        slug: 'target-audience',
        description: 'Create detailed buyer personas and customer profiles',
        content: 'Effective marketing starts with knowing your audience. Learn how to research and define your target market, create detailed buyer personas, understand customer pain points and motivations, and map the customer journey. We\'ll cover market segmentation, demographic and psychographic analysis, and how to use audience insights to inform every marketing decision.',
        duration: 32,
        order: 2,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: digitalMarketing.id,
        title: 'SEO Essentials: On-Page Optimization',
        slug: 'seo-on-page',
        description: 'Optimize your website for search engines',
        content: 'Search Engine Optimization (SEO) is crucial for online visibility. Learn on-page SEO fundamentals including keyword research, title tags and meta descriptions, header structure, internal linking, image optimization, and URL structure. We\'ll also cover how search engines work, what factors affect rankings, and common SEO mistakes to avoid.',
        duration: 38,
        order: 3,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: digitalMarketing.id,
        title: 'Content Marketing Strategy',
        slug: 'content-marketing',
        description: 'Create content that attracts and engages',
        content: 'Content is king in digital marketing. Learn how to develop a content strategy, create valuable blog posts and articles, use content to build authority, repurpose content across channels, and measure content performance. We\'ll explore different content types (blog posts, videos, infographics, podcasts), content calendars, and how to consistently produce quality content.',
        duration: 35,
        order: 4,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: digitalMarketing.id,
        title: 'Social Media Marketing',
        slug: 'social-media-marketing',
        description: 'Build and engage your social audience',
        content: 'Social media is where your customers spend their time. Learn platform-specific strategies for Facebook, Instagram, LinkedIn, Twitter, and TikTok. We\'ll cover creating engaging content, building community, using hashtags effectively, timing your posts, and managing social media engagement. You\'ll also learn about social media algorithms and how to work with them.',
        duration: 40,
        order: 5,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: digitalMarketing.id,
        title: 'Email Marketing Mastery',
        slug: 'email-marketing',
        description: 'Build lists and create effective campaigns',
        content: 'Email marketing offers the highest ROI of any digital channel. Learn how to build an email list ethically, create compelling email campaigns, write subject lines that get opened, design emails that convert, segment your audience, and automate email sequences. We\'ll cover welcome series, newsletters, promotional campaigns, and email marketing best practices.',
        duration: 33,
        order: 6,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: digitalMarketing.id,
        title: 'Paid Advertising Basics',
        slug: 'paid-advertising',
        description: 'Introduction to Google Ads and Facebook Ads',
        content: 'Paid advertising can accelerate your growth. Learn the basics of pay-per-click (PPC) advertising, how Google Ads and Facebook Ads work, campaign structure and targeting, ad copywriting, budgeting and bidding strategies, and how to avoid wasting money on ads. We\'ll cover search ads, display ads, and social media ads.',
        duration: 42,
        order: 7,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: digitalMarketing.id,
        title: 'Analytics and Measurement',
        slug: 'analytics-measurement',
        description: 'Track, measure, and optimize your marketing',
        content: 'You can\'t improve what you don\'t measure. Learn how to use Google Analytics, set up conversion tracking, understand key metrics (traffic, bounce rate, conversion rate, ROI), create reports, and use data to optimize campaigns. We\'ll cover attribution models, A/B testing, and how to prove the value of your marketing efforts.',
        duration: 36,
        order: 8,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: digitalMarketing.id,
        title: 'Marketing Strategy Project',
        slug: 'marketing-strategy-project',
        description: 'Create a complete digital marketing plan',
        content: 'Put everything together in this comprehensive project. You\'ll create a complete digital marketing strategy for a business (real or fictional), including audience research, channel selection, content calendar, SEO plan, social media strategy, email campaign outline, and measurement framework. This project includes templates, examples, and a detailed guide to help you create a professional marketing plan.',
        duration: 60,
        order: 9,
        type: 'TEXT',
        isPreview: false,
      },
    }),
  ]);

  // Course 5: Introduction to Psychology
  const introPsychology = await prisma.course.create({
    data: {
      title: 'Introduction to Psychology',
      slug: 'intro-psychology',
      description:
        'Explore the fascinating world of human behavior and mental processes. This comprehensive introduction to psychology covers major theories, research methods, cognitive processes, personality, psychological disorders, and applied psychology. Understand why people think, feel, and behave the way they do. Perfect for students, professionals interested in human behavior, or anyone curious about the mind.',
      shortDescription: 'Understand the human mind and behavior',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
      categoryId: categories[1].id, // Psychology
      instructorId: 'inst_dr_lisa_martinez',
      instructorName: 'Dr. Lisa Martinez',
      instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      instructorBio: 'Clinical psychologist and university professor with PhD in Cognitive Psychology',
      price: 59.00,
      originalPrice: 89.00,
      currency: 'USD',
      duration: 290, // 4.8+ hours
      level: CourseLevel.BEGINNER,
      tags: ['psychology', 'behavior', 'mental-health', 'cognition', 'personality'],
      rating: 4.9,
      reviewsCount: 0,
      studentsCount: 0,
      whatYouWillLearn: [
        'Understand major psychological theories',
        'Learn how memory and learning work',
        'Recognize psychological disorders',
        'Apply psychology to everyday life',
        'Understand personality development',
        'Learn about research methods in psychology',
      ],
      requirements: ['No prerequisites', 'Curiosity about human behavior'],
      hasCertificate: true,
      isPaid: true,
      isPublished: true,
      isPopular: false,
      isNew: true,
      colorScheme: ColorScheme.YELLOW,
    },
  });

  // Create lessons for Psychology course
  await Promise.all([
    prisma.lesson.create({
      data: {
        courseId: introPsychology.id,
        title: 'What is Psychology?',
        slug: 'what-is-psychology',
        description: 'Introduction to the science of mind and behavior',
        content: 'Psychology is the scientific study of mind and behavior. In this introductory lesson, we\'ll explore what psychology is and isn\'t, the major perspectives in psychology (biological, cognitive, behavioral, psychodynamic, humanistic), the history of psychology from ancient philosophy to modern neuroscience, and what psychologists do in various fields. We\'ll also discuss why studying psychology is valuable for everyone.',
        duration: 25,
        order: 1,
        type: 'VIDEO',
        isPreview: true,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: introPsychology.id,
        title: 'Research Methods in Psychology',
        slug: 'research-methods',
        description: 'How psychologists study behavior scientifically',
        content: 'Psychology is a science, and like all sciences, it relies on rigorous research methods. Learn about the scientific method, descriptive research (case studies, surveys, naturalistic observation), correlational research, experimental research, and ethical considerations. We\'ll discuss how to critically evaluate psychological claims and why understanding research methods helps you be a better consumer of information.',
        duration: 35,
        order: 2,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: introPsychology.id,
        title: 'The Brain and Nervous System',
        slug: 'brain-nervous-system',
        description: 'Biological foundations of behavior',
        content: 'The brain is the most complex organ in the human body. Explore brain structure and function, the role of neurotransmitters, how the nervous system works, and the relationship between brain and behavior. We\'ll cover major brain regions (cortex, limbic system, brainstem), neuroplasticity, and fascinating case studies that reveal how brain damage affects behavior and personality.',
        duration: 40,
        order: 3,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: introPsychology.id,
        title: 'Sensation and Perception',
        slug: 'sensation-perception',
        description: 'How we experience and interpret the world',
        content: 'Sensation is the detection of physical energy by our senses, while perception is how we organize and interpret that information. Learn about the five senses, how sensory information is processed, perceptual organization and interpretation, optical illusions, and factors that influence perception. We\'ll explore fascinating phenomena like blindsight, synesthesia, and phantom limbs.',
        duration: 32,
        order: 4,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: introPsychology.id,
        title: 'Learning and Conditioning',
        slug: 'learning-conditioning',
        description: 'Classical conditioning, operant conditioning, and observational learning',
        content: 'How do we learn? Explore classical conditioning (Pavlov\'s dogs), operant conditioning (rewards and punishments), observational learning (learning by watching others), and cognitive learning. We\'ll discuss practical applications of learning principles in education, parenting, behavior change, and therapy. You\'ll understand why habits form and how to break them.',
        duration: 36,
        order: 5,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: introPsychology.id,
        title: 'Memory: Encoding, Storage, and Retrieval',
        slug: 'memory',
        description: 'How memory works and why we forget',
        content: 'Memory is fundamental to who we are. Learn about the three stages of memory (sensory, short-term, long-term), how memories are encoded and retrieved, why we forget, false memories, and memory improvement techniques. We\'ll cover fascinating topics like flashbulb memories, the serial position effect, and how emotion affects memory.',
        duration: 33,
        order: 6,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: introPsychology.id,
        title: 'Personality Theories',
        slug: 'personality-theories',
        description: 'Understanding individual differences',
        content: 'What makes you, you? Explore major personality theories including psychoanalytic (Freud), humanistic (Rogers, Maslow), trait theories (Big Five), and social-cognitive perspectives. We\'ll discuss personality assessment, how personality develops, the nature vs nurture debate, and whether personality can change. Learn about personality disorders and what they tell us about normal personality.',
        duration: 38,
        order: 7,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: introPsychology.id,
        title: 'Psychological Disorders',
        slug: 'psychological-disorders',
        description: 'Understanding mental health and disorders',
        content: 'Mental health is health. Learn about the classification of psychological disorders (DSM-5), anxiety disorders, mood disorders (depression, bipolar), schizophrenia, personality disorders, and eating disorders. We\'ll discuss causes, symptoms, prevalence, and treatments. This lesson aims to reduce stigma and promote understanding of mental health challenges.',
        duration: 42,
        order: 8,
        type: 'VIDEO',
        isPreview: false,
      },
    }),
    prisma.lesson.create({
      data: {
        courseId: introPsychology.id,
        title: 'Applied Psychology Project',
        slug: 'applied-psychology-project',
        description: 'Apply psychological principles to real life',
        content: 'Psychology isn\'t just theory - it has practical applications everywhere. In this final project, you\'ll choose an area of your life (relationships, work, health, learning) and apply psychological principles to understand and improve it. You\'ll conduct a self-analysis, apply relevant theories, design an intervention based on psychological research, and reflect on the results. This project includes examples, worksheets, and guidance.',
        duration: 50,
        order: 9,
        type: 'TEXT',
        isPreview: false,
      },
    }),
  ]);

  console.log('✅ All courses and lessons created');

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
