import React from 'react'


export default function WorkflowSkeleton() {
  return (
    <div className='space-y-3'>
        {
            [1,2,3,4,5].map((item) => (
                <div key={item} className="animate-pulse flex space-x-4">
                    <div className="rounded-md bg-muted h-10 w-10"></div>
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-muted rounded"></div>
                            <div className="h-4 bg-muted rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            ))
            
        }
    </div>
  )
}