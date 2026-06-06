'use client';

import { use } from 'react';
import { CountryDetail } from '@/components/country/CountryDetail';
import type { GeographyRecord } from '@/lib/types';

interface ClientPageProps {
  params: Promise<{ code: string }>;
  initialCountry?: GeographyRecord;
}

export function ClientPage({ params, initialCountry }: ClientPageProps) {
  const { code } = use(params);
  return <CountryDetail code={code} initialData={initialCountry} />;
}
