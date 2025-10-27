# 🤖 Claude AI - Contexto del Proyecto

> **Proyecto:** FitTracker - Aplicación de seguimiento de entrenamientos AMRAP
> **Stack:** React + Redux Toolkit + Tailwind CSS + Vite + React Router
> **Propósito:** App educativa para aprender React y Redux con sistema completo de workouts

---

## 📋 Descripción del Proyecto

FitTracker es una aplicación web de fitness que permite a usuarios/jugadores:
- Realizar **workouts AMRAP** (As Many Rounds As Possible) con timer interactivo
- Registrar sesiones de entrenamiento (3 días diferentes por semana)
- Competir en un **leaderboard global** con rankings por grupos musculares
- Sistema de **"Reyes de Músculo"** con badges por categoría (🦵 Piernas, 💪 Brazos, etc.)
- Ver progreso semanal y estadísticas detalladas
- Recibir amonestaciones por incumplimiento
- Realizar ejercicios de recuperación para eliminar amonestaciones
- **Capturar fotos** con la cámara del dispositivo (mobile-first)
- Sistema de **ciclos de 4 semanas** con rotación de grupos musculares

### Reglas de Negocio Importantes
- ✅ Cada usuario debe completar **3 sesiones en 3 días diferentes** cada semana
- ❌ **NO se puede** registrar más de 1 sesión por día
- ❌ **NO se puede** registrar más de 3 días diferentes por semana
- ⚠️ Si no completa 3 días → Recibe una amonestación
- 🔄 Ejercicio de recuperación elimina 1 amonestación
- 💪 **Sistema de ciclos de 4 semanas** con rotación de grupos musculares:
   - Semana 1: Lower Body (piernas, glúteos)
   - Semana 2: Core & Cardio (abdomen, cardio)
   - Semana 3: Upper Body Push (pecho, hombros, tríceps)
   - Semana 4: Upper Body Pull (espalda, bíceps)
- 🏆 **Puntos por dificultad**: Beginner (1x), Intermediate (1.5x), Advanced (2x)
- 👑 **"Rey del músculo"** = jugador con más puntos en cada grupo muscular
- 📸 **Captura con cámara**: Compresión automática a 50-150KB, cambio front/rear

---

## 🗂️ Arquitectura

```
fitness-tracker/
├── src/
│   ├── components/
│   │   ├── player/
│   │   │   └── WarningBadge.jsx       # Indicador de amonestaciones
│   │   ├── session/
│   │   │   ├── SessionUpload.jsx      # [DEPRECATED] Formulario simple
│   │   │   └── WeeklyProgress.jsx     # Barra de progreso semanal
│   │   ├── workout/
│   │   │   ├── WorkoutTimer.jsx       # Timer pantalla completa con navegación
│   │   │   ├── WorkoutPreCountdown.jsx # Countdown 8 segundos antes de iniciar
│   │   │   ├── WorkoutComplete.jsx    # Pantalla post-workout con stats
│   │   │   ├── WorkoutSummary.jsx     # Resumen de workout generado
│   │   │   └── ExerciseList.jsx       # Lista scrollable de ejercicios
│   │   └── camera/
│   │       └── CameraCapture.jsx      # Captura con cámara móvil + compresión
│   ├── pages/
│   │   ├── Login.jsx                  # Selección de usuario
│   │   ├── Dashboard.jsx              # Panel principal con stats
│   │   ├── LeaderboardPage.jsx        # Clasificación global + Reyes de Músculo
│   │   ├── Profile.jsx                # Perfil y recuperación
│   │   ├── WorkoutGeneratorPage.jsx   # Generador de workouts AMRAP
│   │   ├── WorkoutTimerPage.jsx       # Página del timer (ruta: /workout/:id)
│   │   └── WorkoutCompletePage.jsx    # Registro post-workout
│   ├── redux/
│   │   ├── store.js                   # Configuración del store + localStorage
│   │   ├── slices/
│   │   │   ├── authSlice.js          # Autenticación simple
│   │   │   ├── playersSlice.js       # Gestión de jugadores, warnings y muscle points
│   │   │   ├── sessionsSlice.js      # Gestión de sesiones con validaciones
│   │   │   └── workoutsSlice.js      # [NEW!] Gestión de workouts AMRAP generados
│   │   └── thunks/
│   │       └── checkWeeklyCompliance.js  # Verificación semanal manual
│   ├── data/
│   │   └── exercises.js              # [NEW!] Base de datos de 32 ejercicios
│   ├── utils/
│   │   ├── dateHelpers.js            # Funciones de fechas y semanas
│   │   ├── workoutGenerator.js       # [NEW!] Algoritmo de generación de workouts
│   │   └── musclePointsCalculator.js # [NEW!] Cálculo de puntos por grupo muscular
│   ├── App.jsx                        # Navegación principal con React Router
│   ├── main.jsx                       # Entry point con Provider
│   └── index.css                      # Tailwind imports
├── tailwind.config.js
├── vite.config.js
└── package.json
```

