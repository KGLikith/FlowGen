import { AppNodeMissingInputs } from "@/schema/appNode";
import App from "next/app";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type flowValidationContextType = {
    invalidInputs: AppNodeMissingInputs[];
    setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
    clearErrors: () => void
}

export const FlowValidionContext = createContext<flowValidationContextType | null>(null)

export function FlowValidationContextProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>([])

    const clearErrors = () => {
        setInvalidInputs([])
    }

    return (
        <FlowValidionContext.Provider value={{ invalidInputs, setInvalidInputs, clearErrors }}>
            {children}
        </FlowValidionContext.Provider>
    )
}
