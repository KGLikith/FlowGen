import { Button } from '@/components/ui/button';
import { useUpdateWorkflow } from '@/hooks/workflows';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon, Loader } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

type Props = {
    workflowId: string
}

export default function SaveButton({ workflowId }: Props) {
    const { toObject } = useReactFlow();

    const { mutateAsync, isPending } = useUpdateWorkflow();

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