**⚠️ NOTA:** El archivo `SessionUpload.jsx` está deprecado. Ahora se usa el flujo completo de workout:
1. `WorkoutGeneratorPage` → genera workout
2. `WorkoutTimerPage` → ejecuta con timer
3. `WorkoutCompletePage` → registra sesión con foto

---

## 💪 Sistema de Ejercicios AMRAP

### Base de Datos de Ejercicios (32 ejercicios)

Cada ejercicio tiene:
- **ID único**: Para evitar duplicados
- **Nombre**: Descripción clara del ejercicio
- **Grupos musculares**: Array de músculos trabajados (ej: `['legs', 'glutes']`)
- **Nivel**: `'beginner' | 'intermediate' | 'advanced'`
- **Equipo**: `'bodyweight' | 'dumbbells' | 'barbell' | 'kettlebell' | 'box'`
- **Descripción**: Instrucciones del ejercicio
- **Reps sugeridas**: Número base de repeticiones

```javascript
// Ejemplo de ejercicio
{
  id: 'squat',
  name: 'Air Squats',
  muscleGroups: ['legs', 'glutes'],
  level: 'beginner',
  equipment: 'bodyweight',
  description: 'Sentadillas sin peso',
  suggestedReps: 15
}
```

### Grupos Musculares Disponibles
- `legs` 🦵 (Piernas)
- `glutes` 🍑 (Glúteos)
- `core` 💪 (Core/Abdomen)
- `cardio` ❤️ (Cardio)
- `chest` 💪 (Pecho)
- `shoulders` 💪 (Hombros)
- `triceps` 💪 (Tríceps)
- `back` 💪 (Espalda)
- `biceps` 💪 (Bíceps)

### Sistema de Ciclos (4 semanas)

```javascript
const WEEK_FOCUS = {
  1: { primary: ['legs', 'glutes'], name: 'Lower Body Week' },
  2: { primary: ['core', 'cardio'], name: 'Core & Cardio Week' },
  3: { primary: ['chest', 'shoulders', 'triceps'], name: 'Upper Push Week' },
  4: { primary: ['back', 'biceps'], name: 'Upper Pull Week' }
};
```

- La semana se calcula con `getWeekNumber(date) % 4 + 1`
- El generador de workouts selecciona **70% de ejercicios del grupo focal** de la semana
- El 30% restante son ejercicios complementarios para variedad
- Los ciclos se repiten automáticamente cada 4 semanas

---

## 🏆 Sistema de Puntos y Rankings

### Cálculo de Puntos por Ejercicio

```javascript
// Multiplicadores por dificultad
const DIFFICULTY_MULTIPLIER = {
  beginner: 1,
  intermediate: 1.5,
  advanced: 2
};

// Ejemplo: Push-ups (intermediate) → 15 reps × 1.5 = 22.5 puntos
// Divididos entre músculos: chest (11.25), triceps (7.5), shoulders (3.75)
```

**Reglas de distribución:**
- Los puntos se dividen proporcionalmente entre todos los grupos musculares del ejercicio
- Ejercicios con 1 músculo: 100% de puntos a ese músculo
- Ejercicios con 2 músculos: 50% cada uno
- Ejercicios con 3+ músculos: Se divide equitativamente

