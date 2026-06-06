import type { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'US States',
  description: 'Explore AI adoption patterns across all 50 US states and territories. View top states by AI Usage Index (AUI), total usage counts, and state-by-state comparison of Claude adoption.',
  openGraph: {
    title: 'US States | AI Adoption by State',
    description: 'Explore AI adoption patterns across all 50 US states. View top states by AI Usage Index and total usage.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'US States AI Adoption',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US States | AI Adoption by State',
    description: 'Explore AI adoption patterns across all 50 US states with detailed metrics.',
  },
};

export default ClientPage;
