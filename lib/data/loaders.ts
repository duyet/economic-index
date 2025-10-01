import type { GeographyData, GlobalSummary } from '../types';

export async function loadCountries(): Promise<any[]> {
  const response = await fetch('/data/countries.json');
  if (!response.ok) {
    throw new Error('Failed to load countries data');
  }
  return response.json();
}

export async function loadStates(): Promise<any[]> {
  const response = await fetch('/data/states.json');
  if (!response.ok) {
    throw new Error('Failed to load states data');
  }
  return response.json();
}

export async function loadGlobal(): Promise<any> {
  const response = await fetch('/data/global.json');
  if (!response.ok) {
    throw new Error('Failed to load global data');
  }
  return response.json();
}

export async function loadMetadata(): Promise<GlobalSummary> {
  const response = await fetch('/data/metadata.json');
  if (!response.ok) {
    throw new Error('Failed to load metadata');
  }
  return response.json();
}
