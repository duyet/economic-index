import type { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Countries',
  description: 'Browse AI adoption patterns across 173 countries worldwide. Compare usage indices, total usage, and global distribution. Sort by AI Usage Index, total usage, or country name.',
  openGraph: {
    title: 'Countries | Global AI Adoption Data',
    description: 'Browse AI adoption patterns across 173 countries. Compare usage indices, total usage, and global distribution.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Global AI Adoption by Country',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Countries | Global AI Adoption Data',
    description: 'Browse AI adoption patterns across 173 countries with interactive filters and sorting.',
  },
};

export default ClientPage;
