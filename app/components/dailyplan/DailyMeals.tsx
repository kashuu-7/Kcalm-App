import React from 'react'
import MealsLeft from './MealsLeft'
import MealsRight from './MealsRight'

export default function DailyMeals() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start max-[1026px]:grid-cols-1 gap-[18px]">
      <MealsLeft />
      <MealsRight />
    </div>
  )
}
