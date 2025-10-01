import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Global Economic Index | AI Adoption Patterns Worldwide',
  description: 'Explore AI adoption patterns across 150+ countries and US states. Track Claude usage, collaboration modes, and task distribution globally.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
