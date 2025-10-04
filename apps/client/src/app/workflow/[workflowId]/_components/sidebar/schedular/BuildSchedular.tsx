import React, { useEffect, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from '@/components/ui/calendar'
import parser from "cron-parser"
import cronstrue from "cronstrue"

type Props = {
    handleSave: (cron: string, isValid: boolean) => Promise<void>
    workflowCron: string
    draft: string
    setDraft: (value: string) => void
}

type BuilderState = {
    freq: "hourly" | "daily" | "weekly" | "monthly"
    time: string 
    dayOfWeek: number
    dayOfMonth: number
    date?: Date | null
}

function buildCronFromBuilder(b: BuilderState): string {
    const [hh, mm] = (b.time || "09:00").split(":")
    const h = isNaN(Number(hh)) ? 9 : Number(hh)
    const m = isNaN(Number(mm)) ? 0 : Number(mm)

    switch (b.freq) {
        case "hourly":
            return `0 * * * *`
        case "daily":
            return `${m} ${h} * * *`
        case "weekly":
            return `${m} ${h} * * ${b.dayOfWeek ?? 0}`
        case "monthly":
            return `${m} ${h} ${b.dayOfMonth ?? 1} * *`
        default:
            return `0 * * * *`
    }
}

function buildCronForOneTime(date: Date, time: string): string {
    const [hh, mm] = (time || "09:00").split(":")
    const h = isNaN(Number(hh)) ? 9 : Number(hh)
    const m = isNaN(Number(mm)) ? 0 : Number(mm)
    const day = date.getDate()
    const month = date.getMonth() + 1
    return `${m} ${h} ${day} ${month} *`
}

export default function BuildSchedular({ handleSave, workflowCron, draft, setDraft }: Props) {
    const defaultBuilder: BuilderState = {
        freq: "daily",
        time: "09:00",
        dayOfWeek: 1,
        dayOfMonth: 1,
        date: undefined,
    }

    const [builder, setBuilder] = useState<BuilderState>(defaultBuilder)
    const [mode, setMode] = useState<"frequency" | "date">("frequency")

    useEffect(() => {
        if (!draft) {
            const init = buildCronFromBuilder(builder)
            setDraft(init)
        }
    }, [])

    useEffect(() => {
        if (mode === "frequency") {
            setDraft(buildCronFromBuilder(builder))
        } else {
            if (builder.date) {
                setDraft(buildCronForOneTime(builder.date, builder.time))
            } else {
                setDraft("")
            }
        }
    }, [builder, mode])

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

    const onChangeFreq = (freq: BuilderState["freq"]) => {
        setBuilder((b) => ({ ...b, freq }))
    }

    const onChangeTime = (time: string) => {
        setBuilder((b) => ({ ...b, time }))
        if (mode === "date" && builder.date) {
            setDraft(buildCronForOneTime(builder.date, time))
        }
    }

    const onChangeDayOfWeek = (d: number) => {
        setBuilder((b) => ({ ...b, dayOfWeek: d }))
    }

    const onChangeDayOfMonth = (d: number) => {
        setBuilder((b) => ({ ...b, dayOfMonth: d }))
    }

    const onPickDate = (date: Date | undefined | null) => {
        setBuilder((b) => ({ ...b, date: date ?? undefined }))
        if (date) {
            setDraft(buildCronForOneTime(date, builder.time))
        } else {
            setDraft("")
        }
    }

    const oneTimeSummary = useMemo(() => {
        if (!builder.date) return ""
        const date = builder.date
        const time = builder.time ?? "09:00"
        return `${date.toDateString()} at ${time}`
    }, [builder.date, builder.time])

    return (
        <section className="rounded-lg border bg-muted/40 p-3 space-y-4">
            <h3 className="text-xs font-medium text-muted-foreground">Build a schedule</h3>

            <Tabs value={mode} onValueChange={(v) => {
                setMode(v as any)
            }} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger className='cursor-pointer' value="frequency">By Frequency</TabsTrigger>
                    <TabsTrigger className='cursor-pointer' value="date">Pick a Date</TabsTrigger>
                </TabsList>

                <TabsContent value="frequency" className="space-y-4 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Frequency</Label>
                            <Select value={builder.freq} onValueChange={(v) => onChangeFreq(v as any)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hourly">Hourly</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {builder.freq !== "hourly" && (
                            <div className="space-y-1">
                                <Label htmlFor="time" className="text-xs text-muted-foreground">Time</Label>
                                <Input id="time" type="time" value={builder.time} onChange={(e) => onChangeTime(e.target.value)} className="w-32" />
                            </div>
                        )}

                        {builder.freq === "weekly" && (
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Day of week</Label>
                                <Select value={String(builder.dayOfWeek)} onValueChange={(v) => onChangeDayOfWeek(Number(v))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Sunday</SelectItem>
                                        <SelectItem value="1">Monday</SelectItem>
                                        <SelectItem value="2">Tuesday</SelectItem>
                                        <SelectItem value="3">Wednesday</SelectItem>
                                        <SelectItem value="4">Thursday</SelectItem>
                                        <SelectItem value="5">Friday</SelectItem>
                                        <SelectItem value="6">Saturday</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {builder.freq === "monthly" && (
                            <div className="space-y-1">
                                <Label htmlFor="dom" className="text-xs text-muted-foreground">Day of month</Label>
                                <Input
                                    id="dom"
                                    type="number"
                                    min={1}
                                    max={31}
                                    value={builder.dayOfMonth}
                                    onChange={(e) => onChangeDayOfMonth(Math.min(31, Math.max(1, Number(e.target.value) || 1)))}
                                    className="w-24"
                                />
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="date" className="space-y-4 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Pick a date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="justify-start w-full">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {builder.date ? builder.date.toDateString() : "Select a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-auto" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={builder.date as Date | undefined}
                                        onSelect={(date) => onPickDate(date ?? undefined)}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="date-time" className="text-xs text-muted-foreground">Time</Label>
                            <Input id="date-time" type="time" value={builder.time} onChange={(e) => onChangeTime(e.target.value)} className="w-32" />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex flex-col gap-2 md:flex-row md:items-center mt-4">
                <div className="text-xs flex-1">
                    {draft && isValid ? (
                        <span className="text-green-600 dark:text-green-500 font-semibold">{mode === "frequency" ? (builder.freq).toLocaleUpperCase() : ""} {draftReadable}</span>
                    ) : draft ? (
                        <span className="text-red-600 dark:text-red-500">Invalid cron expression</span>
                    ) : (
                        <span className="text-muted-foreground">No schedule configured yet</span>
                    )}
                </div>

                <Button size="sm" onClick={() => handleSave(draft, isValid)} disabled={!isValid || draft === (workflowCron ?? "")}>
                    Save
                </Button>
            </div>
        </section>
    )
}
