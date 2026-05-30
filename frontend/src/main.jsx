import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

// Envolvemos toda la app con AuthProvider para que cualquier componente
// pueda acceder a los datos de sesion con useContext(AuthContext)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)