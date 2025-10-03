import React from 'react'
import CloseButton from '../CloseButton'

type Props = {
  onClose: () => void
}

export default function SettingsPanel({ onClose }: Props) {
  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center justify-between border-b px-3 py-2">
        <h2 className=" font-bold">Settings</h2>
        <CloseButton onClose={onClose} />
      </header>
    </div>
  )
}