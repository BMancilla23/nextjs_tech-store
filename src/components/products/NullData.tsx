"use client"

import { FC } from "react";

interface NullDataProps{
  title: string;
}

export const NullData:FC<NullDataProps> = ({title}) => {
  return (
    <div className="w-full h-[50vh] flex items-center justify-center text-xl md:text-2xl">
      <p>{title}</p>
    </div>
  )
}
