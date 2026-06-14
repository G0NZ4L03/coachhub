import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import DashboardCoach from './pages/DashboardCoach'
import DashboardAthlete from './pages/DashboardAthlete'
import CoachAthleteDetail from './pages/CoachAthleteDetail'
import AthleteProgress from './pages/AthleteProgress'
import AthleteProfile from './pages/AthleteProfile'
import CoachProfile from './pages/CoachProfile'

function App() {
  // Estado global del modo oscuro gestionado aqui y pasado como prop
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  // useEffect para aplicar la clase dark al html cuando cambia el estado
  // Necesario en Tailwind v4 para que los estilos dark: se activen correctamente
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raiz: redirige al login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Ruta publica del login, recibe el estado del modo oscuro */}
        <Route path="/login" element={<Login isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />

        {/* Ruta protegida solo para COACH, le pasamos el estado del tema */}
        <Route path="/coach/dashboard" element={
          <ProtectedRoute requiredRole="COACH">
            <DashboardCoach isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </ProtectedRoute>
        } />

        {/* Ficha detallada de un atleta concreto, accesible solo desde el panel del coach */}
        <Route path="/coach/athlete/:id" element={
          <ProtectedRoute requiredRole="COACH">
            <CoachAthleteDetail isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </ProtectedRoute>
        } />

        {/* Ruta protegida solo para ATHLETE, le pasamos el estado del tema */}
        <Route path="/athlete/*" element={
          <ProtectedRoute requiredRole="ATHLETE">
            <DashboardAthlete isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </ProtectedRoute>
        } />

        {/* Ruta protegida solo para ATHLETE, le pasamos el estado del tema */}
        <Route path="/athlete/dashboard" element={
          <ProtectedRoute requiredRole="ATHLETE">
            <DashboardAthlete isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </ProtectedRoute>
        } />

        {/* Vista de progreso del atleta con grafica de peso */}
        <Route path="/athlete/progress" element={
          <ProtectedRoute requiredRole="ATHLETE">
            <AthleteProgress isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </ProtectedRoute>
        } />

        {/* Perfil editable del atleta */}
        <Route path="/athlete/profile" element={
          <ProtectedRoute requiredRole="ATHLETE">
            <AthleteProfile isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </ProtectedRoute>
        } />

        {/* Perfil informativo del coach */}
        <Route path="/coach/profile" element={
          <ProtectedRoute requiredRole="COACH">
            <CoachProfile isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App