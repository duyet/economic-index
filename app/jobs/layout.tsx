import Link from 'next/link';

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8">
          <Link href="/" className="block">
            <h1 className="text-2xl font-serif mb-1">Global Economic Index</h1>
            <p className="text-sm text-gray-600">Understanding AI&apos;s effects on the economy</p>
          </Link>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            <li>
              <Link href="/" className="block py-2 px-3 rounded hover:bg-gray-50">
                Global usage
              </Link>
            </li>
            <li>
              <Link href="/us" className="block py-2 px-3 rounded hover:bg-gray-50">
                US usage
              </Link>
            </li>
            <li>
              <Link href="/countries" className="block py-2 px-3 rounded hover:bg-gray-50">
                Countries
              </Link>
            </li>
            <li>
              <Link href="/jobs" className="block py-2 px-3 rounded bg-gray-100">
                Job explorer
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200">
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
      <main className="flex-1 bg-background">{children}</main>
    </div>
  );
}
