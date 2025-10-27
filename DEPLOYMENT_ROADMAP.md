# 🚀 FitTracker - Roadmap de Deployment

Plan completo para llevar FitTracker de desarrollo local a producción real, dividido en 3 fases progresivas.

---

## 📊 Resumen General

| Fase | Tiempo Estimado | Costo | Resultado |
|------|----------------|-------|-----------|
| **Fase 1: MVP Live** | 1-2 horas | $0 | App funcionando online |
| **Fase 2: Base de Datos Real** | 3-5 días | $0 | Datos persistentes + sincronización |
| **Fase 3: Producción Completa** | 2-3 semanas | $10-20/mes | Backend completo + features avanzadas |

---

## 🎯 FASE 1: Deploy Inicial (MVP Live)

**Objetivo:** Tener la app funcionando online con localStorage
**Tiempo:** 1-2 horas
**Costo:** $0

### ✅ TODO List - Fase 1

- [x] **1.1 Preparar el Repositorio**
  - [x] Asegurar que todo el código está commiteado
  - [x] Verificar que no hay archivos sensibles (API keys en .env)
  - [x] Push a GitHub (si no está ya)
  ```bash
  git add .
  git commit -m "Prepare for deployment"
  git push origin main
  ```

- [x] **1.2 Crear Cuenta en Vercel**
  - [ ] Ir a https://vercel.com
  - [ ] Sign up con GitHub (recomendado)
  - [ ] Autorizar acceso a tus repositorios

- [x] **1.3 Conectar Repositorio**
  - [ ] Click en "Add New Project"
  - [ ] Seleccionar repositorio `fitness-tracker`
  - [ ] Configuración detectada automáticamente (Vite)
  - [ ] **Build Command:** `npm run build`
  - [ ] **Output Directory:** `dist`
  - [ ] **Install Command:** `npm install`

- [x] **1.4 Configurar Variables de Entorno** (si aplica)
  - [ ] En Vercel: Settings → Environment Variables
  - [ ] Añadir cualquier variable que uses (por ahora ninguna)

- [x] **1.5 Deploy**
  - [ ] Click "Deploy"
  - [ ] Esperar 2-3 minutos
  - [ ] ✅ **¡TU APP ESTÁ LIVE!**

- [ ] **1.6 Verificar Funcionalidad**
  - [ ] Abrir la URL de Vercel (ej: `fitness-tracker-xyz.vercel.app`)
  - [ ] Login con un usuario
  - [ ] Generar workout
  - [ ] Completar workout
  - [ ] Registrar sesión
  - [ ] Verificar que todo funcione correctamente

- [ ] **1.7 Compartir y Recoger Feedback**
  - [ ] Compartir URL con amigos/familia
  - [ ] Crear lista de feedback recibido
  - [ ] Priorizar mejoras

**🎉 Resultado:** App funcionando en `https://tu-proyecto.vercel.app`

---

## 💾 FASE 2: Base de Datos Real + Mejoras UX

**Objetivo:** Datos persistentes, sincronización multi-dispositivo, mejor UX
**Tiempo:** 3-5 días
**Costo:** $0 (tier gratuito de Supabase)

### ✅ TODO List - Fase 2A: Supabase Setup

- [ ] **2.1 Crear Cuenta en Supabase**
  - [ ] Ir a https://supabase.com
  - [ ] Sign up (recomendado con GitHub)
  - [ ] Crear nuevo proyecto
  - [ ] Nombre: `fittracker`
  - [ ] Región: Elegir la más cercana (Europe West)
  - [ ] Generar password seguro (guardar en lugar seguro)
  - [ ] Esperar ~2 minutos a que se cree el proyecto

