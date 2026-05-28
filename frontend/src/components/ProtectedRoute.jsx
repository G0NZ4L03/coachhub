import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Componente que protege las rutas privadas
// Si el usuario no esta logueado, redirige al login automaticamente
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  // Si no hay sesion activa, mandamos al login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si la ruta requiere un rol especifico y el usuario no lo tiene, redirigimos
  // Lo configuro asi para evitar que un atleta acceda al panel del coach y viceversa
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  // Si todo esta bien, mostramos el contenido protegido
  return children
}

export default ProtectedRoute