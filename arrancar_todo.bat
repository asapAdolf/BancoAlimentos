@echo off
chcp 65001 >nul
title Rescate Alimentario - Inicio Completo
color 0E

echo =======================================================
echo     RESCATE ALIMENTARIO - INICIO COMPLETO
echo        (PostgreSQL + Flask: front-end y API)
echo =======================================================
echo.

cd /d "%~dp0"

:: 1. PostgreSQL
echo [1/2] Verificando PostgreSQL...
sc query postgresql-x64-17 2>nul | findstr /I "RUNNING" >nul
if %ERRORLEVEL% equ 0 (
    echo       [OK] PostgreSQL en ejecución (5432).
) else (
    echo       Iniciando servicio de PostgreSQL...
    net start postgresql-x64-17 2>nul
)

:: 2. Flask (sirve las pantallas y la API /api en el puerto 5000)
echo [2/2] Levantando Servidor Flask (puerto 5000)...
echo.
echo  Front-End:  http://127.0.0.1:5000
echo  API salud:  http://127.0.0.1:5000/api/salud
echo.
echo Presiona Ctrl+C para detener el servidor.
echo.
start "" http://127.0.0.1:5000
python run.py
