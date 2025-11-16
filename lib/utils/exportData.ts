/**
 * Data Export Utilities
 *
 * Provides functions to export data in various formats (JSON, CSV)
 * with proper file download handling and MIME types.
 */

/**
 * Export data as JSON file
 * @param data - Data object to export
 * @param filename - Name of the file (without extension)
 */
export function exportToJSON(data: unknown, filename: string): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
  } catch (error) {
    throw new Error(`Failed to export JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export data as CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 */
export function exportToCSV(data: unknown, filename: string): void {
  try {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${filename}.csv`);
  } catch (error) {
    throw new Error(`Failed to export CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert JSON data to CSV format
 * @param jsonData - Data to convert (object or array)
 * @returns CSV string
 */
export function convertToCSV(jsonData: unknown): string {
  if (!jsonData) {
    throw new Error('No data provided');
  }

  // Handle different data structures
  let records: Record<string, unknown>[] = [];

  if (Array.isArray(jsonData)) {
    records = jsonData;
  } else if (typeof jsonData === 'object') {
    // For objects with nested arrays (like countries.json, states.json)
    const obj = jsonData as Record<string, unknown>;

    // Try to find the main data array
    if (obj.countries && Array.isArray(obj.countries)) {
      records = obj.countries as Record<string, unknown>[];
    } else if (obj.states && Array.isArray(obj.states)) {
      records = obj.states as Record<string, unknown>[];
    } else if (obj.data && Array.isArray(obj.data)) {
      records = obj.data as Record<string, unknown>[];
    } else {
      // Flatten single object to array
      records = [obj];
    }
  }

  if (records.length === 0) {
    throw new Error('No records found to export');
  }

  // Flatten nested objects for CSV
  const flattenedRecords = records.map(record => flattenObject(record));

  // Get all unique headers
  const headers = Array.from(
    new Set(
      flattenedRecords.flatMap(record => Object.keys(record))
    )
  ).sort();

  // Build CSV
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headers.map(escapeCSVField).join(','));

  // Add data rows
  for (const record of flattenedRecords) {
    const values = headers.map(header => {
      const value = record[header];
      return escapeCSVField(value);
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Flatten nested object for CSV export
 * @param obj - Object to flatten
 * @param prefix - Prefix for nested keys
 * @returns Flattened object
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, unknown> {
  const flattened: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      flattened[newKey] = '';
    } else if (Array.isArray(value)) {
      // Convert arrays to JSON strings for CSV
      flattened[newKey] = JSON.stringify(value);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively flatten nested objects
      Object.assign(flattened, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
}

/**
 * Escape CSV field value
 * @param value - Field value
 * @returns Escaped string
 */
function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Download blob as file
 * @param blob - Blob to download
 * @param filename - File name
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with timestamp
 * @param baseName - Base name for the file
 * @returns Filename with timestamp
 */
export function generateTimestampedFilename(baseName: string): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5); // YYYY-MM-DDTHH-MM-SS
  return `${baseName}_${timestamp}`;
}

/**
 * Fetch and export data from public data folder
 * @param dataFile - Name of the data file (e.g., 'countries.json')
 * @param format - Export format ('json' or 'csv')
 * @param filename - Optional custom filename
 */
export async function fetchAndExport(
  dataFile: string,
  format: 'json' | 'csv',
  filename?: string
): Promise<void> {
  try {
    const response = await fetch(`/data/${dataFile}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${dataFile}: ${response.statusText}`);
    }

    const data = await response.json();

    const baseFilename = filename || generateTimestampedFilename(
      dataFile.replace('.json', '')
    );

    if (format === 'json') {
      exportToJSON(data, baseFilename);
    } else {
      exportToCSV(data, baseFilename);
    }
  } catch (error) {
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
