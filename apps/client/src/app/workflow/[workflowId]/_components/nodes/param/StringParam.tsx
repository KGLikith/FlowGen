"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { TaskParamProps } from "@/schema/task"
import { useEffect, useId, useState } from "react"

export default function StringParam({ param, value, updateNodeParamValue, disabled, error }: TaskParamProps) {

  const [stringValue, setStringValue] = useState(value)
  const id = useId()
  console.log(param, value, disabled, error)
  
  useEffect(() => {
    setStringValue(value)
  }, [value])

  let Component: any = Input
  if (param.variant === "textarea") {
    Component = Textarea
  }

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-sm font-medium">
        {param.name}
        {param.required && <span className="text-red-500">*</span>}
      </Label>
      <Component
        id={id}
        disabled={disabled}
        placeholder="Enter value here"
        value={stringValue}
        onChange={(e: any) => {
          setStringValue(e.target.value)
        }}
        onBlur={(e: any) => {
          updateNodeParamValue(e.target.value)
        }}
        className={cn("text-xs font-medium bg-white", {
          "border-red-500": param.required && !stringValue && !disabled, 
          "opacity-50 cursor-not-allowed": disabled,
          "border-2 border-red-500": error && !disabled
        })}
      />
      {param.helperText && <p className="text-xs text-muted-foreground px-2">{param.helperText}</p>}
    </div>
  )
}
