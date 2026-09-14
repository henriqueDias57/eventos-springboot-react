@echo off
title Eventos API - Backend (Spring Boot 3)
echo ============================================================
echo   Iniciando Backend Spring Boot (Porta 8080)...
echo ============================================================
cd /d "%~dp0eventos-api"
..\apache-maven-3.9.6\bin\mvn spring-boot:run
pause
