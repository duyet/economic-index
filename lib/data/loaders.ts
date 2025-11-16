import fs from 'fs';
import path from 'path';
import type { GeographyData, GlobalSummary } from '../types';

// Helper to load data from public directory during build
function loadJSONFile(filename: string) {
  const filePath = path.join(process.cwd(), 'public', 'data', filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function loadCountries(): Promise<any[]> {
  return loadJSONFile('countries.json');
}

export async function loadStates(): Promise<any[]> {
  return loadJSONFile('states.json');
}

export async function loadGlobal(): Promise<any> {
  return loadJSONFile('global.json');
}

export async function loadMetadata(): Promise<GlobalSummary> {
  return loadJSONFile('metadata.json');
}
