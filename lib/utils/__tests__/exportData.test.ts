/**
 * Tests for exportData utilities
 */

import { convertToCSV, generateTimestampedFilename } from '../exportData';

describe('exportData utilities', () => {
  describe('convertToCSV', () => {
    it('should convert array of objects to CSV', () => {
      const data = [
        { name: 'USA', code: 'US', population: 331 },
        { name: 'UK', code: 'GB', population: 67 }
      ];

      const csv = convertToCSV(data);
      const lines = csv.split('\n');

      expect(lines[0]).toContain('code');
      expect(lines[0]).toContain('name');
      expect(lines[0]).toContain('population');
      expect(lines.length).toBe(3); // header + 2 rows
    });

    it('should handle nested objects', () => {
      const data = [
        {
          name: 'USA',
          metrics: { usage: 100, tier: 4 }
        }
      ];

      const csv = convertToCSV(data);
      expect(csv).toContain('metrics.usage');
      expect(csv).toContain('metrics.tier');
    });

    it('should escape CSV special characters', () => {
      const data = [
        { name: 'Test, Inc.', description: 'Contains "quotes"' }
      ];

      const csv = convertToCSV(data);
      expect(csv).toContain('"Test, Inc."');
      expect(csv).toContain('""quotes""');
    });

    it('should handle data wrapper objects', () => {
      const data = {
        countries: [
          { name: 'USA', code: 'US' },
          { name: 'UK', code: 'GB' }
        ]
      };

      const csv = convertToCSV(data);
      const lines = csv.split('\n');
      expect(lines.length).toBe(3); // header + 2 rows
    });
  });

  describe('generateTimestampedFilename', () => {
    it('should generate filename with timestamp', () => {
      const filename = generateTimestampedFilename('countries');
      expect(filename).toMatch(/^countries_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}$/);
    });

    it('should handle different base names', () => {
      const filename = generateTimestampedFilename('export-data');
      expect(filename).toContain('export-data_');
    });
  });
});
