# 📱 Guía de Instalación PWA - FitTracker

## 🎯 ¿Qué es una PWA?

Una **Progressive Web App (PWA)** permite que tu aplicación web funcione como una app nativa:
- ✅ **Icono en la pantalla de inicio** del móvil
- ✅ **Funciona offline** (caché local)
- ✅ **Pantalla completa** (sin barra del navegador)
- ✅ **Notificaciones push** (preparado para futuro)
- ✅ **Wake Lock** (pantalla no se apaga durante workouts)
- ✅ **Más rápida** (recursos cacheados)

---

## 📋 Checklist de Implementación

### ✅ 1. Archivos Creados

- [x] `manifest.json` - Configuración PWA
- [x] `service-worker.js` - Cache y offline
- [x] `registerServiceWorker.js` - Utilidad de registro
- [x] `index.html` - Meta tags PWA
- [x] `main.jsx` - Registro del SW

### 📁 2. Estructura de Carpetas Necesaria

```
public/
├── manifest.json              ← Copiar aquí
├── service-worker.js          ← Copiar aquí
├── icons/
│   ├── favicon.png            ← Crear 32x32
│   ├── icon-72x72.png         ← Generar con herramienta
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png       ← REQUERIDO
│   ├── icon-384x384.png
│   ├── icon-512x512.png       ← REQUERIDO
│   ├── icon-180x180.png       (iOS)
│   └── icon-167x167.png       (iOS)
├── splash/                    (Opcional - iOS)
│   ├── iphone5_splash.png
│   ├── iphone6_splash.png
│   ├── iphonex_splash.png
│   └── ...
├── screenshots/               (Opcional)
│   ├── dashboard-mobile.png
│   └── workout-mobile.png
└── browserconfig.xml          (Opcional - Windows)

src/
├── utils/
│   └── registerServiceWorker.js  ← Copiar aquí
├── main.jsx                      ← Actualizar
└── index.html                    ← Actualizar (root)
```

---

## 🖼️ 3. Generar Iconos

### Opción A: PWA Asset Generator (Recomendado) ⭐

1. **Crear un logo base** (512x512px o mayor, PNG con fondo)
    - Puede ser el emoji 💪 sobre fondo indigo
    - O un diseño custom

2. **Usar herramienta online:**
    - https://www.pwabuilder.com/imageGenerator
    - https://realfavicongenerator.net/
    - https://favicon.io/

3. **Subir tu logo** → Genera automáticamente todos los tamaños

4. **Descargar el pack** → Copiar a `/public/icons/`

### Opción B: Manual con Figma/Photoshop

Crear manualmente estos tamaños:
- 72x72, 96x96, 128x128, 144x144, 152x152
- **192x192** (Android)
- 384x384
- **512x512** (Android)
- 180x180 (iOS)
- 167x167 (iPad)

---

## 🚀 4. Pasos de Instalación

### A) Copiar Archivos

```bash
# 1. Copiar manifest.json
cp manifest.json /public/manifest.json

# 2. Copiar service worker
cp service-worker.js /public/service-worker.js

# 3. Copiar utilidad
cp registerServiceWorker.js /src/utils/registerServiceWorker.js

# 4. Actualizar index.html
cp index.html /index.html

# 5. Actualizar main.jsx
cp main.jsx /src/main.jsx
```

### B) Generar Iconos

**Usando PWA Builder:**
1. Ir a https://www.pwabuilder.com/imageGenerator
2. Subir logo 512x512px
3. Seleccionar: "Generate all sizes"
4. Descargar ZIP
5. Extraer a `/public/icons/`

**O crear un logo simple con código:**

```bash
# Crear directorio
mkdir -p public/icons

# Generar con ImageMagick (si lo tienes)
convert -size 512x512 -background "#4f46e5" -fill white -gravity center -pointsize 200 label:"💪" public/icons/icon-512x512.png

# Redimensionar automáticamente
for size in 72 96 128 144 152 192 384; do
  convert public/icons/icon-512x512.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png
done
```

### C) Verificar en Localhost

```bash
# 1. Iniciar dev server
npm run dev

# 2. Abrir Chrome DevTools → Application
# 3. Verificar:
#    - Manifest
#    - Service Workers
#    - Cache Storage
```

---

## 🧪 5. Testing

### En Chrome Desktop:

1. **Abrir DevTools** (F12)
2. **Application tab** → Manifest
    - ✅ Verificar que aparece el manifest
    - ✅ Ver iconos cargados
3. **Service Workers**
    - ✅ Ver "Active" en verde
4. **Cache Storage**
    - ✅ Ver cache creada

### En Chrome Android:

1. **Abrir la app** en Chrome
2. **Ver banner de instalación** (si aparece)
    - O menú ⋮ → "Instalar app"
3. **Instalar en pantalla de inicio**
4. **Abrir desde icono** → Debe verse como app

### En Safari iOS:

