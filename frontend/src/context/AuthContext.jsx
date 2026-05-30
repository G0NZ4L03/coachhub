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
    return token ? { token, role, name, id } : null
  })

  // Guardamos todo de golpe al hacer login exitoso
  const loginUser = (data) => {
    localStorage.setItem('jwt_token', data.token)
    localStorage.setItem('user_role', data.role)
    localStorage.setItem('user_name', data.name)
    localStorage.setItem('user_id', data.id)
    setUser(data)
  }

  // Limpiamos al salir
  const logoutUser = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_id')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar el contexto facilmente desde cualquier componente
export const useAuth = () => useContext(AuthContext)
// Exportamos tambien el contexto para compatibilidad con useContext directo
export { AuthContext }