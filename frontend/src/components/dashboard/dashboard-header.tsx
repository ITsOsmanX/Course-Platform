'use client';

import { Bell, ShoppingCart, Menu } from 'lucide-react';
import UserDropdown from './user-dropdown';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface DashboardHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  const { count } = useCart();

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/8 bg-slate-950/70 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={17} />
        </button>
        <h1 className="text-base font-semibold text-white sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Cart */}
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

        {/* Notifications */}
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
