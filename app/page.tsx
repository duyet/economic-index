import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import MainLayout from '@/components/layout/MainLayout';
import { DataErrorBoundary } from '@/components/errors';
import { Globe, TrendingUp, Briefcase, ArrowRight, BarChart3, Users, Sparkles } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

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
      <div className="h-full overflow-auto">
        {/* Hero Section with Gradient Background */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-950">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-teal-200/30 to-transparent dark:from-teal-800/20 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-sage-200/30 to-transparent dark:from-sage-900/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
            <div className="text-center space-y-8 animate-fade-in-down">
              {/* Sparkle Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-teal-200 dark:border-teal-800 shadow-soft">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Based on Anthropic Economic Index V3 (Aug 2025)
                </span>
              </div>

              {/* Hero Heading with Gradient */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light leading-tight">
                <span className="block text-gray-900 dark:text-gray-100 mb-2">
                  Global AI Adoption
                </span>
                <span className="block bg-gradient-to-r from-teal-600 via-teal-500 to-sage-600 dark:from-teal-400 dark:via-teal-300 dark:to-sage-400 bg-clip-text text-transparent">
                  Interactive Insights
                </span>
              </h1>

              {/* Hero Description */}
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Explore AI adoption patterns across 173 countries. Track Claude usage,
                collaboration modes, and task distribution to understand how AI is being
                deployed worldwide.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link
                  href="/countries"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium shadow-soft-lg hover:shadow-glow-teal transition-all duration-300 transform hover:scale-105"
                  aria-label="Explore countries"
                >
                  <Globe className="w-5 h-5" />
                  Explore Countries
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/compare"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600 shadow-soft hover:shadow-soft-lg transition-all duration-300"
                  aria-label="Compare countries"
                >
                  <BarChart3 className="w-5 h-5" />
                  Compare Data
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Cards with Animations */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 -mt-12 relative z-10" aria-label="Key statistics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Countries */}
            <article
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-soft-lg hover:shadow-glow-teal transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
              role="listitem"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/50 dark:to-teal-800/30 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <AnimatedCounter
                end={173}
                className="text-5xl font-serif font-light text-gray-900 dark:text-gray-100 mb-2"
                aria-label="173 countries"
              />
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Countries Tracked</div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Comprehensive global coverage
              </p>
            </article>

            {/* Card 2 - Job Categories */}
            <article
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-soft-lg hover:shadow-glow-sage transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
              role="listitem"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-sage-100 to-sage-50 dark:from-sage-900/50 dark:to-sage-800/30 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-6 h-6 text-sage-600 dark:text-sage-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-sage-600 dark:text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <AnimatedCounter
                end={974}
                className="text-5xl font-serif font-light text-gray-900 dark:text-gray-100 mb-2"
                aria-label="974 job categories"
              />
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Job Categories</div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                O*NET-based classifications
              </p>
            </article>

            {/* Card 3 - Conversations */}
            <article
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-soft-lg hover:shadow-glow-teal transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
              role="listitem"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/50 dark:to-teal-800/30 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-5xl font-serif font-light text-gray-900 dark:text-gray-100 mb-2" aria-label="Over 1 million conversations">
                1M+
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversations</div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Real-world AI interactions
              </p>
            </article>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-20">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-gray-900 dark:text-gray-100 mb-4">
              Powerful <span className="bg-gradient-to-r from-teal-600 to-sage-600 dark:from-teal-400 dark:to-sage-400 bg-clip-text text-transparent">Insights</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Dive deep into AI adoption metrics with interactive visualizations and comprehensive data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-6 rounded-xl bg-gradient-to-br from-white to-teal-50/30 dark:from-gray-800 dark:to-teal-950/20 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300 animate-fade-in-up">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-serif font-light text-gray-900 dark:text-gray-100 mb-2">
                Global Coverage
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Explore AI adoption patterns across 173 countries with interactive maps and detailed metrics
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-xl bg-gradient-to-br from-white to-sage-50/30 dark:from-gray-800 dark:to-sage-950/20 border border-gray-200 dark:border-gray-700 hover:border-sage-300 dark:hover:border-sage-700 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 dark:from-sage-600 dark:to-sage-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-serif font-light text-gray-900 dark:text-gray-100 mb-2">
                Job Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Discover how AI is used across 974 job categories based on O*NET task classifications
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-xl bg-gradient-to-br from-white to-teal-50/30 dark:from-gray-800 dark:to-teal-950/20 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-serif font-light text-gray-900 dark:text-gray-100 mb-2">
                Comparative Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Compare adoption patterns, usage metrics, and collaboration modes across regions
              </p>
            </div>
          </div>
        </section>

        {/* Global Coverage with Map */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 py-8 sm:py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-soft-xl animate-fade-in-up">
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-gray-100 mb-2">
                    Global <span className="bg-gradient-to-r from-teal-600 to-sage-600 dark:from-teal-400 dark:to-sage-400 bg-clip-text text-transparent">Coverage</span>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Explore AI adoption patterns across 173 countries worldwide
                  </p>
                </div>
                <Link
                  href="/countries"
                  className="group hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-all duration-200"
                  aria-label="View all 173 countries"
                >
                  View all countries
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="p-6 sm:p-8 animate-fade-in">
              <DataErrorBoundary componentName="World Map">
                <WorldMap showTabs={true} />
              </DataErrorBoundary>
            </div>
          </div>
        </section>

        {/* Getting Started / Quick Links */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 py-8 sm:py-12 pb-16 sm:pb-24">
          <div className="bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 shadow-soft-xl animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-gray-100 mb-3">
                Ready to <span className="bg-gradient-to-r from-teal-600 to-sage-600 dark:from-teal-400 dark:to-sage-400 bg-clip-text text-transparent">Explore?</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Start discovering AI adoption insights across the globe
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Link 1 */}
              <Link
                href="/countries"
                className="group p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-glow-teal transition-all duration-300 transform hover:-translate-y-1"
              >
                <Globe className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-serif font-light text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  Browse Countries
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore detailed insights for 173 countries worldwide
                </p>
              </Link>

              {/* Quick Link 2 */}
              <Link
                href="/compare"
                className="group p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-sage-300 dark:hover:border-sage-600 hover:shadow-glow-sage transition-all duration-300 transform hover:-translate-y-1"
              >
                <BarChart3 className="w-8 h-8 text-sage-600 dark:text-sage-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-serif font-light text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  Compare Data
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analyze adoption patterns across different regions
                </p>
              </Link>

              {/* Quick Link 3 */}
              <Link
                href="/jobs"
                className="group p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-glow-teal transition-all duration-300 transform hover:-translate-y-1"
              >
                <Briefcase className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-serif font-light text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  Job Categories
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Discover AI usage across 974 job types
                </p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
