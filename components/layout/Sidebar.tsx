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
