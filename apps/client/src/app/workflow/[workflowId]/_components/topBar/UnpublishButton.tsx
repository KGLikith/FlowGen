'use cliennt'
import { Button } from '@/components/ui/button'
import { useUnpublishWorkflow } from '@/hooks/workflows/mutation'
import { Download, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    workflowId: string
}

export default function UnpublishButton({ workflowId }: Props) {
    const { mutateAsync, isPending } = useUnpublishWorkflow(workflowId);
    const router = useRouter();

    return (
        <Button variant={"outline"} className='cursor-pointer flex items-center gap-2'
            onClick={async () => {
                await mutateAsync(workflowId)
            }}
        >
            {isPending ? <div>
                <Loader2 className='animate-spin stroke-orange-400' />
            </div> : <>
                <Download size={16} className='stroke-orange-400' />
                Unpublish
            </>
            }

        </Button>
    )
}