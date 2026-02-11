# 🎨 Learnify Design System

Complete design system documentation for the Learnify platform.

## 🎨 Color Palette

### Primary Colors

```css
/* Purple - Main Brand Color */
--primary-50: #f5f3ff
--primary-100: #ede9fe
--primary-200: #ddd6fe
--primary-300: #c4b5fd
--primary-purple: #b4a0d8
--primary-500: #8b5cf6
--primary-600: #7c3aed
--primary-700: #6d28d9
```

### Accent Colors

```css
/* Orange - CTAs & Actions */
--accent-orange: #ff5722
--accent-orange-light: #ff7849

/* Yellow - Highlights & Stats */
--accent-yellow: #ffc107
--accent-yellow-light: #ffdb4d

/* Pink - Secondary Accents */
--accent-pink: #ff6b9d

/* Coral - Tertiary */
--accent-coral: #ff8a65
```

### Neutral Colors

```css
/* Backgrounds & Text */
--neutral-cream: #faf8f5
--neutral-beige: #f5f1ed
--neutral-dark: #2d2d2d
--neutral-dark-soft: #3a3a3a
```

## 📝 Typography

### Font Families

```css
/* Display Font - For headings */
font-family: 'Space Grotesk', system-ui, sans-serif

/* Body Font - For content */
font-family: 'Inter', system-ui, sans-serif
```

### Font Sizes

```css
/* Headings */
--text-6xl: 3.75rem  /* 60px */
--text-5xl: 3rem     /* 48px */
--text-4xl: 2.25rem  /* 36px */
--text-3xl: 1.875rem /* 30px */
--text-2xl: 1.5rem   /* 24px */
--text-xl: 1.25rem   /* 20px */

/* Body */
--text-lg: 1.125rem  /* 18px */
--text-base: 1rem    /* 16px */
--text-sm: 0.875rem  /* 14px */
--text-xs: 0.75rem   /* 12px */
```

## 🔘 Components

### Buttons

#### Primary Button
```tsx
<Button variant="primary">
  Primary Action
</Button>
```
- Background: `#ff5722` (orange)
- Text: White
- Hover: Scale 1.05 + shadow
- Rounded: Full (pill shape)

#### Secondary Button
```tsx
<Button variant="secondary">
  Secondary Action
</Button>
```
- Background: `#b4a0d8` (purple)
- Text: White
- Hover: Scale 1.05

#### Outline Button
```tsx
<Button variant="outline">
  Outline Action
</Button>
```
- Border: 2px solid dark
- Text: Dark
- Hover: Filled dark background

### Cards

#### White Card
```tsx
<Card>
  Content
</Card>
```
- Background: White
- Border radius: 24px (rounded-3xl)
- Shadow: Soft on hover
- Hover: Lift effect (-8px)

#### Colored Card
```tsx
<Card variant="colored" colorScheme="purple">
  Content
</Card>
```
Available color schemes:
- `purple`
- `yellow`
- `orange`
- `pink`
- `gray`
- `black`

### Badges

```tsx
<Badge variant="default">Label</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
```

Properties:
- Padding: 6px 16px
- Rounded: Full
- Font: Semibold, 14px

## 🎭 Animations

### Duration Standards

```css
--duration-fast: 150ms
--duration-normal: 300ms
--duration-slow: 500ms
```

### Common Animations

#### Float
```css
@keyframes float {
  0%, 100% { transform: translateY(0px) }
  50% { transform: translateY(-20px) }
}
```
Duration: 6s
Easing: ease-in-out
Loop: infinite

#### Slide Up
```css
@keyframes slideUp {
  0% { transform: translateY(30px); opacity: 0 }
  100% { transform: translateY(0); opacity: 1 }
}
```
Duration: 0.5s
Easing: ease-out

#### Fade In
```css
@keyframes fadeIn {
  0% { opacity: 0 }
  100% { opacity: 1 }
}
```
Duration: 0.6s
Easing: ease-out

### Hover Effects

#### Card Hover
```tsx
<motion.div
  whileHover={{ y: -8, scale: 1.02 }}
  transition={{ duration: 0.3 }}
>
  Card Content
</motion.div>
```

