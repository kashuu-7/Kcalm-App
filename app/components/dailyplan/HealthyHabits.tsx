import React from 'react'
import { Bricolage_Grotesque } from 'next/font/google'
import DashboardBottom from '../dashboard/DashboardBottom'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

export default function HealthyHabits() {
  return (
    <div>
      <h3 className={`${bricolage.className} text-[20px] mb-[4px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}>
        Healthy habits
      </h3>
      <p className="text-[13px] text-[#8E978F] mb-[14px]">
        Small daily habits add up to better results.
      </p>
      <DashboardBottom />
    </div>
  )
}
