@echo off
chcp 65001 >nul
title Rescate Alimentario - Iniciando Plataforma
color 0A

echo =======================================================
echo          RESCATE ALIMENTARIO - INICIO
echo =======================================================
echo.

:: 1. Ir a la carpeta del proyecto
cd /d "%~dp0"

:: 2. Verificar y arrancar PostgreSQL
echo [1/2] Verificando servicio de Base de Datos PostgreSQL...
sc query postgresql-x64-17 2>nul | findstr /I "RUNNING" >nul
if %ERRORLEVEL% equ 0 (
    echo       [OK] PostgreSQL ya está en ejecución (puerto 5432).
) else (
    echo       Iniciando servicio postgresql-x64-17...
    net start postgresql-x64-17 2>nul
    if %ERRORLEVEL% equ 0 (
        echo       [OK] PostgreSQL iniciado correctamente.
    ) else (
        echo       [!] Nota: Si PostgreSQL no inició, asegúrate de ejecutar este BAT
        echo           como Administrador o iniciar el servicio desde Servicios de Windows.
    )
)

echo.

:: 3. Verificar dependencias del Front-End
echo [2/2] Verificando Front-End...
if not exist "node_modules\" (
    echo       No se encontró la carpeta node_modules. Instalando dependencias...
    call npm install
)

echo.
echo =======================================================
echo  Base de Datos:  PostgreSQL (localhost:5432)
echo  Front-End:      http://localhost:5173
echo =======================================================
echo.
echo Presiona Ctrl+C en cualquier momento para detener el Front-End.
echo.

:: 4. Lanzar el Front-End abriendo el navegador automáticamente
npm run dev -- --open

pause
