@echo off
REM 🎮 My Favourite Things V2 - Desarrollo Local (Windows)

echo 🎮 My Favourite Things V2 - Modo Desarrollo
echo ==========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado
    exit /b 1
)

echo ✅ Node.js instalado
node -v
echo.

REM Install dependencies if needed
if not exist backend\node_modules (
    echo 📦 Instalando dependencias del backend...
    cd backend
    call npm install
    cd ..
)

if not exist frontend\node_modules (
    echo 📦 Instalando dependencias del frontend...
    cd frontend
    call npm install
    cd ..
)

echo ✅ Dependencias instaladas
echo.

REM Check .env files
if not exist backend\.env (
    echo ⚠️ backend\.env no encontrado
    echo Creando desde .env.example...
    copy backend\.env.example backend\.env
    echo ⚠️ IMPORTANTE: Edita backend\.env con tu MONGODB_URI
    echo.
)

if not exist frontend\.env (
    echo ⚠️ frontend\.env no encontrado
    echo Creando desde .env.example...
    copy frontend\.env.example frontend\.env
    echo ✅ Frontend .env creado (valores por defecto OK para desarrollo)
    echo.
)

echo 🚀 Iniciando servidor...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener
echo.

REM Start both in separate windows
start "Backend - My Favourite Things" cmd /k "cd backend && npm run dev"
start "Frontend - My Favourite Things" cmd /k "cd frontend && npm run dev"

echo ✅ Servicios iniciados en ventanas separadas
echo.
pause
