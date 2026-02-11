# Contributing to Learnify

Thank you for your interest in contributing to Learnify! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- **Bug Reports**: Found a bug? Open an issue with details
- **Feature Requests**: Have an idea? Share it in the issues
- **Code Contributions**: Submit pull requests for fixes or features
- **Documentation**: Improve docs, add examples, fix typos
- **Design**: Suggest UI/UX improvements
- **Testing**: Test the platform and report issues

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/learnify.git
cd learnify
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

## 📝 Code Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use type inference where appropriate

```typescript
// Good
interface Course {
  id: string;
  title: string;
  price: number;
}

// Bad
const course: any = { ... };
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and prop names
- Add JSDoc comments for complex components

```typescript
/**
 * Course card component
 * Displays course information in a card layout
 */
interface CourseCardProps {
  course: Course;
  onEnroll?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll }) => {
  // Implementation
};
```

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Use custom classes from `globals.css` when appropriate
- Maintain responsive design (mobile-first)

```tsx
// Good
<div className="card p-6 rounded-3xl hover:shadow-card">
  <h3 className="text-xl font-display font-bold">Title</h3>
</div>

// Avoid inline styles
<div style={{ padding: '24px' }}>
```

### File Organization

- Place new components in `src/components/`
- UI components go in `src/components/ui/`
- Layout components go in `src/components/layout/`
- Pages go in `src/app/`
- Utilities go in `src/lib/`
- Types go in `src/types/`

### Naming Conventions

- **Components**: PascalCase (`CourseCard.tsx`)
- **Files**: camelCase for utilities (`certificate.ts`)
- **Functions**: camelCase (`generateCertificate`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_COURSES`)
- **Types/Interfaces**: PascalCase (`CourseData`)

## 🧪 Testing

Before submitting:

1. **Test your changes**
   - Run the app and test manually
   - Test on different screen sizes
   - Check browser console for errors

2. **Check TypeScript**
   ```bash
   npm run build
   ```

3. **Lint your code**
   ```bash
   npm run lint
   ```

## 📤 Submitting Changes

### 1. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "Add course filtering by level"
```

Follow this format:
- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor function`
- `test: Add tests`
- `chore: Update dependencies`

### 2. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 3. Create a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template:
   - **Title**: Clear, concise description
   - **Description**: What does this PR do?
   - **Changes**: List of changes made
   - **Screenshots**: If UI changes
   - **Testing**: How you tested

### Pull Request Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
Add screenshots here

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] No console errors
- [ ] TypeScript compiles
- [ ] Linter passes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes
```

## 🎨 Design Contributions

When suggesting design changes:

1. **Explain the problem** - What issue does it solve?
2. **Show examples** - Screenshots, mockups, or prototypes
3. **Consider accessibility** - WCAG compliance
4. **Match the brand** - Follow existing color scheme
5. **Responsive design** - Works on all devices

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description** - Clear description of the issue
2. **Steps to Reproduce** - How to trigger the bug
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Screenshots** - Visual evidence if applicable
6. **Environment** - Browser, OS, screen size
7. **Console Errors** - Any JavaScript errors

### Bug Report Template

```markdown
## Bug Description
A clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
Add screenshots

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Screen size: 1920x1080

## Console Errors
```
Error messages here
```

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

When requesting features:

1. **Problem Statement** - What problem does it solve?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other ways to solve it
4. **Use Cases** - Real-world examples
5. **Mockups** - Visual representation if applicable

## 📋 Code Review Process

1. **Automated Checks** - CI must pass
2. **Code Review** - Maintainer reviews code
3. **Feedback** - Address any comments
4. **Approval** - Get approval from maintainer
5. **Merge** - Changes are merged

## 🎯 Priority Areas

We're especially interested in contributions for:

- **Accessibility improvements** (WCAG compliance)
- **Performance optimizations** (faster load times)
- **Mobile experience** (better responsiveness)
- **Documentation** (clearer explanations)
- **Bug fixes** (stability improvements)
- **Testing** (automated tests)

## ❓ Questions?

If you have questions:

1. Check existing issues
2. Read the documentation
3. Create a new issue with the "question" label
4. Join our community discussions

## 🙏 Thank You!

Your contributions make Learnify better for everyone. Whether it's a bug report, feature suggestion, or code contribution, we appreciate your help!

---

Happy coding! 🎓✨
