import Script from 'next/script';

interface StructuredDataProps {
  data: object;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Global Economic Index',
    url: 'https://economic-index.pages.dev',
    logo: 'https://economic-index.pages.dev/og-image.png',
    description:
      'Interactive data visualization platform showcasing global AI adoption patterns across 173 countries and US states.',
    founder: {
      '@type': 'Person',
      name: 'Duyet Le',
      url: 'https://github.com/duyet',
    },
    sameAs: [
      'https://github.com/duyet/economic-index',
    ],
  };

  return <StructuredData data={schema} />;
}

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Global Economic Index',
    url: 'https://economic-index.pages.dev',
    description:
      'Explore AI adoption patterns across 173 countries and US states with interactive data visualizations.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://economic-index.pages.dev/countries?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <StructuredData data={schema} />;
}

export function DatasetSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Anthropic Economic Index V3',
    description:
      'Global AI adoption data from August 4-11, 2025, covering 173 countries and 52 US states. Includes usage metrics, collaboration modes, and task-level analysis across 974 job categories.',
    url: 'https://economic-index.pages.dev',
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    creator: {
      '@type': 'Organization',
      name: 'Anthropic',
      url: 'https://www.anthropic.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Duyet Le',
      url: 'https://github.com/duyet',
    },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: 'https://economic-index.pages.dev/data/countries.json',
        name: 'Countries Data',
      },
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: 'https://economic-index.pages.dev/data/states.json',
        name: 'US States Data',
      },
    ],
    temporalCoverage: '2025-08-04/2025-08-11',
    spatialCoverage: {
      '@type': 'Place',
      name: 'Global',
    },
    keywords: [
      'AI adoption',
      'artificial intelligence',
      'economic index',
      'Claude AI',
      'task automation',
      'collaboration modes',
      'job automation',
    ],
    variableMeasured: [
      'AI Usage Index',
      'Usage Count',
      'Collaboration Modes',
      'Task Distribution',
      'Automation Percentage',
    ],
  };

  return <StructuredData data={schema} />;
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={schema} />;
}
