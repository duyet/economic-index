/**
 * Sitemap Generator for Global Economic Index
 *
 * Generates sitemap.xml with all static routes including:
 * - Main pages (home, countries, US states, compare, jobs)
 * - Individual country pages for all 173+ countries
 *
 * Run: npm run generate-sitemap
 * Output: public/sitemap.xml
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://economic-index.pages.dev';
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'sitemap.xml');
const COUNTRIES_DATA = path.join(process.cwd(), 'public', 'data', 'countries.json');

// Priority levels
const PRIORITIES = {
  home: '1.0',
  main: '0.8',
  country: '0.6',
};

// Change frequency
const CHANGE_FREQ = {
  static: 'monthly',
  dynamic: 'weekly',
};

interface Country {
  geo_id: string;
  geography: string;
  metrics?: {
    usage_count?: number;
    usage_rank?: number;
  };
}

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

/**
 * Format date to ISO 8601 format (YYYY-MM-DD)
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Generate sitemap URL entry
 */
function createUrl(url: SitemapUrl): string {
  return `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
}

/**
 * Load country data
 */
function loadCountries(): Country[] {
  try {
    const data = fs.readFileSync(COUNTRIES_DATA, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading countries data:', error);
    return [];
  }
}

/**
 * Generate sitemap.xml
 */
function generateSitemap(): void {
  console.log('Generating sitemap.xml...');

  const lastmod = formatDate(new Date());
  const urls: SitemapUrl[] = [];

  // Main pages
  const mainPages = [
    { path: '/', priority: PRIORITIES.home, changefreq: CHANGE_FREQ.static },
    { path: '/countries/', priority: PRIORITIES.main, changefreq: CHANGE_FREQ.static },
    { path: '/us/', priority: PRIORITIES.main, changefreq: CHANGE_FREQ.static },
    { path: '/compare/', priority: PRIORITIES.main, changefreq: CHANGE_FREQ.static },
    { path: '/jobs/', priority: PRIORITIES.main, changefreq: CHANGE_FREQ.static },
  ];

  mainPages.forEach(page => {
    urls.push({
      loc: `${SITE_URL}${page.path}`,
      lastmod,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  // Country pages
  const countries = loadCountries();
  console.log(`Found ${countries.length} countries`);

  countries.forEach(country => {
    urls.push({
      loc: `${SITE_URL}/country/${country.geo_id.toLowerCase()}/`,
      lastmod,
      changefreq: CHANGE_FREQ.static,
      priority: PRIORITIES.country,
    });
  });

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(createUrl).join('\n')}
</urlset>`;

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf-8');

  console.log(`✓ Sitemap generated successfully!`);
  console.log(`  Total URLs: ${urls.length}`);
  console.log(`  Main pages: ${mainPages.length}`);
  console.log(`  Country pages: ${countries.length}`);
  console.log(`  Output: ${OUTPUT_FILE}`);
}

// Run the generator
try {
  generateSitemap();
} catch (error) {
  console.error('Error generating sitemap:', error);
  process.exit(1);
}
