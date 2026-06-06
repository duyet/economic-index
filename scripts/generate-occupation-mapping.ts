#!/usr/bin/env tsx

/**
 * DEPRECATED: This script requires the xlsx package which has known security vulnerabilities.
 *
 * To use this script:
 * 1. Convert onet_task_statements.xlsx to CSV format
 * 2. Use papaparse (already installed) instead of xlsx
 * 3. Or install xlsx as a devDependency temporarily if needed
 *
 * The script is not used in production builds and the required source file
 * (onet_task_statements.xlsx) is not included in the repository.
 */

import * as fs from 'fs';
import * as path from 'path';
// import * as XLSX from 'xlsx'; // REMOVED: Security vulnerability

const DATA_DIR = path.join(process.cwd(), 'aei_v3_download');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data');

async function generateOccupationMapping() {
  console.error('⚠️  This script is deprecated and requires xlsx package.');
  console.error('⚠️  Please convert onet_task_statements.xlsx to CSV and use papaparse instead.');
  console.error('⚠️  See script comments for details.');
  process.exit(1);

  console.log('📊 Generating occupation mapping from O*NET...');

  const onetFile = path.join(DATA_DIR, 'onet_task_statements.csv');

  // Read Excel file
  const workbook = XLSX.readFile(onetFile);
  const sheet = workbook.Sheets['Task Statements'];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  console.log(`✅ Loaded ${rows.length} O*NET task statements`);

  // Create task-to-occupation mapping
  const taskToOccupation = new Map<string, any>();

  for (const row of rows) {
    const task = row['Task'];
    const socCode = row['O*NET-SOC Code'];
    const title = row['Title'];

    if (task && socCode && title) {
      // Normalize task text (lowercase, trim)
      const normalizedTask = task.toLowerCase().trim();

      taskToOccupation.set(normalizedTask, {
        soc_code: socCode,
        occupation_title: title,
        soc_major_group: socCode.substring(0, 2),
      });
    }
  }

  console.log(`✅ Created mapping for ${taskToOccupation.size} unique tasks`);

  // Save mapping
  const mappingArray = Array.from(taskToOccupation.entries()).map(([task, data]) => ({
    task,
    ...data,
  }));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'task-occupation-mapping.json'),
    JSON.stringify(mappingArray, null, 2)
  );

  console.log(`✅ Wrote task-occupation-mapping.json`);

  // Group by occupation to see distribution
  const occupations = new Map<string, any>();

  for (const row of rows) {
    const socCode = row['O*NET-SOC Code'];
    const title = row['Title'];

    if (socCode && title) {
      if (!occupations.has(socCode)) {
        occupations.set(socCode, {
          soc_code: socCode,
          occupation_title: title,
          soc_major_group: socCode.substring(0, 2),
          task_count: 0,
        });
      }
      const occ = occupations.get(socCode)!;
      occ.task_count++;
    }
  }

  console.log(`✅ Found ${occupations.size} unique occupations`);

  // Save occupations list
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'onet-occupations.json'),
    JSON.stringify(Array.from(occupations.values()), null, 2)
  );

  console.log(`✅ Wrote onet-occupations.json`);
}

generateOccupationMapping().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
