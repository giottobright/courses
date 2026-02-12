#!/bin/bash
# Quick Build Test Script for Bash/Linux/Mac
# Проверка сборки проекта перед деплоем

echo "🧪 Starting build test..."
echo ""

# Step 1: Clean .next folder
echo "📁 Cleaning .next folder..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "✅ .next folder removed"
else
    echo "✅ .next folder doesn't exist"
fi
echo ""

# Step 2: Build
echo "🔨 Building project (npm run build)..."
echo ""

npm run build
BUILD_EXIT_CODE=$?

echo ""

# Check build result
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ BUILD SUCCESSFUL!"
    echo ""
    echo "🎉 All tests passed! Ready to deploy!"
    echo ""
    echo "Next steps:"
    echo "1. Test locally: npm start"
    echo "2. Open: http://localhost:3000"
    echo "3. If everything works - deploy!"
    echo ""
    echo "Deploy commands:"
    echo "  git add ."
    echo "  git commit -m 'fix: resolve localStorage SSR and TypeScript errors'"
    echo "  git push origin main"
    echo ""
else
    echo "❌ BUILD FAILED!"
    echo ""
    echo "Please check the errors above."
    echo ""
    echo "Common issues:"
    echo "1. TypeScript errors - check src/store/userStore.ts"
    echo "2. localStorage errors - check for 'use client' directives"
    echo "3. Missing dependencies - try: npm install"
    echo ""
    echo "Documentation:"
    echo "- FINAL-FIX-SUMMARY.md - Overview"
    echo "- TYPESCRIPT-FIX-SUMMARY.md - TypeScript fixes"
    echo "- TEST-BUILD-LOCALLY.md - Troubleshooting"
    echo ""
fi

# Exit with same code as build
exit $BUILD_EXIT_CODE
