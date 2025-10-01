'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface UsageIndexChartProps {
  data: Array<{
    geo_id: string;
    name?: string;
    index: number;
  }>;
  title?: string;
  description?: string;
}

const chartConfig = {
  index: {
    label: 'Usage Index',
    color: 'hsl(173, 58%, 39%)',
  },
} satisfies ChartConfig;

export function UsageIndexChart({
  data,
  title = 'Usage Index by Geography',
  description = 'Anthropic AI Usage Index (AUI)',
}: UsageIndexChartProps) {
  // Sort by index descending and take top 15
  const chartData = [...data]
    .sort((a, b) => b.index - a.index)
    .slice(0, 15)
    .reverse(); // Reverse for horizontal bar chart

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <p className="text-xs text-muted-foreground mt-2">
          Index &gt; 1.0 means higher usage than expected based on population
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 40, right: 60 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="geo_id"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
            />
            <XAxis
              type="number"
              domain={[0, 'auto']}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="index" fill="var(--color-index)" radius={4}>
              <LabelList
                dataKey="index"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `${value.toFixed(2)}x`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
