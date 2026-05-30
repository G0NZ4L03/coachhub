import React from 'react';

// Logo oficial de CoachHub: dos barras de progreso (morada=coach, verde=atleta)
// y texto con "Hub" en verde
export const CoachHubLogo = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Icono de las barras (Morado y Verde) */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        {/* Barra izquierda - representa al Coach */}
        <rect x="4" y="10" width="10" height="16" rx="5" className="fill-purple-600 dark:fill-[#965fd4] transition-colors duration-300" />
        {/* Barra derecha - representa al Atleta, mas alta para indicar progreso */}
        <rect x="18" y="4" width="10" height="22" rx="5" className="fill-green-600 dark:fill-[#8bd450] transition-colors duration-300" />
      </svg>

      {/* Texto de la marca con Hub en verde */}
      <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
        Coach<span className="text-green-600 dark:text-[#8bd450]">Hub</span>
      </span>
    </div>
  );
};