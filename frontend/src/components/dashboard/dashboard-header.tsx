'use client';

import { Bell } from 'lucide-react';
import UserDropdown from './user-dropdown';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const { count } = useCart();

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/8 bg-slate-950/70 px-6 backdrop-blur-xl">
      <h1 className="text-lg font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Cart icon with badge */}
        <Link
          href="/dashboard/cart"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Cart"
        >
          <ShoppingCart size={16} />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>

        {/* Notifications placeholder */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </button>

        <UserDropdown />
      </div>
    </header>
  );
}
