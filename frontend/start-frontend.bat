@echo off
title Student Record Management System - React Frontend
echo ============================================================
echo   Starting React Vite Frontend on Port 5173...
echo ============================================================
echo.

cd /d "%~dp0frontend"
call npm.cmd run dev
pause