### Muscle Kings (Reyes de Músculo)

El sistema identifica al jugador con más puntos en cada grupo muscular:
- 🦵 **Rey de Piernas**
- 🍑 **Rey de Glúteos**
- 💪 **Rey de Core**
- ❤️ **Rey de Cardio**
- 💪 **Rey de Pecho**
- 💪 **Rey de Hombros**
- 💪 **Rey de Tríceps**
- 💪 **Rey de Espalda**
- 💪 **Rey de Bíceps**

Los badges se muestran en el Leaderboard junto a los nombres de los jugadores.

---

## 🎯 Flujo de Usuario: Workout Completo

### 1. Generar Workout (WorkoutGeneratorPage)
- Usuario hace clic en "💪 Generar Workout"
- Sistema genera workout basado en la semana actual del ciclo
- Selecciona 4-6 ejercicios (70% del grupo focal)
- Calcula puntos potenciales totales
- Muestra resumen con lista de ejercicios

### 2. Countdown Pre-Workout (WorkoutPreCountdown)
- Al hacer clic en "▶️ Comenzar Workout"
- Navega a `/workout/:workoutId`
- Muestra countdown de 8 segundos
- Pantalla inmersiva preparando al usuario

### 3. Timer Activo (WorkoutTimerPage)
- **Sticky header** con navegación y timer grande
- **Lista scrollable** de ejercicios con checkboxes
- **Botón pausar/reanudar** (icono depende del estado)
- **Botón finalizar workout** (⏹️) siempre visible
- Timer corre desde 0:00 hacia arriba
- Usuario marca ejercicios completados mientras entrena

### 4. Post-Workout (WorkoutCompletePage)
- Muestra tiempo final (ej: "12:45")
- Muestra puntos ganados por grupo muscular
- **Input de rondas completadas** (número)
- **Captura de foto**:
   - Opción 1: Subir desde galería (input file)
   - Opción 2: **Tomar con cámara** (CameraCapture)
- Botón "✅ Registrar Sesión"

### 5. Camera Capture (Mobile-First)
- **Vista previa en tiempo real** del stream de la cámara
- **Botón de cambio de cámara** (front/rear) en la esquina
- **Captura** dibuja el frame en Canvas
- **Compresión automática**:
   - Redimensiona a max 800x600px manteniendo aspect ratio
   - Comprime a JPEG con quality ajustable
   - Target: 50-150KB por imagen
- **Cierra stream** correctamente al desmontar para ahorrar batería
- Retorna base64 string para guardar en localStorage

---

## 🔑 Conceptos Clave de Redux

### Estado Global (ACTUALIZADO)

```javascript
{
  auth: {
    currentUser: { id, name, email, photo },
    isAuthenticated: boolean
  },
  players: {
    byId: { 
      "1": { 
        id, name, warnings, streak, totalSessions,
        musclePoints: {
          legs: 120.5,
          core: 85.0,
          chest: 95.5,
          // ... otros grupos musculares
        }
      } 
    },
    allIds: ["1", "2", "3"]
  },
  sessions: {
    byId: { 
      "s1": { 
        id, playerId, date, photo, result, 
        weekNumber, isRecovery,
        workoutId, // [NEW!] referencia al workout usado
        rounds, // [NEW!] rondas completadas
        musclePointsEarned // [NEW!] puntos ganados por músculo
      } 
    },
    allIds: ["s1", ...],
    byPlayer: { "1": ["s1", "s2"], ... }
  },
  workouts: { // [NEW!] Slice completo
    byId: {
      "w1": {
        id, weekFocus, exercises: [
          { exerciseId, name, reps, muscleGroups, level, points }
        ],
        totalPotentialPoints,
        createdAt
      }
    },
    allIds: ["w1", ...],
    activeWorkout: "w1" // workout actualmente en progreso
  }
}
```

### Nuevos Selectors (workoutsSlice)

