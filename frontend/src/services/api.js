import axios from 'axios'

// Direccion del backend de Spring Boot
const BASE_URL = 'http://localhost:8080/api'

// Preparamos axios para no tener que escribir la ruta entera todo el rato
const api = axios.create({
  baseURL: BASE_URL,
})

// Aqui interceptamos antes de hacer cualquier peticion al servidor.
// Le "da" el token JWT a la peticion para poder entrar con Spring Boot 
// sin que salte el error 403
api.interceptors.request.use((config) => {
// Recuperamos el token del usuario guardado al hacer login
const token = localStorage.getItem('jwt_token')
  
  if (token) {
    // Añadimos el token JWT como "DNI digital" en la cabecera de la peticion
    // El formato Bearer es el que espera nuestro filtro de Spring Security
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// --- ZONA DE LOGIN Y REGISTRO ---

// Pasamos los datos, pidiendo el codigo secreto si es entrenador
export const register = (data) => api.post('/auth/register', data)

// Mandamos el correo y contraseña y el servidor nos devuelve el token
export const login = (data) => api.post('/auth/login', data)


// --- GESTION DE USUARIOS ---

// Nos dice quien es el usuario activo ahora mismo
export const getMe = () => api.get('/users/me')

// Para cuando el atleta rellena su peso y altura obligatorios por primera vez
export const updateProfile = (data) => api.put('/users/profile', data)

// Saca la lista de clientes reales que tiene el entrenador actual
export const getMyAthletes = () => api.get('/users/my-athletes')

// Asocia a un atleta con su entrenador usando solo el correo
export const linkAthlete = (athleteEmail) => 
  api.post(`/users/link-athlete?athleteEmail=${athleteEmail}`)

// Carga los datos completos de un atleta concreto para la ficha del coach
export const getAthleteById = (id) => api.get(`/users/athletes/${id}`)


// --- MOTOR DE RUTINAS ---

// Trae todos los ejercicios del catalogo para que el coach los seleccione
export const getAllExercises = () => api.get('/exercises')

// El coach crea una rutina nueva y la asigna a un atleta
export const createRoutine = (data) => api.post('/routines', data)

// Añade un ejercicio a una rutina con su fecha, series, reps y RIR
export const addExerciseToRoutine = (routineId, data) => 
  api.post(`/routines/${routineId}/exercises`, data)

// Devuelve todas las rutinas de un atleta concreto
export const getRoutinesByAthlete = (athleteId) => 
  api.get(`/routines/athlete/${athleteId}`)

// Devuelve los ejercicios de una rutina con todos sus parametros
export const getExercisesByRoutine = (routineId) => 
  api.get(`/routines/${routineId}/exercises`)

// --- PROGRESO Y METRICAS ---

// El atleta registra una nueva entrada de peso
export const addDailyMetric = (data) => api.post('/metrics', data)

// Devuelve el historico de peso del atleta para la grafica
export const getMyMetrics = () => api.get('/metrics')

// El coach consulta el historico de peso de un atleta concreto
export const getAthleteMetrics = (athleteId) => api.get(`/metrics/athlete/${athleteId}`)

export default api