import React, { FC, ReactNode } from 'react'

interface FormWrapProps{
  children: ReactNode
}

export const FormWrap:FC<FormWrapProps> = ({children}) => {
  return (
    <div className='min-h-fit h-full flex items-center justify-center mb-12 mt-24'>
      <div className='max-w-[650px] w-full flex flex-col gap-6 items-center shadow-xl shadow-slate-200 rounded-md p-4 md:p-8'>
        {children}
      </div>
    </div>
  )
}
