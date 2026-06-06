import type { Geography } from './geography';
import type { AllMetrics } from './metrics';
import type { FacetType, TaskUsage, RequestUsage } from './tasks';
import type { CollaborationData } from './collaboration';

export interface RawDataRow {
  geo_id: string;
  geography: string;
  date_start: string;
  date_end: string;
  platform_and_product: string;
  facet: FacetType;
  level: number;
  variable: string;
  cluster_name: string;
  value: number;
}

export interface GeographyData {
  geography: Geography;
  metrics: AllMetrics;
  tasks: TaskUsage[];
  requests: RequestUsage[];
  collaboration: CollaborationData[];
  topTasks: TaskUsage[];
  topRequests: RequestUsage[];
}

export interface GlobalSummary {
  totalUsage: number;
  countries: number;
  dateRange: {
    start: string;
    end: string;
  };
  topCountries: Array<{
    geo_id: string;
    name: string;
    usage_count: number;
    usage_pct: number;
  }>;
  topStates: Array<{
    geo_id: string;
    name: string;
    usage_count: number;
    usage_pct: number;
  }>;
}

/**
 * Flattened geography data structure as returned from JSON files
 * (countries.json, states.json)
 */
export interface GeographyRecord {
  geo_id: string;
  geography: 'country' | 'state_us' | 'global';
  name?: string;
  iso_alpha_2?: string;
  iso_alpha_3?: string;
  state_code?: string;
  metrics: AllMetrics;
  tasks?: Array<{
    task: string;
    soc_major_group?: string;
    soc_major_group_title?: string;
    metrics: {
      onet_task_count: number;
      onet_task_pct: number;
      onet_task_pct_index?: number;
    };
  }>;
  requests?: Array<{
    cluster_name: string;
    level: number;
    metrics: {
      request_count: number;
      request_pct: number;
      request_pct_index?: number;
    };
  }>;
  collaboration?: Array<{
    mode: string;
    category?: string;
    metrics: {
      collaboration_count: number;
      collaboration_pct: number;
      collaboration_pct_index?: number;
    };
  }>;
}

/**
 * Occupation data structure for jobs page
 */
export interface OccupationRecord {
  occupation_title: string;
  soc_code: string;
  soc_major_group: string;
  soc_major_group_title: string;
  task_count: number;
  usage_count: number;
  usage_pct: number;
  automation_pct: number;
  augmentation_pct: number;
  tasks: Array<{
    task: string;
    usage_pct: number;
  }>;
}