```javascript
// Seleccionar workout activo
const activeWorkout = useSelector(selectActiveWorkout);

// Seleccionar workout por ID
const workout = useSelector((state) => selectWorkoutById(state, workoutId));

// Calcular puntos totales de un workout
const totalPoints = workout.exercises.reduce((sum, ex) => sum + ex.points, 0);
```

### Nuevos Actions

```javascript
// Generar nuevo workout
dispatch(generateWorkout({ weekNumber, exercises: [...] }));

// Marcar workout como activo
dispatch(setActiveWorkout(workoutId));

// Completar workout (limpiar activo)
dispatch(completeWorkout(workoutId));

// Registrar sesión con workout data
dispatch(uploadSession({
  playerId,
  workoutId,
  rounds,
  photo,
  musclePointsEarned: { legs: 50, core: 30 }
}));
```

---

## 📸 Sistema de Captura de Cámara

### CameraCapture Component

**Props:**
- `onCapture: (base64Image: string) => void` - Callback con imagen capturada
- `onClose: () => void` - Callback para cerrar la cámara

**Características:**
- Usa `navigator.mediaDevices.getUserMedia()` para acceder a la cámara
- Renderiza stream en `<video>` element
- Al capturar: dibuja frame actual en `<canvas>`
- Compresión inteligente:
  ```javascript
  // Redimensionar manteniendo aspect ratio
  const MAX_WIDTH = 800;
  const MAX_HEIGHT = 600;
  
  // Comprimir a JPEG
  canvas.toDataURL('image/jpeg', 0.7); // 70% quality
  ```
- **Limpieza de recursos**: Detiene tracks del stream al desmontar
- **Switch de cámara**: Cambia entre `facingMode: 'user'` y `'environment'`

**Mobile Considerations:**
- Botones grandes (min 48px) para touch targets
- Vista previa full-width en mobile
- Fallback a input file si no hay soporte de cámara
- Optimizado para iOS Safari y Chrome Android

---

## 🎨 Stack Tecnológico

### Core
- **React 19** - UI library
- **Redux Toolkit 2.0** - State management
- **React Router 6** - Client-side routing
- **Vite 5.x** - Build tool y dev server
- **Tailwind CSS 3.x** - Utility-first CSS

### APIs Web Usadas
- **Canvas API** - Captura y compresión de imágenes
- **Media Devices API** - Acceso a cámara del dispositivo
- **localStorage** - Persistencia del estado

### Herramientas
- **Pravatar.cc** - Fotos de perfil aleatorias
- **ISO Week Numbers** - Cálculo de semanas del año

---

## 📝 Convenciones de Código

### Componentes
- PascalCase para nombres de archivo: `WorkoutTimerPage.jsx`
- Props destructuring: `function Component({ prop1, prop2 }) {}`
- Export default al final del archivo
- Hooks en orden: useState → useEffect → useSelector → useDispatch → custom hooks

### Redux
- Slices con createSlice de RTK
- Thunks para lógica compleja (NO middlewares para business logic)
- Selectors con prefijo `select`: `selectActiveWorkout`
- Actions con notación `entity/action`: `workouts/generateWorkout`
- Estado normalizado: `byId` + `allIds` para entidades

### Navegación (React Router)
```javascript
// En App.jsx
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/workout/:workoutId" element={<WorkoutTimerPage />} />
  <Route path="/workout/:workoutId/complete" element={<WorkoutCompletePage />} />
  // ...
</Routes>

// Navegación programática
const navigate = useNavigate();
navigate(`/workout/${workoutId}`);

// Obtener params
const { workoutId } = useParams();
```

### Estilos
- Tailwind classes directamente en JSX
- Clases condicionales con template strings
- Responsive: `sm:`, `md:`, `lg:`
- Sticky positioning: `sticky top-0 z-10`

### Fechas
- ISO strings para almacenamiento: `new Date().toISOString()`
- Funciones helper en `dateHelpers.js`
- Semanas según estándar ISO (getWeekNumber)

---

## 🚀 Comandos Importantes

