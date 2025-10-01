import { TIER_COLORS } from '../data/constants';
import type { UsageTier } from '../types';

export function getTierColor(tier: UsageTier): string {
  return TIER_COLORS[tier] || TIER_COLORS[0];
}

export function getCollaborationColor(mode: string): string {
  const automationModes = ['directive', 'feedback loop'];
  const augmentationModes = ['learning', 'task iteration', 'validation'];

  if (automationModes.includes(mode)) {
    return '#117763'; // Teal for automation
  }
  if (augmentationModes.includes(mode)) {
    return '#96C1A2'; // Sage for augmentation
  }
  return '#9CA3AF'; // Gray for other
}

export function getSOCColor(socCode: string): string {
  const colorMap: Record<string, string> = {
    '11': '#5A9770', // Management - sage
    '13': '#74AE85', // Business - light sage
    '15': '#4DCAB6', // Computer - teal
    '17': '#1ABBA1', // Engineering - medium teal
    '19': '#80D9CB', // Science - light teal
    '21': '#96C1A2', // Community - sage
    '23': '#3A6248', // Legal - dark sage
    '25': '#6B8DD6', // Education - blue
    '27': '#F98D7F', // Arts - coral
    '29': '#B3E8E0', // Healthcare - very light teal
    '43': '#9CA3AF', // Office - gray
  };

  return colorMap[socCode] || '#D9E7DC';
}
