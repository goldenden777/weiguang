@echo off
cd /d "%~dp0"

if exist ".git\config.lock" (
    echo Removing stale lock file...
    del ".git\config.lock"
    echo.
)

echo Step 1: Init Git repo...
git init
if errorlevel 1 (
    echo Init failed.
    pause
    exit /b 1
)
echo.

echo Step 2: Set user name and email...
git config user.name "goldenden777"
git config user.email "goldenden@126.com"

if %errorlevel% equ 0 (
    echo.
    echo OK. Configured:
    git config user.name
    git config user.email
) else (
    echo Failed.
)

echo.
pause
