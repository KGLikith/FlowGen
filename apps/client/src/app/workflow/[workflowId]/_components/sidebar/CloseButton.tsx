import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import React from 'react'

type Props = {
    onClose: () => void
}

export default function CloseButton({ onClose }: Props) {
    return (
        <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close history">
                <X className="size-4" />
            </Button>
        </div>
    )
}