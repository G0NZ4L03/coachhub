import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/api'

// Modal bloqueante que aparece cuando el atleta no ha completado sus datos fisicos
// El atleta no puede cerrar este modal, debe rellenarlo obligatoriamente
export default function OnboardingModal() {
  const { completeOnboarding } = useAuth()

  const [height, setHeight] = useState('')
  const [startingWeight, setStartingWeight] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [objective, setObjective] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Mandamos los datos fisicos al backend para completar el perfil
      await updateProfile({
        height: parseFloat(height),
        startingWeight: parseFloat(startingWeight),
        birthDate,
        gender,
        objective
      })

      // Actualizamos el contexto para que el modal desaparezca
      // y el dashboard se desbloquee sin recargar la pagina
      completeOnboarding(startingWeight)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // Fondo oscuro que bloquea toda la pantalla detras del modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#2a273f] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl">

        {/* Icono y titulo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-[#8bd450]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Completa tu perfil</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Necesitamos estos datos para que tu entrenador pueda trabajar contigo
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Altura en centimetros */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">
                Altura (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                placeholder="175"
                min="100"
                max="250"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
              />
            </div>

            {/* Peso inicial en kilogramos */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">
                Peso (kg)
              </label>
              <input
                type="number"
                value={startingWeight}
                onChange={(e) => setStartingWeight(e.target.value)}
                required
                placeholder="70"
                min="30"
                max="300"
                step="0.1"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
              />
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
            />
          </div>

          {/* Genero */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">
              Genero
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
            >
              <option value="">Selecciona...</option>
              <option value="MALE">Hombre</option>
              <option value="FEMALE">Mujer</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>

          {/* Objetivo del atleta */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1 block">
              Objetivo
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
            >
              <option value="">Selecciona...</option>
              <option value="LOSE_WEIGHT">Perder peso</option>
              <option value="GAIN_MUSCLE">Ganar musculo</option>
              <option value="MAINTAIN">Mantenimiento</option>
              <option value="IMPROVE_PERFORMANCE">Mejorar rendimiento</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-green-600 dark:bg-[#8bd450] text-white dark:text-[#1d1a2f] font-bold text-sm disabled:opacity-60 hover:bg-green-700 transition-colors mt-2"
          >
            {isLoading ? 'Guardando...' : 'Guardar y empezar'}
          </button>
        </form>

      </div>
    </div>
  )
}