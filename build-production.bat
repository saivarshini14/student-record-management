@echo off
title Student Record Management System - Production Build
echo ============================================================
echo   Building Full-Stack Application for Production Deployment
echo ============================================================
echo.

echo [1/3] Building React Frontend...
cd /d "%~dp0frontend"
call npm.cmd run build
if %ERRORLEVEL% neq 0 (
    echo Error building frontend.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Syncing frontend build to backend static folder...
cd /d "%~dp0"
if not exist "backend\src\main\resources\static" mkdir "backend\src\main\resources\static"
xcopy /E /Y /I "frontend\dist\*" "backend\src\main\resources\static\"

echo.
echo [3/3] Packaging Spring Boot JAR...
cd /d "%~dp0backend"
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Java\jdk-17" set "JAVA_HOME=C:\Program Files\Java\jdk-17"
)
set "PATH=%JAVA_HOME%\bin;%PATH%"

set "MVN_CMD=mvn.cmd"
if not exist "%MVN_CMD%" (
    if exist "C:\Users\ADMIN\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd" (
        set "MVN_CMD=C:\Users\ADMIN\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd"
    )
)

call "%MVN_CMD%" clean package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo Error packaging backend.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ============================================================
echo   BUILD COMPLETE!
echo   Single Deployable JAR created in: backend\target\
echo   Run directly with: java -jar backend\target\student-record-management-1.0.0.jar
echo ============================================================
pause
