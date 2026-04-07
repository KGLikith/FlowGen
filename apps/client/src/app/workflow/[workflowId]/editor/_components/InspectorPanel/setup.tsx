"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ChevronDown } from "lucide-react"
import { type TaskInfo, TpConnections, type TaskEvent } from "@/gql/graphql"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { ConnectionIcon, connectionLabel } from "./connection-icons"
import { setUpEventType } from "../conifgPanel"

type Props = {
   taskInfo: TaskInfo
   inputs: setUpEventType
   setInputs: (inputs: setUpEventType) => void
   disabled: boolean
   selectedEventId?: string
   onSelectEvent?: (eventId: string) => void
   onClickSignIn?: (provider: TpConnections) => void
   accountConnectedName?: string | null
}

export default function Setup({
   taskInfo,
   inputs,
   setInputs,
   disabled,
   selectedEventId,
   onSelectEvent,
   onClickSignIn,
   accountConnectedName,
}: Props) {
   const [open, setOpen] = useState(false)

   const events = taskInfo.events ?? []
   const selected = useMemo(
      () => events.find((e) => (inputs.event || selectedEventId) === e.id),
      [events, selectedEventId,inputs.event],
   )

   const choose = (e: TaskEvent) => {
      setInputs({ ...inputs, event: e.id })
      setOpen(false)
   }

   const requiresConnection = taskInfo.requiredConnection && taskInfo.requiredConnection !== TpConnections.None

   return (
      <div className="flex flex-col gap-3">
         <div>
            <p className="text-sm font-medium text-foreground">What you need</p>
            <Separator className="my-2" />
            <ul className="text-xs text-muted-foreground list-disc ml-4 space-y-1">
               <li>Connect any required credentials.</li>
               <li>Review default inputs and required fields.</li>
               <li>Use “Configure” to map values from previous steps.</li>
            </ul>
         </div>

         {events.length > 0 && (
            <div className="flex flex-col gap-1">
               <Label className="text-xs font-medium">Trigger/Action event</Label>
               <Popover open={open} onOpenChange={setOpen} >
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        disabled={disabled}
                        className={cn("w-full h-8 justify-between text-xs", !selected && "text-muted-foreground")}
                     >
                        {selected ? selected.label : "Choose an event"}
                        <ChevronDown className="h-3 w-3 opacity-60" />
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[320px]" align="start">
                     <Command>
                        <CommandInput disabled={disabled} placeholder="Search events..." />
                        <CommandList>
                           <CommandEmpty>No events found.</CommandEmpty>
                           <CommandGroup>
                              {events.map((e) => (
                                 <CommandItem
                                    key={e.id}
                                    value={e.label}
                                    onSelect={() => choose(e)}
                                    disabled={disabled}
                                    className="flex flex-col items-start gap-0.5"
                                 >
                                    <span className="text-xs text-foreground">{e.label}</span>
                                    {e.description && <span className="text-[10px] text-muted-foreground">{e.description}</span>}
                                 </CommandItem>
                              ))}
                           </CommandGroup>
                        </CommandList>
                     </Command>
                  </PopoverContent>
               </Popover>
            </div>
         )}

         {requiresConnection && (
            <div className="flex flex-col gap-1">
               <Label className="text-xs font-medium">
                  Account <span className="text-destructive">*</span>
               </Label>
               <div className="flex items-center justify-between gap-2 border rounded-md h-9 px-2 bg-secondary">
                  <div className="flex items-center gap-2">
                     <ConnectionIcon provider={taskInfo.requiredConnection as any} />
                     <span className="text-xs text-muted-foreground">
                        {accountConnectedName
                           ? accountConnectedName
                           : `Connect ${connectionLabel(taskInfo.requiredConnection as any)}`}
                     </span>
                  </div>
                  {!accountConnectedName && (
                     <Button size="sm" className="h-7" onClick={() => onClickSignIn?.(taskInfo.requiredConnection)}>
                        Sign in
                     </Button>
                  )}
               </div>
            </div>
         )}
      </div>
   )
}
