@echo off
echo ========================================
echo APPLYING NODE.JS IMPROVEMENTS
echo ========================================
echo.

echo Your agent now has enhanced Node.js support!
echo.
echo Changes made:
echo - Enhanced error parsing for JavaScript/TypeScript
echo - Added ESLint, TypeScript, Jest error detection
echo - Improved static analysis with multiple tools
echo - Added basic code scan for JS/TS files
echo - Better test execution and output parsing
echo.

echo ========================================
echo RESTARTING BACKEND
echo ========================================
echo.

echo Stopping backend...
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend...
cd backend
start cmd /k "python main.py"
cd ..

echo.
echo ========================================
echo BACKEND RESTARTED!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Your agent now supports:
echo - Python projects (pytest, flake8, pylint)
echo - Node.js projects (Jest, ESLint, TypeScript)
echo.
echo Test it with a Node.js repo to see the improvements!
echo.
pause
