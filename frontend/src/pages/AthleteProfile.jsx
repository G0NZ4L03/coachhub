import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { getMe, updateProfile } from '../services/api'

export default function AthleteProfile({ isDarkMode, setIsDarkMode }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Guardamos todos los datos del atleta, pero solo el objetivo es editable
  const [profile, setProfile] = useState(null)
  const [objective, setObjective] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await getMe()
      setProfile(response.data)
      setObjective(response.data.objective ?? '')
    } catch (err) {
      setError('No se pudieron cargar tus datos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      // Mandamos todos los campos para no perderlos, pero solo cambia el objetivo
      await updateProfile({
        height: profile.height,
        startingWeight: profile.startingWeight,
        birthDate: profile.birthDate,
        gender: profile.gender,
        objective
      })
      setProfile(prev => ({ ...prev, objective }))
      setSuccess('Objetivo actualizado correctamente')
    } catch (err) {
      setError('Error al guardar los cambios')
    } finally {
      setIsSaving(false)
    }
  }

  const translateGender = (g) => ({ MALE: 'Hombre', FEMALE: 'Mujer', OTHER: 'Otro' }[g] || '—')

  // Calculamos la edad a partir de la fecha de nacimiento
  const calcAge = (birthDate) => {
    if (!birthDate) return '—'
    const diff = Date.now() - new Date(birthDate).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1d1a2f] transition-colors duration-300 p-6">
      <div className="max-w-4xl mx-auto">

        <Header
          title="Editar mi perfil"
          subtitle="Tus datos y objetivo de entrenamiento"
          userName={user?.name}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <button
          onClick={() => navigate('/athlete/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ← Volver a mi rutina
        </button>

        {isLoading ? (
          <p className="text-center text-sm text-slate-400 dark:text-gray-500 py-12">Cargando...</p>
        ) : (
          <>
            {/* Datos fijos, informativos, no editables */}
            <div className="bg-white dark:bg-[#2a273f] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Tus datos</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Estos datos no cambian, contacta con tu entrenador si hay un error</p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-slate-100 dark:bg-white/5">
                {[
                  { label: 'Edad', value: profile?.birthDate ? `${calcAge(profile.birthDate)} años` : '—' },
                  { label: 'Genero', value: translateGender(profile?.gender) },
                  { label: 'Altura', value: profile?.height ? `${profile.height} cm` : '—' },
                  { label: 'Peso inicial', value: profile?.startingWeight ? `${profile.startingWeight} kg` : '—' },
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

            {/* Objetivo, lo unico editable porque puede cambiar con el tiempo */}
            <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-6 border border-slate-200 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Tu objetivo</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">Puedes cambiarlo cuando quieras segun tu etapa actual</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
                >
                  <option value="LOSE_WEIGHT">Perder peso</option>
                  <option value="GAIN_MUSCLE">Ganar musculo</option>
                  <option value="MAINTAIN">Mantenimiento</option>
                  <option value="IMPROVE_PERFORMANCE">Mejorar rendimiento</option>
                </select>

                {error && <p className="text-sm font-medium text-red-500">{error}</p>}
                {success && <p className="text-sm font-medium text-green-600 dark:text-[#8bd450]">{success}</p>}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-4 rounded-xl bg-green-600 dark:bg-[#8bd450] text-white dark:text-[#1d1a2f] font-bold text-sm disabled:opacity-60 hover:bg-green-700 transition-colors"
                >
                  {isSaving ? 'Guardando...' : 'Guardar objetivo'}
                </button>
              </form>
            </div>
          </>
        )}

      </div>
    </div>
  )
}