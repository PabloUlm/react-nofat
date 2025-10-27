# 🚀 Quick Start - PWA FitTracker

## 📦 Archivos Descargados

Has descargado estos archivos para convertir FitTracker en PWA:

### ✅ Archivos Principales (5)

1. **manifest.json** → `/public/manifest.json`
    - Configuración de la PWA (nombre, iconos, colores, etc.)

2. **service-worker.js** → `/public/service-worker.js`
    - Maneja cache y funcionalidad offline

3. **registerServiceWorker.js** → `/src/utils/registerServiceWorker.js`
    - Utilidad para registrar el Service Worker

4. **index.html** → `/index.html` (reemplazar)
    - Con meta tags PWA completos

5. **main.jsx** → `/src/main.jsx` (actualizar)
    - Registra el Service Worker al iniciar

### 📄 Archivos Opcionales (2)

6. **PWAInstallPrompt.jsx** → `/src/components/common/PWAInstallPrompt.jsx`
    - Componente React para mostrar banner de instalación custom

7. **PWA_INSTALLATION_GUIDE.md** → Para referencia
    - Guía completa paso a paso

---

## ⚡ Instalación Rápida (5 minutos)

### Paso 1: Copiar Archivos Base
```bash
# En la raíz de tu proyecto:

# Crear carpeta utils si no existe
mkdir -p src/utils

# Copiar archivos
cp manifest.json public/manifest.json
cp service-worker.js public/service-worker.js
cp registerServiceWorker.js src/utils/registerServiceWorker.js
cp index.html index.html
cp main.jsx src/main.jsx

# Opcional: Componente de instalación
mkdir -p src/components/common
cp PWAInstallPrompt.jsx src/components/common/PWAInstallPrompt.jsx
```

### Paso 2: Generar Iconos (IMPORTANTE)

**Opción A - Rápida (Recomendada):**

1. Ir a → https://www.pwabuilder.com/imageGenerator
2. Subir un logo 512x512px (puede ser simple)
3. Click "Generate Zip"
4. Descargar y extraer en `/public/icons/`

**Opción B - Logo Simple con Emoji:**

Crear archivo temporal `generate-icon.html`:
```html
<!DOCTYPE html>
<canvas id="canvas" width="512" height="512"></canvas>
<script>
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  // Fondo indigo
  ctx.fillStyle = '#4f46e5';
  ctx.fillRect(0, 0, 512, 512);
  
  // Emoji
  ctx.font = 'bold 300px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💪', 256, 270);
  
  // Descargar
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'icon-512x512.png';
    a.click();
  });
</script>
```

Abrir en navegador → Descarga automática → Guardar en `/public/icons/`

Luego redimensionar:
```bash
# Si tienes ImageMagick instalado:
cd public/icons
for size in 72 96 128 144 152 192 384; do
  convert icon-512x512.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

### Paso 3: Añadir Componente al App (Opcional)

```javascript
// src/App.jsx
import PWAInstallPrompt from './components/common/PWAInstallPrompt';

