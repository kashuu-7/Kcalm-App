import React from 'react'
import Pricing from './Pricing'
import Trust from './Trust'
import Download from './Download'
import Faq from './Faq'
import CalmerWay from './CalmerWay'
import Footer from './Footer'

export default function PriceMain() {
  return (
    <div className=" w-[full] max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
      <Pricing />
      <Trust />
      <Download />
      <Faq />
      <CalmerWay />
      <Footer />
    </div>
  )
}
