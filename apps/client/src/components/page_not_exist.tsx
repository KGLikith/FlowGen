import { FileX } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PageNotExist() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-md text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <FileX className="h-8 w-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Page Not Found</h3>
          <p className="text-muted-foreground">The page you're looking for doesn't exist or may have been moved.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