#### Button Hover
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Button
</motion.button>
```

## 📐 Spacing

### Padding Standards

```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
--spacing-3xl: 64px
```

### Section Padding

```css
.section-padding {
  padding-top: 4rem;    /* 64px */
  padding-bottom: 4rem;

  @media (min-width: 768px) {
    padding-top: 6rem;    /* 96px */
    padding-bottom: 6rem;
  }

  @media (min-width: 1024px) {
    padding-top: 8rem;    /* 128px */
    padding-bottom: 8rem;
  }
}
```

## 📱 Breakpoints

```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Usage Examples

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
</div>
```

## 🌈 Gradients

### Primary Gradient
```css
.bg-gradient-primary {
  background: linear-gradient(to bottom right, #b4a0d8, #7c3aed);
}
```

### Warm Gradient
```css
.bg-gradient-warm {
  background: linear-gradient(to bottom right, #ff5722, #ffc107);
}
```

### Soft Gradient
```css
.bg-gradient-soft {
  background: linear-gradient(to bottom right, #ede9fe, rgba(255, 193, 7, 0.2));
}
```

## 🎯 Icons

We use **Lucide React** for icons:

```tsx
import { Star, Heart, Download } from 'lucide-react';

<Star size={20} className="text-accent-yellow" />
```

### Icon Sizes

```tsx
<Icon size={16} /> /* Small */
<Icon size={20} /> /* Medium (default) */
<Icon size={24} /> /* Large */
<Icon size={32} /> /* Extra Large */
```

## 🔲 Shadows

```css
/* Soft Shadow - Cards at rest */
--shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.08)

/* Card Shadow - Cards on hover */
--shadow-card: 0 8px 30px rgba(0, 0, 0, 0.12)

/* Glow Effect - Special elements */
--shadow-glow: 0 0 20px rgba(139, 92, 246, 0.3)
```

## 📊 Border Radius

```css
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 20px
--radius-2xl: 24px
--radius-3xl: 28px
--radius-4xl: 32px
--radius-5xl: 40px
--radius-full: 9999px  /* Pills/circles */
```

## 🎨 Design Principles

### 1. Clarity First
- Clear hierarchy
- Obvious actions
- Readable text (min 16px)
- High contrast

### 2. Playful but Professional
- Vibrant colors
- Smooth animations
- Fun illustrations
- Serious about functionality

### 3. Mobile-First
- Touch-friendly targets (min 44px)
- Readable on small screens
- Optimized images
- Fast loading

### 4. Consistency
- Reuse components
- Follow spacing system
- Maintain color palette
- Consistent animations

## 🖼 Image Guidelines

### Aspect Ratios
- Hero images: 16:9
- Course thumbnails: 16:9
- Profile pictures: 1:1
- Certificates: A4 ratio

### File Formats
- Photos: WebP or JPEG
- Icons/Illustrations: SVG
- Screenshots: PNG

### Optimization
- Max width: 1920px
- Compress: 80% quality
- Lazy load: Yes
- Use Next.js Image component

## ♿ Accessibility

### Color Contrast
- Text on background: Min 4.5:1
- Large text: Min 3:1
- Interactive elements: Clear focus states

### Focus States
```css
.focus-visible {
  outline: 2px solid #7c3aed;
  outline-offset: 2px;
}
```

### ARIA Labels
Always include for icons:
```tsx
<button aria-label="Close modal">
  <X size={20} />
</button>
```

## 🎬 Page Transitions

### Page Load
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Page Content
</motion.div>
```

### Scroll Animations
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## 📝 Code Style

### Component Structure
```tsx
interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({
  variant = 'primary',
  size = 'md',
  children,
}) => {
  return (
    <div className={`base-classes ${variant} ${size}`}>
      {children}
    </div>
  );
};
```

### Naming Conventions
- Components: PascalCase (`Button`, `CourseCard`)
- Files: PascalCase (`Button.tsx`, `CourseCard.tsx`)
- Variables: camelCase (`isActive`, `courseList`)
- Constants: UPPER_SNAKE_CASE (`MAX_COURSES`, `API_URL`)

## 🎯 Usage Examples

### Hero Section
```tsx
<section className="bg-gradient-primary text-white py-16">
  <div className="container-custom">
    <h1 className="text-6xl font-display font-bold mb-6">
      Find the right <span className="text-accent-orange">course</span>
    </h1>
    <Button variant="primary" size="lg">
      Get Started
    </Button>
  </div>
</section>
```

### Course Card
```tsx
<Card hover>
  <Badge className="bg-primary-100 text-primary-700">
    Category
  </Badge>
  <h3 className="text-xl font-display font-bold mt-3">
    Course Title
  </h3>
  <p className="text-gray-600 mt-2">
    Short description
  </p>
  <ProgressBar progress={60} className="mt-4" />
</Card>
```

---

**This design system ensures consistency and quality across the entire Learnify platform.**
