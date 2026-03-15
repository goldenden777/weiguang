@echo off
cd /d "%~dp0"

echo Step 1: Add all files and commit...
git add .
git status
git commit -m "first commit"
if errorlevel 1 (
    echo No new changes to commit. Pushing existing commits...
)
echo.

echo Step 2: Set branch to main, add remote...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/goldenden777/weiguang.git
echo.

echo Step 3: Push to GitHub...
git push -u origin main

echo.
pause
