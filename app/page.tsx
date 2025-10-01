import Link from 'next/link';
import WorldMap from '@/components/maps/WorldMap';
import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout fullWidth>
      <div className="h-full flex flex-col p-12">
        <div className="flex-shrink-0 mb-8">
          <h2 className="text-5xl font-serif text-gray-900 font-light leading-tight">Global AI Adoption</h2>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl space-y-6">

        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
          <h3 className="text-xl font-serif mb-4 text-gray-900 font-light">Overview</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Explore AI adoption patterns across 173 countries. Track Claude usage,
            collaboration modes, and task distribution to understand how AI is being
            deployed worldwide.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="p-6 bg-cream-50 rounded-lg border border-gray-100">
              <div className="text-4xl font-serif font-light text-teal-600 mb-1">173</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="p-6 bg-cream-50 rounded-lg border border-gray-100">
              <div className="text-4xl font-serif font-light text-teal-600 mb-1">974</div>
              <div className="text-sm text-gray-600">Job Categories</div>
            </div>
            <div className="p-6 bg-cream-50 rounded-lg border border-gray-100">
              <div className="text-4xl font-serif font-light text-teal-600 mb-1">1M+</div>
              <div className="text-sm text-gray-600">Conversations</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif text-gray-900 font-light">Global Coverage</h3>
            <Link href="/countries" className="text-sm text-teal-600 hover:text-teal-700 underline decoration-teal-300 underline-offset-2">
              View all countries →
            </Link>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Explore AI adoption patterns across 173 countries worldwide
          </p>
          <div className="bg-cream-50 rounded-lg p-6 border border-gray-100">
            <WorldMap />
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#117763' }}></div>
              <span>Leading</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4DCAB6' }}></div>
              <span>Upper Middle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#80D9CB' }}></div>
              <span>Lower Middle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#B3E8E0' }}></div>
              <span>Emerging</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E6F7F5' }}></div>
              <span>Minimal</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h3 className="text-xl font-serif mb-4 text-gray-900 font-light">Getting Started</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 mt-1">→</span>
              <span>Browse <Link href="/countries" className="text-teal-600 hover:text-teal-700 underline decoration-teal-300 underline-offset-2">173 countries worldwide</Link></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 mt-1">→</span>
              <span>Compare <Link href="/compare" className="text-teal-600 hover:text-teal-700 underline decoration-teal-300 underline-offset-2">adoption patterns across countries</Link></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 mt-1">→</span>
              <span>Explore <Link href="/jobs" className="text-teal-600 hover:text-teal-700 underline decoration-teal-300 underline-offset-2">974 job categories</Link></span>
            </li>
          </ul>
        </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