- [ ] **2.2 Configurar Tablas en Supabase**
  
  **Tabla: players**
  - [ ] Ir a Table Editor → Create New Table
  - [ ] Nombre: `players`
  - [ ] Columnas:
    ```sql
    id (uuid, primary key, default: gen_random_uuid())
    created_at (timestamptz, default: now())
    name (text, required)
    email (text, required, unique)
    photo (text)
    warnings (int4, default: 0)
    streak (int4, default: 0)
    total_sessions (int4, default: 0)
    last_session_date (timestamptz)
    muscle_points (jsonb, default: {})
    ```
  - [ ] Enable Row Level Security (RLS)
  - [ ] Crear política: Allow all (por ahora)

  **Tabla: sessions**
  - [ ] Create New Table
  - [ ] Nombre: `sessions`
  - [ ] Columnas:
    ```sql
    id (uuid, primary key, default: gen_random_uuid())
    created_at (timestamptz, default: now())
    player_id (uuid, foreign key → players.id)
    date (timestamptz, required)
    photo (text)
    result (text, required)
    week_number (int4, required)
    is_recovery (boolean, default: false)
    workout_id (uuid, nullable)
    rounds (int4, nullable)
    muscle_points_earned (jsonb, default: {})
    ```
  - [ ] Enable RLS
  - [ ] Crear política: Allow all

  **Tabla: workouts**
  - [ ] Create New Table
  - [ ] Nombre: `workouts`
  - [ ] Columnas:
    ```sql
    id (uuid, primary key, default: gen_random_uuid())
    created_at (timestamptz, default: now())
    week_focus (int4, required)
    exercises (jsonb, required)
    total_potential_points (numeric)
    ```
  - [ ] Enable RLS
  - [ ] Crear política: Allow all

- [ ] **2.3 Obtener Credenciales de Supabase**
  - [ ] Ir a Settings → API
  - [ ] Copiar `Project URL`
  - [ ] Copiar `anon/public key`
  - [ ] Guardar en lugar seguro

- [ ] **2.4 Instalar Dependencias**
  ```bash
  npm install @supabase/supabase-js
  ```

- [ ] **2.5 Configurar Cliente de Supabase**
  - [ ] Crear archivo `src/lib/supabase.js`
  ```javascript
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  ```

- [ ] **2.6 Crear Archivo .env.local**
  - [ ] Crear `.env.local` en la raíz
  ```env
  VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
  VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
  ```
  - [ ] Añadir `.env.local` a `.gitignore`

- [ ] **2.7 Configurar Variables en Vercel**
  - [ ] Vercel Dashboard → Settings → Environment Variables
  - [ ] Añadir `VITE_SUPABASE_URL`
  - [ ] Añadir `VITE_SUPABASE_ANON_KEY`

### ✅ TODO List - Fase 2B: Migración de Redux a Supabase

- [ ] **2.8 Migrar playersSlice**
  
  - [ ] **2.8.1 Crear thunk: fetchPlayers**
    ```javascript
    export const fetchPlayers = () => async (dispatch) => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (!error) {
        // Normalizar y dispatch
      }
    };
    ```
  
  - [ ] **2.8.2 Crear thunk: addWarningAsync**
    ```javascript
    export const addWarningAsync = (playerId) => async (dispatch) => {
      const { data, error } = await supabase
        .from('players')
        .update({ warnings: supabase.rpc('increment', { row_id: playerId }) })
        .eq('id', playerId)
        .select()
        .single();
      
      if (!error) {
        dispatch(updatePlayer(data));
      }
    };
    ```
  
  - [ ] **2.8.3 Crear thunk: updatePlayerStatsAsync**
  - [ ] **2.8.4 Actualizar todos los dispatches en componentes**

