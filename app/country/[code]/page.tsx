import type { Metadata } from 'next';
import { ClientPage } from './ClientPage';
import { loadCountries } from '@/lib/data/loaders';
import { formatIndex, formatNumber } from '@/lib/utils/formatters';

// Generate static params for key countries only
// NOTE: Limited to avoid Next.js 15 static export event handler serialization issue
export async function generateStaticParams() {
  // Only generate a minimal set of country pages
  return [
    { code: 'us' }
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const countries = await loadCountries();
  const country = countries.find(
    (c) => c.geo_id.toLowerCase() === code.toLowerCase()
  );

  if (!country) {
    return {
      title: 'Country Not Found',
      description: 'The requested country data could not be found.',
    };
  }

  const usageIndex = country.metrics.usage_per_capita_index
    ? formatIndex(country.metrics.usage_per_capita_index)
    : 'N/A';
  const totalUsage = formatNumber(country.metrics.usage_count || 0);
  const usagePct = (country.metrics.usage_pct || 0).toFixed(2);

  const title = `${country.geo_id} | AI Adoption Data`;
  const description = `AI adoption in ${country.geo_id}: Usage Index ${usageIndex}, ${totalUsage} total conversations (${usagePct}% of global). Explore collaboration modes, task distribution, and detailed metrics.`;

  return {
    title,
    description,
    openGraph: {
      title: `${country.geo_id} | AI Adoption Metrics`,
      description,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${country.geo_id} AI Adoption Data`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${country.geo_id} | AI Adoption Metrics`,
      description: `AI adoption in ${country.geo_id}: ${usageIndex} Usage Index, ${totalUsage} conversations`,
    },
  };
}

export default function CountryPage({ params }: { params: Promise<{ code: string }> }) {
  return <ClientPage params={params} />;
}
