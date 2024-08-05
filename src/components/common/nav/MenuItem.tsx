"use client"

import { FC, ReactNode } from "react"

interface MenuItemProps{

  children: ReactNode;
  onClick: () => void
}

export const MenuItem:FC<MenuItemProps> = ({children, onClick}) => {
  return (
    <div onClick={onClick} className="px-4 py-3 hover:bg-neutral-100 transition">
      {children}
    </div>
  )
}
