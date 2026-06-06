import type { Metadata } from 'next';
import './globals.css';
import { OrganizationSchema, WebSiteSchema, DatasetSchema } from '@/components/seo';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://economic-index.pages.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Global Economic Index | AI Adoption Patterns Worldwide',
    template: '%s | Global Economic Index',
  },
  description: 'Explore AI adoption patterns across 173 countries and US states. Interactive data visualization of Claude usage, collaboration modes, task distribution, and job automation based on Anthropic Economic Index V3.',
  keywords: [
    'AI adoption',
    'artificial intelligence',
    'economic index',
    'Claude AI',
    'global AI usage',
    'task automation',
    'AI collaboration',
    'job automation',
    'O*NET tasks',
    'AI usage index',
    'Anthropic',
    'data visualization',
  ],
  authors: [{ name: 'Duyet Le', url: 'https://github.com/duyet' }],
  creator: 'Duyet Le',
  publisher: 'Duyet Le',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Global Economic Index',
    title: 'Global Economic Index | AI Adoption Patterns Worldwide',
    description: 'Explore AI adoption patterns across 173 countries and US states. Interactive data visualization of Claude usage, collaboration modes, and task distribution.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Global Economic Index - AI Adoption Patterns',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Economic Index | AI Adoption Patterns Worldwide',
    description: 'Explore AI adoption patterns across 173 countries and US states with interactive visualizations.',
    images: ['/og-image.png'],
    creator: '@duyetdev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
        <DatasetSchema />
        {/* Prevent flash of wrong theme on page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const stored = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = stored || (prefersDark ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {/* Skip to main content link for screen readers and keyboard users */}
          <a
            href="#main-content"
            className="skip-to-main"
          >
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