function App() {
  // ... tu código existente
  
  return (
    <>
      <PWAInstallPrompt />  {/* ← Añadir aquí */}
      {/* ... resto de tu app */}
    </>
  );
}
```

### Paso 4: Verificar
```bash
npm run dev
```

Abrir Chrome DevTools → Application:
- ✅ Manifest debe aparecer
- ✅ Service Workers → "Activated and running"
- ✅ Icons deben cargarse

---

## 🎯 Estructura Final

```
fitness-tracker/
├── public/
│   ├── manifest.json          ✅
│   ├── service-worker.js      ✅
│   └── icons/
│       ├── icon-72x72.png     ← GENERAR
│       ├── icon-96x96.png     ← GENERAR
│       ├── icon-128x128.png   ← GENERAR
│       ├── icon-144x144.png   ← GENERAR
│       ├── icon-152x152.png   ← GENERAR
│       ├── icon-192x192.png   ← GENERAR (REQUERIDO)
│       ├── icon-384x384.png   ← GENERAR
│       └── icon-512x512.png   ← GENERAR (REQUERIDO)
├── src/
│   ├── components/
│   │   └── common/
│   │       └── PWAInstallPrompt.jsx  ✅ (Opcional)
│   ├── utils/
│   │   └── registerServiceWorker.js  ✅
│   ├── main.jsx               ✅ (Actualizar)
│   └── App.jsx                (Añadir PWAInstallPrompt)
└── index.html                 ✅ (Actualizar)
```

---

## 🧪 Testing Local

### Test 1: Manifest
```
1. Abrir http://localhost:5173
2. DevTools → Application → Manifest
3. Debe mostrar "FitTracker - Entrenamiento AMRAP"
4. Ver iconos listados
```

### Test 2: Service Worker
```
1. DevTools → Application → Service Workers
2. Debe mostrar "Activated and running"
3. Console debe mostrar: "✅ Service Worker activado"
```

### Test 3: Cache
```
1. DevTools → Application → Cache Storage
2. Debe aparecer: "fittracker-v1.0.0"
3. Ver archivos cacheados
```

### Test 4: Offline
```
1. DevTools → Network tab
2. Cambiar a "Offline"
3. Recargar página (F5)
4. Debe seguir funcionando (aunque con datos viejos)
```

---

## 📱 Testing en Móvil

### Android (Chrome)

1. **Abrir en Chrome**
2. **Menú ⋮** → "Instalar app"
3. **Confirmar**
4. **Icono aparece** en pantalla de inicio
5. **Abrir desde icono** → Funciona como app

### iOS (Safari)

1. **Abrir en Safari**
2. **Botón Compartir** (cuadrado con flecha ↑)
3. **"Añadir a pantalla de inicio"**
4. **Dar nombre** → Añadir
5. **Icono aparece** en pantalla de inicio
6. **Abrir desde icono** → Funciona como app

---

## 🚀 Deploy a Producción

### Vercel

```bash
# 1. Verificar build
npm run build

# 2. Comprobar que dist/ tiene:
ls dist/manifest.json
ls dist/service-worker.js
ls dist/icons/

# 3. Deploy
vercel --prod

# 4. Abrir URL y verificar
```

### Configuración Vercel (vercel.json)

Crear `vercel.json` en la raíz:

```json
{
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## ✅ Checklist Final

Antes de deploy:

- [ ] manifest.json en `/public/`
- [ ] service-worker.js en `/public/`
- [ ] Iconos 192x192 y 512x512 mínimo
- [ ] index.html actualizado
- [ ] main.jsx registra SW
- [ ] `npm run build` funciona
- [ ] Test local: SW activo
- [ ] Test local: Cache funciona
- [ ] Test móvil: Instalación funciona

---

## 🆘 Problemas Comunes

### "Service Worker no se registra"
```javascript
// Verificar en consola del navegador:
if ('serviceWorker' in navigator) {
  console.log('✅ Soportado');
} else {
  console.log('❌ NO soportado');
}
```

**Solución:** Verificar que estás en HTTPS (o localhost)

### "Icons not found"
**Solución:**
- Verificar rutas en manifest.json
- Verificar que archivos existen en `/public/icons/`
- Hard reload (Ctrl+Shift+R)

### "Manifest not loading"
**Solución:**
- Verificar `<link rel="manifest" href="/manifest.json">` en index.html
- Verificar que archivo existe en `/public/`
- Limpiar Application Storage en DevTools

---

## 📚 Recursos

- **Icon Generator:** https://www.pwabuilder.com/imageGenerator
- **Manifest Validator:** https://manifest-validator.appspot.com/
- **Lighthouse:** Chrome DevTools → Lighthouse
- **Guía Completa:** Ver `PWA_INSTALLATION_GUIDE.md`

---

## 🎉 ¡Listo!

Tu app ahora es una PWA. Usuarios pueden:
- ✅ Instalarla en pantalla de inicio
- ✅ Usarla offline (con limitaciones)
- ✅ Disfrutar de carga más rápida
- ✅ Experiencia similar a app nativa

**Next Steps:**
1. Deploy a producción
2. Probar instalación en móvil real
3. Ejecutar Lighthouse audit
4. ¡Compartir con usuarios!

💪 **¡A entrenar con tu nueva PWA!**