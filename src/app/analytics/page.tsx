import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import AnalyticsClient from './analytics-client';

export default function AnalyticsPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <AnalyticsClient />
      </SidebarInset>
    </SidebarProvider>
  );
}
