import { FlowToExecutionPlan, FlowToExecutionPlanTypeErrorType } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/schema/appNode";
import { useReactFlow } from "@xyflow/react"
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";
import { useWorkflow } from "@/components/context/WorkflowProvider";
import { AvailableTrigger } from "@/gql/graphql";


const useExecutionPlan = () => {
    const { toObject } = useReactFlow();
    const { setInvalidInputs, clearErrors, setInvalidNodes } = useFlowValidation();
    const { trigger, actions } = useWorkflow();

    const handleError = useCallback((error: any) => {
        switch (error.type) {
            case FlowToExecutionPlanTypeErrorType.NO_ENTRY_POINT:
                toast.error("No entry point found. Please add a task that can start the workflow.")
                break;
            case FlowToExecutionPlanTypeErrorType.INVALID_INPUTS:
                toast.error("Not all inputs are connected. Please fix the errors.")
                setInvalidInputs(error.invalidElements || []);
                break;
            case FlowToExecutionPlanTypeErrorType.INVALID_NODES:
                toast.error("Some nodes are not compatible with the trigger. ",{
                    description: "Please remove or replace the invalid nodes."
                })
                setInvalidNodes(error.invalidNodes || []);
                break;
            default:
                toast.error("An unknown error occurred while generating the execution plan.")
                break;
        }
    }, [setInvalidInputs])

    const generateExecutionPlan = useCallback(() => {
        const { nodes, edges } = toObject();
        const { executionPlan, error } = FlowToExecutionPlan(nodes as AppNode[], edges, actions, trigger as AvailableTrigger);

        if (error) {
            handleError(error);
            return null
        }

        clearErrors();

        return executionPlan
    }, [toObject, handleError, actions, trigger])

    return generateExecutionPlan
}

export default useExecutionPlan