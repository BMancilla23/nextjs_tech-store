import { FC } from "react";
import { IconType } from "react-icons";

interface BadgeProps{
  text: string;
  icon: IconType;
  bg: string;
  color: string;
}

export const Badge:FC<BadgeProps> = ({text, icon:Icon, bg, color}) => {
  return (
    <div className={`px-1 rounded inline-flex items-center gap-1 ${bg} ${color} h-5`}>
        {text} <Icon size={15}/>
    </div>
  )
}