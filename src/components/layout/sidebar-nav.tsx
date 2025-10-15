'use client';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import {
  Home,
  BarChart3,
  Settings,
  UserCircle,
  LogOut,
  MonitorPlay,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';

export function SidebarNav() {
  const { toast } = useToast();
  const pathname = usePathname();

  const handleActionClick = (action: string) => {
    toast({
      title: 'Action',
      description: `${action}.`,
    });
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Icons.logo className="size-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tighter">
              CrowdSafe AI
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="/dashboard"
              isActive={pathname === '/dashboard'}
            >
              <Home />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/cctv" isActive={pathname === '/cctv'}>
              <MonitorPlay />
              CCTV Footage
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/analytics" isActive={pathname === '/analytics'}>
              <BarChart3 />
              Analytics
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/settings" isActive={pathname === '/settings'}>
              <Settings />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Separator className="mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="/profile" isActive={pathname === '/profile'}>
              <UserCircle />
              Profile
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" onClick={() => handleActionClick('Logout')}>
              <LogOut />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
