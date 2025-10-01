import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-cream-50 overflow-hidden">
      <Sidebar />
      <main className={`flex-1 overflow-auto ${fullWidth ? 'p-0' : 'p-12'}`}>
        {children}
      </main>
    </div>
  );
}
