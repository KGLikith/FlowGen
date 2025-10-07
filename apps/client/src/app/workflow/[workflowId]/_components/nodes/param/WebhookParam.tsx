"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import type { TaskParamProps } from "@/schema/task"
import { Copy } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"

export default function WebhookParam({ param, updateNodeParamValue, value, disabled }: TaskParamProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value || "")
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (e) {
      console.error("Failed to copy webhook URL", e)
    }
  }, [value])

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="space-y-1">
        <Label className="text-sm font-medium">
          Your webhook URL
          {param.required && <span className="text-red-500">*</span>}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            readOnly
            disabled={disabled}
            value={value || ""}
            placeholder="Webhook URL will appear here"
            onChange={(e) => updateNodeParamValue(e.target.value)}
            className="text-xs font-medium bg-white"
          />
          <Button variant="secondary" size="sm" onClick={onCopy} disabled={!value}>
            <Copy className="w-4 h-4 mr-1" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        {param.helperText && <p className="text-xs text-muted-foreground">{param.helperText}</p>}
      </div>

      <Card className="p-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-foreground" aria-hidden />
          <p className="text-sm font-medium">We’re listening!</p>
        </div>
        <Separator className="my-2" />
        <p className="text-xs text-muted-foreground">Send a request to this URL and we’ll capture it for testing.</p>
      </Card>
    </div>
  )
}
