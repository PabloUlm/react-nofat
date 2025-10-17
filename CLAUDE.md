# 🤖 Claude AI - Contexto del Proyecto

> **Proyecto:** FitTracker - Aplicación de seguimiento de entrenamientos
> **Stack:** React + Redux Toolkit + Tailwind CSS + Vite
> **Propósito:** App educativa para aprender React y Redux

---

## 📋 Descripción del Proyecto

FitTracker es una aplicación web que permite a usuarios/jugadores:
- Registrar sesiones de entrenamiento (3 días diferentes por semana)
- Ver su progreso semanal
- Competir en un leaderboard global
- Recibir amonestaciones por incumplimiento
- Realizar ejercicios de recuperación para eliminar amonestaciones
- **NUEVO:** Generar workouts AMRAP semanales automáticos
- **NUEVO:** Competir por ser el "Rey" de cada grupo muscular
- **NUEVO:** Ganar badges por logros específicos

### Reglas de Negocio Importantes
- ✅ Cada usuario debe completar **3 sesiones en 3 días diferentes** cada semana
- ❌ **NO se puede** registrar más de 1 sesión por día
- ❌ **NO se puede** registrar más de 3 días diferentes por semana
- ⚠️ Si no completa 3 días → Recibe una amonestación
- 🔄 Ejercicio de recuperación elimina 1 amonestación

---

## 🗂️ Arquitectura

