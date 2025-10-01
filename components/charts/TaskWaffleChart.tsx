'use client';

import { useState } from 'react';

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

export function TaskWaffleChart({ tasks, size = 12 }: TaskWaffleChartProps) {
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const totalSquares = size * size;

  // Calculate total usage
  const totalUsage = tasks.reduce((sum, t) => sum + (t.metrics.onet_task_pct || 0), 0);

  // Assign squares to tasks based on their usage percentage
  const taskSquares: (Task | null)[] = [];
  let remainingSquares = totalSquares;

  tasks.forEach((task, index) => {
    const taskPercentage = (task.metrics.onet_task_pct / totalUsage) * 100;
    let squaresForTask = Math.round((taskPercentage / 100) * totalSquares);

    // Ensure we don't exceed total squares
    if (index === tasks.length - 1) {
      squaresForTask = remainingSquares;
    } else {
      squaresForTask = Math.min(squaresForTask, remainingSquares);
    }

    remainingSquares -= squaresForTask;

    for (let i = 0; i < squaresForTask; i++) {
      taskSquares.push(task);
    }
  });

  // Fill remaining squares with null
  while (taskSquares.length < totalSquares) {
    taskSquares.push(null);
  }

  // Assign collaboration modes to tasks based on hash
  const getCollaborationMode = (task: Task) => {
    if (task.collaboration_mode) return task.collaboration_mode;

    const hash = task.task.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const modes = ['directive', 'feedback_loop', 'task_iteration', 'validation', 'learning'];
    return modes[hash % modes.length];
  };

  const getSquareColor = (mode: string) => {
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
  };

  const getModeName = (mode: string) => {
    const names: Record<string, string> = {
      directive: 'Directive',
      feedback_loop: 'Feedback Loop',
      task_iteration: 'Task Iteration',
      validation: 'Validation',
      learning: 'Learning',
    };
    return names[mode] || mode;
  };

  const handleMouseEnter = (task: Task | null, event: React.MouseEvent) => {
    if (task) {
      setHoveredTask(task);
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredTask(null);
  };

  return (
    <div className="relative">
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {taskSquares.map((task, index) => {
          const mode = task ? getCollaborationMode(task) : 'none';
          return (
            <div
              key={index}
              className="aspect-square rounded-[1px] cursor-pointer transition-opacity hover:opacity-80 hover:ring-1 hover:ring-gray-400"
              style={{ backgroundColor: getSquareColor(mode) }}
              onMouseEnter={(e) => handleMouseEnter(task, e)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </div>

      {/* Task tooltip */}
      {hoveredTask && (
        <div
          className="fixed bg-gray-800 text-white px-3 py-2 rounded text-xs shadow-xl border border-gray-700 z-50 max-w-sm"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 10}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
          }}
        >
          <div className="space-y-1.5">
            <div className="text-gray-100 leading-tight">
              {hoveredTask.task.charAt(0).toUpperCase() + hoveredTask.task.slice(1)}
            </div>
            <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{
                    backgroundColor: getSquareColor(
                      getCollaborationMode(hoveredTask)
                    ),
                  }}
                ></div>
                <span className="text-gray-300 text-[11px]">
                  {getModeName(getCollaborationMode(hoveredTask))}
                </span>
              </div>
              <span className="font-medium text-[11px]">
                {((hoveredTask.metrics.onet_task_pct / totalUsage) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1"
            style={{ pointerEvents: 'none' }}
          >
            <div className="border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  );
}
