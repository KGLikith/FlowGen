"use client"

import { createWorkflowSchema, type createWorkflowSchemaType } from "@/schema/workflow"
import { useCallback, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useCreateWorkflow } from "@/hooks/workflows"
import { useGetCurrentUser } from "@/hooks/user"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { User } from "@/gql/graphql"

type Props = {
  triggerText?: string
}

export default function CreateWorkflowDialog({ triggerText = "Create workflow" }: Props) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useGetCurrentUser()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter();

  const { mutateAsync } = useCreateWorkflow()

  useEffect(() => {
    if (user) setCurrentUser(user)
    else setCurrentUser(null)
  }, [user])

  const form = useForm<createWorkflowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = useCallback(async (data: createWorkflowSchemaType) => {
    setIsLoading(true)
    try {
      console.log(currentUser)
      if (!currentUser?.id) return;

      toast.loading("Creating workflow...", { id: "create_workflow" })

      const res = await mutateAsync({
        name: data.name,
        description: data.description,
        userId: currentUser.id,
        definition: "TODO"
      })

      if (!res?.createWorkflow) {
        toast.error("Failed to create workflow", { id: "create_workflow" })
        setIsLoading(false)
        // setOpen(false)
        form.reset()
        return;
      }
      setOpen(false)
      form.reset()
      router.push(`/workflow/editor/${res?.createWorkflow.id}`)

    } catch (error) {
      console.error("Failed to create workflow:", error)
    } finally {
      setIsLoading(false)
    }
  }, [mutateAsync, currentUser])

  return (
    <Dialog open={open} onOpenChange={() => {
      setOpen(!open)
      form.reset()
    }}>
      <DialogTrigger asChild>
        <Button
          className="bg-neutral-800 hover:bg-neutral-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-zinc-200 text-white cursor-pointer rounded-lg px-4 py-2 transition-colors"

        >
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Create New Workflow
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500 dark:text-neutral-400">
            Set up your automation workflow with a name and short description.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      Workflow Name
                    </FormLabel>
                    <span className="text-xs text-red-500 font-medium">(Required)</span>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Enter a unique workflow name"
                      className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                    Max 20 characters, make it <span className="font-bold text-white">Unique</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      Description
                    </FormLabel>
                    <span className="text-xs text-neutral-500 font-medium">Optional</span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe this workflow..."
                      className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none cursor-text"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                    Max 50 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Workflow"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
