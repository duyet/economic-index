'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Global usage' },
  { href: '/countries', label: 'Countries' },
  { href: '/compare', label: 'Compare' },
  { href: '/jobs', label: 'Job explorer' }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="block">
          <h1 className="text-2xl font-serif mb-1 text-gray-900">Global Economic Index</h1>
          <p className="text-sm text-gray-600">Understanding AI&apos;s effects on the economy</p>
        </Link>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-2 px-3 rounded text-sm transition-colors ${
                    isActive
                      ? 'bg-cream-100 text-gray-900'
                      : 'hover:bg-cream-50 text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-5 h-5 text-teal-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">Global usage coming soon</p>
            <p className="text-xs text-gray-600">Download the dataset to explore now</p>
          </div>
        </div>
        <div>
          <button className="w-full py-2 px-4 border border-gray-300 rounded text-sm hover:bg-cream-50 text-gray-700 transition-colors">
            ↓ Download dataset
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">Last updated Sep 16, 2025</p>
      </div>
    </aside>
  );
}
