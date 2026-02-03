@echo off
REM 🎮 My Favourite Things V2 - Setup Script (Windows)
REM Este script configura el entorno de desarrollo completo

echo 🎮 My Favourite Things V2 - Setup
echo ==================================
echo.

REM Check Node.js
echo 📦 Verificando dependencias...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado
    echo Por favor instala Node.js 18+ desde https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js instalado
node -v

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm no está instalado
    exit /b 1
)

echo ✅ npm instalado
npm -v
echo.

REM Setup Backend
echo 🔧 Configurando Backend...
cd backend

if not exist .env (
    echo ⚠️ Creando backend\.env desde .env.example
    copy .env.example .env
    echo ⚠️ IMPORTANTE: Edita backend\.env con tu MONGODB_URI
    echo.
)

if not exist node_modules (
    echo 📦 Instalando dependencias del backend...
    call npm install
    echo ✅ Backend dependencies instaladas
) else (
    echo ✅ Backend dependencies ya instaladas
)

cd ..
echo.

REM Setup Frontend
echo 🎨 Configurando Frontend...
cd frontend

if not exist .env (
    echo ⚠️ Creando frontend\.env desde .env.example
    copy .env.example .env
    echo ✅ Frontend .env creado (valores por defecto OK para desarrollo)
    echo.
)

if not exist node_modules (
    echo 📦 Instalando dependencias del frontend...
    call npm install
    echo ✅ Frontend dependencies instaladas
) else (
    echo ✅ Frontend dependencies ya instaladas
)

cd ..
echo.

REM Final instructions
echo ==================================
echo 🎉 Setup completado!
echo.
echo 📋 Próximos pasos:
echo.
echo 1. Configura tu MongoDB:
echo    - Ve a https://www.mongodb.com/cloud/atlas
echo    - Crea un cluster gratuito
echo    - Obtén tu connection string
echo    - Edita backend\.env y reemplaza MONGODB_URI
echo.
echo 2. Ejecuta el backend (en una terminal):
echo    cd backend ^&^& npm run dev
echo.
echo 3. En otra terminal, ejecuta el frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 4. Abre tu navegador en:
echo    http://localhost:3000
echo.
echo 📖 Para más información, lee:
echo    - README.md
echo    - DEPLOYMENT_V2.md
echo    - ARCHITECTURE.md
echo.
echo ¡Diviértete jugando! 🎮❤️

pause
