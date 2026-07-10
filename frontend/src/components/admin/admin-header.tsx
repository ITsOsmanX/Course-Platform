'use client';

import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/8 bg-black/70 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={17} />
        </button>
        <h1 className="text-base font-semibold text-white sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-black">
          {user?.name?.[0]?.toUpperCase() ?? 'A'}
        </span>
        <div className="hidden sm:block">
          <p className="text-xs font-medium text-white">{user?.name}</p>
          <p className="text-[10px] text-slate-500">Administrator</p>
        </div>
      </div>
    </header>
  );
}
