@echo off
chcp 65001 >nul
title Rescate Alimentario - Inicio Completo
color 0E

echo =======================================================
echo     RESCATE ALIMENTARIO - INICIO COMPLETO
echo   (PostgreSQL + Back-End Flask + Front-End Vite)
echo =======================================================
echo.

cd /d "%~dp0"

:: 1. PostgreSQL
echo [1/3] Verificando PostgreSQL...
sc query postgresql-x64-17 2>nul | findstr /I "RUNNING" >nul
if %ERRORLEVEL% equ 0 (
    echo       [OK] PostgreSQL en ejecución (5432).
) else (
    echo       Iniciando servicio de PostgreSQL...
    net start postgresql-x64-17 2>nul
)

:: 2. Flask en ventana independiente
echo [2/3] Levantando Servidor Flask (puerto 5000)...
start "Flask API" cmd /k "python app.py"

:: 3. Front-End Vite
echo [3/3] Levantando Front-End Vite (puerto 5173)...
echo.
echo Presiona Ctrl+C para detener el Front-End.
echo.
npm run dev -- --open