1. **Abrir en Safari**
2. **Botón "Compartir"** (cuadrado con flecha)
3. **"Añadir a pantalla de inicio"**
4. **Dar nombre** → Añadir
5. **Abrir desde icono** → Debe verse como app

---

## 🔍 6. Verificación de PWA

### Lighthouse Audit

```bash
# En Chrome DevTools → Lighthouse
# Seleccionar: Progressive Web App
# Run audit
```

**Criterios importantes:**
- ✅ Manifest válido
- ✅ Service Worker registrado
- ✅ Funciona offline
- ✅ HTTPS (en producción)
- ✅ Viewport configurado
- ✅ Iconos correctos

### PWA Builder Check

1. Ir a https://www.pwabuilder.com/
2. Ingresar URL de tu app (después de deploy)
3. Ver score y recomendaciones

---

## 📦 7. Build para Producción

### Actualizar vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Copiar service worker a dist
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  // Importante: No minificar el service-worker
  publicDir: 'public',
});
```

### Build y Deploy

```bash
# 1. Build
npm run build

# 2. Verificar que dist/ contiene:
#    - manifest.json
#    - service-worker.js
#    - /icons/*

# 3. Deploy a Vercel/Netlify
vercel --prod
# o
netlify deploy --prod
```

---

## 🌐 8. Deploy en Vercel

### Configuración Necesaria

**vercel.json:**
```json
{
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        },
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🐛 9. Troubleshooting

### Service Worker no se registra

```javascript
// Verificar en consola:
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker soportado');
} else {
  console.log('❌ Service Worker NO soportado');
}
```

**Soluciones:**
- ✅ Verificar que estás en HTTPS (o localhost)
- ✅ Verificar que `/service-worker.js` existe
- ✅ Limpiar cache y hard reload (Ctrl+Shift+R)

### Iconos no aparecen

**Soluciones:**
- ✅ Verificar rutas en manifest.json (`/icons/icon-192x192.png`)
- ✅ Verificar que los archivos existen en `/public/icons/`
- ✅ Hard reload + limpiar Application Storage

### App no funciona offline

**Soluciones:**
- ✅ Verificar Cache Storage en DevTools
- ✅ Verificar estrategia de cache en service-worker.js
- ✅ Desactivar wifi y probar navegación

### Manifest no se carga

**Soluciones:**
- ✅ Verificar link en index.html: `<link rel="manifest" href="/manifest.json">`
- ✅ Verificar Content-Type en headers: `application/manifest+json`
- ✅ Validar JSON en https://manifest-validator.appspot.com/

---

## ✅ 10. Checklist Final

Antes de deploy, verificar:

- [ ] ✅ manifest.json en `/public/`
- [ ] ✅ service-worker.js en `/public/`
- [ ] ✅ Iconos generados (192x192 y 512x512 mínimo)
- [ ] ✅ index.html actualizado con meta tags
- [ ] ✅ main.jsx registra el Service Worker
- [ ] ✅ Build funciona: `npm run build`
- [ ] ✅ Test local: Service Worker activo
- [ ] ✅ Test local: Cache funciona
- [ ] ✅ Test local: Iconos se ven bien
- [ ] ✅ HTTPS habilitado en producción
- [ ] ✅ Lighthouse PWA score > 90

---

## 🎉 11. Post-Instalación

### Características Adicionales (Futuro)

**Notificaciones Push:**
```javascript
// Ya preparado en service-worker.js
// Solo necesitas:
// 1. Configurar Firebase Cloud Messaging o similar
// 2. Pedir permiso al usuario
// 3. Enviar notificaciones desde backend
```

**Shortcuts (Atajos):**
- Ya configurado en manifest.json
- En Android: Long press en icono → accesos rápidos

**Share Target:**
```json
// Añadir a manifest.json para compartir a la app
"share_target": {
  "action": "/share",
  "method": "POST",
  "enctype": "multipart/form-data",
  "params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}
```

---

## 📚 Recursos Útiles

- **PWA Builder:** https://www.pwabuilder.com/
- **Manifest Generator:** https://app-manifest.firebaseapp.com/
- **Icon Generator:** https://realfavicongenerator.net/
- **Lighthouse:** Chrome DevTools → Lighthouse tab
- **MDN PWA Guide:** https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- **Google PWA Checklist:** https://web.dev/pwa-checklist/

---

## 🚨 Notas Importantes

1. **HTTPS Requerido:** Service Workers solo funcionan en HTTPS (o localhost)
2. **Cache Strategy:** Usa "Cache First" para assets, "Network First" para API
3. **Versioning:** Cambia `CACHE_NAME` en SW cuando actualices la app
4. **iOS Safari:** Soporte limitado, pero básico funciona
5. **Testing:** Siempre probar en dispositivos reales (Android + iOS)

---

**¡Tu app ahora es una PWA completa! 🎉**

Usuarios pueden instalarla en su pantalla de inicio y usarla como una app nativa.