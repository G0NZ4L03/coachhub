import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { addDailyMetric, getMyMetrics } from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AthleteProgress({ isDarkMode, setIsDarkMode }) {
  const { user } = useAuth()

  const [metrics, setMetrics] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Formulario para nueva entrada de peso
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [weight, setWeight] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await getMyMetrics()
      setMetrics(response.data)
    } catch (err) {
      console.error('Error al cargar el progreso:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMetric = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    try {
      await addDailyMetric({
        date,
        weight: parseFloat(weight),
        steps: null,
        sleepHours: null
      })
      setWeight('')
      // Recargamos el historico para actualizar la grafica
      fetchMetrics()
    } catch (err) {
      setError('Error al guardar el registro')
    } finally {
      setIsSaving(false)
    }
  }

  // Formateamos la fecha en formato corto para el eje X
  const formatDateShort = (dateStr) => {
    const [, month, day] = dateStr.split('-')
    return `${day}/${month}`
  }

  // Preparamos los datos para Recharts con fecha formateada
  const chartData = metrics.map(m => ({
    date: formatDateShort(m.date),
    weight: parseFloat(m.weight)
  }))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1d1a2f] transition-colors duration-300 p-6">
      <div className="max-w-4xl mx-auto">

        <Header
          title="Mi progreso"
          subtitle="Evolucion de tu peso a lo largo del tiempo"
          userName={user?.name}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Formulario para registrar peso de hoy */}
        <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-6 border border-slate-200 dark:border-white/10 mb-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Registrar peso</h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">Anota tu peso de hoy para seguir tu evolucion</p>

          <form onSubmit={handleAddMetric} className="flex gap-3 flex-wrap">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
            />
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              step="0.1"
              min="30"
              max="300"
              placeholder="Peso (kg)"
              className="flex-1 min-w-[120px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-[#8bd450]"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-3 rounded-xl bg-green-600 dark:bg-[#8bd450] text-white dark:text-[#1d1a2f] font-bold text-sm disabled:opacity-60 hover:bg-green-700 transition-colors"
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-500">{error}</p>
          )}
        </div>

        {/* Grafica de evolucion */}
        <div className="bg-white dark:bg-[#2a273f] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Evolucion del peso</h2>

          {isLoading ? (
            <div className="text-center py-12 text-sm text-slate-400 dark:text-gray-500">
              Cargando...
            </div>
          ) : metrics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 dark:text-gray-500 text-sm">Todavia no hay registros de peso</p>
              <p className="text-slate-300 dark:text-gray-600 text-xs mt-1">Usa el formulario de arriba para empezar</p>
            </div>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#ffffff15' : '#e2e8f0'} />
                  <XAxis dataKey="date" stroke={isDarkMode ? '#9ca3af' : '#64748b'} fontSize={12} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#64748b'} fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#2a273f' : '#ffffff',
                      border: isDarkMode ? '1px solid #ffffff1a' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '13px'
                    }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#8bd450" strokeWidth={3} dot={{ r: 4 }} name="Peso (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}