'use client';

import { useMemo } from 'react';
import {
  UnifiedWaffleChart,
  createSquaresFromWeightedItems,
  type WaffleSquare,
} from './UnifiedWaffleChart';

interface Task {
  task: string;
  metrics: {
    onet_task_count: number;
    onet_task_pct: number;
  };
  collaboration_mode?: string; // Assigned collaboration mode
}

interface TaskWaffleChartProps {
  tasks: Task[];
  size?: number;
}

/**
 * Assign collaboration modes to tasks based on hash
 * This ensures consistent mode assignment for the same task
 */
function getCollaborationMode(task: Task): string {
  if (task.collaboration_mode) return task.collaboration_mode;

  const hash = task.task.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const modes = ['directive', 'feedback_loop', 'task_iteration', 'validation', 'learning'];
  return modes[hash % modes.length];
}

/**
 * Get color for a collaboration mode
 */
function getSquareColor(mode: string): string {
  switch (mode) {
    case 'directive':
    case 'feedback_loop':
      return '#5A9770'; // Sage green for automation
    case 'task_iteration':
    case 'validation':
    case 'learning':
      return '#B8A3D6'; // Lavender for augmentation
    default:
      return '#E8E4DC'; // Beige for no data
  }
}

/**
 * Get human-readable name for a collaboration mode
 */
function getModeName(mode: string): string {
  const names: Record<string, string> = {
    directive: 'Directive',
    feedback_loop: 'Feedback Loop',
    task_iteration: 'Task Iteration',
    validation: 'Validation',
    learning: 'Learning',
  };
  return names[mode] || mode;
}

/**
 * TaskWaffleChart - Task-level O*NET distribution visualization
 *
 * Displays individual tasks as a waffle chart, with each square representing
 * a portion of task usage. Colors indicate collaboration modes (automation vs augmentation).
 * This is a lightweight wrapper around UnifiedWaffleChart.
 *
 * @example
 * <TaskWaffleChart
 *   tasks={[
 *     { task: 'analyzing data', metrics: { onet_task_count: 100, onet_task_pct: 45.2 } },
 *     { task: 'writing code', metrics: { onet_task_count: 80, onet_task_pct: 35.8 } }
 *   ]}
 *   size={12}
 * />
 */
export function TaskWaffleChart({ tasks, size = 12 }: TaskWaffleChartProps) {
  const totalSquares = size * size;

  // Calculate total usage for percentage calculations
  const totalUsage = useMemo(
    () => tasks.reduce((sum, t) => sum + (t.metrics.onet_task_pct || 0), 0),
    [tasks]
  );

  // Create squares from weighted task data
  const squares = useMemo(
    () =>
      createSquaresFromWeightedItems(
        tasks,
        (task) => task.metrics.onet_task_pct,
        (task) => getSquareColor(getCollaborationMode(task)),
        totalSquares
      ),
    [tasks, totalSquares]
  );

  // Generate accessible description
  const accessibleDescription = useMemo(() => {
    const automationTasks = tasks.filter((t) => {
      const mode = getCollaborationMode(t);
      return mode === 'directive' || mode === 'feedback_loop';
    });
    const augmentationTasks = tasks.filter((t) => {
      const mode = getCollaborationMode(t);
      return mode === 'task_iteration' || mode === 'validation' || mode === 'learning';
    });

    const automationPct = (
      (automationTasks.reduce((sum, t) => sum + t.metrics.onet_task_pct, 0) / totalUsage) *
      100
    ).toFixed(0);
    const augmentationPct = (
      (augmentationTasks.reduce((sum, t) => sum + t.metrics.onet_task_pct, 0) / totalUsage) *
      100
    ).toFixed(0);

    return `Task distribution chart: ${automationPct}% automated tasks, ${augmentationPct}% augmented tasks`;
  }, [tasks, totalUsage]);

  // Render tooltip for individual task
  const renderTooltip = (square: WaffleSquare<Task>) => {
    if (!square.data) return null;

    const task = square.data;
    const mode = getCollaborationMode(task);

    return (
      <div className="space-y-1.5">
        <div className="text-gray-100 leading-tight">
          {task.task.charAt(0).toUpperCase() + task.task.slice(1)}
        </div>
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: getSquareColor(mode) }}
            />
            <span className="text-gray-300 text-[11px]">{getModeName(mode)}</span>
          </div>
          <span className="font-medium text-[11px]">
            {((task.metrics.onet_task_pct / totalUsage) * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <UnifiedWaffleChart
      squares={squares}
      size={size}
      accessibleDescription={accessibleDescription}
      renderTooltip={renderTooltip}
      tooltipMode="fixed"
    />
  );
}
