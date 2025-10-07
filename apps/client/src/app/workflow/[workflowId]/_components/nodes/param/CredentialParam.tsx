"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetCredentials } from "@/hooks/user"
import type { TaskParamProps } from "@/schema/task"
import { Loader2 } from "lucide-react"

export default function CredentialParam({ param, updateNodeParamValue, value, disabled }: TaskParamProps) {
  const { credentials, isLoading } = useGetCredentials()
  if (isLoading)
    return (
      <>
        <div className="flex justify-center items-center h-full w-full">
          <Loader2 width={8} height={8} />
        </div>
      </>
    )
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={param.name} className="text-sm font-medium ">
        {param.name}
        {param.required && <span className="text-red-500">*</span>}
      </Label>
      <Select
        disabled={disabled}
        onValueChange={(val) => {
          updateNodeParamValue(val)
        }}
        value={value}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue className="cursor-pointer" placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="bg-background w-fit">
            <SelectLabel className="">Credentials</SelectLabel>
            {credentials && credentials.length > 0 ? (
              credentials.map((credential) => (
                <SelectItem key={credential.id} value={credential.id} className="cursor-pointer">
                  {credential.name}
                </SelectItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">No credentials found.</div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
