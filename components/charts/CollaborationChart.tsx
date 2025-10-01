'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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

interface CollaborationChartProps {
  data: Array<{
    mode: string;
    count: number;
    pct: number;
  }>;
  title?: string;
  description?: string;
}

const chartConfig = {
  directive: {
    label: 'Directive',
    color: 'hsl(173, 58%, 39%)', // Teal
  },
  'feedback loop': {
    label: 'Feedback Loop',
    color: 'hsl(173, 40%, 50%)',
  },
  learning: {
    label: 'Learning',
    color: 'hsl(120, 30%, 60%)', // Sage
  },
  'task iteration': {
    label: 'Task Iteration',
    color: 'hsl(120, 35%, 50%)',
  },
  validation: {
    label: 'Validation',
    color: 'hsl(120, 40%, 40%)',
  },
} satisfies ChartConfig;

export function CollaborationChart({
  data,
  title = 'Collaboration Modes',
  description = 'Automation vs Augmentation patterns',
}: CollaborationChartProps) {
  // Transform data for stacked area chart
  const chartData = [
    {
      category: 'All',
      ...data.reduce((acc, item) => {
        if (item.mode !== 'none' && item.mode !== 'not_classified') {
          acc[item.mode] = item.pct;
        }
        return acc;
      }, {} as Record<string, number>),
    },
  ];

  // Calculate automation vs augmentation percentages
  const automationModes = ['directive', 'feedback loop'];
  const augmentationModes = ['learning', 'task iteration', 'validation'];

  const automation = data
    .filter((d) => automationModes.includes(d.mode))
    .reduce((sum, d) => sum + d.pct, 0);

  const augmentation = data
    .filter((d) => augmentationModes.includes(d.mode))
    .reduce((sum, d) => sum + d.pct, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="flex gap-4 text-sm mt-2">
          <div>
            <span className="font-medium">Automation:</span>{' '}
            <span className="text-teal-600">{automation.toFixed(1)}%</span>
          </div>
          <div>
            <span className="font-medium">Augmentation:</span>{' '}
            <span className="text-sage-600">{augmentation.toFixed(1)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data
            .filter((item) => item.mode !== 'none' && item.mode !== 'not_classified')
            .sort((a, b) => b.pct - a.pct)
            .map((item) => (
              <div key={item.mode} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: automationModes.includes(item.mode)
                        ? 'hsl(173, 58%, 39%)'
                        : 'hsl(120, 35%, 50%)',
                    }}
                  />
                  <span className="capitalize text-sm">{item.mode}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.pct}%`,
                        backgroundColor: automationModes.includes(item.mode)
                          ? 'hsl(173, 58%, 39%)'
                          : 'hsl(120, 35%, 50%)',
                      }}
                    />
                  </div>
                  <span className="font-mono text-sm font-medium w-12 text-right">
                    {item.pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
