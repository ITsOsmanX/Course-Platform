'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, ShoppingBag, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Browse Courses', href: '/dashboard/courses', icon: BookOpen },
  { label: 'Purchase History', href: '/dashboard/purchases', icon: ShoppingBag },
  { label: 'Cart', href: '/dashboard/cart', icon: ShoppingCart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-white/8 bg-slate-950/90 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/8 px-6">
        <Link href="/dashboard" className="text-xl font-bold">
          <span className="gradient-text">Waypoint</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-blue-600/20 text-blue-400 shadow-sm shadow-blue-600/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom brand strip */}
      <div className="border-t border-white/8 px-6 py-4">
        <p className="text-xs text-slate-600">Waypoint Academy © 2025</p>
      </div>
    </aside>
  );
}
