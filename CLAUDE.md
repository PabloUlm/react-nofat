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

### Reglas de Negocio Importantes
- ✅ Cada usuario debe completar **3 sesiones en 3 días diferentes** cada semana
- ❌ **NO se puede** registrar más de 1 sesión por día
- ❌ **NO se puede** registrar más de 3 días diferentes por semana
- ⚠️ Si no completa 3 días → Recibe una amonestación
- 🔄 Ejercicio de recuperación elimina 1 amonestación

---

## 🏗️ Arquitectura

```
fitness-tracker/
├── src/
│   ├── components/
│   │   ├── player/
│   │   │   └── WarningBadge.jsx       # Indicador de amonestaciones
│   │   └── session/
│   │       ├── SessionUpload.jsx      # Formulario para subir sesión
│   │       └── WeeklyProgress.jsx     # Barra de progreso semanal
│   ├── pages/
│   │   ├── Login.jsx                  # Selección de usuario
│   │   ├── Dashboard.jsx              # Panel principal con stats
│   │   ├── LeaderboardPage.jsx        # Clasificación global
│   │   └── Profile.jsx                # Perfil y recuperación
│   ├── redux/
│   │   ├── store.js                   # Configuración del store + localStorage
│   │   ├── slices/
│   │   │   ├── authSlice.js          # Autenticación simple
│   │   │   ├── playersSlice.js       # Gestión de jugadores y warnings
│   │   │   └── sessionsSlice.js      # Gestión de sesiones con validaciones
│   │   └── middleware/
│   │       └── warningMiddleware.js   # Verificación semanal (manual)
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
  }
}
```

### Flujo de Datos
```
Usuario → Componente → dispatch(action) → Thunk/Reducer → Estado actualizado → Re-render
```

### Validaciones en uploadSession (Thunk)
1. Verificar que no haya sesión el mismo día (isSameDay)
2. Verificar que no tenga más de 3 días diferentes esta semana (getUniqueDaysInWeek)
3. Si pasa validaciones → addSession + updatePlayerStats

---

## 🎨 Stack Tecnológico

### Core
- **React 18** - UI library
- **Redux Toolkit 2.0** - State management
- **Vite 5.x** - Build tool y dev server
- **Tailwind CSS 3.x** - Utility-first CSS

### Dependencias
```json
{
  "react": "^18.2.0",
  "react-redux": "^9.0.0",
  "@reduxjs/toolkit": "^2.0.0"
}
```

### Herramientas
- **localStorage** - Persistencia del estado
- **Pravatar.cc** - Fotos de perfil aleatorias
- **ISO Week Numbers** - Cálculo de semanas del año

---

## 📝 Convenciones de Código

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

## 🐛 Problemas Conocidos / Limitaciones

### Actuales
- [ ] Middleware de warnings NO se ejecuta automáticamente (requiere dispatch manual)
- [ ] No hay validación de fechas futuras
- [ ] No hay sistema de notificaciones
- [ ] Fotos son URLs (no upload real)
- [ ] No hay backend (todo en frontend + localStorage)

### Estado "Como Está"
- ✅ Validaciones de sesiones funcionan correctamente
- ✅ Persistencia con localStorage funciona
- ✅ Leaderboard ordena correctamente
- ✅ Sistema de recuperación funciona

---

## 🎯 Posibles Mejoras Futuras

### Corto Plazo
- [ ] Botón para ejecutar verificación semanal
- [ ] Validación de fechas futuras
- [ ] Confirmación antes de eliminar datos
- [ ] Dark mode

### Medio Plazo
- [ ] Upload real de imágenes (Cloudinary/AWS S3)
- [ ] Sistema de notificaciones (toast)
- [ ] Gráficas de progreso (Chart.js/Recharts)
- [ ] Filtros en leaderboard

### Largo Plazo (Requiere Backend)
- [ ] Backend con Node.js + Express
- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Autenticación real (JWT)
- [ ] Cron jobs para verificaciones automáticas
- [ ] API REST/GraphQL
- [ ] Notificaciones push

---

## 💡 Guías para Claude

### Al Generar Código
- Usar Redux Toolkit (NO Redux vanilla)
- Validar datos antes de dispatch
- Mantener consistencia con estructura actual
- Usar Tailwind (NO CSS modules ni styled-components)
- Comentar lógica compleja

### Al Modificar Redux
- Actualizar selectors si cambias estructura de estado
- Considerar impacto en localStorage
- Mantener normalización (byId + allIds)
- Thunks para lógica compleja, reducers para cambios simples

### Al Crear Componentes
- Props tipadas con destructuring
- Usar hooks de Redux: useSelector, useDispatch
- Responsive design con Tailwind
- Accessibility: labels, alt texts, semantic HTML

### Al Debugear
- Usar Redux DevTools para ver estado y acciones
- console.log en thunks para seguir flujo
- Verificar localStorage en DevTools → Application
- React DevTools para ver props y state

---

## 🧪 Testing Manual

### Flujo Completo de Prueba
1. Login con usuario
2. Subir sesión → Verificar que aparece en dashboard
3. Intentar subir otra el mismo día → Debe dar error
4. Subir en 3 días diferentes
5. Intentar subir una 4ta → Debe dar error
6. Ir a Profile → Ejecutar recuperación (si hay warnings)
7. Ver leaderboard → Verificar orden correcto

### Casos Edge
- ¿Qué pasa si localStorage está corrupto?
- ¿Qué pasa si no hay sesiones?
- ¿Qué pasa si es semana 53 del año?

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

---

## 🤝 Trabajando con Claude

### Contexto que Siempre Debes Dar
```
Proyecto: FitTracker (React + Redux)
Archivo: [ruta del archivo]
Problema: [descripción clara]
Comportamiento esperado: [qué debería pasar]
Comportamiento actual: [qué está pasando]
```

### Preguntas Efectivas
✅ "En sessionsSlice.js, ¿cómo puedo añadir validación para fechas futuras?"
✅ "Quiero añadir un filtro por mes en LeaderboardPage, ¿dónde debería ir esa lógica?"
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

---

## 🔄 Última Actualización

**Fecha:** 2025-10-10
**Estado:** ✅ Funcional - En desarrollo
**Versión:** 1.0.0

---

**Creado con ❤️ para aprender React y Redux**