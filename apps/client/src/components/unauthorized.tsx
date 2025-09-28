'use client'
import { User } from 'lucide-react'
import React from 'react'
import { SignInButton } from '@clerk/nextjs'

export default function Unauthorized() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center max-w-md text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-orange-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">Authentication Required</h3>
                    <p className="text-muted-foreground ">
                        Please log in to view this workflow. You need to be authenticated to access workflow details.
                    </p>
                    <SignInButton />
                </div>
            </div>
        </div>
    )
}