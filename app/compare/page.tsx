import type { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Compare Countries',
  description: 'Compare AI adoption patterns across up to 10 countries side-by-side. Analyze usage indices, total usage, collaboration modes, and global distribution. Interactive charts and detailed metrics comparison.',
  openGraph: {
    title: 'Compare Countries | AI Adoption Metrics',
    description: 'Compare AI adoption patterns across up to 10 countries side-by-side with interactive charts and detailed metrics.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Compare AI Adoption Across Countries',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Countries | AI Adoption Metrics',
    description: 'Compare AI adoption patterns across countries with interactive visualizations.',
  },
};

export default ClientPage;
