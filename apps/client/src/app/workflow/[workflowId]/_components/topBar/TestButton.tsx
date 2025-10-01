'use cliennt'
import { Button } from '@/components/ui/button'
import useExecutionPlan from '@/hooks/useExecutionPlan'
import { useRunWorkflow } from '@/hooks/workflows/mutation'
import { useReactFlow } from '@xyflow/react'
import { Loader2, PlayIcon, TestTube } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    workflowId: string
}

export default function TestButton({ workflowId }: Props) {
    const generate = useExecutionPlan()
    const { toObject } = useReactFlow();
    const { mutateAsync, isPending } = useRunWorkflow();
    const router = useRouter();

    return (
        <Button variant={"outline"} className='cursor-pointer flex items-center gap-2'
            onClick={async () => {
                // const plan = generate();
                // if (!plan) return;

                // const data = await mutateAsync({
                //     workflowId,
                //     executionPlan: JSON.stringify(plan),
                //     flowDefinition: JSON.stringify(toObject()),
                // })
                // if (!data) return;
                // router.push(`/workflow/${workflowId}/runs/${data.id}`)
                "TODO"
            }}
        >
            {isPending ? <div>
                <Loader2 className='animate-spin stroke-orange-400' />
            </div> : <>
                <TestTube size={16} className='stroke-orange-400' />
                Test(todo)
            </>
            }

        </Button>
    )
}