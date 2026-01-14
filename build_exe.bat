@echo off
setlocal
chcp 65001 >nul

echo ==========================================
echo       RAYCOM - 一键构建脚本
echo ==========================================

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未找到 Node.js，请先安装 Node.js。
    pause
    exit /b 1
)

echo.
echo [1/3] 检查并安装依赖...
if not exist "node_modules" (
    echo 未发现 node_modules，正在执行 npm install...
    call npm install
) else (
    echo node_modules 已存在，跳过安装。
)

echo.
echo [2/3] 清理旧构建...
if exist "dist" (
    rmdir /s /q "dist"
    echo dist 目录已清理。
)

echo.
echo [3/3] 开始构建 Windows 安装包...
call npm run build:win
if %errorlevel% neq 0 (
    echo [错误] 构建失败。
    pause
    exit /b 1
)

echo.
echo ==========================================
echo [成功] 构建完成！
echo.
echo 安装包位置: dist\*.exe
echo 免安装版位置: dist\win-unpacked\
echo ==========================================
pause
endlocal
