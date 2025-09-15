import { DashboardLayout } from '@/components/dashboard-layout'
import React from 'react'

type Props = {
    children?: React.ReactNode
}

export default function layout({ children }: Props) {
    return (
        <DashboardLayout credits={{ current: 649, total: 1000 }}>
            {children}
        </DashboardLayout>
    )
}