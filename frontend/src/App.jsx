import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import DashboardCoach from './pages/DashboardCoach'

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
        <Route path="/coach/*" element={
          <ProtectedRoute allowedRole="COACH">
            <DashboardCoach isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </ProtectedRoute>
        } />

        {/* Ruta protegida solo para ATHLETE */}
        <Route path="/athlete/*" element={
          <ProtectedRoute allowedRole="ATHLETE">
            <div className="text-white bg-[#1d1a2f] min-h-screen p-8">Dashboard Atleta proximamente</div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App