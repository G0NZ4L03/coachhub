import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import OnboardingModal from '../components/OnboardingModal'
import { getRoutinesByAthlete, getExercisesByRoutine } from '../services/api'

export default function DashboardAthlete({ isDarkMode, setIsDarkMode }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Rutina activa y sus ejercicios
  const [activeRoutine, setActiveRoutine] = useState(null)
  const [routineExercises, setRoutineExercises] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargamos la rutina activa del atleta al montar el componente
  useEffect(() => {
    if (user?.onboardingComplete) {
      fetchRoutine()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const fetchRoutine = async () => {
    try {
      const routinesRes = await getRoutinesByAthlete(user.id)
      // Buscamos la rutina activa
      const active = routinesRes.data.find(r => r.isActive === true)
      if (active) {
        setActiveRoutine(active)
        const exRes = await getExercisesByRoutine(active.id)
        setRoutineExercises(exRes.data)
      }
    } catch (err) {
      console.error('Error al cargar la rutina:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Agrupamos los ejercicios por fecha para mostrarlos por dia
  const groupExercisesByDate = (exercises) => {
    return exercises.reduce((groups, ex) => {
      const date = ex.assignedDate
      if (!groups[date]) groups[date] = []
      groups[date].push(ex)
      return groups
    }, {})
  }

  // Formateamos la fecha en español sin libreria externa
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const [year, month, day] = dateStr.split('-')
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
    return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1d1a2f] transition-colors duration-300 p-6">
      <div className="max-w-4xl mx-auto">

        <Header
          title={`Hola, ${user?.name?.split(' ')[0] || 'Atleta'} 👋`}
          subtitle="Aqui tienes tu rutina de entrenamiento"
          userName={user?.name}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Modal bloqueante: si el atleta no ha completado sus datos, no ve nada */}
        {!user?.onboardingComplete && (
          <OnboardingModal />
        )}

        {/* Contenido principal, solo visible si el onboarding esta completo */}
        {user?.onboardingComplete && (
          <>
            {/* Boton de acceso a la grafica de progreso */}
            <button
              onClick={() => navigate('/athlete/progress')}
              className="mb-6 text-sm font-bold px-4 py-2 rounded-xl bg-green-600 dark:bg-[#8bd450] text-white dark:text-[#1d1a2f] hover:bg-green-700 transition-colors"
            >
              Ver mi progreso →
            </button>

            {/* Stats rapidas del atleta */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-5 border border-slate-200 dark:border-white/10">
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Peso actual</p>
                <p className="text-3xl font-bold text-green-600 dark:text-[#8bd450]">
                  {user?.startingWeight ? `${user.startingWeight} kg` : '—'}
                </p>
              </div>
              <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-5 border border-slate-200 dark:border-white/10">
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Rutina activa</p>
                <p className="text-lg font-bold text-green-600 dark:text-[#8bd450] truncate">
                  {isLoading ? '—' : activeRoutine ? activeRoutine.name : '—'}
                </p>
              </div>
            </div>

            {/* Rutina del atleta con ejercicios agrupados por dia */}
            <div className="bg-white dark:bg-[#2a273f] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Mi rutina</h2>
                {activeRoutine && (
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    {formatDate(activeRoutine.startDate)} — {formatDate(activeRoutine.endDate)}
                  </p>
                )}
              </div>

              {isLoading ? (
                <div className="px-6 py-12 text-center text-sm text-slate-400 dark:text-gray-500">
                  Cargando...
                </div>
              ) : !activeRoutine ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-slate-400 dark:text-gray-500 text-sm">Todavia no tienes rutina asignada</p>
                  <p className="text-slate-300 dark:text-gray-600 text-xs mt-1">Tu entrenador te asignara una pronto</p>
                </div>
              ) : routineExercises.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-slate-400 dark:text-gray-500 text-sm">La rutina no tiene ejercicios todavia</p>
                </div>
              ) : (
                <div className="px-6 py-5 space-y-5">
                  {Object.entries(groupExercisesByDate(routineExercises))
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, exs]) => (
                      <div key={date}>
                        {/* Cabecera del dia en verde para el atleta */}
                        <p className="text-xs font-bold text-green-600 dark:text-[#8bd450] uppercase tracking-wide mb-2">
                          {formatDate(date)}
                        </p>
                        <div className="space-y-2">
                          {exs.map((re) => (
                            <div
                              key={re.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#1d1a2f]/50 border border-slate-100 dark:border-white/5"
                            >
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {re.exercise.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                  {re.exercise.muscleGroup}
                                </p>
                              </div>
                              {/* Parametros del ejercicio en pills verdes para el atleta */}
                              <div className="flex gap-2 flex-wrap justify-end">
                                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-green-50 dark:bg-[#8bd450]/10 text-green-700 dark:text-[#8bd450]">
                                  {re.sets}x{re.reps}
                                </span>
                                {re.rir !== null && re.rir !== undefined && (
                                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                                    RIR {re.rir}
                                  </span>
                                )}
                                {re.restSeconds && (
                                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                                    {re.restSeconds}s
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}