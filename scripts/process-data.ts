#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';
import type { RawDataRow } from '../lib/types';

const DATA_DIR = path.join(process.cwd(), 'aei_v3_download');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface GeoMetrics {
  [key: string]: number | string;
}

interface Task {
  task: string;
  metrics: {
    [key: string]: number;
  };
}

interface Request {
  cluster_name: string;
  metrics: {
    [key: string]: number;
  };
  level: number;
}

interface Collaboration {
  mode: string;
  metrics: {
    [key: string]: number;
  };
}

interface GeoData {
  geo_id: string;
  geography: string;
  metrics: GeoMetrics;
  tasks: Task[];
  requests: Request[];
  collaboration: Collaboration[];
}

interface ProcessedData {
  countries: Map<string, GeoData>;
  states: Map<string, GeoData>;
  global: GeoData;
  tasks: Map<string, Task>;
  requests: Map<string, Request>;
}

async function parseCSV(filePath: string): Promise<RawDataRow[]> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return new Promise((resolve, reject) => {
    Papa.parse<RawDataRow>(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn(`Warnings in ${path.basename(filePath)}:`, results.errors);
        }
        resolve(results.data);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

async function processClaudeAIData() {
  console.log('📊 Processing Claude AI data...');

  const claudeFile = path.join(DATA_DIR, 'aei_raw_claude_ai_2025-08-04_to_2025-08-11.csv');
  const data = await parseCSV(claudeFile);

  console.log(`✅ Loaded ${data.length} rows from Claude AI data`);

  // Initialize data structures
  const countries = new Map<string, GeoData>();
  const states = new Map<string, GeoData>();
  let globalData: GeoData = {
    geo_id: '',
    geography: 'global',
    metrics: {},
    tasks: [],
    requests: [],
    collaboration: [],
  };

  // Group data by geography
  for (const row of data) {
    const { geo_id, geography, facet, variable, cluster_name, value } = row;

    // Skip not_classified geographies
    if (geo_id === 'not_classified') continue;

    // Initialize geography entry if needed
    let geoData: GeoData | undefined;
    if (geography === 'country') {
      if (!countries.has(geo_id)) {
        countries.set(geo_id, {
          geo_id,
          geography,
          metrics: {},
          tasks: [],
          requests: [],
          collaboration: [],
        });
      }
      geoData = countries.get(geo_id);
    } else if (geography === 'state_us') {
      if (!states.has(geo_id)) {
        states.set(geo_id, {
          geo_id,
          geography,
          metrics: {},
          tasks: [],
          requests: [],
          collaboration: [],
        });
      }
      geoData = states.get(geo_id);
    } else if (geography === 'global') {
      if (!globalData.geo_id) {
        globalData = {
          geo_id,
          geography,
          metrics: {},
          tasks: [],
          requests: [],
          collaboration: [],
        };
      }
      geoData = globalData;
    }

    if (!geoData) continue;

    // Store the metric
    if (facet === 'country' || facet === 'state_us') {
      geoData.metrics[variable] = value;
    } else if (facet === 'onet_task') {
      // Task data - skip not_classified
      if (cluster_name === 'not_classified') continue;
      const taskKey = cluster_name;
      let task = geoData.tasks.find((t) => t.task === taskKey);
      if (!task) {
        task = { task: taskKey, metrics: {} };
        geoData.tasks.push(task);
      }
      task.metrics[variable] = value;
    } else if (facet === 'request') {
      // Request data - skip not_classified
      if (cluster_name === 'not_classified') continue;
      const requestKey = cluster_name;
      let request = geoData.requests.find((r) => r.cluster_name === requestKey);
      if (!request) {
        request = { cluster_name: requestKey, metrics: {}, level: row.level };
        geoData.requests.push(request);
      }
      request.metrics[variable] = value;
    } else if (facet === 'collaboration') {
      // Collaboration data - skip not_classified
      if (cluster_name === 'not_classified') continue;
      const mode = cluster_name;
      let collab = geoData.collaboration.find((c) => c.mode === mode);
      if (!collab) {
        collab = { mode, metrics: {} };
        geoData.collaboration.push(collab);
      }
      collab.metrics[variable] = value;
    }
  }

  console.log(`📍 Processed ${countries.size} countries`);
  console.log(`📍 Processed ${states.size} US states`);

  return { countries, states, global: globalData };
}

async function processAPIData(): Promise<GeoData> {
  console.log('📊 Processing 1P API data...');

  const apiFile = path.join(DATA_DIR, 'aei_raw_1p_api_2025-08-04_to_2025-08-11.csv');
  const data = await parseCSV(apiFile);

  console.log(`✅ Loaded ${data.length} rows from 1P API data`);

  const apiData: GeoData = {
    geo_id: 'GLOBAL',
    geography: 'global',
    metrics: {},
    tasks: [],
    requests: [],
    collaboration: [],
  };

  for (const row of data) {
    const { facet, variable, cluster_name, value } = row;

    if (facet === 'onet_task') {
      // Skip not_classified
      if (cluster_name === 'not_classified') continue;
      const taskKey = cluster_name;
      let task = apiData.tasks.find((t) => t.task === taskKey);
      if (!task) {
        task = { task: taskKey, metrics: {} };
        apiData.tasks.push(task);
      }
      task.metrics[variable] = value;
    } else if (facet === 'request') {
      // Skip not_classified
      if (cluster_name === 'not_classified') continue;
      const requestKey = cluster_name;
      let request = apiData.requests.find((r) => r.cluster_name === requestKey);
      if (!request) {
        request = { cluster_name: requestKey, metrics: {}, level: row.level };
        apiData.requests.push(request);
      }
      request.metrics[variable] = value;
    } else if (facet === 'collaboration') {
      // Skip not_classified
      if (cluster_name === 'not_classified') continue;
      const mode = cluster_name;
      let collab = apiData.collaboration.find((c) => c.mode === mode);
      if (!collab) {
        collab = { mode, metrics: {} };
        apiData.collaboration.push(collab);
      }
      collab.metrics[variable] = value;
    }
  }

  return apiData;
}

function calculateTiersAndRanks(geoMap: Map<string, GeoData>): void {
  console.log('📊 Calculating usage tiers and ranks...');

  const geoArray = Array.from(geoMap.values());

  // Sort by usage_pct descending
  geoArray.sort((a, b) => (b.metrics.usage_pct || 0) - (a.metrics.usage_pct || 0));

  // Calculate ranks and tiers
  geoArray.forEach((geo, index) => {
    geo.metrics.usage_rank = index + 1;

    // Calculate tier based on percentile
    const percentile = (index + 1) / geoArray.length;
    if (percentile <= 0.25) {
      geo.metrics.usage_tier = 4; // Leading (top 25%)
    } else if (percentile <= 0.50) {
      geo.metrics.usage_tier = 3; // Upper Middle (25-50%)
    } else if (percentile <= 0.75) {
      geo.metrics.usage_tier = 2; // Lower Middle (50-75%)
    } else if (percentile <= 0.90) {
      geo.metrics.usage_tier = 1; // Emerging (75-90%)
    } else {
      geo.metrics.usage_tier = 0; // Minimal (bottom 10%)
    }

    // Calculate usage per capita index (normalized against global average)
    // AUI = (country_usage_pct / population_share) where population_share is assumed proportional
    // For now, we'll use usage_pct as a proxy since we don't have population data
    // A value of 1.0 means proportional to global average
    const globalAvgPct = 100 / geoArray.length; // Equal distribution baseline
    geo.metrics.usage_per_capita_index = (geo.metrics.usage_pct || 0) / globalAvgPct;
  });

  console.log(`✅ Calculated tiers and ranks for ${geoArray.length} geographies`);
}

interface TaskOccupationMapping {
  task: string;
  soc_code: string;
  occupation_title: string;
  soc_major_group: string;
}

interface Occupation {
  soc_code: string;
  occupation_title: string;
  soc_major_group: string;
  tasks: Task[];
  total_usage_count: number;
  total_usage_pct: number;
}

function aggregateTasksByOccupation(globalData: GeoData): Occupation[] {
  console.log('📊 Aggregating tasks by occupation...');

  // Load task-occupation mapping
  const mappingFile = path.join(OUTPUT_DIR, 'task-occupation-mapping.json');
  if (!fs.existsSync(mappingFile)) {
    console.warn('⚠️  task-occupation-mapping.json not found, skipping occupation aggregation');
    return [];
  }

  const mapping: TaskOccupationMapping[] = JSON.parse(fs.readFileSync(mappingFile, 'utf-8'));
  const taskMap = new Map(mapping.map(m => [m.task, m]));

  // Group tasks by occupation
  const occupationMap = new Map<string, Occupation>();

  for (const task of globalData.tasks) {
    const normalizedTask = task.task.toLowerCase().trim();
    const occupationInfo = taskMap.get(normalizedTask);

    if (occupationInfo) {
      const { soc_code, occupation_title, soc_major_group } = occupationInfo;

      if (!occupationMap.has(soc_code)) {
        occupationMap.set(soc_code, {
          soc_code,
          occupation_title,
          soc_major_group,
          tasks: [],
          total_usage_count: 0,
          total_usage_pct: 0,
        });
      }

      const occ = occupationMap.get(soc_code)!;
      occ.tasks.push(task);
      occ.total_usage_count += task.metrics.onet_task_count || 0;
      occ.total_usage_pct += task.metrics.onet_task_pct || 0;
    }
  }

  console.log(`✅ Aggregated ${occupationMap.size} occupations`);

  return Array.from(occupationMap.values())
    .sort((a, b) => b.total_usage_pct - a.total_usage_pct);
}

async function main() {
  console.log('🚀 Starting data processing...\n');

  try {
    // Process Claude AI data
    const { countries, states, global } = await processClaudeAIData();

    // Calculate tiers and ranks
    calculateTiersAndRanks(countries);
    calculateTiersAndRanks(states);

    // Aggregate tasks by occupation
    const occupations = aggregateTasksByOccupation(global);

    // Process API data
    const apiData = await processAPIData();

    // Write output files
    console.log('\n💾 Writing output files...');

    // Write countries
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'countries.json'),
      JSON.stringify(Array.from(countries.values()), null, 2)
    );
    console.log(`✅ Wrote countries.json (${countries.size} countries)`);

    // Write states
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'states.json'),
      JSON.stringify(Array.from(states.values()), null, 2)
    );
    console.log(`✅ Wrote states.json (${states.size} states)`);

    // Write global
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'global.json'),
      JSON.stringify(global, null, 2)
    );
    console.log(`✅ Wrote global.json`);

    // Write API data
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'api.json'),
      JSON.stringify(apiData, null, 2)
    );
    console.log(`✅ Wrote api.json`);

    // Write occupations
    if (occupations.length > 0) {
      fs.writeFileSync(
        path.join(OUTPUT_DIR, 'occupations.json'),
        JSON.stringify(occupations, null, 2)
      );
      console.log(`✅ Wrote occupations.json (${occupations.length} occupations)`);
    }

    // Write summary
    interface Summary {
      generated: string;
      dateRange: {
        start: string;
        end: string;
      };
      counts: {
        countries: number;
        states: number;
      };
    }

    const summary: Summary = {
      generated: new Date().toISOString(),
      dateRange: {
        start: '2025-08-04',
        end: '2025-08-11',
      },
      counts: {
        countries: countries.size,
        states: states.size,
      },
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'metadata.json'),
      JSON.stringify(summary, null, 2)
    );
    console.log(`✅ Wrote metadata.json`);

    console.log('\n✨ Data processing complete!');
  } catch (error) {
    console.error('❌ Error processing data:', error);
    process.exit(1);
  }
}

main();
