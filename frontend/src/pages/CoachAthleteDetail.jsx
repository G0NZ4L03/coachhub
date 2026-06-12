import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { 
  getAthleteById, 
  getAllExercises, 
  createRoutine, 
  addExerciseToRoutine,
  getRoutinesByAthlete,
  getExercisesByRoutine
} from '../services/api'

export default function CoachAthleteDetail({ isDarkMode, setIsDarkMode }) {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Datos del atleta
  const [athlete, setAthlete] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Rutina activa del atleta
  const [activeRoutine, setActiveRoutine] = useState(null)
  const [routineExercises, setRoutineExercises] = useState([])

  // Catalogo de ejercicios disponibles
  const [exercises, setExercises] = useState([])
  const [filteredExercises, setFilteredExercises] = useState([])
  const [exerciseSearch, setExerciseSearch] = useState('')

  // Control del formulario de nueva rutina
  const [showRoutineForm, setShowRoutineForm] = useState(false)
  const [routineName, setRoutineName] = useState('')
  const [routineNotes, setRoutineNotes] = useState('')
  const [routineStartDate, setRoutineStartDate] = useState('')
  const [routineEndDate, setRoutineEndDate] = useState('')
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false)

  // Control del formulario de añadir ejercicio
  const [showExerciseForm, setShowExerciseForm] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState('')
  const [assignedDate, setAssignedDate] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [rir, setRir] = useState('')
  const [restSeconds, setRestSeconds] = useState('')
  const [isAddingExercise, setIsAddingExercise] = useState(false)

  // Cargamos todo al montar: atleta, rutinas y catalogo de ejercicios
  useEffect(() => {
    fetchAll()
  }, [id])

  // Filtramos ejercicios cuando cambia el texto de busqueda
  useEffect(() => {
    if (!exerciseSearch.trim()) {
      setFilteredExercises(exercises)
    } else {
      const q = exerciseSearch.toLowerCase()
      setFilteredExercises(
        exercises.filter(e => 
          e.name.toLowerCase().includes(q) || 
          e.muscleGroup.toLowerCase().includes(q)
        )
      )
    }
  }, [exerciseSearch, exercises])

  const fetchAll = async () => {
    try {
      // Cargamos atleta, rutinas y ejercicios en paralelo para ir mas rapido
      const [athleteRes, routinesRes, exercisesRes] = await Promise.all([
        getAthleteById(id),
        getRoutinesByAthlete(id),
        getAllExercises()
      ])

      setAthlete(athleteRes.data)
      setExercises(exercisesRes.data)
      setFilteredExercises(exercisesRes.data)

      // Buscamos la rutina activa entre todas las del atleta
      const active = routinesRes.data.find(r => r.isActive === true)
      if (active) {
        setActiveRoutine(active)
        // Cargamos los ejercicios de la rutina activa
        const exRes = await getExercisesByRoutine(active.id)
        setRoutineExercises(exRes.data)
      }
    } catch (err) {
      setError('No se pudieron cargar los datos del atleta')
    } finally {
      setIsLoading(false)
    }
  }

  // El coach crea una rutina nueva para el atleta
  // El backend se encarga de desactivar la anterior si existia
  const handleCreateRoutine = async (e) => {
    e.preventDefault()
    setIsCreatingRoutine(true)
    try {
      const response = await createRoutine({
        athleteId: parseInt(id),
        name: routineName,
        notes: routineNotes,
        startDate: routineStartDate || null,
        endDate: routineEndDate || null
      })
      setActiveRoutine(response.data)
      setRoutineExercises([])
      setShowRoutineForm(false)
      // Limpiamos el formulario
      setRoutineName('')
      setRoutineNotes('')
      setRoutineStartDate('')
      setRoutineEndDate('')
    } catch (err) {
      setError('Error al crear la rutina')
    } finally {
      setIsCreatingRoutine(false)
    }
  }

  // Añadimos un ejercicio a la rutina activa con todos sus parametros
  const handleAddExercise = async (e) => {
    e.preventDefault()
    setIsAddingExercise(true)
    try {
      const response = await addExerciseToRoutine(activeRoutine.id, {
        exerciseId: parseInt(selectedExercise),
        assignedDate,
        sets: parseInt(sets),
        reps: parseInt(reps),
        rir: rir ? parseInt(rir) : null,
        restSeconds: restSeconds ? parseInt(restSeconds) : null
      })
      // Añadimos el ejercicio a la lista sin recargar todo
      setRoutineExercises(prev => [...prev, response.data])
      // Limpiamos el formulario pero mantenemos la fecha para agilizar
      setSelectedExercise('')
      setSets('')
      setReps('')
      setRir('')
      setRestSeconds('')
    } catch (err) {
      setError('Error al añadir el ejercicio')
    } finally {
      setIsAddingExercise(false)
    }
  }

  // Agrupamos los ejercicios por fecha para mostrarlos organizados por dia
  const groupExercisesByDate = (exercises) => {
    return exercises.reduce((groups, ex) => {
      const date = ex.assignedDate
      if (!groups[date]) groups[date] = []
      groups[date].push(ex)
      return groups
    }, {})
  }

  // Calculamos la edad a partir de la fecha de nacimiento
  const calcAge = (birthDate) => {
    if (!birthDate) return '—'
    const diff = Date.now() - new Date(birthDate).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  const translateGender = (g) => ({ MALE: 'Hombre', FEMALE: 'Mujer', OTHER: 'Otro' }[g] || '—')
  const translateObjective = (o) => ({
    LOSE_WEIGHT: 'Perder peso',
    GAIN_MUSCLE: 'Ganar músculo',
    MAINTAIN: 'Mantenimiento',
    IMPROVE_PERFORMANCE: 'Mejorar rendimiento'
  }[o] || '—')

  const getInitials = (name) => {
    if (!name) return 'AT'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0].substring(0, 2).toUpperCase()
  }

  // Formateamos la fecha para mostrarla en español sin libreria externa
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
          title="Ficha del atleta"
          subtitle="Datos físicos y seguimiento"
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

        {isLoading && (
          <div className="text-center py-20 text-slate-400 dark:text-gray-500 text-sm">
            Cargando...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {athlete && (
          <>
            {/* Cabecera con nombre y email del atleta */}
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

            {/* Grid de datos fisicos */}
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
                  { label: 'Estado', value: athlete.isActive ? 'Activo' : 'Inactivo' },
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

            {/* SECCION DE RUTINA */}
            <div className="bg-white dark:bg-[#2a273f] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Rutina asignada</h3>
                  {activeRoutine && (
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      {formatDate(activeRoutine.startDate)} — {formatDate(activeRoutine.endDate)}
                    </p>
                  )}
                </div>
                {/* Boton crear o cambiar rutina */}
                <button
                  onClick={() => setShowRoutineForm(!showRoutineForm)}
                  className="text-xs font-bold px-4 py-2 rounded-xl bg-purple-600 dark:bg-[#965fd4] text-white hover:bg-purple-700 transition-colors"
                >
                  {activeRoutine ? 'Cambiar rutina' : 'Crear rutina'}
                </button>
              </div>

              {/* Formulario de nueva rutina, aparece al pulsar el boton */}
              {showRoutineForm && (
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#1d1a2f]/50">
                  <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                    {activeRoutine ? 'Nueva rutina (desactiva la actual)' : 'Nueva rutina'}
                  </p>
                  <form onSubmit={handleCreateRoutine} className="space-y-3">
                    <input
                      type="text"
                      value={routineName}
                      onChange={(e) => setRoutineName(e.target.value)}
                      required
                      placeholder="Nombre de la rutina (ej: Split 3 dias)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#965fd4]"
                    />
                    <textarea
                      value={routineNotes}
                      onChange={(e) => setRoutineNotes(e.target.value)}
                      placeholder="Notas opcionales para el atleta"
                      rows={2}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#965fd4] resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Fecha inicio</label>
                        <input
                          type="date"
                          value={routineStartDate}
                          onChange={(e) => setRoutineStartDate(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#965fd4]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Fecha fin</label>
                        <input
                          type="date"
                          value={routineEndDate}
                          onChange={(e) => setRoutineEndDate(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-[#965fd4]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={isCreatingRoutine}
                        className="px-5 py-3 rounded-xl bg-purple-600 dark:bg-[#965fd4] text-white font-bold text-sm disabled:opacity-60 hover:bg-purple-700 transition-colors"
                      >
                        {isCreatingRoutine ? 'Creando...' : 'Crear rutina'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRoutineForm(false)}
                        className="px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Si no hay rutina activa mostramos estado vacio */}
              {!activeRoutine && !showRoutineForm && (
                <div className="px-6 py-12 text-center">
                  <p className="text-slate-400 dark:text-gray-500 text-sm">Todavia no hay rutina asignada</p>
                  <p className="text-slate-300 dark:text-gray-600 text-xs mt-1">Pulsa "Crear rutina" para empezar</p>
                </div>
              )}

              {/* Si hay rutina activa mostramos sus ejercicios agrupados por dia */}
              {activeRoutine && (
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeRoutine.name}
                    </h4>
                    <button
                      onClick={() => setShowExerciseForm(!showExerciseForm)}
                      className="text-xs font-bold px-4 py-2 rounded-xl bg-green-600 dark:bg-[#8bd450] text-white dark:text-[#1d1a2f] hover:bg-green-700 transition-colors"
                    >
                      + Añadir ejercicio
                    </button>
                  </div>

                  {/* Formulario para añadir ejercicio a la rutina */}
                  {showExerciseForm && (
                    <div className="mb-5 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1d1a2f]/50">
                      <form onSubmit={handleAddExercise} className="space-y-3">
                        {/* Buscador de ejercicios */}
                        <input
                          type="text"
                          value={exerciseSearch}
                          onChange={(e) => setExerciseSearch(e.target.value)}
                          placeholder="Buscar ejercicio por nombre o grupo muscular..."
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
                        />
                        {/* Selector de ejercicio filtrado */}
                        <select
                          value={selectedExercise}
                          onChange={(e) => setSelectedExercise(e.target.value)}
                          required
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
                        >
                          <option value="">Selecciona un ejercicio...</option>
                          {filteredExercises.map(ex => (
                            <option key={ex.id} value={ex.id}>
                              {ex.name} — {ex.muscleGroup}
                            </option>
                          ))}
                        </select>

                        {/* Fecha asignada al ejercicio */}
                        <div>
                          <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Fecha del dia</label>
                          <input
                            type="date"
                            value={assignedDate}
                            onChange={(e) => setAssignedDate(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
                          />
                        </div>

                        {/* Parametros del ejercicio en grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Series</label>
                            <input
                              type="number"
                              value={sets}
                              onChange={(e) => setSets(e.target.value)}
                              required
                              min="1"
                              placeholder="4"
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Reps</label>
                            <input
                              type="number"
                              value={reps}
                              onChange={(e) => setReps(e.target.value)}
                              required
                              min="1"
                              placeholder="10"
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">RIR</label>
                            <input
                              type="number"
                              value={rir}
                              onChange={(e) => setRir(e.target.value)}
                              min="0"
                              max="5"
                              placeholder="2"
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">Descanso (s)</label>
                            <input
                              type="number"
                              value={restSeconds}
                              onChange={(e) => setRestSeconds(e.target.value)}
                              min="0"
                              placeholder="90"
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={isAddingExercise}
                            className="px-5 py-3 rounded-xl bg-green-600 dark:bg-[#8bd450] text-white dark:text-[#1d1a2f] font-bold text-sm disabled:opacity-60 hover:bg-green-700 transition-colors"
                          >
                            {isAddingExercise ? 'Añadiendo...' : 'Añadir'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowExerciseForm(false)}
                            className="px-5 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Lista de ejercicios agrupados por fecha */}
                  {routineExercises.length === 0 ? (
                    <p className="text-slate-400 dark:text-gray-500 text-sm text-center py-6">
                      Todavia no hay ejercicios en esta rutina
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(groupExercisesByDate(routineExercises))
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([date, exs]) => (
                          <div key={date}>
                            {/* Cabecera del dia */}
                            <p className="text-xs font-bold text-purple-600 dark:text-[#965fd4] uppercase tracking-wide mb-2">
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
                                  {/* Parametros del ejercicio en pills */}
                                  <div className="flex gap-2 flex-wrap justify-end">
                                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-purple-50 dark:bg-[#965fd4]/10 text-purple-700 dark:text-[#965fd4]">
                                      {re.sets}x{re.reps}
                                    </span>
                                    {re.rir !== null && (
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
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}