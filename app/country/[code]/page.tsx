import { CountryDetail } from '@/components/country/CountryDetail';

// Generate static params for all countries
export async function generateStaticParams() {
  // Read the countries data at build time
  const fs = require('fs');
  const path = require('path');

  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'countries.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Generate pages for all countries from data
    const countryCodes = data.map((country: any) => ({
      code: country.geo_id.toLowerCase(),
    }));

    // Also include all countries from the world map
    const mapCountries = [
      'us', 'ca', 'mx', 'br', 'ar',  // Americas
      'gb', 'fr', 'de', 'es', 'it',  // Europe
      'eg', 'za', 'ng',              // Africa
      'sa', 'ae',                    // Middle East
      'cn', 'in', 'jp', 'kr', 'id', 'th', 'vn', 'sg',  // Asia
      'au', 'nz'                     // Oceania
    ];

    // Merge and deduplicate
    const allCodes = new Set([
      ...countryCodes.map((c: any) => c.code),
      ...mapCountries
    ]);

    return Array.from(allCodes).map(code => ({ code }));
  } catch (error) {
    console.error('Error reading countries data:', error);
    // Fallback to comprehensive list including map countries
    const fallbackCountries = [
      'us', 'ca', 'mx', 'br', 'ar',
      'gb', 'fr', 'de', 'es', 'it',
      'eg', 'za', 'ng', 'sa', 'ae',
      'cn', 'in', 'jp', 'kr', 'id', 'th', 'vn', 'sg',
      'au', 'nz'
    ];
    return fallbackCountries.map((code) => ({ code }));
  }
}

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <CountryDetail code={code} />;
}
