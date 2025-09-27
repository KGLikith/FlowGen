import { AppNodeMissingInputs } from "@/schema/appNode";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type flowValidationContextType = {
    invalidInputs: AppNodeMissingInputs[];
    setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
    clearErrors: () => void
    invalidNodes: AppNodeMissingInputs[];
    setInvalidNodes: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
}

export const FlowValidationContext = createContext<flowValidationContextType | null>(null)

export function FlowValidationContextProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>([])
    const [invalidNodes, setInvalidNodes] = useState<AppNodeMissingInputs[]>([])

    const clearErrors = () => {
        setInvalidInputs([])
        setInvalidNodes([])
    }

    return (
        <FlowValidationContext.Provider value={{ invalidInputs, setInvalidInputs, clearErrors, invalidNodes, setInvalidNodes }}>
            {children}
        </FlowValidationContext.Provider>
    )
}
