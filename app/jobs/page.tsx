import type { Metadata } from 'next';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Explore by Job',
  description: 'Discover AI adoption across 974 job categories based on O*NET-SOC classification. See which tasks are automated, augmented, or remain in human hands. Interactive waffle charts show task-level automation patterns.',
  keywords: [
    'job automation',
    'AI jobs',
    'O*NET tasks',
    'task automation',
    'job categories',
    'AI augmentation',
    'occupation analysis',
    'Claude tasks',
  ],
  openGraph: {
    title: 'Explore by Job | 974 Occupation Categories',
    description: 'Discover AI adoption across 974 job categories. See which tasks are automated, augmented, or remain in human hands.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Adoption by Job Category',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore by Job | 974 Occupation Categories',
    description: 'Discover AI adoption across 974 job categories with interactive task-level automation analysis.',
  },
};

export default ClientPage;
