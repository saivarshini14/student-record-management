@echo off
title Student Record Management System - Launcher
echo ============================================================
echo   Launching Student Record Management System
echo   1. Spring Boot Backend (Port 8080)
echo   2. React.js Frontend (Port 5173)
echo ============================================================
echo.

start "Backend [Spring Boot :8080]" cmd /c "%~dp0start-backend.bat"
timeout /t 5 >nul
start "Frontend [React :5173]" cmd /c "%~dp0start-frontend.bat"

echo.
echo Both applications launched in separate windows!
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:8080/api/students
echo - H2 Database Console: http://localhost:8080/h2-console
echo.
pause
