export interface UsageMetrics {
  usage_count: number;
  usage_pct: number;
  usage_per_capita?: number;
  usage_per_capita_index?: number; // AUI - Anthropic AI Usage Index
  usage_tier?: number; // 0-4 tier
}

export interface ContentMetrics {
  onet_task_count?: number;
  onet_task_pct?: number;
  onet_task_pct_index?: number;
  request_count?: number;
  request_pct?: number;
  request_pct_index?: number;
  collaboration_count?: number;
  collaboration_pct?: number;
  collaboration_pct_index?: number;
}

export interface IntersectionMetrics {
  onet_task_collaboration_count?: number;
  onet_task_collaboration_pct?: number;
  request_collaboration_count?: number;
  request_collaboration_pct?: number;
}

export interface TokenMetrics {
  prompt_tokens_index?: number;
  prompt_tokens_count?: number;
  completion_tokens_index?: number;
  completion_tokens_count?: number;
  cost_index?: number;
  cost_count?: number;
}

export interface DemographicMetrics {
  working_age_pop?: number;
  gdp_per_working_age_capita?: number;
}

export interface AutomationMetrics {
  automation_pct?: number;
  augmentation_pct?: number;
}

export type AllMetrics = UsageMetrics &
  ContentMetrics &
  IntersectionMetrics &
  TokenMetrics &
  DemographicMetrics &
  AutomationMetrics;
