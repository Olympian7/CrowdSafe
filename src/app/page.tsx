import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import DashboardClient from './dashboard-client';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
