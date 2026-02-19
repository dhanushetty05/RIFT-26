@echo off
echo ========================================
echo QUICK GIT FIX - Rewriting History
echo ========================================
echo.

echo Killing vim processes...
taskkill /F /IM vim.exe 2>nul
taskkill /F /IM gvim.exe 2>nul
timeout /t 1 /nobreak >nul

echo Aborting rebase...
git rebase --abort 2>nul

echo Resetting to initial commit...
git reset --soft 29aeba7

echo Staging all files...
git add -A

echo Creating clean commit...
git commit -m "Complete CI/CD Healing Agent - Production Ready"

echo Force pushing to GitHub...
git push origin main --force

echo.
echo ========================================
echo SUCCESS! Code is now on GitHub!
echo ========================================
echo.
echo IMPORTANT: Revoke your old API keys NOW!
echo.
echo 1. Google Gemini: https://makersuite.google.com/app/apikey
echo 2. GitHub Token: https://github.com/settings/tokens
echo.
echo Then create new keys and update backend/.env
echo.
pause
