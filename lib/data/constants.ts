// SOC Major Group Titles
export const SOC_MAJOR_GROUPS: Record<string, string> = {
  '11': 'Management',
  '13': 'Business and Financial Operations',
  '15': 'Computer and Mathematical',
  '17': 'Architecture and Engineering',
  '19': 'Life, Physical, and Social Science',
  '21': 'Community and Social Service',
  '23': 'Legal',
  '25': 'Educational Instruction and Library',
  '27': 'Arts, Design, Entertainment, Sports, and Media',
  '29': 'Healthcare Practitioners and Technical',
  '31': 'Healthcare Support',
  '33': 'Protective Service',
  '35': 'Food Preparation and Serving Related',
  '37': 'Building and Grounds Cleaning and Maintenance',
  '39': 'Personal Care and Service',
  '41': 'Sales and Related',
  '43': 'Office and Administrative Support',
  '45': 'Farming, Fishing, and Forestry',
  '47': 'Construction and Extraction',
  '49': 'Installation, Maintenance, and Repair',
  '51': 'Production',
  '53': 'Transportation and Material Moving',
};

// Usage tier thresholds (based on AUI percentiles)
export const USAGE_TIERS = {
  LEADING: 4, // Top 25%
  UPPER_MIDDLE: 3, // 50-75%
  LOWER_MIDDLE: 2, // 25-50%
  EMERGING: 1, // Bottom 25%
  MINIMAL: 0, // No usage
} as const;

// Tier labels for display
export const TIER_LABELS: Record<number, string> = {
  4: 'Leading (top 25%)',
  3: 'Upper middle (50-75%)',
  2: 'Lower middle (25-50%)',
  1: 'Emerging (bottom 25%)',
  0: 'Minimal',
};

// Tier colors for maps
export const TIER_COLORS: Record<number, string> = {
  4: '#117763', // Dark teal
  3: '#4DCAB6', // Medium teal
  2: '#80D9CB', // Light teal/sage
  1: '#B3E8E0', // Very light teal
  0: '#E6F7F5', // Barely visible teal
};

// Minimum observations for inclusion
export const MIN_OBSERVATIONS = {
  COUNTRY: 200,
  STATE: 100,
};

export const DATA_DATE_RANGE = {
  start: '2025-08-04',
  end: '2025-08-11',
};

export const PLATFORMS = {
  CLAUDE_AI: 'Claude AI (Free and Pro)',
  API_1P: '1P API',
} as const;
