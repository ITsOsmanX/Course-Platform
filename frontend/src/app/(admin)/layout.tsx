'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/auth/login');
      } else if (role !== 'admin') {
        router.replace('/dashboard'); // Kick non-admins down to student profile
      }
    }
  }, [user, role, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-amber-500" />
      </div>
    );
  }

  if (!user || role !== 'admin') return null;

  return <div className="min-h-screen bg-black text-white">{children}</div>;
}