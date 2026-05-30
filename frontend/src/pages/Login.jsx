import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { login, register } from '../services/api'
import { CoachHubLogo } from '../components/Logo'

export default function Login({ isDarkMode, setIsDarkMode }) {
  // Controlamos en que paso estamos: seleccion de rol o formulario
  const [step, setStep] = useState('selection')
  const [selectedRole, setSelectedRole] = useState(null)
  // Alternamos entre login y registro dentro del mismo formulario
  const [isLoginMode, setIsLoginMode] = useState(true)

  // Campos del formulario
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { loginUser } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      let data

      if (isLoginMode) {
        // Login: mandamos email y password al backend
        const response = await login({ email, password })
        data = response.data
      } else {
        // Cortafuegos: el codigo secreto para evitar falsos entrenadores
        // Esta validacion es doble: tambien la hace el backend en AuthService
        if (selectedRole === 'COACH' && secretCode !== 'COACH2026') {
          throw new Error('Codigo de invitacion no valido.')
        }
        const response = await register({ name, email, password, role: selectedRole, secretCode })
        data = response.data
      }

      // Guardamos la sesion completa en el contexto y localStorage
      // data contiene: token, role, name, id, onboardingComplete
      loginUser(data)

      // Redirigimos segun el rol que nos devuelve el servidor
      // Usamos data.role y no selectedRole para fiarnos del backend
      navigate(data.role === 'COACH' ? '/coach/dashboard' : '/athlete/dashboard')

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error de conexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#1d1a2f] transition-colors duration-300 relative">
      {/* Boton flotante de modo oscuro */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed cursor-pointer top-4 right-4 p-3 rounded-full bg-white text-xl shadow-sm border border-slate-200 dark:border-white/10 dark:bg-[#2a273f] hover:scale-110 transition-transform"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-[#2a273f] rounded-3xl p-8 shadow-xl flex flex-col items-center border border-slate-200 dark:border-white/10 transition-colors duration-300">
        <CoachHubLogo className="w-48 mb-6" />

        {/* PASO 1: Seleccion de rol */}
        {step === 'selection' && (
          <>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Bienvenido a CoachHub</h1>
            <p className="text-slate-500 dark:text-gray-300 text-sm mb-8 text-center">Selecciona tu rol para continuar</p>

            <div className="w-full flex flex-col gap-4">
              {/* Tarjeta Coach */}
              <button
                onClick={() => setSelectedRole('COACH')}
                className={`flex cursor-pointer items-center p-4 rounded-2xl border-2 transition-all duration-300 w-full text-left ${selectedRole === 'COACH' ? 'border-purple-600 bg-purple-100 dark:border-[#965fd4] dark:bg-[#965fd4] dark:text-white dark:shadow-[0_0_20px_rgba(150,95,212,0.6)]' : 'border-slate-200 bg-white hover:border-purple-300 dark:border-white/10 dark:bg-[#1d1a2f] dark:hover:border-[#965fd4]/50'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors duration-300 ${selectedRole === 'COACH' ? 'bg-purple-200 dark:bg-white/20' : 'bg-purple-50 dark:bg-[#965fd4]/20'}`}>
                  👨‍🏫
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${selectedRole === 'COACH' ? 'text-purple-900 dark:text-white' : 'text-slate-700 dark:text-white'}`}>Entrenador</h3>
                  <p className={`text-xs mt-1 ${selectedRole === 'COACH' ? 'text-purple-700 dark:text-white/80' : 'text-slate-500 dark:text-gray-400'}`}>Gestiona clientes y planes</p>
                </div>
              </button>

              {/* Tarjeta Atleta */}
              <button
                onClick={() => setSelectedRole('ATHLETE')}
                className={`flex cursor-pointer items-center p-4 rounded-2xl border-2 transition-all duration-300 w-full text-left ${selectedRole === 'ATHLETE' ? 'border-green-600 bg-green-100 dark:border-[#8bd450] dark:bg-[#8bd450] dark:text-[#1d1a2f] dark:shadow-[0_0_20px_rgba(139,212,80,0.6)]' : 'border-slate-200 bg-white hover:border-green-300 dark:border-white/10 dark:bg-[#1d1a2f] dark:hover:border-[#8bd450]/50'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors duration-300 ${selectedRole === 'ATHLETE' ? 'bg-green-200 dark:bg-black/10' : 'bg-green-50 dark:bg-[#8bd450]/20'}`}>
                  🏃‍♂️
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${selectedRole === 'ATHLETE' ? 'text-green-900 dark:text-[#1d1a2f]' : 'text-slate-700 dark:text-white'}`}>Atleta</h3>
                  <p className={`text-xs mt-1 ${selectedRole === 'ATHLETE' ? 'text-green-800 dark:text-[#1d1a2f]/80' : 'text-slate-500 dark:text-gray-400'}`}>Sigue tu progreso</p>
                </div>
              </button>
            </div>

            {/* Boton Continuar, solo aparece cuando hay rol seleccionado */}
            {selectedRole && (
              <button
                onClick={() => { setStep('form'); setIsLoginMode(true); setError('') }}
                className={`cursor-pointer mt-8 w-full py-4 rounded-xl font-bold transition-all cursor-pointer duration-300 shadow-md ${selectedRole === 'COACH' ? 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-[#965fd4]' : 'bg-green-600 text-white hover:bg-green-700 dark:bg-[#8bd450] dark:text-[#1d1a2f]'}`}
              >
                Continuar
              </button>
            )}
          </>
        )}

        {/* PASO 2: Formulario de login o registro */}
        {step === 'form' && (
          <div className="w-full">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              {isLoginMode ? 'Iniciar Sesion' : 'Crear Cuenta'}
            </h1>

            {/* Mensaje de error si algo falla */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              {/* Campo nombre solo en registro */}
              {!isLoginMode && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Tu nombre completo"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white"
                />
              )}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Contrasena"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#1d1a2f] dark:text-white"
              />

              {/* Campo codigo secreto solo en registro de coach */}
              {!isLoginMode && selectedRole === 'COACH' && (
                <input
                  type="password"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  required
                  placeholder="Codigo Secreto (COACH2026)"
                  className="w-full rounded-xl border-2 border-purple-300 bg-purple-50 p-4 dark:border-[#965fd4]/50 dark:bg-[#965fd4]/10 dark:text-white"
                />
              )}

              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 cursor-pointer rounded-xl font-bold shadow-md disabled:opacity-70 ${selectedRole === 'COACH' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white dark:bg-[#8bd450] dark:text-[#1d1a2f]'}`}
                >
                  {isLoading ? 'Cargando...' : (isLoginMode ? 'Entrar' : 'Registrarme')}
                </button>

                {/* Alternamos entre login y registro */}
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white">
                  {isLoginMode ? '¿No tienes cuenta? Registrate' : '¿Ya tienes cuenta? Inicia sesion'}
                </button>

                {/* Volvemos a la seleccion de rol */}
                <button
                  type="button"
                  onClick={() => setStep('selection')}
                  className="cursor-pointer text-sm text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white">
                  ← Volver
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}