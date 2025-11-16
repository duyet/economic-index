'use client';

import { use } from 'react';
import { CountryDetail } from '@/components/country/CountryDetail';

interface ClientPageProps {
  params: Promise<{ code: string }>;
}

export function ClientPage({ params }: ClientPageProps) {
  const { code } = use(params);
  return <CountryDetail code={code} />;
}
