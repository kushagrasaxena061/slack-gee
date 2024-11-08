import React from 'react'
import { UserButton } from '@/features/auth/components/user-button'
import { WorkspaceSwitcher } from './workspace-switcher'
import { SidebarButton } from './sidebar-button'
import { Bell, Home, MessageSquare, MoreHorizontal } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { usePathname } from 'next/navigation'

export const Sidebar = () => {
    const pathname = usePathname()
    return (
        <aside className=' bg-neutral-900 flex flex-col gap-y-4  pt-[9px] pb-4'>
            <WorkspaceSwitcher />
            <Separator />
            <SidebarButton icon={Home} label='Home' isActive={pathname.includes("/workspace")} />
            <SidebarButton icon={MessageSquare} label="DM's" />
            <SidebarButton icon={Bell} label='Activity' />
            <SidebarButton icon={MoreHorizontal} label='More' />

            <div className=' gap-y-1 mt-auto'>
                <UserButton />
            </div>
        </aside>
    )
}