```
fitness-tracker/
├── src/
│   ├── components/
│   │   ├── player/
│   │   │   └── WarningBadge.jsx       # Indicador de amonestaciones
│   │   ├── session/
│   │   │   ├── SessionUpload.jsx      # Formulario para subir sesión (CON RONDAS)
│   │   │   └── WeeklyProgress.jsx     # Barra de progreso semanal
│   │   ├── workout/                   # NUEVO
│   │   │   ├── WeeklyWorkout.jsx      # Generador y visualizador de workout semanal
│   │   │   ├── MonthlyBalance.jsx     # Análisis de balance muscular mensual
│   │   │   └── WorkoutStats.jsx       # Estadísticas personales de workouts
│   │   └── rankings/                  # NUEVO
│   │       └── MuscleRankings.jsx     # Rankings por grupo muscular con badges
│   ├── pages/
│   │   ├── Login.jsx                  # Selección de usuario
│   │   ├── Dashboard.jsx              # Panel principal con stats + workouts
│   │   ├── RankingsPage.jsx           # NUEVO: Tabs (General + Reyes Musculares)
│   │   └── Profile.jsx                # Perfil, recuperación y verificación semanal
│   ├── redux/
│   │   ├── store.js                   # Configuración del store + localStorage
│   │   ├── slices/
│   │   │   ├── authSlice.js          # Autenticación simple
│   │   │   ├── playersSlice.js       # Gestión de jugadores y warnings
│   │   │   ├── sessionsSlice.js      # Gestión de sesiones con validaciones
│   │   │   └── workoutsSlice.js      # NUEVO: Workouts, balance, rankings, badges
│   │   └── thunks/
│   │       └── checkWeeklyCompliance.js  # Verificación semanal manual
│   ├── data/                          # NUEVO
│   │   └── exercises.js               # Base de datos de 32 ejercicios
│   ├── utils/
│   │   └── dateHelpers.js            # Funciones de fechas y semanas
│   ├── App.jsx                        # Navegación principal
│   ├── main.jsx                       # Entry point con Provider
│   └── index.css                      # Tailwind imports
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🔑 Conceptos Clave de Redux

### Estado Global
```javascript
{
  auth: {
    currentUser: { id, name, email, photo },
    isAuthenticated: boolean
  },
  players: {
    byId: { "1": { id, name, warnings, streak, totalSessions, ... } },
    allIds: ["1", "2", "3"]
  },
  sessions: {
    byId: { "s1": { id, playerId, date, photo, result, weekNumber, isRecovery } },
    allIds: ["s1", ...],
    byPlayer: { "1": ["s1", "s2"], ... }
  },
  workouts: {  // NUEVO
    byWeek: { 
      "42": { weekNumber, focus, duration, exercises: [...], generatedAt }
    },
    completedWorkouts: [
      { type, weekNumber, exercises, result, rounds, partialExercise, playerId, completedAt }
    ],
    monthlyDistribution: { pecho: 10, espalda: 15, core: 20, ... }
  }
}
```

### Flujo de Datos
```
Usuario → Componente → dispatch(action) → Thunk/Reducer → Estado actualizado → Re-render
```

---

## 🆕 Sistema de Workouts (NUEVO)

### 📊 Base de Datos de Ejercicios

**Archivo:** `src/data/exercises.js`

- **32 ejercicios** clasificados por:
    - Grupos musculares (pecho, espalda, hombros, bíceps, tríceps, core, glúteos, cuádriceps, isquios, gemelos, cardio)
    - Dificultad (principiante, intermedio, avanzado)
    - Equipamiento (sin equipo, mancuernas, kettlebell, barra, cajón, etc.)
    - Tipo de reps (count, time, distance)

**Constantes principales:**
```javascript
export const MUSCLE_GROUPS = { CHEST, BACK, SHOULDERS, ... }
export const DIFFICULTY = { BEGINNER, INTERMEDIATE, ADVANCED }
export const EQUIPMENT = { NONE, DUMBBELLS, KETTLEBELL, ... }
export const EXERCISES = [ {...}, {...}, ... ] // 32 ejercicios
```

### 🔄 Ciclo de Workouts Semanales

El sistema rota automáticamente cada 4 semanas:

1. **Semana 1:** Tren Inferior (60% piernas, 40% core/cardio)
2. **Semana 2:** Core y Cardio (70% core/cardio, 30% piernas)
3. **Semana 3:** Tren Superior Push (65% pecho/hombros/tríceps)
4. **Semana 4:** Tren Superior Pull (60% espalda/bíceps)

### 📝 Sistema de Registro de Sesiones

**Cambios importantes en SessionUpload:**
- ❌ **Eliminado:** Campo "Resultado/Tiempo" (texto libre)
- ✅ **Nuevo:** Campo "Rondas Completas" (obligatorio, número entero)
- ✅ **Nuevo:** Campo "Ejercicio Parcial" (opcional, selector)
- ✅ **Preview en tiempo real:** Muestra "5.3 rondas" antes de enviar

**Ejemplos de registro:**
```
5 rondas completas → "5 rondas"
5 rondas + ejercicio 3 → "5.3 rondas"
0 rondas + ejercicio 2 → "0.2 rondas"
```

**Regla del ejercicio parcial:**
- ✅ Si COMPLETASTE el ejercicio → cuenta
- ❌ Si te QUEDASTE EN el ejercicio → NO cuenta

---

## 🏆 Sistema de Rankings (NUEVO)

### 💪 Rankings por Grupo Muscular

**Archivo:** `src/components/rankings/MuscleRankings.jsx`

Cada jugador acumula puntos en cada grupo muscular según:

#### Sistema de Puntos:
```javascript
// Multiplicadores base por dificultad
Principiante: ×1
Intermedio: ×1.5
Avanzado: ×2

// División entre músculos trabajados
Ejemplo: Burpees (avanzado, 4 músculos)
Puntos base: 2
Por músculo: 2 ÷ 4 = 0.5 puntos/rep

Si completaste 6 reps de burpees:
- Pecho: +3 pts (0.5 × 6)
- Core: +3 pts
- Piernas: +3 pts
- Cardio: +3 pts
```

#### Cálculo de Reps Completadas:
```javascript
Rondas completas: 5
Ejercicio parcial: 3 (completado)

