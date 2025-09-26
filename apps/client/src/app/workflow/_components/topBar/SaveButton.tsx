import { Button } from '@/components/ui/button';
import { useUpdateWorkflow } from '@/hooks/workflows/mutation';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon, Loader } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import React from 'react'
import { toast } from 'sonner';

type Props = {
    workflowId: string
}

export default function SaveButton({ workflowId }: Props) {
    const { toObject } = useReactFlow();

    const { mutateAsync, isPending } = useUpdateWorkflow(workflowId);

    const handleSave = async (wfDef: string) => {
        toast.loading('Saving workflow...', {
            id: 'update_workflow'
        });
        await mutateAsync({
            id: workflowId,
            payload: {
                definition: wfDef,
            }
        });
        // revalidatePath(`/workflow/${workflowId}`);
    };

    return (
        <Button variant={'outline'} className='cursor-pointer flex items-center gap-2'
            onClick={() => {
                const wfDef = JSON.stringify(toObject());
                handleSave(wfDef);
            }}
        >
            {!isPending ? <>
                <CheckIcon size={20} className='text-muted-foreground stroke-green-400' />
                Save
            </> : <Loader className='animate-spin' />
            }
        </Button>
    )
}