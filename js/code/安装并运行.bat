@echo off
chcp 65001 >nul
echo 正在查找 Node.js / npm ...
set "NPM="
if exist "C:\Program Files\nodejs\npm.cmd" set "NPM=C:\Program Files\nodejs\npm.cmd"
if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" set "NPM=%ProgramFiles(x86)%\nodejs\npm.cmd"
if exist "%LOCALAPPDATA%\Programs\node\npm.cmd" set "NPM=%LOCALAPPDATA%\Programs\node\npm.cmd"
if exist "%APPDATA%\npm\npm.cmd" set "NPM=%APPDATA%\npm\npm.cmd"
where npm >nul 2>&1 && set "NPM=npm"
if "%NPM%"=="" (
    echo.
    echo [错误] 未找到 npm。请先安装 Node.js：https://nodejs.org/
    echo 安装时务必勾选 "Add to PATH"，安装完成后重启 Cursor 再试。
    pause
    exit /b 1
)
echo 使用: %NPM%
echo.
echo 1/2 安装依赖...
call "%NPM%" install
if errorlevel 1 (
    echo 安装失败。
    pause
    exit /b 1
)
echo.
echo 2/2 启动模拟环境（开发服务器）...
echo 启动后在浏览器打开: http://localhost:4321
echo 按 Ctrl+C 可停止服务器。
echo.
call "%NPM%" run simulate
pause
