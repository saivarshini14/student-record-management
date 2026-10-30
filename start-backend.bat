@echo off
title Student Record Management System - Spring Boot Backend
echo ============================================================
echo   Starting Spring Boot REST API Backend on Port 8080...
echo ============================================================
echo.

cd /d "%~dp0backend"

if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Java\jdk-17" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
        echo Using detected JDK 17 at %JAVA_HOME%
    )
)

set "PATH=%JAVA_HOME%\bin;%PATH%"

set "MVN_CMD=mvn.cmd"
if not exist "%MVN_CMD%" (
    if exist "C:\Users\ADMIN\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd" (
        set "MVN_CMD=C:\Users\ADMIN\.m2\wrapper\dists\apache-maven-3.9.16\0daed3be3ebd1c706f0e69e8b07c6b73f5cc4ea3dfce72a8d0ec2e849ca2ddb0\bin\mvn.cmd"
    )
)

call "%MVN_CMD%" spring-boot:run
pause