Para ejercicio #1: 5 + 1 = 6 reps (llegaste a él en ronda 6)
Para ejercicio #2: 5 + 1 = 6 reps
Para ejercicio #3: 5 + 1 = 6 reps (lo completaste)
Para ejercicio #4: 5 reps (no llegaste)
Para ejercicio #5: 5 reps (no llegaste)
```

### 🎖️ Sistema de Badges

**5 tipos de badges** según logros:

1. **👑 Rey Absoluto** (Legendary)
    - Requisito: Ser #1 en 3+ grupos musculares
    - Color: Gradient amarillo-naranja

2. **🔥 Especialista** (Epic)
    - Requisito: Tener 2x o más puntos que el segundo en algún grupo
    - Color: Gradient púrpura-rosa

3. **⚡ Polivalente** (Rare)
    - Requisito: Top 3 en 5+ grupos diferentes
    - Color: Gradient azul-cyan

4. **💎 Elite** (Legendary)
    - Requisito: Solo ejercicios avanzados (mínimo 3 workouts)
    - Color: Gradient amarillo-naranja

5. **🏆 Campeón** (Common)
    - Requisito: Líder en 1 grupo muscular
    - Color: Gris

### 📊 Visualización de Rankings

**Dos vistas:**

1. **Vista Grid** (por defecto):
    - Muestra todos los grupos musculares en cards
    - Cada card muestra el "Rey" actual y top 3
    - Click para ver detalle completo

2. **Vista Detallada** (al hacer click):
    - Ranking completo del grupo muscular
    - Badges de cada jugador
    - Desglose expandible de puntos por ejercicio
    - Historial de sesiones con fechas

---

## 🎯 Stack Tecnológico

### Core
- **React 19** - UI library
- **Redux Toolkit 2.0** - State management
- **Vite 5.x** - Build tool y dev server
- **Tailwind CSS 3.x** - Utility-first CSS

### Dependencias
```json
{
  "react": "^19.1.1",
  "react-redux": "^9.2.0",
  "@reduxjs/toolkit": "^2.9.0"
}
```

### Herramientas
- **localStorage** - Persistencia del estado
- **Pravatar.cc** - Fotos de perfil aleatorias
- **ISO Week Numbers** - Cálculo de semanas del año
- **Data URLs** - Imágenes placeholder SVG inline

---

## 📐 Convenciones de Código

### Componentes
- PascalCase para nombres de archivo: `SessionUpload.jsx`
- Props destructuring: `function Component({ prop1, prop2 }) {}`
- Export default al final del archivo

### Redux
- Slices con createSlice de RTK
- Thunks para lógica compleja antes de dispatch
- Selectors con prefijo `select`: `selectAllPlayers`
- Actions con notación `entity/action`: `players/addWarning`

### Estilos
- Tailwind classes directamente en JSX
- Clases condicionales con template strings
- Responsive: `sm:`, `md:`, `lg:`

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
npm install [package]   # Instalar nuevo paquete
npm uninstall [package] # Desinstalar paquete
```

---

## 🛠 Problemas Conocidos / Limitaciones

### Actuales
- [ ] Verificación de warnings requiere ejecución manual (por diseño en frontend)
- [ ] No hay validación de fechas futuras
- [ ] No hay sistema de notificaciones
- [ ] Fotos son URLs (no upload real)
- [ ] No hay backend (todo en frontend + localStorage)

### Estado "Como Está"
- ✅ Validaciones de sesiones funcionan correctamente
- ✅ Persistencia con localStorage funciona
- ✅ Leaderboard ordena correctamente
- ✅ Sistema de recuperación funciona
- ✅ Verificación semanal manual funciona correctamente
- ✅ Generación de workouts semanales funciona
- ✅ Rankings por grupo muscular con badges funciona
- ✅ Sistema de puntos y cálculos es preciso

---

## 🎯 Mejoras Implementadas Recientemente

### ✅ v1.2.0 - Sistema de Workouts y Rankings (Última versión)

**Features nuevas:**
1. **Base de datos de ejercicios** (32 ejercicios clasificados)
2. **Generación automática de workouts AMRAP** (ciclo de 4 semanas)
3. **Registro mejorado de sesiones** (rondas completas + ejercicio parcial)
4. **Balance mensual muscular** (análisis visual)
5. **Rankings por grupo muscular** (11 categorías)
6. **Sistema de badges** (5 tipos de logros)
7. **Estadísticas de workouts** (rondas promedio, historial)

**Archivos nuevos:**
- `src/data/exercises.js`
- `src/components/workout/WeeklyWorkout.jsx`
- `src/components/workout/MonthlyBalance.jsx`
- `src/components/workout/WorkoutStats.jsx`
- `src/components/rankings/MuscleRankings.jsx`
- `src/pages/RankingsPage.jsx`

**Archivos modificados:**
- `src/redux/slices/workoutsSlice.js` (añadido rankings y badges)
- `src/components/session/SessionUpload.jsx` (sistema de rondas)
- `src/pages/Dashboard.jsx` (integración de workouts)
- `src/pages/Profile.jsx` (workout stats)
- `src/App.jsx` (cambio a RankingsPage)
- `src/redux/store.js` (añadido workouts reducer)

