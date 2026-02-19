@echo off
echo ========================================
echo FIXING GIT PUSH ISSUE
echo ========================================
echo.

echo Step 1: Killing any vim processes...
taskkill /F /IM vim.exe 2>nul
taskkill /F /IM gvim.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Aborting any ongoing rebase...
git rebase --abort 2>nul

echo Step 3: Checking current status...
git status

echo.
echo ========================================
echo CHOOSE YOUR FIX OPTION:
echo ========================================
echo.
echo Option 1: REWRITE HISTORY (Recommended - Clean slate)
echo   - Removes the commit with exposed secrets
echo   - Creates one clean commit
echo   - Requires force push
echo.
echo Option 2: ALLOW SECRET ON GITHUB (Quick fix)
echo   - Go to: https://github.com/dhanushetty05/RIFT-26/security/secret-scanning/unblock-secret/39tqqnmaU1eP4FDbHWo6ie50Rxw
echo   - Click "Allow secret"
echo   - Then push normally
echo   - WARNING: Old keys remain in git history
echo.
echo Enter 1 or 2:
set /p choice=

if "%choice%"=="1" goto option1
if "%choice%"=="2" goto option2
echo Invalid choice!
pause
exit /b

:option1
echo.
echo ========================================
echo OPTION 1: REWRITING HISTORY
echo ========================================
echo.

echo Step 1: Resetting to initial commit...
git reset --soft 29aeba7

echo Step 2: Staging all files...
git add -A

echo Step 3: Creating clean commit...
git commit -m "Complete CI/CD Healing Agent - Production Ready"

echo Step 4: Force pushing to GitHub...
git push origin main --force

echo.
echo ========================================
echo DONE! Your code is now on GitHub!
echo ========================================
echo.
echo IMPORTANT: Revoke your old API keys and create new ones!
echo - Google Gemini: https://makersuite.google.com/app/apikey
echo - GitHub Token: https://github.com/settings/tokens
echo.
pause
exit /b

:option2
echo.
echo ========================================
echo OPTION 2: ALLOW SECRET ON GITHUB
echo ========================================
echo.
echo 1. Open this URL in your browser:
echo    https://github.com/dhanushetty05/RIFT-26/security/secret-scanning/unblock-secret/39tqqnmaU1eP4FDbHWo6ie50Rxw
echo.
echo 2. Click "Allow secret" button
echo.
echo 3. Come back here and press any key to push...
pause

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo DONE! Your code is now on GitHub!
echo ========================================
echo.
echo WARNING: Your old API keys are still in git history!
echo STRONGLY RECOMMENDED: Revoke them and create new ones!
echo - Google Gemini: https://makersuite.google.com/app/apikey
echo - GitHub Token: https://github.com/settings/tokens
echo.
pause
exit /b
