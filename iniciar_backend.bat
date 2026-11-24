@echo off
title Eventos API - Backend (Spring Boot 3)
echo ============================================================
echo   Iniciando Backend Spring Boot (Porta 8080)...
echo ============================================================

rem Se JAVA_HOME nao estiver definido, procura por versoes do Java 17 ou 21 em locais padrao
if not defined JAVA_HOME (
    for /d %%D in ("C:\Program Files\Eclipse Adoptium\jdk-17*" "C:\Program Files\Eclipse Adoptium\jdk-21*" "C:\Program Files\Java\jdk-17*" "C:\Program Files\Java\jdk-21*" "C:\Program Files\Amazon Corretto\jdk-17*" "C:\Program Files\Amazon Corretto\jdk-21*") do (
        if exist "%%D\bin\java.exe" set "JAVA_HOME=%%D"
    )
    if not defined JAVA_HOME (
        if exist "C:\Users\Administrador\.antigravity\extensions\redhat.java-1.56.0-win32-x64\jre\21.0.12.1-win32-x86_64\bin\java.exe" (
            set "JAVA_HOME=C:\Users\Administrador\.antigravity\extensions\redhat.java-1.56.0-win32-x64\jre\21.0.12.1-win32-x86_64"
        )
    )
)

if defined JAVA_HOME (
    echo [INFO] Utilizando JAVA_HOME: %JAVA_HOME%
    set "PATH=%JAVA_HOME%\bin;%PATH%"
) else (
    echo [AVISO] JAVA_HOME nao definido explicitamente. Utilizando Java padrao do sistema.
)

cd /d "%~dp0eventos-api"

if exist "..\apache-maven-3.9.6\bin\mvn.cmd" (
    call "..\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
) else (
    call mvn spring-boot:run
)

pause
