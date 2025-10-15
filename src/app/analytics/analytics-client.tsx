'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { StatCard } from '@/components/dashboard/stat-card';
import { Video, BarChart2, ShieldAlert, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const analysisData = [
  {
    id: 'vid001',
    videoName: 'Market_Square_Noon.mp4',
    date: '2023-10-27',
    peakDensity: 78,
    averageDensity: 45,
    alertsTriggered: 3,
    status: 'Reviewed',
    analysisSummary:
      'High density detected during peak hours. Minor congestion but no major incidents.',
  },
  {
    id: 'vid002',
    videoName: 'Concert_Entrance_Night.mp4',
    date: '2023-10-26',
    peakDensity: 92,
    averageDensity: 75,
    alertsTriggered: 8,
    status: 'Critical',
    analysisSummary:
      'Critical density levels reached. Multiple crowd surge alerts. Recommend further review.',
  },
  {
    id: 'vid003',
    videoName: 'Plaza_Evening.mp4',
    date: '2023-10-26',
    peakDensity: 45,
    averageDensity: 30,
    alertsTriggered: 0,
    status: 'Normal',
    analysisSummary: 'Crowd density remained within normal limits. No alerts.',
  },
    {
    id: 'vid004',
    videoName: 'Festival_Main_Stage.mp4',
    date: '2023-10-25',
    peakDensity: 85,
    averageDensity: 65,
    alertsTriggered: 5,
    status: 'Warning',
    analysisSummary: 'Density exceeded warning thresholds multiple times. Crowd flow was partially obstructed.',
  },
];

const chartConfig = {
  alerts: {
    label: 'Alerts Triggered',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  Reviewed: 'default',
  Critical: 'destructive',
  Normal: 'secondary',
    Warning: 'default'
};


export default function AnalyticsClient() {
  const totalVideos = analysisData.length;
  const avgPeakDensity = Math.round(analysisData.reduce((acc, item) => acc + item.peakDensity, 0) / totalVideos);
  const totalAlerts = analysisData.reduce((acc, item) => acc + item.alertsTriggered, 0);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <h1 className="text-2xl font-bold tracking-tight">Footage Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Videos Analyzed"
          value={totalVideos}
          icon={<Video />}
        />
        <StatCard
          title="Avg. Peak Density"
          value={`${avgPeakDensity}%`}
          icon={<Users />}
        />
        <StatCard
          title="Total Alerts"
          value={totalAlerts}
          icon={<ShieldAlert />}
        />
        <StatCard
          title="Highest Risk Video"
          value="Concert_Entrance..."
          icon={<BarChart2 />}
          status="Critical"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alerts per Video</CardTitle>
            <CardDescription>
              Number of alerts triggered during each video analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={analysisData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="videoName" tickFormatter={(value) => value.split('_')[0]} />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="alertsTriggered" fill="var(--color-alerts)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Analysis Details</CardTitle>
                <CardDescription>
                    Detailed breakdown of each video analysis.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Video Name</TableHead>
                    <TableHead>Peak Density</TableHead>
                    <TableHead>Alerts</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {analysisData.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.videoName}</TableCell>
                        <TableCell>{item.peakDensity}%</TableCell>
                        <TableCell>{item.alertsTriggered}</TableCell>
                        <TableCell>
                            <Badge variant={statusColors[item.status] || 'default'}>{item.status}</Badge>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
