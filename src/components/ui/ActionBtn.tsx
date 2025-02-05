
import { FC, MouseEvent } from "react";
import { IconType } from "react-icons"

interface ActionBtnProps{
  icon: IconType;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean
}

export const ActionBtn:FC<ActionBtnProps> = ({icon:Icon, onClick, disabled}) => {
  return (
    <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center rounded cursor-pointer w-[40px] h-[30px] text-slate-700 border border-slate-400 ${disabled && "opacity-50 cursor-not-allowed"}`}>
      <Icon size={18}/>
    </button>
  )
}
