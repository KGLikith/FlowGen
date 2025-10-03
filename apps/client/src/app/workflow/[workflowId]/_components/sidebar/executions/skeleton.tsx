import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

export default function SkeletonComp({ }: Props) {
    return (
        <div className="flex h-full w-full flex-col">
            <header className="flex items-center justify-between border-b px-3 py-2">
                <Skeleton className="h-4 w-40" /> {/* title */}
                <Skeleton className="h-6 w-6 rounded-md" /> {/* close button */}
            </header>

            <div className="flex items-center gap-2 border-b px-3 py-2">
                <Skeleton className="h-6 w-6 rounded-md" /> {/* filter icon */}
                <Skeleton className="h-8 w-[140px] rounded-md" /> {/* status select */}
                <Skeleton className="h-8 w-[150px] rounded-md" /> {/* range select */}
            </div>

            <div className="flex flex-col gap-2 p-2 sm:p-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between rounded-md border bg-card px-3 py-2"
                    >
                        <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-3 w-3 rounded-full" /> {/* status dot */}
                                <Skeleton className="h-4 w-20" /> {/* status text */}
                                <Skeleton className="h-4 w-16" /> {/* trigger */}
                                <Skeleton className="h-4 w-10" /> {/* credits */}
                            </div>
                            <Skeleton className="h-3 w-32" /> {/* completedAt */}
                        </div>
                        <Skeleton className="h-4 w-4 ml-2" /> {/* ChevronRight */}
                    </div>
                ))}
            </div>
        </div>
    )
}