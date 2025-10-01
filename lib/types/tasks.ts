import type { CollaborationMode, CollaborationCategory } from './collaboration';

export type FacetType =
  | 'country'
  | 'state_us'
  | 'onet_task'
  | 'collaboration'
  | 'request'
  | 'onet_task::collaboration'
  | 'request::collaboration'
  | 'onet_task::prompt_tokens'
  | 'onet_task::completion_tokens'
  | 'onet_task::cost';

export interface ONetTask {
  task: string;
  task_id?: string;
  onet_soc_code?: string;
  soc_major_group: string;
  soc_major_group_title: string;
}

export interface RequestCluster {
  cluster_name: string;
  level: 0 | 1 | 2; // 0 = most granular, 2 = highest level
  parent_cluster?: string;
}

export interface TaskUsage extends ONetTask {
  count: number;
  pct: number;
  pct_index?: number;
  collaboration?: Record<CollaborationMode, number>;
}

export interface RequestUsage extends RequestCluster {
  count: number;
  pct: number;
  pct_index?: number;
  collaboration?: Record<CollaborationMode, number>;
}
