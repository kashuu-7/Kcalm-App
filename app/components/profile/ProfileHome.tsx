import React from 'react'
import Profile from './Profile'
import Dietary from './Dietary'
import Plan from './Plan'
import SaveData from './SaveData'
import AccountSettings from './AccountSettings'
import Targets from './Targets'
import Danger from './Danger'

export default function ProfileHome() {
  return (
    <main>
      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-[18px] items-start max-[1050px]:grid-cols-1">
        <div className="grid gap-[18px]">
            <Profile />
            <Dietary />
            <Plan />
            <SaveData />
        </div>
        <div className="grid gap-[18px]">
          <AccountSettings />
          <Targets />
          <Danger />
        </div>
      </div>
    </main>
  )
}
