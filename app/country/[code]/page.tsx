import { CountryDetail } from '@/components/country/CountryDetail';

// Generate static params for popular countries
export async function generateStaticParams() {
  const popularCountries = [
    'us', 'gb', 'ca', 'au', 'de', 'fr', 'jp', 'sg', 'il', 'nz',
    'kr', 'nl', 'se', 'ch', 'dk', 'fi', 'no', 'ie', 'be', 'at'
  ];

  return popularCountries.map((code) => ({
    code: code,
  }));
}

export default async function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <CountryDetail code={code} />;
}
