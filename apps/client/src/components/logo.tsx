import React from 'react'


export default function Logo() {
    return (
        <>
            <div className="flex items-center gap-3 h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="h-9 w-9 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
                    <span className="text-white dark:text-neutral-900 font-bold text-lg">F</span>
                </div>
                <span className="font-semibold text-lg text-neutral-900 dark:text-white">FlowGen</span>
            </div>
        </>
    )
}