- [ ] **2.9 Migrar sessionsSlice**
  
  - [ ] **2.9.1 Crear thunk: fetchSessions**
  - [ ] **2.9.2 Crear thunk: uploadSessionAsync**
    ```javascript
    export const uploadSessionAsync = (sessionData) => async (dispatch) => {
      // Validaciones (mismo código)
      
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          player_id: sessionData.playerId,
          date: sessionData.date,
          photo: sessionData.photo,
          result: sessionData.result,
          week_number: weekNumber,
          is_recovery: sessionData.isRecovery,
          workout_id: sessionData.workoutId,
          rounds: sessionData.rounds,
          muscle_points_earned: sessionData.musclePointsEarned
        })
        .select()
        .single();
      
      if (!error) {
        dispatch(addSession(data));
        // Actualizar stats del jugador
      }
      
      return { success: !error, error: error?.message };
    };
    ```
  
  - [ ] **2.9.3 Crear thunk: deleteSessionAsync**
  - [ ] **2.9.4 Actualizar componentes para usar async thunks**

- [ ] **2.10 Migrar workoutsSlice**
  
  - [ ] **2.10.1 Crear thunk: saveWorkoutAsync**
  - [ ] **2.10.2 Crear thunk: fetchActiveWorkout**
  - [ ] **2.10.3 Actualizar WorkoutGeneratorPage**
  - [ ] **2.10.4 Actualizar WorkoutTimerPage**

- [ ] **2.11 Migrar authSlice (opcional por ahora)**
  - [ ] Por ahora mantener selección simple de usuario
  - [ ] Preparar para auth real en Fase 3

- [ ] **2.12 Eliminar localStorage del store.js**
  - [ ] Comentar o eliminar `loadState()` y `saveState()`
  - [ ] Mantener como backup temporal

### ✅ TODO List - Fase 2C: Mejoras de UX