```bash
# Desarrollo
npm run dev              # Iniciar servidor (http://localhost:5173)

# Producción
npm run build           # Construir para producción
npm run preview         # Previsualizar build

# Gestión de paquetes
npm install react-router-dom   # Ya instalado
npm install [package]          # Instalar nuevo paquete
npm uninstall [package]        # Desinstalar paquete
```

---

## 🛠️ Problemas Conocidos / Limitaciones

### Actuales
- [ ] Verificación de warnings requiere ejecución manual (por diseño en frontend)
- [ ] No hay validación de fechas futuras
- [ ] No hay sistema de notificaciones push
- [ ] Fotos se guardan en base64 en localStorage (límite ~5-10MB total)
- [ ] No hay backend (todo en frontend + localStorage)
- [ ] Timer no persiste si refrescas la página
- [ ] No hay historial de workouts pasados (solo la sesión registrada)

### Estado "Como Está"
- ✅ Validaciones de sesiones funcionan correctamente
- ✅ Persistencia con localStorage funciona
- ✅ Leaderboard ordena correctamente (sesiones → warnings → streak)
- ✅ Muscle Kings se calculan correctamente
- ✅ Sistema de recuperación funciona
- ✅ Verificación semanal manual funciona correctamente
- ✅ Generador de workouts respeta ciclo de 4 semanas
- ✅ Captura de cámara funciona en iOS y Android
- ✅ Compresión de imágenes mantiene tamaño <150KB

---

## 🎯 Posibles Mejoras Futuras

### Corto Plazo
- [ ] Validación de fechas futuras
- [ ] Confirmación antes de eliminar datos
- [ ] Dark mode
- [ ] Exportar estadísticas a CSV/PDF
- [ ] Historial de workouts completados (lista visual)
- [ ] Gráfica de progreso de puntos por músculo (Chart.js)
- [ ] Filtros en leaderboard (por semana, por mes)
- [ ] Compartir workout en redes sociales

### Medio Plazo
- [ ] Upload real de imágenes (Cloudinary/AWS S3)
- [ ] Sistema de notificaciones (toast/snackbar)
- [ ] Gráficas de progreso (Chart.js/Recharts)
- [ ] PWA con service workers (funcionar offline)
- [ ] Historial de amonestaciones
- [ ] Editor de workouts custom (crear propios)
- [ ] Timer con sonidos/vibración en milestones
- [ ] Compartir workout con otros usuarios

### Largo Plazo (Requiere Backend)
- [ ] Backend con Node.js + Express
- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Autenticación real (JWT + OAuth)
- [ ] **Cron jobs para verificaciones automáticas** ⭐
- [ ] API REST/GraphQL
- [ ] Upload de imágenes a S3/Cloudinary
- [ ] Notificaciones push (Firebase Cloud Messaging)
- [ ] Sistema de roles (admin/user/coach)
- [ ] Emails automáticos (recordatorios, logros)
- [ ] Sincronización multi-dispositivo en tiempo real
- [ ] Analytics de uso y engagement

---

## 💡 Guías para Claude

### Al Generar Código
- Usar Redux Toolkit (NO Redux vanilla)
- Validar datos antes de dispatch
- Mantener consistencia con estructura actual
- Usar Tailwind (NO CSS modules ni styled-components)
- Comentar lógica compleja
- Preferir thunks sobre middlewares para lógica de negocio
- **React Router v6** para navegación (usar useNavigate, useParams)
- Mobile-first: considerar touch targets, viewport, performance

### Al Modificar Redux
- Actualizar selectors si cambias estructura de estado
- Considerar impacto en localStorage (límite de tamaño)
- Mantener normalización (byId + allIds)
- Thunks para lógica compleja, reducers para cambios simples
- **NO usar middlewares para lógica de negocio** - usar thunks
- Documentar nuevos selectors y actions

### Al Crear Componentes
- Props tipadas con destructuring
- Usar hooks de Redux: useSelector, useDispatch
- Usar hooks de Router: useNavigate, useParams, useLocation
- Responsive design con Tailwind
- Accessibility: labels, alt texts, semantic HTML, ARIA when needed
- Mobile: touch targets ≥48px, consider thumb zones

