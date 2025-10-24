# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 🛠️ Stack

- React 18 + Redux Toolkit
- Tailwind CSS
- Vite

**Comandos utiles**:

Usar solo una vez para crear el proyecto:
npm create vite@latest mi-proyecto -- --template react

npm install          # Instalar todas las dependencias
npm install [paquete] # Instalar un nuevo paquete
npm uninstall [paquete] # Desinstalar un paquete

npm run dev         # Iniciar servidor de desarrollo
npm run build        # Crear versión optimizada para producción
npm run preview      # Ver cómo se verá en producción


**TESTEOS A HACER EN EL FUTURO**

Vitest + React Testing Library + Redux Testing + @testing-library/user-event
```

### Razones específicas para tu proyecto:

1. **Vitest**: Ya usas Vite, configuración mínima
2. **React Testing Library**: Perfecto para testar componentes como SessionUpload
3. **Redux nativo**: Suficiente para testear slices y selectors complejos
4. **user-event**: Simular clicks, typing, selects

---

## 📋 Tipos de Tests que Deberías Escribir

### **1. Unit Tests - Selectores Redux** (MÁS IMPORTANTE)

**Qué testear:**
```
✅ selectMuscleGroupRankings
- Calcula puntos correctamente según dificultad
- Divide puntos entre músculos correctamente
- Ordena rankings correctamente

✅ selectPlayerBadges
- Asigna Rey Absoluto cuando domina 3+ grupos
- Asigna Especialista cuando tiene 2x puntos
- Asigna Polivalente cuando está en top 3 de 5+ grupos

✅ selectMonthlyBalance
- Cuenta ejercicios por grupo correctamente
- Filtra por mes actual correctamente
```

**Por qué es importante:**
- Esta es tu **lógica de negocio crítica**
- Un bug aquí rompe toda la competencia
- Son funciones puras (fáciles de testear)

---

### **2. Unit Tests - Reducers** (IMPORTANTE)

**Qué testear:**
```
✅ sessionsSlice
- uploadSession valida día duplicado
- uploadSession valida 3 días máximo por semana
- Calcula weekNumber correctamente

✅ workoutsSlice
- generateWeeklyWorkout crea workout según ciclo
- markWorkoutCompleted guarda rondas y ejercicio parcial
- generateRecoveryWorkout filtra ejercicios principiantes

✅ playersSlice
- addWarning incrementa correctamente
- updatePlayerStats actualiza streak correctamente
```

---

### **3. Integration Tests - Componentes + Redux** (MEDIO)

**Qué testear:**
```
✅ SessionUpload + workoutsSlice
- Muestra workout actual correctamente
- Preview de rondas funciona (5.3)
- Valida que no puedas subir sin workout
- Submit llama a uploadSession y markWorkoutCompleted

✅ MuscleRankings + workoutsSlice
- Muestra rankings correctamente
- Click en grupo muestra detalle
- Badges aparecen según logros
- Desglose muestra ejercicios correctamente

✅ WeeklyProgress + sessionsSlice
- Muestra días completados correctamente
- Barra de progreso calcula % correcto
```

---

### **4. End-to-End Tests** (OPCIONAL, más adelante)

Con **Playwright** o **Cypress** (cuando vayas a backend):
```
✅ Flujo completo: Login → Generar workout → Registrar → Ver ranking
✅ Verificación semanal asigna warnings
✅ Recuperación elimina warning
```

---

## 📊 Priorización para Tu Proyecto

### **Fase 1: Lo Esencial** (empezar aquí)
1. ✅ Selectores de rankings (`selectMuscleGroupRankings`)
2. ✅ Sistema de puntos (calcular puntos por ejercicio)
3. ✅ Validaciones de sesiones (días duplicados, 3 máximo)
4. ✅ Cálculo de badges

**Cobertura objetivo:** 80% de lógica crítica

---

### **Fase 2: Componentes**
5. ✅ SessionUpload (registro de rondas)
6. ✅ MuscleRankings (visualización)
7. ✅ WeeklyProgress (progreso semanal)

**Cobertura objetivo:** 60% de componentes

---

### **Fase 3: Edge Cases**
8. ✅ Semana 53 del año
9. ✅ localStorage corrupto
10. ✅ 0 rondas completadas
11. ✅ Ejercicio parcial en posición 0

---

## 💡 Ejemplo de Estructura de Tests
```
src/
├── __tests__/
│   ├── unit/
│   │   ├── selectors/
│   │   │   ├── muscleGroupRankings.test.js    ⭐ CRÍTICO
│   │   │   ├── playerBadges.test.js           ⭐ CRÍTICO
│   │   │   └── monthlyBalance.test.js
│   │   ├── reducers/
│   │   │   ├── sessionsSlice.test.js          ⭐ CRÍTICO
│   │   │   ├── workoutsSlice.test.js
│   │   │   └── playersSlice.test.js
│   │   └── utils/
│   │       └── dateHelpers.test.js
│   ├── integration/
│   │   ├── SessionUpload.test.jsx
│   │   ├── MuscleRankings.test.jsx
│   │   └── WeeklyProgress.test.jsx
│   └── e2e/                                   (futuro)
│       └── complete-flow.spec.js