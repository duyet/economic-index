import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import MainLayout from '@/components/layout/MainLayout';
import { DataErrorBoundary } from '@/components/errors';

// Lazy load WorldMap component for code splitting
const WorldMap = dynamic(() => import('@/components/maps/WorldMap'));

export const metadata: Metadata = {
  title: 'Home',
  description: 'Explore AI adoption patterns across 173 countries worldwide. Interactive maps and visualizations showing Claude usage, collaboration modes, and task distribution based on Anthropic Economic Index V3 (Aug 2025).',
  openGraph: {
    title: 'Global AI Adoption | Interactive World Map',
    description: 'Explore AI adoption patterns across 173 countries with interactive visualizations. Track Claude usage, collaboration modes, and task distribution worldwide.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Global AI Adoption Interactive Map',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global AI Adoption | Interactive World Map',
    description: 'Explore AI adoption patterns across 173 countries with interactive visualizations.',
  },
};

export default function Home() {
  return (
    <MainLayout fullWidth>
      <div className="h-full flex flex-col p-12">
        <header className="flex-shrink-0 mb-8">
          <h1 className="text-5xl font-serif text-gray-900 dark:text-gray-100 font-light leading-tight">Global AI Adoption</h1>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl space-y-6">

        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-6 shadow-sm" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-xl font-serif mb-4 text-gray-900 dark:text-gray-100 font-light">Overview</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Explore AI adoption patterns across 173 countries. Track Claude usage,
            collaboration modes, and task distribution to understand how AI is being
            deployed worldwide.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8" role="list" aria-label="Key statistics">
            <article className="p-6 bg-cream-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700" role="listitem">
              <div className="text-4xl font-serif font-light text-teal-600 dark:text-teal-400 mb-1" aria-label="173 countries">173</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
            </article>
            <article className="p-6 bg-cream-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700" role="listitem">
              <div className="text-4xl font-serif font-light text-teal-600 dark:text-teal-400 mb-1" aria-label="974 job categories">974</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Job Categories</div>
            </article>
            <article className="p-6 bg-cream-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700" role="listitem">
              <div className="text-4xl font-serif font-light text-teal-600 dark:text-teal-400 mb-1" aria-label="Over 1 million conversations">1M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conversations</div>
            </article>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-6 shadow-sm" aria-labelledby="global-coverage-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="global-coverage-heading" className="text-xl font-serif text-gray-900 dark:text-gray-100 font-light">Global Coverage</h2>
            <Link href="/countries" className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline decoration-teal-300 underline-offset-2" aria-label="View all 173 countries">
              View all countries →
            </Link>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Explore AI adoption patterns across 173 countries worldwide
          </p>
          <DataErrorBoundary componentName="World Map">
            <WorldMap showTabs={true} />
          </DataErrorBoundary>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 shadow-sm" aria-labelledby="getting-started-heading">
          <h2 id="getting-started-heading" className="text-xl font-serif mb-4 text-gray-900 dark:text-gray-100 font-light">Getting Started</h2>
          <nav aria-label="Quick navigation links">
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 dark:text-teal-400 mt-1" aria-hidden="true">→</span>
                <span>Browse <Link href="/countries" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline decoration-teal-300 underline-offset-2">173 countries worldwide</Link></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 dark:text-teal-400 mt-1" aria-hidden="true">→</span>
                <span>Compare <Link href="/compare" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline decoration-teal-300 underline-offset-2">adoption patterns across countries</Link></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 dark:text-teal-400 mt-1" aria-hidden="true">→</span>
                <span>Explore <Link href="/jobs" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline decoration-teal-300 underline-offset-2">974 job categories</Link></span>
              </li>
            </ul>
          </nav>
        </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