### Al Trabajar con Media APIs
- **Siempre limpiar recursos**: detener tracks de mediaStream
- **Fallbacks**: verificar soporte del navegador
- **Permisos**: manejar caso de denegación
- **Performance**: considerar batería en mobile
- **Compresión**: usar Canvas API para reducir tamaño de imágenes
- **Testing**: probar en iOS Safari + Chrome Android

### Al Debuggear
- Usar Redux DevTools para ver estado y acciones
- console.log en thunks para seguir flujo
- Verificar localStorage en DevTools → Application
- React DevTools para ver props y state
- Network tab para verificar permisos de cámara
- Canvas debugging: verificar dimensiones y dataURL

---

## 🧪 Testing Manual

### Flujo Completo de Prueba: Workout
1. Login con usuario
2. Click "💪 Generar Workout"
3. Verificar que ejercicios sean del grupo focal de la semana
4. Click "▶️ Comenzar Workout"
5. Verificar countdown de 8 segundos
6. En timer: marcar algunos ejercicios, pausar/reanudar
7. Click "⏹️ Finalizar Workout"
8. Ingresar rondas completadas (ej: 3)
9. Capturar foto con cámara:
   - Dar permisos de cámara
   - Cambiar entre front/rear
   - Capturar imagen
   - Verificar preview
10. Click "✅ Registrar Sesión"
11. Verificar en Dashboard:
   - Aparece sesión nueva
   - Puntos por músculo se actualizaron
   - Stats globales correctas

### Flujo Completo de Prueba: Sistema de Warnings
1. Subir sesión → Verificar que aparece en dashboard
2. Intentar subir otra el mismo día → Debe dar error
3. Subir en 3 días diferentes de la semana
4. Intentar subir una 4ta → Debe dar error
5. Ir a Profile → Ejecutar verificación semanal manual
6. Verificar amonestaciones en consola y en UI
7. Hacer ejercicio de recuperación (si hay warnings)
8. Ver leaderboard → Verificar orden correcto

### Flujo Completo de Prueba: Muscle Kings
1. Completar workouts con diferentes usuarios
2. Verificar que los puntos se acumulen correctamente
3. Ir a Leaderboard
4. Verificar que aparezcan los "Reyes de Músculo"
5. Verificar que los badges estén junto al nombre correcto
6. Completar workout que supere al líder actual
7. Refrescar leaderboard → Verificar cambio de rey

### Casos Edge
- ¿Qué pasa si localStorage está corrupto?
- ¿Qué pasa si no hay sesiones?
- ¿Qué pasa si es semana 53 del año?
- ¿Qué pasa si ejecutas verificación múltiples veces?
- ¿Qué pasa si cierras la cámara sin capturar?
- ¿Qué pasa si niegas permisos de cámara?
- ¿Qué pasa si localStorage está lleno (>5MB)?
- ¿Qué pasa si refrescas durante un workout activo?

---

## 📚 Recursos y Referencias

