import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TaskParamProps } from '@/schema/task'
import React from 'react'


export default function SelectorParam({ param, updateNodeParamValue, value, disabled }: TaskParamProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <Label htmlFor={param.name} className="text-sm font-medium ">
                {param.name}
                {param.required && <span className="text-red-500">*</span>}
            </Label>
            <Select disabled={disabled} onValueChange={(val) => { updateNodeParamValue(val) }} value={value} defaultValue={value}>
                <SelectTrigger className='w-full'>
                    <SelectValue className='cursor-pointer' placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className='bg-background '>
                        <SelectLabel className=''>Options</SelectLabel>
                        {param.options && param.options.map((op) => {
                            const option = JSON.parse(op)
                            return <SelectItem className='cursor-pointer' key={option.value} value={option.value}>{option.label}</SelectItem>
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}