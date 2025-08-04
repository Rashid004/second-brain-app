import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}