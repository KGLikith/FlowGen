"use client"

import type { TaskInfo } from "@/gql/graphql"
import { useWebhookSubscription } from "@/hooks/workflows/subscription"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  taskInfo: TaskInfo
  testing: boolean
  setTesting: (testing: boolean) => void
  currentNodeId: string
  currentTab: string
  workflowId: string
}

export default function WebhookTest({ currentTab, taskInfo, testing, setTesting, currentNodeId, workflowId }: Props) {
  const [webhookURL, setWebhookURL] = useState<string | undefined>()
  const [response, setResponse] = useState<any>()
  const [copied, setCopied] = useState(false)

  const { data } = useWebhookSubscription(currentNodeId, testing)

  useEffect(() => {
    if (testing) {
      setResponse(undefined)
      const timer = setTimeout(() => {
        setTesting(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [testing])

  useEffect(() => {
    if (currentTab === "test") {
      setWebhookURL(`http://localhost:4000/webhook/${workflowId}`)
    } else {
      setResponse(undefined)
    }
  }, [currentTab, currentNodeId])

  useEffect(() => {
    if (data && (data as any).webhookEvent) {
      setResponse((data as any).webhookEvent)
      setTesting(false)
    }
  }, [data, setTesting])

  const isReady = useMemo(() => Boolean(webhookURL), [webhookURL])

  const handleCopy = async () => {
    if (!webhookURL) return
    try {
      await navigator.clipboard.writeText(webhookURL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { }
  }

  const handleStart = () => setTesting(true)
  const handleStop = () => setTesting(false)

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      {/* Webhook URL */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">Your Webhook URL</p>
        <p className="text-[12px] text-muted-foreground">Send your app requests to this URL for testing.</p>

        <div className="mt-2 flex items-center gap-2">
          <Input
            readOnly
            value={webhookURL ?? ""}
            placeholder="Webhook URL will appear here"
            className="text-xs h-9 bg-muted/40"
          />
          <Button
            variant="secondary"
            size="sm"
            className="relative h-9 w-9 flex items-center justify-center"
            onClick={handleCopy}
            disabled={!isReady}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Copy className="h-4 w-4 text-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Status + Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            className={`h-2.5 w-2.5 rounded-full ${testing ? "bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.6)]" : "bg-muted-foreground/40"}`}
            animate={testing ? { scale: [1, 1.3, 1] } : {}}
            transition={{ repeat: testing ? Infinity : 0, duration: 1.2 }}
          />
          <span className="text-sm font-medium">
            {testing ? "Listening for webhook events..." : "Not listening"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!testing ? (
            // <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white" onClick={handleStart} disabled={!isReady}>
            //   Start Listening
            // </Button>
            <></>
          ) : (
            <Button size="sm" variant="destructive" className="h-8" onClick={handleStop}>
              Stop
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-1" />

      {/* Response Display */}
      {response ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Received Response (JSON)</p>
          <p className="text-[11px] text-muted-foreground">
            Most recent webhook payload captured below.
          </p>
          <div className="mt-1 rounded-md border border-border bg-muted/40 p-2">
            <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(response, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          {testing ? "Waiting for an incoming request…" : "Click “Test” and send a webhook request."}
        </p>
      )}
    </div>
  )
}
