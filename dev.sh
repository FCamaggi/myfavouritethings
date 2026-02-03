#!/bin/bash

# 🎮 My Favourite Things V2 - Desarrollo Local
# Inicia backend y frontend simultáneamente

set -e

echo "🎮 My Favourite Things V2 - Modo Desarrollo"
echo "=========================================="
echo ""

# Check if in correct directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
    echo "❌ Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"
echo ""

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd frontend && npm install && cd ..
fi

echo "✅ Dependencias instaladas"
echo ""

# Check .env files
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env no encontrado"
    echo "Creando desde .env.example..."
    cp backend/.env.example backend/.env
    echo "⚠️  IMPORTANTE: Edita backend/.env con tu MONGODB_URI"
    echo ""
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env no encontrado"
    echo "Creando desde .env.example..."
    cp frontend/.env.example frontend/.env
    echo "✅ Frontend .env creado (valores por defecto OK para desarrollo)"
    echo ""
fi

echo "🚀 Iniciando servidor..."
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Presiona Ctrl+C para detener ambos servicios"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend in background
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for both processes
wait
