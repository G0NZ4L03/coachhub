import { createContext, useContext, useState } from 'react'

// Con este contexto compartimos los datos de sesion la app
// Todos los componentes sabrán quién está logueado sin usar props
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Guardamos el estado del usuario (token, rol, nombre e id)
  // Lo inicializamos desde localStorage para mantener la sesion al recargar
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const name = localStorage.getItem('name')
    const id = localStorage.getItem('id')
    // Si hay token guardado, reconstruimos el usuario sin pedir de nuevo el login
    return token ? { token, role, name, id } : null
  })

  // Funcion al hacer login exitoso, guardamos los 
  // datos en localStorage y actualiza el estado global
  const loginUser = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('role', data.role)
    localStorage.setItem('name', data.name)
    localStorage.setItem('id', data.id)
    setUser(data)
  }

  // Funcion de logout, limpia localStorage y resetea el estado
  // Paramos el interceptor de axios para que no envie mas el token automaticamente
  const logoutUser = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    localStorage.removeItem('id')
    setUser(null)
  }

  return (
    // Le damos el contexto a todos los componentes hijos
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto facilmente
// En vez de: useContext(AuthContext) usamos --> useAuth()
export const useAuth = () => useContext(AuthContext)