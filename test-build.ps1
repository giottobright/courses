# Quick Build Test Script for PowerShell
# Проверка сборки проекта перед деплоем

Write-Host "🧪 Starting build test..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean .next folder
Write-Host "📁 Cleaning .next folder..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ .next folder removed" -ForegroundColor Green
} else {
    Write-Host "✅ .next folder doesn't exist" -ForegroundColor Green
}
Write-Host ""

# Step 2: Build
Write-Host "🔨 Building project (npm run build)..." -ForegroundColor Yellow
Write-Host ""

$buildOutput = npm run build 2>&1
$buildExitCode = $LASTEXITCODE

# Display build output
$buildOutput | ForEach-Object { Write-Host $_ }
Write-Host ""

# Check build result
if ($buildExitCode -eq 0) {
    Write-Host "✅ BUILD SUCCESSFUL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 All tests passed! Ready to deploy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test locally: npm start" -ForegroundColor White
    Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
    Write-Host "3. If everything works - deploy!" -ForegroundColor White
    Write-Host ""
    Write-Host "Deploy commands:" -ForegroundColor Cyan
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'fix: resolve localStorage SSR and TypeScript errors'" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ BUILD FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the errors above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. TypeScript errors - check src/store/userStore.ts" -ForegroundColor White
    Write-Host "2. localStorage errors - check for 'use client' directives" -ForegroundColor White
    Write-Host "3. Missing dependencies - try: npm install" -ForegroundColor White
    Write-Host ""
    Write-Host "Documentation:" -ForegroundColor Yellow
    Write-Host "- FINAL-FIX-SUMMARY.md - Overview" -ForegroundColor White
    Write-Host "- TYPESCRIPT-FIX-SUMMARY.md - TypeScript fixes" -ForegroundColor White
    Write-Host "- TEST-BUILD-LOCALLY.md - Troubleshooting" -ForegroundColor White
    Write-Host ""
}

# Exit with same code as build
exit $buildExitCode