---

## 🎮 Flujo de Usuario Completo

### 1. Login
```
Usuario selecciona su perfil → dispatch(login) → Redirige a Dashboard
```

### 2. Generar Workout Semanal
```
Dashboard → "Generar Workout" → Seleccionar dificultad → 
generateWeeklyWorkout(weekNumber, duration, difficulty) →
Muestra 5-7 ejercicios según ciclo semanal
```

### 3. Completar Sesión
```
Dashboard → "Registrar Sesión" →
Rellenar "Rondas Completas": 5 →
Seleccionar "Ejercicio Parcial": 3. Burpees →
Preview: "5.3 rondas" →
Submit →
uploadSession() + markWorkoutCompleted() →
Guarda sesión + distribuye puntos a grupos musculares
```

### 4. Ver Rankings
```
Tab "Rankings" → "Reyes Musculares" →
Click en "💪 pecho" →
Vista detallada con ranking completo →
Click "Ver desglose" en jugador →
Muestra todos sus ejercicios de pecho con puntos
```

### 5. Verificación Semanal
```
Profile → "Ejecutar Verificación Semanal" →
checkWeeklyCompliance() →
Revisa semana anterior →
Añade warnings a quienes no completaron 3 días
```

### 6. Ejercicio de Recuperación
```
Profile → "Hacer Recuperación" →
generateRecoveryWorkout(20 min) →
uploadSession(isRecovery: true) →
removeWarning()
```

---

## 💡 Guías para Claude

### Al Generar Código
- Usar Redux Toolkit (NO Redux vanilla)
- Validar datos antes de dispatch
- Mantener consistencia con estructura actual
- Usar Tailwind (NO CSS modules ni styled-components)
- Comentar lógica compleja
- Preferir thunks sobre middlewares para lógica de negocio
- **NO usar localStorage/sessionStorage en artifacts** (no disponible)
- Usar React state (useState, useReducer) en artifacts

### Al Modificar Redux
- Actualizar selectors si cambias estructura de estado
- Considerar impacto en localStorage
- Mantener normalización (byId + allIds)
- Thunks para lógica compleja, reducers para cambios simples
- **NO usar middlewares para lógica de negocio** - usar thunks
- Documentar selectores complejos (como rankings)

### Al Crear Componentes
- Props tipadas con destructuring
- Usar hooks de Redux: useSelector, useDispatch
- Responsive design con Tailwind
- Accessibility: labels, alt texts, semantic HTML
- Evitar repetición de lógica (extraer a helpers)

### Al Debuggear
- Usar Redux DevTools para ver estado y acciones
- console.log en thunks para seguir flujo
- Verificar localStorage en DevTools → Application
- React DevTools para ver props y state
- Verificar que IDs de ejercicios no estén duplicados

---

## 🧪 Testing Manual

### Flujo Completo de Prueba
1. Login con usuario
2. **Generar workout semanal** con dificultad intermedia
3. **Subir sesión** → Rellenar rondas: 5, ejercicio parcial: 3
4. Verificar que aparece en dashboard con "5.3 rondas"
5. Intentar subir otra el mismo día → Debe dar error
6. **Ir a Rankings** → Tab "Reyes Musculares"
7. Verificar que aparecen puntos en grupos musculares
8. **Click en un grupo** → Ver ranking detallado
9. **Click "Ver desglose"** → Ver ejercicios y puntos
10. Completar 3 sesiones en 3 días diferentes
11. Intentar subir una 4ta → Debe dar error
12. Ir a Profile → Ejecutar verificación semanal manual
13. Verificar badges en tabla de rankings

### Casos Edge
- ¿Qué pasa si localStorage está corrupto?
- ¿Qué pasa si no hay workout generado y subes sesión?
- ¿Qué pasa si regeneras workout varias veces?
- ¿Qué pasa si hay ejercicios duplicados (mismo ID)?
- ¿Qué pasa con ejercicio parcial en posición 0?
- ¿Qué pasa si completas 0 rondas?

---

## 📚 Recursos y Referencias

### Documentación Oficial
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

