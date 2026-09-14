@echo off
title Eventos Web - Frontend (React + Vite)
echo ============================================================
echo   Iniciando Frontend React (Porta 3000)...
echo ============================================================

cd /d "%~dp0eventos-web"

if not exist "node_modules" (
    echo [INFO] Instalando dependencias pela primeira vez...
    call npm install
)

call npm run dev
pause
