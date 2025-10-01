import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-serif mb-1">Global Economic Index</h1>
          <p className="text-sm text-gray-600">Understanding AI&apos;s effects on the economy</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            <li>
              <Link href="/" className="block py-2 px-3 rounded hover:bg-gray-50 bg-gray-100">
                Global usage
              </Link>
            </li>
            <li>
              <Link href="/us" className="block py-2 px-3 rounded hover:bg-gray-50">
                US usage
              </Link>
            </li>
            <li>
              <Link href="/state" className="block py-2 px-3 rounded hover:bg-gray-50">
                State usage
              </Link>
            </li>
            <li>
              <Link href="/jobs" className="block py-2 px-3 rounded hover:bg-gray-50">
                Job explorer
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <div>
              <p className="text-sm font-medium">Global usage coming soon</p>
              <p className="text-xs text-gray-600">Download the dataset to explore now</p>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full py-2 px-4 border border-gray-300 rounded text-sm hover:bg-gray-50">
              ↓ Download dataset
            </button>
            <button className="w-full py-2 px-4 border border-gray-300 rounded text-sm hover:bg-gray-50">
              ✉ Get email updates
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">Last updated Sep 16, 2025</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif mb-6">Global AI Adoption</h2>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Overview</h3>
            <p className="text-gray-600 mb-4">
              Explore AI adoption patterns across 150+ countries. Track Claude usage,
              collaboration modes, and task distribution to understand how AI is being
              deployed worldwide.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-teal-600">173</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-teal-600">52</div>
                <div className="text-sm text-gray-600">US States</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-teal-600">1M+</div>
                <div className="text-sm text-gray-600">Conversations</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium mb-4">Getting Started</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• View <Link href="/us" className="text-teal-600 hover:underline">US state adoption patterns</Link></li>
              <li>• Explore <Link href="/jobs" className="text-teal-600 hover:underline">job-specific AI usage</Link></li>
              <li>• Download the full dataset for your own analysis</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
