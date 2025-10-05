import { Credential } from '@/gql/graphql'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { useDeleteCredential } from '@/hooks/user'
import { toast } from 'sonner'

type Props = {
    cred: Credential
}

export default function DeleteCredDialog({ cred }: Props) {
    const { mutateAsync, isPending: isDeleting } = useDeleteCredential()

    async function handleDelete(id: string) {
        try {
            await mutateAsync(id)
        } catch (e) {
            // no-op: rely on hook error handling
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent">
                    <Trash2 className="text-red-500" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold">Delete Credential</DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-1">
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <span className="font-semibold text-foreground">{cred.name}</span>?
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        This will permanently remove the credential.
                    </p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={() => handleDelete(cred.id)} disabled={isDeleting}>
                            {
                                isDeleting ? <>
                                    <Loader2 width={5} height={5} className="animate-spin" /> Loading
                                </> : "Delete"
                            }
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}