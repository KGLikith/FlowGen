import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WorkflowStatus } from "@/gql/graphql";
import { TaskParamProps } from "@/schema/task";
import React, { useEffect, useId, useState } from "react";

export default function StringParam({
   param,
   value,
   updateNodeParamValue,
   disabled,
   status
}: TaskParamProps) {
   const [stringValue, setStringValue] = useState(value);
   const id = useId();

   useEffect(() => {
      setStringValue(value);
   }, [value]);

   let Component: any = Input;
   if (param.variant === "textarea") {
      Component = Textarea;
   }

   return (
      <div className="space-y-1 p-1 w-full">
         <Label htmlFor={id} className="text-sm font-medium">
            {param.name}
            {param.required && <span className="text-red-500">*</span>}
         </Label>
         <Component
            id={id}
            disabled={disabled|| status === WorkflowStatus.Active}
            placeholder="Enter value here"
            value={stringValue}
            onChange={(e: any) => {
               setStringValue(e.target.value);
            }}
            onBlur={(e: any) => {
               updateNodeParamValue(e.target.value);
            }}
            className="text-xs font-medium bg-white"
         />
         {param.helperText && (
            <p className="text-xs text-muted-foreground px-2">{param.helperText}</p>
         )}
      </div>
   );
}
