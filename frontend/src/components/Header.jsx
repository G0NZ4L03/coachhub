import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// Header universal que se adapta al rol del usuario
// Coach → colores morados | Atleta → colores verdes
export default function Header({ title, subtitle, userName, isDarkMode, setIsDarkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logoutUser } = useContext(AuthContext)

  // Texto del rol en español para mostrar en el menu
  const roleText = user?.role === 'COACH' ? 'Entrenador' : 'Atleta'

  // Ruta del perfil segun el rol
  const profileLink = user?.role === 'COACH' ? '/coach/profile' : '/athlete/profile'

  // Colores del avatar segun quien entre
  const avatarColors = user?.role === 'COACH'
    ? 'border-purple-600 bg-purple-100 text-purple-700 dark:border-[#965fd4] dark:bg-[#965fd4]/20 dark:text-[#965fd4]'
    : 'border-green-600 bg-green-100 text-green-700 dark:border-[#8bd450] dark:bg-[#8bd450]/20 dark:text-[#8bd450]'

  // Sacamos las iniciales del nombre para el avatar
  const getInitials = (name) => {
    if (!name) return user?.role === 'COACH' ? 'CH' : 'AT'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0].substring(0, 2).toUpperCase()
  }

  // Limpiamos sesion y mandamos al login
  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <header className="mb-8 flex items-center justify-between z-10 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-sm text-slate-500 dark:text-gray-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Boton de modo oscuro/claro */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm border border-slate-200 dark:border-white/10 dark:bg-[#2a273f] hover:scale-105 transition-transform"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Avatar con menu desplegable */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm transition-transform hover:scale-105 focus:outline-none ${avatarColors}`}
          >
            <span className="font-bold">{getInitials(userName)}</span>
          </button>

          {/* Capa transparente para cerrar el menu al hacer clic fuera */}
          {isMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>}

          {/* Menu desplegable con animacion */}
          <div className={`absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-xl transition-all duration-200 dark:border-white/10 dark:bg-[#2a273f] z-50 ${isMenuOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'}`}>
            <div className="p-2">
              {/* Cabecera del menu con nombre y rol */}
              <div className="mb-2 border-b border-slate-100 px-4 pb-3 pt-2 text-left dark:border-white/5">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{userName || roleText}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400">{roleText}</p>
              </div>

              <Link
                to={profileLink}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                onClick={() => setIsMenuOpen(false)}
              >
                Mi Perfil
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                Cerrar Sesion
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}