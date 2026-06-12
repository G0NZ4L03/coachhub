import { createContext, useContext, useState } from 'react'

// Con este contexto compartimos los datos de sesion con toda la app
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Leemos lo que hay guardado de sesiones anteriores
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('jwt_token')
    const role = localStorage.getItem('user_role')
    const name = localStorage.getItem('user_name')
    const id = localStorage.getItem('user_id')
    // Convertimos a booleano porque localStorage solo guarda strings
    const onboardingComplete = localStorage.getItem('onboarding_complete') === 'true'
    // Recuperamos el peso si ya completo el onboarding en una sesion anterior
    const startingWeight = localStorage.getItem('user_starting_weight')
    return token ? { token, role, name, id, onboardingComplete, startingWeight } : null
  })

  // Guardamos todo de golpe al hacer login exitoso
  // data contiene: token, role, name, id, onboardingComplete
  const loginUser = (data) => {
    localStorage.setItem('jwt_token', data.token)
    localStorage.setItem('user_role', data.role)
    localStorage.setItem('user_name', data.name)
    localStorage.setItem('user_id', data.id)
    localStorage.setItem('onboarding_complete', data.onboardingComplete)
    // Si el backend nos manda el peso lo guardamos para mostrarlo en el dashboard
    if (data.startingWeight) {
      localStorage.setItem('user_starting_weight', data.startingWeight)
    }
    setUser(data)
  }

  // Actualizamos onboardingComplete y guardamos el peso inicial del atleta
  // Sin tocar el resto de la sesion activa
  const completeOnboarding = (startingWeight) => {
    localStorage.setItem('onboarding_complete', 'true')
    localStorage.setItem('user_starting_weight', startingWeight)
    setUser(prev => ({ ...prev, onboardingComplete: true, startingWeight }))
  }

  // Limpiamos al salir
  const logoutUser = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_id')
    localStorage.removeItem('onboarding_complete')
    localStorage.removeItem('user_starting_weight')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar el contexto facilmente desde cualquier componente
export const useAuth = () => useContext(AuthContext)
// Exportamos tambien el contexto para compatibilidad con useContext directo
export { AuthContext }