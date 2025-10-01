export type GeographyType = 'country' | 'state_us' | 'global';

export type UsageTier = 0 | 1 | 2 | 3 | 4;

export interface BaseGeography {
  geo_id: string;
  geography: GeographyType;
  name: string;
}

export interface Country extends BaseGeography {
  geography: 'country';
  iso_alpha_2: string;
  iso_alpha_3: string;
  working_age_pop?: number;
  gdp_per_working_age_capita?: number;
}

export interface USState extends BaseGeography {
  geography: 'state_us';
  state_code: string;
  working_age_pop?: number;
  gdp_per_working_age_capita?: number;
}

export interface GlobalData extends BaseGeography {
  geography: 'global';
  geo_id: 'GLOBAL';
}

export type Geography = Country | USState | GlobalData;
