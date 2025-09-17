'use client'
import { Button } from "@/components/ui/button"
import { useGetCurrentUser } from "@/hooks/user"
import { useUser } from "@clerk/nextjs";

export default function HomePage() {

  const {user, isLoading} = useGetCurrentUser();
  const clerkUser = useUser();
  
  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {clerkUser.user?.firstName} {clerkUser.user?.lastName}!</h1>
          <p className="text-muted-foreground">Ready to create your next automation?</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Home</h2>
            <Button className="bg-primary hover:bg-primary/90">Create an Automation</Button>
          </div>
        </div>
      </div>
  )
}
