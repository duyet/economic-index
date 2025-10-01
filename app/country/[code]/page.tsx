import { CountryDetail } from '@/components/country/CountryDetail';

// Generate static params for all countries
export async function generateStaticParams() {
  // Read the countries data at build time
  const fs = require('fs');
  const path = require('path');

  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'countries.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Generate pages for all countries
    return data.map((country: any) => ({
      code: country.geo_id.toLowerCase(),
    }));
  } catch (error) {
    console.error('Error reading countries data:', error);
    // Fallback to popular countries
    const popularCountries = [
      'us', 'gb', 'ca', 'au', 'de', 'fr', 'jp', 'sg', 'il', 'nz',
      'kr', 'nl', 'se', 'ch', 'dk', 'fi', 'no', 'ie', 'be', 'at'
    ];
    return popularCountries.map((code) => ({ code }));
  }
}

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <CountryDetail code={code} />;
}
