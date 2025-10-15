'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const chartData = [
  { time: '10:00', density: 35 },
  { time: '10:05', density: 38 },
  { time: '10:10', density: 42 },
  { time: '10:15', density: 40 },
  { time: '10:20', density: 45 },
  { time: '10:25', density: 55 },
  { time: '10:30', density: 58 },
  { time: '10:35', density: 62 },
  { time: '10:40', density: 60 },
  { time: '10:45', density: 55 },
];

const chartConfig = {
  density: {
    label: 'Density (%)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function DensityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Density</CardTitle>
        <CardDescription>
          Crowd density over the last 45 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} dy={10} />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={value => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="density"
              type="monotone"
              stroke="var(--color-density)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
