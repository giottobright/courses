# 🚀 Deployment Guide for Learnify

This guide will help you deploy Learnify to production.

## Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- Memberstack account (optional, for authentication)
- Your code pushed to a GitHub repository

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel (Recommended)

#### Option A: Deploy via Vercel Dashboard

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Build Settings**
   Vercel will auto-detect Next.js. Verify:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Node.js Version: `18.x` or `20.x`

4. **Add Environment Variables**
   Add these in the Vercel dashboard:
   ```
   NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=your_key_here
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_APP_NAME=Learnify
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your site will be live at `https://your-project.vercel.app`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### 3. Configure Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to your project settings
   - Navigate to "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   ```
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

### 4. Set Up Memberstack Authentication

1. **Create Memberstack Account**
   - Go to [memberstack.com](https://memberstack.com)
   - Sign up for an account
   - Create a new app

2. **Configure Memberstack**
   - Set your app URL: `https://your-app.vercel.app`
   - Configure login/signup pages
   - Customize email templates
   - Set up plans (if using subscriptions)

3. **Get Your API Keys**
   - Go to Settings → API Keys
   - Copy your Public Key

4. **Add to Vercel Environment Variables**
   ```
   NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=pk_YOUR_PUBLIC_KEY
   ```

5. **Redeploy**
   - Environment variables require a redeploy
   - Go to Deployments → Click "Redeploy"

### 5. Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All pages are accessible
- [ ] Responsive design works on mobile
- [ ] Images load properly
- [ ] Navigation works
- [ ] Certificate generation works
- [ ] No console errors
- [ ] SEO meta tags are correct
- [ ] SSL certificate is active (https://)

### 6. Performance Optimization

#### Enable Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics
```

Add to your root layout:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Check Performance

1. **Run Lighthouse Audit**
   - Open DevTools (F12)
   - Go to Lighthouse tab
   - Run audit
   - Aim for scores > 90

2. **Monitor Web Vitals**
   - Check Vercel Analytics dashboard
   - Monitor LCP, FID, CLS
   - Optimize slow pages

### 7. Continuous Deployment

Every push to `main` branch will automatically deploy to production:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys
```

### 8. Staging Environment

Create a staging environment for testing:

1. **Create Preview Deployments**
   - Push to a different branch: `git push origin develop`
   - Vercel creates a preview URL
   - Test changes before merging to main

2. **Environment-Specific Variables**
   - Production: Use production Memberstack keys
   - Preview: Use development Memberstack keys

## Alternative Deployment Options

### Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repo

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Add Environment Variables**
   Same as Vercel configuration

4. **Deploy**
   Click "Deploy site"

### AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect GitHub

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   Add in Amplify Console → App Settings → Environment variables

4. **Deploy**
   Amplify will build and deploy

## Troubleshooting

### Build Fails

**Error:** `Module not found`
```bash
# Make sure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Error:** `TypeScript errors`
```bash
# Fix TypeScript errors locally first
npm run build

# If successful, commit and push
```

### Environment Variables Not Working

1. **Check Variable Names**
   - Must start with `NEXT_PUBLIC_` for client-side
   - No spaces in names or values

2. **Redeploy After Adding**
   - Environment variables require redeploy
   - Click "Redeploy" in Vercel dashboard

### Images Not Loading

1. **Check Image Domains**
   Update `next.config.mjs`:
   ```javascript
   images: {
     domains: [
       'images.unsplash.com',
       'api.dicebear.com',
       // Add your image domains
     ],
   }
   ```

2. **Use Next.js Image Component**
   ```typescript
   import Image from 'next/image';
   <Image src="..." alt="..." width={800} height={600} />
   ```

### SSL Certificate Issues

- Wait 24-48 hours for DNS propagation
- Check domain configuration in Vercel
- Verify nameservers are correct

## Monitoring & Maintenance

### 1. Set Up Error Tracking

Consider adding Sentry:

```bash
npm install @sentry/nextjs
```

### 2. Monitor Performance

- Use Vercel Analytics
- Set up Google Analytics
- Monitor Lighthouse scores

### 3. Regular Updates

```bash
# Update dependencies monthly
npm outdated
npm update

# Test locally
npm run build
npm start

# Deploy
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### 4. Backup

- GitHub is your backup
- Download database backups (when added)
- Export user data regularly

## Security

### 1. Environment Variables

- Never commit `.env.local` to GitHub
- Use Vercel's environment variable system
- Rotate API keys regularly

### 2. Content Security Policy

Add to `next.config.mjs`:

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

### 3. Rate Limiting

Consider adding rate limiting for API routes (future enhancement)

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review browser console for errors
3. Test locally with `npm run build && npm start`
4. Consult Next.js documentation
5. Create a GitHub issue

---

**Congratulations! Your Learnify platform is now live! 🎉**

Share your deployment at: `https://your-domain.com`
