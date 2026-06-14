import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { getMe, getMyAthletes } from '../services/api'

export default function CoachProfile({ isDarkMode, setIsDarkMode }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [athleteCount, setAthleteCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const [meRes, athletesRes] = await Promise.all([getMe(), getMyAthletes()])
      setProfile(meRes.data)
      setAthleteCount(athletesRes.data.length)
    } catch (err) {
      console.error('Error al cargar el perfil:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'CH'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0].substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1d1a2f] transition-colors duration-300 p-6">
      <div className="max-w-4xl mx-auto">

        <Header
          title="Mi perfil"
          subtitle="Informacion de tu cuenta"
          userName={user?.name}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <button
          onClick={() => navigate('/coach/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ← Volver a mis atletas
        </button>

        {isLoading ? (
          <p className="text-center text-sm text-slate-400 dark:text-gray-500 py-12">Cargando...</p>
        ) : (
          <>
            <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-6 border border-slate-200 dark:border-white/10 mb-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full border-2 border-purple-600 dark:border-[#965fd4] bg-purple-50 dark:bg-[#965fd4]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-purple-700 dark:text-[#965fd4]">
                  {getInitials(profile?.name)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.name}</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">{profile?.email}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2a273f] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Resumen de la cuenta</h3>
              </div>
              <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-white/5">
                <div className="bg-white dark:bg-[#2a273f] px-6 py-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Rol</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">Entrenador</p>
                </div>
                <div className="bg-white dark:bg-[#2a273f] px-6 py-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Atletas vinculados</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{athleteCount}</p>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}