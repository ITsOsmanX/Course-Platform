'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, ChevronDown, LogOut, Settings, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        {/* Avatar circle */}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-xs font-bold text-white">
          {user?.name?.[0]?.toUpperCase() ?? 'U'}
        </span>
        <span className="hidden sm:block">{user?.name ?? 'Account'}</span>
        <ChevronDown
          size={14}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
          {/* User info header */}
          <div className="border-b border-white/8 px-4 py-3">
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="mt-0.5 text-xs capitalize text-slate-400">{user?.role}</p>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Eye size={15} />
              View Profile
            </Link>
            <Link
              href="/dashboard/profile/edit"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Settings size={15} />
              Edit Profile
            </Link>
          </div>

          <div className="border-t border-white/8 py-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
