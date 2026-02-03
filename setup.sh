#!/bin/bash

# 🎮 My Favourite Things V2 - Setup Script
# Este script configura el entorno de desarrollo completo

set -e  # Exit on error

echo "🎮 My Favourite Things V2 - Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js version
echo "📦 Verificando dependencias..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js 18+ desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js versión $NODE_VERSION es muy antigua${NC}"
    echo "Por favor actualiza a Node.js 18+ desde https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) instalado${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) instalado${NC}"
echo ""

# Setup Backend
echo "🔧 Configurando Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Creando backend/.env desde .env.example${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edita backend/.env con tu MONGODB_URI${NC}"
    echo ""
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    npm install
    echo -e "${GREEN}✅ Backend dependencies instaladas${NC}"
else
    echo -e "${GREEN}✅ Backend dependencies ya instaladas${NC}"
fi

cd ..
echo ""

# Setup Frontend
echo "🎨 Configurando Frontend..."
cd frontend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Creando frontend/.env desde .env.example${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Frontend .env creado (valores por defecto OK para desarrollo)${NC}"
    echo ""
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
    echo -e "${GREEN}✅ Frontend dependencies instaladas${NC}"
else
    echo -e "${GREEN}✅ Frontend dependencies ya instaladas${NC}"
fi

cd ..
echo ""

# Final instructions
echo "=================================="
echo -e "${GREEN}🎉 Setup completado!${NC}"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Configura tu MongoDB:"
echo "   - Ve a https://www.mongodb.com/cloud/atlas"
echo "   - Crea un cluster gratuito"
echo "   - Obtén tu connection string"
echo "   - Edita backend/.env y reemplaza MONGODB_URI"
echo ""
echo "2. Ejecuta el backend:"
echo "   ${YELLOW}cd backend && npm run dev${NC}"
echo ""
echo "3. En otra terminal, ejecuta el frontend:"
echo "   ${YELLOW}cd frontend && npm run dev${NC}"
echo ""
echo "4. Abre tu navegador en:"
echo "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo "📖 Para más información, lee:"
echo "   - README.md"
echo "   - DEPLOYMENT_V2.md"
echo "   - ARCHITECTURE.md"
echo ""
echo "¡Diviértete jugando! 🎮❤️"
