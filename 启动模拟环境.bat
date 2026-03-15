@echo off
cd /d "%~dp0"

echo ========================================
echo   Start Mock Environment
echo ========================================
echo.

cd js\code
if errorlevel 1 (
    echo [ERROR] Folder js\code not found.
    pause
    exit /b 1
)

set "NODE_EXE="
set "NPM_CLI="

if exist "D:\Program Files\nodejs\node.exe" (
    set "NODE_EXE=D:\Program Files\nodejs\node.exe"
    set "NPM_CLI=D:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"
)
if exist "C:\Program Files\nodejs\node.exe" (
    set "NODE_EXE=C:\Program Files\nodejs\node.exe"
    set "NPM_CLI=C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"
)
if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set "NODE_EXE=C:\Program Files (x86)\nodejs\node.exe"
    set "NPM_CLI=C:\Program Files (x86)\nodejs\node_modules\npm\bin\npm-cli.js"
)
if exist "%LOCALAPPDATA%\Programs\node\node.exe" (
    set "NODE_EXE=%LOCALAPPDATA%\Programs\node\node.exe"
    set "NPM_CLI=%LOCALAPPDATA%\Programs\node\node_modules\npm\bin\npm-cli.js"
)

if not "%NODE_EXE%"=="" goto check_npm
for /f "delims=" %%i in ('where node 2^>nul') do (
    set "NODE_EXE=%%i"
    goto found_where
)
goto no_node

:found_where
for %%A in ("%NODE_EXE%") do set "NODEDIR=%%~dpA"
set "NPM_CLI=%NODEDIR%node_modules\npm\bin\npm-cli.js"

:check_npm
if not exist "%NODE_EXE%" goto no_node
if not exist "%NPM_CLI%" goto no_npm

echo Using Node: %NODE_EXE%
echo.
echo [1/2] Installing dependencies...
"%NODE_EXE%" "%NPM_CLI%" install
if errorlevel 1 (
    echo Install failed. Check network and try again.
    pause
    exit /b 1
)

echo.
echo [2/2] Starting dev server...
echo.
echo   Open in browser:  http://localhost:4321
echo   Stop server:      Press Ctrl+C in this window
echo.
"%NODE_EXE%" "%NPM_CLI%" run simulate
echo.
echo Server stopped.
pause
exit /b 0

:no_npm
echo [ERROR] npm-cli.js not found. Reinstall Node.js LTS.
pause
exit /b 1

:no_node
echo.
echo [ERROR] Node.js not found. Please install Node.js first.
echo.
echo Steps:
echo   1. Open https://nodejs.org/
echo   2. Download and install LTS version
echo   3. Check "Add to PATH" during setup
echo   4. Close this window and run this script again
echo.
pause
exit /b 1
