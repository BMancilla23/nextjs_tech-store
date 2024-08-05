"use client"



import { Avatar } from "@/components/ui/Avatar"

import { signOut } from "next-auth/react"
import Link from "next/link"
import { FC, useCallback, useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { BackDrop } from "./BackDrop"
import { MenuItem } from "./MenuItem"
import { SafeUser } from "@/types/safeUser.type"

interface UserMenuProps{
  currentUser: SafeUser | null
}

export const UserMenu:FC<UserMenuProps> = ({currentUser}) => {

  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = useCallback(
    () => {
      setIsOpen(prev => !prev)
    },
    [],
  )

  return (
   <>
     <div className='relative z-30'>
      <div className='p-2 border-slate-400 flex flex-row items-center gap-1 rounded-full cursor-pointer hober:shadow-md transition text-slate-700' onClick={toggleOpen}>
        <Avatar src={currentUser?.image}/>
        <AiFillCaretDown/>
      </div>
      {
        isOpen && (    
           <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm  flex flex-col cursor-pointer">
            {
              currentUser ? <div>
              <Link href="/orders">
                <MenuItem onClick={toggleOpen}>
                  Your Orders
                </MenuItem>
              </Link>
              <Link href="/admin">
                <MenuItem onClick={toggleOpen}>
                  Admin Dashboard
                </MenuItem>
              </Link>
              <hr />
              <MenuItem onClick={() => {
                toggleOpen();
                signOut()
              }}>
                Logout
              </MenuItem>
              </div> : <div>
            <Link href="/auth/login">
              <MenuItem onClick={toggleOpen}>Login</MenuItem>
            </Link>
            <Link href="/auth/register">
              <MenuItem onClick={toggleOpen}>Register</MenuItem>
            </Link>
          </div>
            }
           
          </div>

        )
      }
    </div>
    {
      isOpen ? <BackDrop onClick={toggleOpen}/> : null
    }
   </>

  )
}
