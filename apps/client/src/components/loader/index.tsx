import React from 'react'
import { Loader } from 'lucide-react'

type Props = {
  state?: boolean
  className?: string
  color?: string
  children?: React.ReactNode
}

const LoaderIc = ({ state, className, color, children }: Props) => {
  return <div className="flex h-screen w-screen justify-center items-center text-foreground ">
      <Loader className="h-7 w-7 animate-spin" />
    </div>
}

export default LoaderIc
