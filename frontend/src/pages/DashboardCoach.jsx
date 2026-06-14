import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { getMyAthletes, linkAthlete } from '../services/api'

export default function DashboardCoach({ isDarkMode, setIsDarkMode }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Lista de atletas vinculados al coach
  const [athletes, setAthletes] = useState([])
  const [isLoadingAthletes, setIsLoadingAthletes] = useState(true)

  // Estado del formulario para vincular atleta nuevo
  const [linkEmail, setLinkEmail] = useState('')
  const [isLinking, setIsLinking] = useState(false)
  const [linkSuccess, setLinkSuccess] = useState('')
  const [linkError, setLinkError] = useState('')

  // Cargamos los atletas del coach al montar el componente
  useEffect(() => {
    fetchAthletes()
  }, [])

  const fetchAthletes = async () => {
    try {
      const response = await getMyAthletes()
      setAthletes(response.data)
    } catch (err) {
      console.error('Error al cargar atletas:', err)
    } finally {
      setIsLoadingAthletes(false)
    }
  }

  // Vinculamos un atleta por su email y recargamos la lista si sale bien
  const handleLinkAthlete = async (e) => {
    e.preventDefault()
    setIsLinking(true)
    setLinkError('')
    setLinkSuccess('')

    try {
      await linkAthlete(linkEmail)
      setLinkSuccess(`Atleta vinculado correctamente`)
      setLinkEmail('')
      // Recargamos la lista para que aparezca el nuevo atleta
      fetchAthletes()
    } catch (err) {
      setLinkError(err.response?.data?.message || 'No se encontro ningun atleta con ese email')
    } finally {
      setIsLinking(false)
    }
  }

  // Sacamos las iniciales del nombre para el avatar de cada atleta
  const getInitials = (name) => {
    if (!name) return 'AT'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0].substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1d1a2f] transition-colors duration-300 p-6">
      <div className="max-w-4xl mx-auto">

        <Header
          title={`Hola, ${user?.name?.split(' ')[0] || 'Coach'} 👋`}
          subtitle="Aqui tienes el resumen de tus atletas"
          userName={user?.name}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Tarjetas de stats rapidas */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-5 border border-slate-200 dark:border-white/10">
            <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Atletas</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-[#965fd4]">
              {isLoadingAthletes ? '—' : athletes.length}
            </p>
          </div>
          <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-5 border border-slate-200 dark:border-white/10">
            <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Atletas activos</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-[#965fd4]">
              {isLoadingAthletes ? '—' : athletes.filter(a => a.active).length}
            </p>
          </div>
        </div>

        {/* Panel para vincular atleta nuevo */}
        <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-6 border border-slate-200 dark:border-white/10 mb-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Vincular atleta</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">El atleta debe estar registrado previamente en CoachHub</p>

          <form onSubmit={handleLinkAthlete} className="flex gap-3">
            <input
              type="email"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              required
              placeholder="Email del atleta"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#965fd4]"
            />
            <button
              type="submit"
              disabled={isLinking}
              className="px-5 py-3 rounded-xl bg-purple-600 dark:bg-[#965fd4] text-white font-bold text-sm disabled:opacity-60 hover:bg-purple-700 transition-colors"
            >
              {isLinking ? '...' : 'Vincular'}
            </button>
          </form>

          {/* Feedback del vinculado */}
          {linkSuccess && (
            <p className="mt-3 text-sm font-medium text-green-600 dark:text-[#8bd450]">{linkSuccess}</p>
          )}
          {linkError && (
            <p className="mt-3 text-sm font-medium text-red-500">{linkError}</p>
          )}
        </div>

        {/* Lista de atletas */}
        <div className="bg-white dark:bg-[#2a273f] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Mis atletas</h2>
          </div>

          {isLoadingAthletes ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400 dark:text-gray-500">
              Cargando...
            </div>
          ) : athletes.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-400 dark:text-gray-500 text-sm">Todavia no tienes atletas vinculados</p>
              <p className="text-slate-300 dark:text-gray-600 text-xs mt-1">Usa el formulario de arriba para añadir el primero</p>
            </div>
          ) : (
            <ul>
              {athletes.map((athlete, index) => (
                <li
                  key={athlete.id}
                  className={`flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${index < athletes.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''}`}
                  onClick={() => navigate(`/coach/athlete/${athlete.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar con iniciales del atleta */}
                    <div className="w-10 h-10 rounded-full border-2 border-green-500 dark:border-[#8bd450] bg-green-50 dark:bg-[#8bd450]/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-700 dark:text-[#8bd450]">
                        {getInitials(athlete.name)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{athlete.name}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">{athlete.email}</p>
                    </div>
                  </div>
                  {/* Flecha de acceso a la ficha */}
                  <span className="text-slate-300 dark:text-gray-600 text-lg">›</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}