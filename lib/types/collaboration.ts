export const COLLABORATION_MODES = {
  directive: {
    mode: 'directive' as const,
    category: 'automation' as const,
    description: 'Users give Claude a task and it completes it with minimal back-and-forth',
  },
  'feedback loop': {
    mode: 'feedback loop' as const,
    category: 'automation' as const,
    description: 'Users automate tasks and provide feedback to Claude as needed',
  },
  learning: {
    mode: 'learning' as const,
    category: 'augmentation' as const,
    description: 'Users ask Claude for information or explanations about various topics',
  },
  'task iteration': {
    mode: 'task iteration' as const,
    category: 'augmentation' as const,
    description: 'Users iterate on tasks collaboratively with Claude',
  },
  validation: {
    mode: 'validation' as const,
    category: 'augmentation' as const,
    description: 'Users ask Claude for feedback on their work',
  },
  none: {
    mode: 'none' as const,
    category: 'other' as const,
    description: 'No specific collaboration pattern detected',
  },
  not_classified: {
    mode: 'not_classified' as const,
    category: 'other' as const,
    description: 'Collaboration pattern could not be classified',
  },
} as const;

export type CollaborationMode = keyof typeof COLLABORATION_MODES;
export type CollaborationCategory = 'automation' | 'augmentation' | 'other';

export interface CollaborationData {
  mode: CollaborationMode;
  count: number;
  pct: number;
}
