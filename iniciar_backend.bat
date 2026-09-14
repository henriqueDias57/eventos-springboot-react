@echo off
title Eventos API - Backend (Spring Boot 3)
echo ============================================================
echo   Iniciando Backend Spring Boot (Porta 8080)...
echo ============================================================

if not defined JAVA_HOME (
    if exist "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot" (
        set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
    )
)

if defined JAVA_HOME (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

cd /d "%~dp0eventos-api"

if exist "..\apache-maven-3.9.6\bin\mvn.cmd" (
    call "..\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
) else (
    call mvn spring-boot:run
)

pause
