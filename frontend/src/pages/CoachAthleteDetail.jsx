import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { getAthleteById } from '../services/api'

export default function CoachAthleteDetail({ isDarkMode, setIsDarkMode }) {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [athlete, setAthlete] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Cargamos los datos del atleta al montar el componente
  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        const response = await getAthleteById(id)
        setAthlete(response.data)
      } catch (err) {
        setError('No se pudieron cargar los datos del atleta')
      } finally {
        setIsLoading(false)
      }
    }
    fetchAthlete()
  }, [id])

  // Calculamos la edad a partir de la fecha de nacimiento
  const calcAge = (birthDate) => {
    if (!birthDate) return '—'
    const diff = Date.now() - new Date(birthDate).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  // Traducimos los valores del enum al español para mostrarlos
  const translateGender = (g) => ({ MALE: 'Hombre', FEMALE: 'Mujer', OTHER: 'Otro' }[g] || '—')
  const translateObjective = (o) => ({
    LOSE_WEIGHT: 'Perder peso',
    GAIN_MUSCLE: 'Ganar músculo',
    MAINTAIN: 'Mantenimiento',
    IMPROVE_PERFORMANCE: 'Mejorar rendimiento'
  }[o] || '—')

  // Sacamos las iniciales del nombre para el avatar
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
          title="Ficha del atleta"
          subtitle="Datos físicos y seguimiento"
          userName={user?.name}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Boton para volver al dashboard */}
        <button
          onClick={() => navigate('/coach/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ← Volver a mis atletas
        </button>

        {isLoading && (
          <div className="text-center py-20 text-slate-400 dark:text-gray-500 text-sm">
            Cargando...
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {athlete && (
          <>
            {/* Cabecera del atleta con avatar y datos principales */}
            <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-6 border border-slate-200 dark:border-white/10 mb-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full border-2 border-green-500 dark:border-[#8bd450] bg-green-50 dark:bg-[#8bd450]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-green-700 dark:text-[#8bd450]">
                  {getInitials(athlete.name)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{athlete.name}</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">{athlete.email}</p>
              </div>
            </div>

            {/* Datos fisicos del atleta en grid */}
            <div className="bg-white dark:bg-[#2a273f] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Datos físicos</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-slate-100 dark:bg-white/5">
                {[
                  { label: 'Edad', value: athlete.birthDate ? `${calcAge(athlete.birthDate)} años` : '—' },
                  { label: 'Género', value: translateGender(athlete.gender) },
                  { label: 'Altura', value: athlete.height ? `${athlete.height} cm` : '—' },
                  { label: 'Peso inicial', value: athlete.startingWeight ? `${athlete.startingWeight} kg` : '—' },
                  { label: 'Objetivo', value: translateObjective(athlete.objective) },
                  { label: 'Estado', value: athlete.active ? 'Activo' : 'Inactivo' },
                ].map((item) => (
                  <div key={item.label} className="bg-white dark:bg-[#2a273f] px-6 py-4">
                    <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      {item.label}
                    </p>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Placeholder de rutina asignada, se rellena en la siguiente fase */}
            <div className="bg-white dark:bg-[#2a273f] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Rutina asignada</h3>
              </div>
              <div className="px-6 py-12 text-center">
                <p className="text-slate-400 dark:text-gray-500 text-sm">Todavia no hay rutina asignada</p>
                <p className="text-slate-300 dark:text-gray-600 text-xs mt-1">El motor de rutinas se implementa en la siguiente fase</p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}