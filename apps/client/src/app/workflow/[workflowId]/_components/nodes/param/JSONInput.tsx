'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from '@/components/ui/command'

export function JsonKeyInput({
  json,
  value,
  onChange,
}: {
  json: any
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const keys = Object.keys(json || {})

  return (
    <div className="relative">
      <Input
        value={value}
        placeholder="Type or choose a key..."
        onFocus={() => setOpen(true)}
        onChange={(e) => onChange(e.target.value)}
      />
      {open && (
        <Command className="absolute z-50 mt-1 w-full border rounded-md bg-background shadow-lg">
          <CommandInput placeholder="Search key..." />
          <CommandList>
            {keys.map((k) => (
              <CommandItem
                key={k}
                onSelect={() => {
                  onChange(`input.${k}`)
                  setOpen(false)
                }}
              >
                input.{k}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      )}
    </div>
  )
}
