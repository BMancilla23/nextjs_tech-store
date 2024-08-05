import Image from 'next/image'
import React from 'react'

type Props = {}

export const Banner = (props: Props) => {
  return (
    <div className='relative bg-gradient-to-r from-slate-800 to-slate-950 mb-8'>
      <div className='mx-auto px-8 py-12 flex flex-col gap-2 md:flex-row items-center justify-evenly'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-6xl font-semibold text-white' >Summer Sale</h1>
          <p className='text-lg md:text-xl text-white mb-2'>Enjoy discount on selected items</p>
          <p className='text-2xl md:text-5xl text-yellow-400 font-semibold'>GET 50% OFF</p>
        </div>

        <div className='w-1/3 relative aspect-video'>
          <Image src='/banner-image.png' fill alt='image' className='object-contain'/>
        </div>
      </div>

      </div>
  )
}