### Patrones Usados
- Normalized State Shape (byId + allIds)
- Redux Ducks Pattern (actions + reducers en slices)
- Selector Pattern para leer estado
- Thunk Pattern para async/validaciones
- **Thunks para lógica de negocio** (NO middlewares)
- Memoization con Reselect (para rankings complejos)

---

## 🤝 Trabajando con Claude

### Contexto que Siempre Debes Dar
```
Proyecto: FitTracker (React + Redux + Workouts + Rankings)
Archivo: [ruta del archivo]
Problema: [descripción clara]
Comportamiento esperado: [qué debería pasar]
Comportamiento actual: [qué está pasando]
```

### Preguntas Efectivas
✅ "En workoutsSlice.js, ¿cómo puedo añadir filtro por dificultad en rankings?"
✅ "Quiero mostrar gráfica de evolución de rondas por semana, ¿dónde va esa lógica?"
✅ "¿Cómo puedo exportar los rankings a PDF?"
❌ "No funciona" (muy vago)
❌ "Arregla mi código" (sin contexto)

### Solicitar Cambios
```
Por favor modifica [archivo] para [objetivo]:
- Mantener [restricción 1]
- Considerar [edge case]
- Usar [patrón/tecnología existente]
```

---

## 📌 Notas Adicionales

- **Propósito educativo**: Este proyecto está diseñado para aprender, NO para producción
- **Prioridad**: Claridad sobre optimización
- **Testing**: Manual por ahora, sin tests automatizados
- **Backend**: Pendiente - Por ahora todo en frontend
- **Verificación semanal**: Manual mediante thunk (futuro: cron job en backend)
- **Rankings**: Calculados en tiempo real (futuro: pre-calcular y cachear)
- **Imágenes**: Data URLs SVG inline (no servicios externos)

---

## 📄 Changelog

### v1.2.0 (2025-01-17) - Sistema de Workouts y Rankings
- ✅ Añadida base de datos de 32 ejercicios clasificados
- ✅ Generación automática de workouts AMRAP semanales
- ✅ Sistema de registro mejorado (rondas + ejercicio parcial)
- ✅ Rankings por grupo muscular (11 categorías)
- ✅ Sistema de badges (5 tipos de logros)
- ✅ Balance mensual muscular con visualización
- ✅ Estadísticas de workouts completados
- ✅ Tab "Rankings" reemplaza "Clasificación"
- ✅ Arreglado IDs duplicados en exercises.js (ex024)
- ✅ Cambiado placeholder images a Data URLs SVG

### v1.1.0 (2025-01-14) - Sistema de Verificación
- ✅ Eliminado `warningMiddleware.js`
- ✅ Creado `checkWeeklyCompliance.js` thunk
- ✅ Actualizado `Profile.jsx` con botón de verificación
- ✅ Simplificado `store.js` (sin middleware custom)

### v1.0.0 (2025-01-10) - Versión Inicial
- ✅ Sistema base de sesiones y jugadores
- ✅ Validaciones de 3 días por semana
- ✅ Sistema de amonestaciones
- ✅ Leaderboard general
- ✅ Ejercicios de recuperación

---

## 🚀 Próximas Mejoras Planificadas

### Corto Plazo
- [ ] Gráficas de evolución de rondas (Recharts)
- [ ] Exportar rankings a PDF
- [ ] Historial de "Reyes" por mes
- [ ] Comparativa entre jugadores en mismo workout
- [ ] Dark mode

### Medio Plazo
- [ ] Upload real de imágenes (Cloudinary/AWS S3)
- [ ] Sistema de notificaciones (toast)
- [ ] Predicción de rondas basada en historial
- [ ] Filtros avanzados en rankings
- [ ] Achievements adicionales

### Largo Plazo (Requiere Backend)
- [ ] Backend con Node.js + Express
- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Autenticación real (JWT)
- [ ] **Cron jobs para verificaciones automáticas** ⭐
- [ ] API REST/GraphQL
- [ ] Notificaciones push
- [ ] Sistema de roles (admin/user)
- [ ] Emails automáticos
- [ ] Pre-cálculo de rankings (performance)

---

**Creado con ❤️ para aprender React y Redux**

**Última Actualización:** 2025-01-17  
**Versión:** 1.2.0  
**Estado:** ✅ Funcional - En desarrollo activo