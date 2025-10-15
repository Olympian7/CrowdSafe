'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { DensityChart } from '@/components/dashboard/density-chart';
import { ObjectTracking } from '@/components/dashboard/object-tracking';
import {
  summarizeCrowdBehavior,
  SummarizeCrowdBehaviorOutput,
} from '@/ai/flows/summarize-crowd-behavior';
import { Users, AlertTriangle, Shield } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export type AlertStatus = 'Normal' | 'Caution' | 'Warning' | 'Critical';

const objectTrackingData = JSON.stringify([
    { id: 1, timestamps: [{ t: 0, x: 10, y: 20 }, { t: 5, x: 12, y: 22 }] },
    { id: 2, timestamps: [{ t: 0, x: 50, y: 80 }, { t: 5, x: 55, y: 81 }] },
    { id: 3, timestamps: [{ t: 0, x: 100, y: 120 }, { t: 5, x: 100, y: 125 }] },
]);

const avatarImage = PlaceHolderImages.find(img => img.id === 'user-avatar-1');

export default function DashboardClient() {
  const [behaviorSummary, setBehaviorSummary] =
    useState<SummarizeCrowdBehaviorOutput>({
      summary: 'Analyzing crowd behavior...',
      riskAreas: [],
      commonMovementFlows: [],
    });

  useEffect(() => {
    async function getSummary() {
      const res = await summarizeCrowdBehavior({ objectTrackingData });
      setBehaviorSummary(res);
    }
    getSummary();
  }, []);

  return (
    <>
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    CrowdSafe Dashboard
                </h1>
                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {avatarImage && (
                <Image
                    src={avatarImage.imageUrl}
                    alt={avatarImage.description}
                    width={40}
                    height={40}
                    data-ai-hint={avatarImage.imageHint}
                    className="rounded-full"
                />
                )}
            </div>
        </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Current Density"
          value={`45%`}
          icon={<Users className="text-accent-foreground" />}
        />
        <StatCard
          title="Crowd Status"
          value='Caution'
          icon={<Shield className="text-accent-foreground" />}
          status='Caution'
        />
        <StatCard
          title="Risk Areas"
          value={behaviorSummary.riskAreas.length}
          icon={<AlertTriangle className="text-accent-foreground" />}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DensityChart />
        </div>
        <div className="lg:col-span-2">
          <ObjectTracking
            summary={behaviorSummary.summary}
          />
        </div>
      </div>
    </div>
    </>
  );
}
