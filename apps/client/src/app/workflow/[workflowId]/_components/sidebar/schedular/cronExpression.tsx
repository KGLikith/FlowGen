import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import parser from "cron-parser"
import cronstrue from 'cronstrue'

type Props = {
    handleSave: (draft: string, isValid: boolean) => Promise<void>
    workflowCron: string
    draft: string
    setDraft: (value: string) => void
}

export default function CronExpression({ handleSave, workflowCron, draft, setDraft }: Props) {

    const { isValid, draftReadable } = useMemo(() => {
        if (!draft?.trim()) return { isValid: false, draftReadable: "" }
        try {
            parser.parse(draft)
            const readable = cronstrue.toString(draft, { use24HourTimeFormat: true })
            return { isValid: true, draftReadable: readable }
        } catch {
            return { isValid: false, draftReadable: "" }
        }
    }, [draft])

    return (
        <section className="rounded-lg border bg-muted/40 p-4 space-y-3">
            <h3 className="text-xs font-medium text-muted-foreground">Use a cron expression</h3>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="flex-1">
                    <Label htmlFor="cron" className="sr-only">
                        Cron expression
                    </Label>
                    <Input
                        id="cron"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="e.g. */5 * * * *"
                    />
                </div>
                <Button
                    size="sm"
                    className="md:ml-2 md:self-start"
                    onClick={() => handleSave(draft, isValid)}
                    disabled={!isValid || draft === (workflowCron ?? "")}
                >
                    Save
                </Button>
            </div>
            {draft.length > 0 && isValid && <p className="text-xs text-green-600 dark:text-green-500">{draftReadable}</p>}
            {draft.length > 0 && !isValid && (
                <p className="text-xs text-red-600 dark:text-red-500">Invalid cron expression</p>
            )}
            <p className="text-xs text-muted-foreground">
                Need help?{" "}
                <Link
                    href="https://crontab.guru/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                >
                    crontab guru
                </Link>
            </p>
        </section>
    )
}