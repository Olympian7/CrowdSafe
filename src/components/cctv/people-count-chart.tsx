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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const chartConfig = {
  count: {
    label: 'People',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type PeopleCountChartProps = {
  data: { time: number; count: number }[];
};

export function PeopleCountChart({ data }: PeopleCountChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>People Count History</CardTitle>
        <CardDescription>
          Live tracking of the number of people detected in the video feed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => `${Math.round(value)}s`}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, (dataMax: number) => Math.max(dataMax + 10, 50)]}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.8}
                />
                <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.1}
                />
                </linearGradient>
            </defs>
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#fillCount)"
              stroke="var(--color-count)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
