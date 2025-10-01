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
