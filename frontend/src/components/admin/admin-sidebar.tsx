'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-white/8 bg-black/90 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/8 px-6">
        <Link href="/admin" className="text-xl font-bold">
          <span className="gradient-text">Waypoint</span>
        </Link>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/8 p-3">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
