'use cliennt'
import { Button } from '@/components/ui/button'
import useExecutionPlan from '@/hooks/useExecutionPlan'
import { usePublishWorkflow } from '@/hooks/workflows/mutation'
import { useReactFlow } from '@xyflow/react'
import { Loader2, UploadIcon } from 'lucide-react'
import React from 'react'

type Props = {
    workflowId: string
}

export default function PublishButton({ workflowId }: Props) {
    const generate = useExecutionPlan()
    const { toObject } = useReactFlow();
    const { mutateAsync, isPending } = usePublishWorkflow(workflowId);
    return (
        <Button variant={"outline"} className='cursor-pointer flex items-center gap-2'
            onClick={async () => {
                const plan = generate();
                if (!plan) return;
                const data = await mutateAsync({
                    workflowId,
                    executionPlan: JSON.stringify(plan),
                    flowDefinition: JSON.stringify(toObject()),
                })
                if (!data) return;
            }}
        >
            {isPending ? <div>
                <Loader2 className='animate-spin stroke-orange-400' />
            </div> : <>
                <UploadIcon size={16} className=' stroke-orange-400' />
                Publish
            </>
            }
        </Button>
    )
}