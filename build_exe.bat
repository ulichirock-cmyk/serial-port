@echo off
echo ==========================================
echo      Building Windows EXE...
echo ==========================================

echo [1/2] Installing dependencies...
call npm install

echo [2/2] Building EXE (this may take a while)...
call npm run build:win

echo.
echo ==========================================
echo Build Complete!
echo Please check the 'dist' folder for the setup file.
echo ==========================================
pause