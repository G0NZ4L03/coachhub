import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import OnboardingModal from '../components/OnboardingModal'

export default function DashboardAthlete({ isDarkMode, setIsDarkMode }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1d1a2f] transition-colors duration-300 p-6">
      <div className="max-w-4xl mx-auto">

        <Header
          title={`Hola, ${user?.name?.split(' ')[0] || 'Atleta'} 👋`}
          subtitle="Aqui tienes tu rutina de entrenamiento"
          userName={user?.name}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Modal bloqueante: si el atleta no ha completado sus datos, no ve nada */}
        {!user?.onboardingComplete && (
          <OnboardingModal />
        )}

        {/* Contenido principal, solo visible si el onboarding esta completo */}
        {user?.onboardingComplete && (
          <>
            {/* Stats rapidas del atleta */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-5 border border-slate-200 dark:border-white/10">
                    <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Peso actual</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-[#8bd450]">
                        {user?.startingWeight ? `${user.startingWeight} kg` : '—'}
                    </p>
                </div>
                <div className="bg-white dark:bg-[#2a273f] rounded-2xl p-5 border border-slate-200 dark:border-white/10">
                    <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide mb-1">Rutina activa</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-[#8bd450]">—</p>
                </div>
            </div>

            {/* Placeholder de rutina asignada, se rellena en la siguiente fase */}
            <div className="bg-white dark:bg-[#2a273f] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Mi rutina</h2>
              </div>
              <div className="px-6 py-12 text-center">
                <p className="text-slate-400 dark:text-gray-500 text-sm">Todavia no tienes rutina asignada</p>
                <p className="text-slate-300 dark:text-gray-600 text-xs mt-1">Tu entrenador te asignara una pronto</p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}