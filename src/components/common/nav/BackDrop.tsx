"use client"

import { FC } from "react"

interface BackDroProps{
  onClick: () => void
}

export const BackDrop: FC<BackDroProps> = ({onClick}) => {
  return (
    <div onClick={onClick} className="z-20 bg-slate-200 opacity-50 w-screen h-screen fixed top-0 left-0">

    </div>
  )
}