"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { useDeleteWorkflow } from "@/hooks/workflows/mutation"

type Props = {
    workflowId: string
    workflowName: string
    triggerText?: string
}

export default function DeleteWorkflowDialog({ workflowId, workflowName, triggerText = "Delete" }: Props) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { mutateAsync } = useDeleteWorkflow();


    const handleDelete = async () => {
        setIsLoading(true)
        try {
            await mutateAsync({ id: workflowId });
            setOpen(false)
            setIsLoading(false)
        } catch (error) {
            console.error("Failed to delete workflow:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive w-full hover:text-destructive hover:bg-destructive/10 cursor-pointer">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {triggerText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Delete Workflow</DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-1">
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <span className="font-semibold text-foreground">"{workflowName}"</span>?
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        This will permanently remove the workflow and all its associated data. Any scheduled runs will be cancelled.
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <Button className="cursor-pointer" type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button className="cursor-pointer" type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Workflow
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
