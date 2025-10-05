
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Workflow } from "@/gql/graphql"
import { Info, Loader2, PlayIcon, Trash2, Zap } from "lucide-react"
import { useState } from "react"

export default function RunDialog({
  workflow,
  onRun,
  loadingGlobal,
}: {
  workflow: Workflow
  onRun: () => Promise<void>
  loadingGlobal?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isLoading = loading || loadingGlobal

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="bg-transparent hover:bg-muted/60 gap-1">
            <PlayIcon size={16} className="text-muted-foreground" />
            <span className="text-foreground">Execute</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">Execute Workflow</DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to run <span className="font-semibold text-foreground">{workflow.name}</span>?
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button className="cursor-pointer bg-background/80" type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button className="cursor-pointer bg-blue-500 hover:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600  text-white" type="button" variant="outline" onClick={onRun} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  Run Workflow
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>

  )
}