### Documentación Oficial
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Docs](https://react.dev/)
- [React Router v6](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [MDN: MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [MDN: Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### Patrones Usados
- Normalized State Shape (byId + allIds)
- Redux Ducks Pattern (actions + reducers en slices)
- Selector Pattern para leer estado
- Thunk Pattern para async/validaciones
- **Thunks para lógica de negocio** (NO middlewares)
- Component Composition (ejercicios, workouts)
- Controlled Components (forms, camera)
- Client-side Routing (React Router)

---

## 🤝 Trabajando con Claude

### Contexto que Siempre Debes Dar
```
Proyecto: FitTracker (React + Redux + React Router)
Archivo: [ruta del archivo]
Problema: [descripción clara]
Comportamiento esperado: [qué debería pasar]
Comportamiento actual: [qué está pasando]
```

### Preguntas Efectivas
✅ "En workoutsSlice.js, ¿cómo puedo añadir un selector para obtener workouts de la semana actual?"
✅ "Quiero añadir un botón para pausar el timer en WorkoutTimerPage, ¿dónde debería ir esa lógica?"
✅ "¿Cómo puedo exportar el historial de workouts a PDF?"
✅ "La compresión de imágenes no funciona en iOS, ¿cómo puedo debuggear esto?"
❌ "No funciona" (muy vago)
❌ "Arregla mi código" (sin contexto)

### Solicitar Cambios
```
Por favor modifica [archivo] para [objetivo]:
- Mantener [restricción 1]
- Considerar [edge case]
- Usar [patrón/tecnología existente]
- Mobile-first approach
```

---

## 📌 Notas Adicionales

- **Propósito educativo**: Este proyecto está diseñado para aprender, NO para producción
- **Prioridad**: Claridad sobre optimización, pero considerar performance en mobile
- **Testing**: Manual por ahora, sin tests automatizados
- **Backend**: Pendiente - Por ahora todo en frontend
- **Verificación semanal**: Manual mediante thunk (futuro: cron job en backend)
- **Navegación**: Client-side routing con React Router v6
- **Media**: Cámara usa navigator.mediaDevices (requiere HTTPS en producción)
- **Imágenes**: Compresión automática a <150KB para no llenar localStorage

---

## 📄 Changelog Reciente

### 2025-10-26 - v2.0.0 🎉
- ✅ **MAJOR:** Sistema completo de workouts AMRAP
- ✅ **NEW:** Base de datos de 32 ejercicios con niveles y grupos musculares
- ✅ **NEW:** Sistema de ciclos de 4 semanas (Lower → Core → Upper Push → Upper Pull)
- ✅ **NEW:** Generador de workouts basado en semana actual
- ✅ **NEW:** Timer pantalla completa con sticky header y navegación
- ✅ **NEW:** Pre-countdown de 8 segundos antes de iniciar
- ✅ **NEW:** Pantalla post-workout con stats detalladas
- ✅ **NEW:** Sistema de puntos por grupo muscular con multiplicadores de dificultad
- ✅ **NEW:** "Muscle Kings" - rankings por cada grupo muscular (9 categorías)
- ✅ **NEW:** Badges visuales en leaderboard (🦵 💪 ❤️ etc.)
- ✅ **NEW:** React Router v6 para navegación entre páginas
- ✅ **NEW:** CameraCapture component para móviles
- ✅ **NEW:** Compresión inteligente de imágenes (50-150KB)
- ✅ **NEW:** Switch entre cámara frontal/trasera
- ✅ **IMPROVED:** SessionUpload deprecado → ahora WorkoutCompletePage
- ✅ **IMPROVED:** Leaderboard muestra "Reyes de Músculo" por categoría
- ✅ **IMPROVED:** workoutsSlice para gestionar workouts generados
- ✅ **IMPROVED:** playersSlice ahora incluye `musclePoints` object
- ✅ **IMPROVED:** sessionsSlice guarda `workoutId`, `rounds`, `musclePointsEarned`

**Razón del cambio:** Transformar la app de un simple tracker a una experiencia completa de workout con timer, ejercicios estructurados, y sistema de gamificación por grupos musculares. La captura de cámara mejora UX en mobile sin necesidad de backend para upload de fotos.

### 2025-10-14 - v1.1.0
- ✅ **CAMBIO IMPORTANTE:** Eliminado `warningMiddleware.js`
- ✅ Creado `checkWeeklyCompliance.js` thunk para verificación semanal
- ✅ Actualizado `Profile.jsx` con botón de verificación mejorado
- ✅ Simplificado `store.js` (sin middleware custom)
- ✅ Documentada estrategia de migración a backend + cron job

**Razón del cambio:** Los middlewares no son apropiados para lógica de negocio que requiere trigger manual. Los thunks son más explícitos y fáciles de debuggear.

---

## 📄 Última Actualización

**Fecha:** 2025-10-26
**Estado:** ✅ Funcional - En desarrollo activo
**Versión:** 2.0.0
**Última mejora:** Sistema completo AMRAP con workouts, timer, camera capture y muscle rankings

---

**Creado con ❤️ para aprender React, Redux y React Router**
**Now with 💪 AMRAP workouts and 📸 mobile camera!**