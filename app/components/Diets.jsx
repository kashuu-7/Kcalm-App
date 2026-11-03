import React from 'react'
import DietSection1 from './DietSection1'
import DietSection2 from './DietSection2'

export default function Diets() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
      <DietSection1 />
      <DietSection2 />
    </div>
  )
}
