import { DashboardLayout } from '@/components/dashboard-layout'
import React from 'react'

type Props = {
    children?: React.ReactNode
}

export default async function layout({ children }: Props) {
    
    return (
        <DashboardLayout >
            {children}
        </DashboardLayout>
    )
}