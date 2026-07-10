'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminHeader from '@/components/admin/admin-header';
import { PageTitleProvider, usePageTitle } from '@/context/PageTitleContext';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { title } = usePageTitle();
  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />
      <div className="flex flex-1 flex-col pl-64">
        <AdminHeader title={title} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.replace('/login');
      else if (role !== 'admin') router.replace('/dashboard');
    }
  }, [user, role, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-amber-500" />
      </div>
    );
  }

  if (!user || role !== 'admin') return null;

  return (
    <PageTitleProvider>
      <AdminShell>{children}</AdminShell>
    </PageTitleProvider>
  );
}
