'use cliennt'
import { Button } from '@/components/ui/button'
import useExecutionPlan from '@/hooks/useExecutionPlan'
import { useRunWorkflow } from '@/hooks/workflows/mutation'
import { useReactFlow } from '@xyflow/react'
import { PlayIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    workflowId: string
}

export default function ExecButton({ workflowId }: Props) {
    const generate = useExecutionPlan()
    const { toObject } = useReactFlow();
    const { mutateAsync} = useRunWorkflow();
    const router = useRouter();
    
    return (
        <Button variant={"outline"} className='cursor-pointer flex items-center gap-2'
            onClick={async () => {
                const plan = generate();
                if (!plan) return;

                const data =await mutateAsync({
                    workflowId,
                    name: "todo",
                    executionPlan: JSON.stringify(plan),
                    flowDefinition: JSON.stringify(toObject()),
                })
                if(!data) return;
                router.push(`/workflow/runs/${workflowId}/${data.id}`)
            }}
        >
            <PlayIcon size={16} className='stroke-orange-400' />
            Execute
        </Button>
    )
}