- [ ] **2.13 Añadir Loading States**
  
  - [ ] **2.13.1 Crear componente LoadingSpinner**
    ```javascript
    // src/components/common/LoadingSpinner.jsx
    export default function LoadingSpinner({ size = 'md' }) {
      const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
      };
      
      return (
        <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`} />
      );
    }
    ```
  
  - [ ] **2.13.2 Añadir loading en Login.jsx**
    ```javascript
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      dispatch(fetchPlayers()).finally(() => setLoading(false));
    }, []);
    
    if (loading) return <LoadingSpinner />;
    ```
  
  - [ ] **2.13.3 Añadir loading en Dashboard.jsx**
  - [ ] **2.13.4 Añadir loading en SessionUpload/WorkoutComplete**
  - [ ] **2.13.5 Añadir loading en LeaderboardPage**
  
- [ ] **2.14 Crear Error Boundary**
  
  - [ ] **2.14.1 Crear componente ErrorBoundary**
    ```javascript
    // src/components/common/ErrorBoundary.jsx
    import { Component } from 'react';
    
    class ErrorBoundary extends Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      
      componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
      }
      
      render() {
        if (this.state.hasError) {
          return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                  ¡Oops! Algo salió mal
                </h1>
                <p className="text-gray-600 mb-4">
                  Ha ocurrido un error inesperado. Por favor, recarga la página.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Recargar Página
                </button>
              </div>
            </div>
          );
        }
        
        return this.props.children;
      }
    }
    
    export default ErrorBoundary;
    ```
  
  - [ ] **2.14.2 Envolver App en ErrorBoundary (main.jsx)**
    ```javascript
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
    ```

- [ ] **2.15 Crear Página 404**
  
  - [ ] **2.15.1 Crear componente NotFound.jsx**
    ```javascript
    // src/pages/NotFound.jsx
    import { useNavigate } from 'react-router-dom';
    
    export default function NotFound() {
      const navigate = useNavigate();
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
            <p className="text-2xl text-gray-600 mb-8">Página no encontrada</p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      );
    }
    ```
  
  - [ ] **2.15.2 Añadir ruta catch-all en App.jsx**
    ```javascript
    <Route path="*" element={<NotFound />} />
    ```

- [ ] **2.16 Añadir Favicon y Meta Tags**
  
  - [ ] **2.16.1 Generar favicon**
    - [ ] Ir a https://favicon.io/
    - [ ] Crear favicon con emoji 💪 o diseño custom
    - [ ] Descargar y poner en `/public`
  
  - [ ] **2.16.2 Actualizar index.html**
    ```html
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <!-- Primary Meta Tags -->
      <title>FitTracker - Tu entrenador personal</title>
      <meta name="title" content="FitTracker - Tu entrenador personal" />
      <meta name="description" content="Registra tus workouts AMRAP, compite con amigos y mantén tu racha de entrenamiento." />
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://tu-app.vercel.app/" />
      <meta property="og:title" content="FitTracker - Tu entrenador personal" />
      <meta property="og:description" content="Registra tus workouts AMRAP, compite con amigos y mantén tu racha de entrenamiento." />
      <meta property="og:image" content="https://tu-app.vercel.app/og-image.png" />
      
      <!-- Twitter -->
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://tu-app.vercel.app/" />
      <meta property="twitter:title" content="FitTracker - Tu entrenador personal" />
      <meta property="twitter:description" content="Registra tus workouts AMRAP, compite con amigos y mantén tu racha de entrenamiento." />
      <meta property="twitter:image" content="https://tu-app.vercel.app/og-image.png" />
    </head>
    ```
  
  - [ ] **2.16.3 Crear imagen OG (opcional)**
    - [ ] Diseñar en Canva: 1200x630px
    - [ ] Guardar en `/public/og-image.png`

- [ ] **2.17 Crear PWA Manifest**
  
  - [ ] **2.17.1 Crear manifest.json**
    ```json
    {
      "name": "FitTracker - Entrenamiento AMRAP",
      "short_name": "FitTracker",
      "description": "Registra tus workouts y compite con amigos",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#ffffff",
      "theme_color": "#4f46e5",
      "orientation": "portrait",
      "icons": [
        {
          "src": "/icon-192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/icon-512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    }
    ```
  
  - [ ] **2.17.2 Generar iconos PWA**
    - [ ] Usar https://realfavicongenerator.net/
    - [ ] Subir logo
    - [ ] Generar pack completo
    - [ ] Guardar en `/public`
  
  - [ ] **2.17.3 Añadir link en index.html**
    ```html
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#4f46e5" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    ```

- [ ] **2.18 Testing Completo**
  - [ ] Probar login y fetch de players
  - [ ] Probar crear nueva sesión
  - [ ] Probar eliminar sesión
  - [ ] Probar generación de workout
  - [ ] Probar timer y completar workout
  - [ ] Probar leaderboard y muscle kings
  - [ ] Probar sistema de warnings
  - [ ] Probar recuperación
  - [ ] Verificar que NO se pierdan datos al recargar
  - [ ] Verificar sincronización multi-dispositivo

- [ ] **2.19 Deploy Actualizado a Vercel**
  - [ ] Commit todos los cambios
  ```bash
  git add .
  git commit -m "Migrate to Supabase + UX improvements"
  git push origin main
  ```
  - [ ] Vercel auto-deploy (~2-3 min)
  - [ ] Verificar que las env vars estén configuradas
  - [ ] Testing en producción

**🎉 Resultado:** App con base de datos real, datos persistentes, mejor UX

---

## 🏗️ FASE 3: Backend Completo + Features Avanzadas

**Objetivo:** Backend custom, cron jobs, autenticación real, imágenes en cloud
**Tiempo:** 2-3 semanas
**Costo:** $10-20/mes

### ✅ TODO List - Fase 3A: Backend Express

- [ ] **3.1 Crear Proyecto Backend**
  ```bash
  mkdir fittracker-backend
  cd fittracker-backend
  npm init -y
  npm install express cors dotenv pg node-cron
  npm install --save-dev nodemon
  ```

- [ ] **3.2 Estructura de Carpetas**
  ```
  fittracker-backend/
  ├── src/
  │   ├── config/
  │   │   └── db.js
  │   ├── controllers/
  │   │   ├── playersController.js
  │   │   ├── sessionsController.js
  │   │   └── workoutsController.js
  │   ├── routes/
  │   │   ├── players.js
  │   │   ├── sessions.js
  │   │   └── workouts.js
  │   ├── middleware/
  │   │   └── auth.js
  │   ├── cron/
  │   │   └── weeklyCompliance.js
  │   └── server.js
  ├── .env
  ├── .gitignore
  └── package.json
  ```

- [ ] **3.3 Configurar Express Server**
  - [ ] Crear `src/server.js` básico
  - [ ] Configurar CORS
  - [ ] Configurar body parser
  - [ ] Configurar rutas básicas

- [ ] **3.4 Conectar a PostgreSQL**
  - [ ] Usar Railway PostgreSQL (configurado en Supabase)
  - [ ] O crear nueva instancia en Railway
  - [ ] Crear `src/config/db.js`
  - [ ] Test de conexión

- [ ] **3.5 Crear Endpoints REST**
  
  **Players:**
  - [ ] `GET /api/players` - Listar todos
  - [ ] `GET /api/players/:id` - Obtener uno
  - [ ] `POST /api/players` - Crear nuevo
  - [ ] `PUT /api/players/:id` - Actualizar
  - [ ] `PUT /api/players/:id/warnings` - Añadir warning
  - [ ] `PUT /api/players/:id/stats` - Actualizar stats
  
  **Sessions:**
  - [ ] `GET /api/sessions` - Listar todas
  - [ ] `GET /api/sessions/player/:playerId` - Por jugador
  - [ ] `POST /api/sessions` - Crear sesión
  - [ ] `DELETE /api/sessions/:id` - Eliminar sesión
  
  **Workouts:**
  - [ ] `GET /api/workouts/:id` - Obtener workout
  - [ ] `POST /api/workouts` - Crear workout

- [ ] **3.6 Testing Local**
  - [ ] Probar todos los endpoints con Postman/Thunder Client
  - [ ] Verificar respuestas y errores
  - [ ] Documentar API (opcional: Swagger)

- [ ] **3.7 Deploy Backend a Railway**
  
  - [ ] **3.7.1 Crear proyecto en Railway**
    - [ ] Ir a https://railway.app
    - [ ] New Project → Deploy from GitHub
    - [ ] Seleccionar repo backend
  
  - [ ] **3.7.2 Configurar variables de entorno**
    - [ ] `DATABASE_URL` (de Railway PostgreSQL)
    - [ ] `PORT` (3000)
    - [ ] `NODE_ENV` (production)
    - [ ] `CORS_ORIGIN` (URL de Vercel frontend)
  
  - [ ] **3.7.3 Deploy**
    - [ ] Railway auto-detecta Node.js
    - [ ] Esperar ~5 minutos
    - [ ] Obtener URL del backend (ej: `fittracker-backend.up.railway.app`)
  
  - [ ] **3.7.4 Verificar salud del backend**
    - [ ] `GET https://tu-backend.railway.app/health`

- [ ] **3.8 Conectar Frontend al Backend**
  
  - [ ] **3.8.1 Crear cliente API**
    ```javascript
    // src/lib/api.js
    const API_URL = import.meta.env.VITE_API_URL;
    
    export const api = {
      players: {
        getAll: () => fetch(`${API_URL}/api/players`).then(r => r.json()),
        getById: (id) => fetch(`${API_URL}/api/players/${id}`).then(r => r.json()),
        update: (id, data) => fetch(`${API_URL}/api/players/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(r => r.json())
      },
      // ... sessions, workouts
    };
    ```
  
  - [ ] **3.8.2 Actualizar Redux thunks para usar API**
  - [ ] **3.8.3 Añadir `VITE_API_URL` en Vercel env vars**
  - [ ] **3.8.4 Testing completo frontend + backend**

### ✅ TODO List - Fase 3B: Cloudinary para Imágenes

- [ ] **3.9 Configurar Cloudinary**
  
  - [ ] **3.9.1 Crear cuenta en Cloudinary**
    - [ ] Ir a https://cloudinary.com
    - [ ] Sign up (gratis: 25GB/mes)
  
  - [ ] **3.9.2 Obtener credenciales**
    - [ ] Dashboard → Account Details
    - [ ] Copiar Cloud Name
    - [ ] Copiar API Key
    - [ ] Copiar API Secret
  
  - [ ] **3.9.3 Instalar SDK en backend**
    ```bash
    npm install cloudinary multer
    ```
  
  - [ ] **3.9.4 Configurar Cloudinary en backend**
    ```javascript
    // src/config/cloudinary.js
    import cloudinary from 'cloudinary';
    
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    export default cloudinary;
    ```
  
  - [ ] **3.9.5 Crear endpoint de upload**
    ```javascript
    // POST /api/upload
    // Recibe base64, sube a Cloudinary, retorna URL
    ```
  
  - [ ] **3.9.6 Actualizar WorkoutCompletePage**
    - [ ] En lugar de guardar base64, hacer upload a Cloudinary
    - [ ] Guardar URL en sesión
  
  - [ ] **3.9.7 Actualizar CameraCapture**
    - [ ] Añadir loading state durante upload
    - [ ] Mostrar preview de imagen subida

- [ ] **3.10 Migrar Imágenes Existentes** (opcional)
  - [ ] Script para subir todas las imágenes de base64 a Cloudinary
  - [ ] Actualizar URLs en base de datos
  - [ ] Limpiar base64 de localStorage

### ✅ TODO List - Fase 3C: Cron Job para Warnings

- [ ] **3.11 Implementar Verificación Automática**
  
  - [ ] **3.11.1 Instalar node-cron**
    ```bash
    npm install node-cron
    ```
  
  - [ ] **3.11.2 Crear job de verificación**
    ```javascript
    // src/cron/weeklyCompliance.js
    import cron from 'node-cron';
    import { checkAllPlayersCompliance } from '../services/complianceService.js';
    
    // Ejecutar cada lunes a las 00:00
    export const weeklyComplianceJob = cron.schedule('0 0 * * 1', async () => {
      console.log('Running weekly compliance check...');
      const results = await checkAllPlayersCompliance();
      console.log('Compliance check completed:', results);
    }, {
      timezone: "Europe/Madrid"
    });
    ```
  
  - [ ] **3.11.3 Crear servicio de compliance**
    ```javascript
    // src/services/complianceService.js
    export async function checkAllPlayersCompliance() {
      // Lógica de checkWeeklyCompliance pero en backend
      // Query a DB para obtener sesiones de semana pasada
      // Añadir warnings donde corresponda
    }
    ```
  
  - [ ] **3.11.4 Iniciar cron en server.js**
    ```javascript
    import { weeklyComplianceJob } from './cron/weeklyCompliance.js';
    weeklyComplianceJob.start();
    ```
  
  - [ ] **3.11.5 Testing del cron job**
    - [ ] Cambiar schedule a cada minuto para probar
    - [ ] Verificar logs
    - [ ] Verificar warnings en DB
    - [ ] Restaurar schedule a lunes 00:00

- [ ] **3.12 Eliminar Verificación Manual del Frontend**
  - [ ] Remover botón de Profile.jsx
  - [ ] Actualizar CLAUDE.md
  - [ ] Añadir nota: "Verificación automática cada lunes"

### ✅ TODO List - Fase 3D: Autenticación Real

- [ ] **3.13 Elegir Provider de Auth**
  - [ ] Opción A: Supabase Auth (más fácil)
  - [ ] Opción B: Auth0 (más features)
  - [ ] Opción C: Clerk (mejor DX)
  - [ ] **Recomendación:** Supabase Auth (ya tienes Supabase)

- [ ] **3.14 Implementar Supabase Auth**
  
  - [ ] **3.14.1 Configurar Auth en Supabase**
    - [ ] Dashboard → Authentication
    - [ ] Habilitar Email provider
    - [ ] Habilitar Google OAuth (opcional)
    - [ ] Configurar email templates
  
  - [ ] **3.14.2 Actualizar authSlice**
    ```javascript
    export const signUpAsync = (email, password) => async (dispatch) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (!error) {
        dispatch(login(data.user));
      }
    };
    
    export const signInAsync = (email, password) => async (dispatch) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        dispatch(login(data.user));
      }
    };
    
    export const signOutAsync = () => async (dispatch) => {
      await supabase.auth.signOut();
      dispatch(logout());
    };
    ```
  
  - [ ] **3.14.3 Crear componentes de Auth**
    - [ ] SignUp.jsx (email + password)
    - [ ] SignIn.jsx (email + password)
    - [ ] Opcionalmente: Google login button
  
  - [ ] **3.14.4 Proteger rutas**
    ```javascript
    // src/components/ProtectedRoute.jsx
    function ProtectedRoute({ children }) {
      const isAuthenticated = useSelector(selectIsAuthenticated);
      return isAuthenticated ? children : <Navigate to="/signin" />;
    }
    ```
  
  - [ ] **3.14.5 Actualizar App.jsx con rutas protegidas**
  
  - [ ] **3.14.6 Conectar users con players**
    - [ ] Cuando user se registra, crear player en DB
    - [ ] auth.user.id → players.auth_user_id

- [ ] **3.15 Implementar Row Level Security (RLS)**
  - [ ] Políticas en Supabase para que users solo vean sus datos
  - [ ] `players`: users solo ven todos (leaderboard)
  - [ ] `sessions`: users solo ven propias
  - [ ] `workouts`: users solo ven propios

- [ ] **3.16 Testing de Auth**
  - [ ] Registro de nuevo usuario
  - [ ] Login
  - [ ] Logout
  - [ ] Protección de rutas
  - [ ] Persistencia de sesión (refresh)

### ✅ TODO List - Fase 3E: Features Finales

- [ ] **3.17 Sistema de Notificaciones**
  - [ ] Opción A: React Toastify
  - [ ] Opción B: Sonner (más moderno)
  - [ ] Instalar y configurar
  - [ ] Añadir notificaciones en:
    - [ ] Sesión registrada con éxito
    - [ ] Error al subir sesión
    - [ ] Warning recibido
    - [ ] Recovery completado
    - [ ] Workout completado

- [ ] **3.18 Analytics (opcional)**
  - [ ] Google Analytics 4
  - [ ] O Vercel Analytics (más simple)
  - [ ] Trackear eventos importantes:
    - [ ] Workouts completados
    - [ ] Sesiones registradas
    - [ ] Warnings recibidos

- [ ] **3.19 Monitoreo y Logs**
  - [ ] Configurar Sentry (error tracking)
  - [ ] O Railway logs monitoring
  - [ ] Alertas para errores críticos

- [ ] **3.20 Performance Optimization**
  - [ ] Code splitting con React.lazy()
  - [ ] Optimizar imágenes (ya tienes con Cloudinary)
  - [ ] Lazy loading de componentes pesados
  - [ ] Memoization con useMemo/useCallback donde aplique

- [ ] **3.21 SEO Final**
  - [ ] Sitemap.xml
  - [ ] robots.txt
  - [ ] Structured data (JSON-LD)

- [ ] **3.22 Testing Final Completo**
  - [ ] Auth flow completo
  - [ ] Workout flow completo
  - [ ] Cron job funcionando
  - [ ] Upload de imágenes
  - [ ] Sincronización multi-dispositivo
  - [ ] Leaderboard actualizado en tiempo real
  - [ ] Performance (Lighthouse score)

- [ ] **3.23 Documentación Final**
  - [ ] README.md actualizado
  - [ ] API documentation
  - [ ] User guide (opcional)
  - [ ] Deployment guide

**🎉 Resultado Final:** App de producción completa con backend, auth real, cron jobs, imágenes en cloud

---

## 📊 Resumen de Costos

| Servicio | Tier Gratuito | Costo Mensual | Límites |
|----------|---------------|---------------|---------|
| **Vercel** | ✅ Ilimitado | $0 | Deploy ilimitados, 100GB bandwidth |
| **Supabase** | ✅ 500MB DB | $0 | 2 proyectos, 500MB, 1GB storage |
| **Railway** | $5 crédito | ~$5-10 | Pay-per-use después de crédito |
| **Cloudinary** | 25GB/mes | $0 | 25 créditos de transformación |
| **Total Fase 1-2** | - | **$0** | - |
| **Total Fase 3** | - | **$5-20/mes** | Escalable |

---

## 🎯 Checklist de Progreso

### Fase 1: MVP Live
- [ ] Cuenta Vercel creada
- [ ] Repo conectado
- [ ] Primera deployment exitosa
- [ ] App accesible públicamente
- [ ] Testing básico completado

### Fase 2: Base de Datos + UX
- [ ] Supabase configurado
- [ ] Tablas creadas
- [ ] Cliente Supabase instalado
- [ ] Redux migrado a async thunks
- [ ] Loading states añadidos
- [ ] Error boundary implementado
- [ ] Página 404 creada
- [ ] Favicon y meta tags actualizados
- [ ] PWA manifest creado
- [ ] Testing completo de sincronización

### Fase 3: Producción Completa
- [ ] Backend Express creado
- [ ] API REST completada
- [ ] Backend deployado en Railway
- [ ] Cloudinary configurado
- [ ] Imágenes migradas a cloud
- [ ] Cron job implementado
- [ ] Auth real funcionando
- [ ] RLS configurado
- [ ] Notificaciones añadidas
- [ ] Analytics configurado (opcional)
- [ ] Performance optimizado
- [ ] Documentación actualizada

---

## 🚨 Troubleshooting Común

### Vercel Build Fails
- [ ] Verificar que `npm run build` funciona localmente
- [ ] Revisar logs de build en Vercel
- [ ] Verificar que todas las dependencias están en `package.json`
- [ ] Verificar variables de entorno

### Supabase Connection Issues
- [ ] Verificar que URL y Key son correctas
- [ ] Verificar que las políticas RLS permiten las queries
- [ ] Revisar logs en Supabase Dashboard
- [ ] Verificar que las tablas existen

### Railway Backend No Responde
- [ ] Verificar logs en Railway Dashboard
- [ ] Verificar que el puerto es correcto (PORT env var)
- [ ] Verificar que DATABASE_URL está configurada
- [ ] Verificar CORS settings

### Imágenes No Se Suben a Cloudinary
- [ ] Verificar credenciales de Cloudinary
- [ ] Verificar límite de tamaño (10MB default)
- [ ] Revisar logs del backend
- [ ] Verificar que el formato es correcto (base64/buffer)

---

## 📚 Recursos Útiles

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Railway Docs:** https://docs.railway.app
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **React Router:** https://reactrouter.com
- **Redux Toolkit:** https://redux-toolkit.js.org
- **Node-cron:** https://github.com/node-cron/node-cron

---

## 🎉 Siguiente Nivel (Post-Launch)

Después de completar todo esto:
- [ ] Marketing: Compartir en redes sociales
- [ ] Feedback: Crear formulario de feedback
- [ ] Roadmap público: Trello/Linear para features futuras
- [ ] Community: Discord/Telegram para usuarios
- [ ] Monetización (opcional): Premium features

---

**💪 ¡Éxito con el deployment! Paso a paso llegarás a producción.**

**Última actualización:** 2025-10-27
**Versión del roadmap:** 1.0.0
