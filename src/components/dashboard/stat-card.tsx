import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { AlertStatus } from '@/app/dashboard-client';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  status?: AlertStatus;
};

const statusColors: Record<AlertStatus, string> = {
  Normal: 'text-green-400',
  Caution: 'text-yellow-400',
  Warning: 'text-orange-400',
  Critical: 'text-red-500',
};

export function StatCard({ title, value, icon, status }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-md bg-accent p-2">{icon}</div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-2xl font-bold',
            status && statusColors[status]
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
