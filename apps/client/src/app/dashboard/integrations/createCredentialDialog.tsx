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
import { Loader2 } from "lucide-react"
import { useCreateCredential } from '@/hooks/user'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Credential } from '@/gql/graphql'
import { toast } from 'sonner'
type Props = {
    creds: Credential[]
}

export default function CreateCredDialog({ creds }: Props) {
    const { mutateAsync: CreateCredential, isPending: isCreating } = useCreateCredential()

    const [newName, setNewName] = React.useState("")
    const [newValue, setNewValue] = React.useState("")

    async function handleCreate() {
        if (!newName.trim() || !newValue.trim()) return
        if(creds.find(c => c.name === newName.trim())){
            toast.error("Credential with this name already exists. 1Please choose a different name.")
            return
        }
        try {
            await CreateCredential({ name: newName.trim(), value: newValue.trim() })
            setNewName("")
            setNewValue("")
        } catch (e) {
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent">
                    New
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add credential</DialogTitle>
                    <DialogDescription>
                        Only the credential name is shown in the UI. Values are stored securely.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="cred-name">Name</Label>
                        <Input
                            id="cred-name"
                            placeholder="e.g. OPENAI_API_KEY"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="cred-value">Value</Label>
                        <Input
                            id="cred-value"
                            type="password"
                            placeholder="••••••••••••••"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={handleCreate} disabled={!newName.trim() || !newValue.trim() || isCreating}>
                            {
                                isCreating ? <>
                                    <Loader2 width={5} height={5} className="animate-spin" /> Loading
                                </> : "Create"
                            }
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}