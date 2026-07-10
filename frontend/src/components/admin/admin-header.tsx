'use client';

import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/8 bg-black/70 px-6 backdrop-blur-xl">
      <h1 className="text-lg font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-black">
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </span>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-white">{user?.name}</p>
            <p className="text-[10px] text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
