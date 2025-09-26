import { FlowValidionContext } from "@/components/context/flowValidationContxt";
import { useContext } from "react";

export default function useFlowValidation() {
    const context = useContext(FlowValidionContext);
    if (!context) {
        throw new Error("useFlowValidation must be used within a FlowValidationContextProvider");
    }

    return context;     
}