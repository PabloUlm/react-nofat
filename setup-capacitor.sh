#!/bin/bash

# Script de instalación de Capacitor para NO FAT App
# Ejecuta este script en la raíz de tu proyecto

echo "📦 Instalando Capacitor Core..."
npm install @capacitor/core @capacitor/cli

echo "🔧 Inicializando Capacitor..."
echo "Cuando te pregunte, usa estos valores:"
echo "  App name: NO FAT"
echo "  App ID: com.nofat.app"
echo "  Web dir: dist"
npx cap init

echo "📱 Instalando plataformas..."
npm install @capacitor/android
npx cap add android

# iOS (opcional por ahora)
# npm install @capacitor/ios
# npx cap add ios

echo "🔌 Instalando plugins nativos..."

# Notificaciones locales
npm install @capacitor/local-notifications

# Mantener pantalla encendida
npm install @capacitor-community/keep-awake

# Splash screen
npm install @capacitor/splash-screen

# Status bar
npm install @capacitor/status-bar

# Hápticos/vibración
npm install @capacitor/haptics

# Storage (reemplazo de localStorage)
npm install @capacitor/preferences

# App (información de la app)
npm install @capacitor/app

echo "✅ Instalación completada!"
echo ""
echo "Siguiente paso: Ejecutar 'npx cap init' manualmente si no se ejecutó automáticamente"
echo "Luego continúa con los cambios de código."