import React from 'react'

export default function BgGradient() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="w-[46vw] h-[46vw] bg-[#ffcdb938] top-[-12vw] right-[-10vw] animate-[drift1_22s_ease-in-out_infinite] absolute rounded-full blur-[70px] [will-change:transform]"></div>
      <div className="w-[40vw] h-[40vw] bg-[#b4e4c038] top-[30vh] left-[-14vw] animate-[drift2_26s_ease-in-out_infinite] absolute rounded-full blur-[70px] [will-change:transform]"></div>
      <div className="w-[34vw] h-[34vw] bg-[#d6cdfc33] bottom-[-10vw] right-[20vw] animate-[drift1_30s_ease-in-out_infinite] absolute rounded-full blur-[70px] [will-change:transform]"></div>
      <div className="absolute inset-0 opacity-[0.025] bg-[url('/download.svg')] bg-cover bg-center"></div>
    </div>
  )
}
