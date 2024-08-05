"use client"

import React, { FC } from 'react'
import { IconType } from 'react-icons';

interface SidebarItemProps {
  selected?:boolean;
  icon: IconType;
  label: string;
}

export const SidebarItem:FC<SidebarItemProps> = ({selected, icon: Icon, label}) => {
  return (
    <>
            <li className={`flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group ${selected ? 'border-b-slate-800 text-slate-800' : 'border-transparent text-slate-500' }`}>
               <Icon size={20}/>
               <span className="ms-3">{label}</span>
            </li>
    </>
  )
}