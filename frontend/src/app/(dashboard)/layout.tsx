'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import FloatingChat from '@/components/dashboard/floating-chat';
import { PageTitleProvider, usePageTitle } from '@/context/PageTitleContext';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { title } = usePageTitle();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar — hidden on mobile, always visible on lg+ */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Desktop sidebar spacer */}
      <div className="hidden w-64 flex-shrink-0 lg:block" />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>

      <FloatingChat />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <PageTitleProvider>
      <DashboardShell>{children}</DashboardShell>
    </PageTitleProvider>
  );
}
