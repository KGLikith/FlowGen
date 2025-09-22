import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaskParam, TaskParamProps } from "@/schema/task";
import React, { useId, useState } from "react";

export default function StringParam({
   param,
   value,
   updateNodeParamValue,
}: TaskParamProps) {
   const [stringValue, setStringValue] = useState(value);
   const id = useId();
   return (
      <div className="space-y-1 p-1 w-full">
         <Label htmlFor={id} className="text-sm font-medium">
            {param.name}
            {param.required && <span className="text-red-500">*</span>}
         </Label>
         <Input
            id={id}
            placeholder="Enter value here"
            value={stringValue}
            onChange={(e) => {
               setStringValue(e.target.value);
            }}
            onBlur={(e) => {
               updateNodeParamValue(e.target.value);
            }}
            className="text-xs font-medium"
         />
         {param.helperText && (
            <p className="text-xs text-muted-foreground px-2">{param.helperText}</p>
         )}
      </div>
   );
}
