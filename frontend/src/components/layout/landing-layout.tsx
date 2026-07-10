'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, ShoppingBag, ShoppingCart,
  Menu, X, ChevronRight, ChevronDown, Eye, Settings, LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const studentNav = [
  { label: 'Dashboard',        href: '/dashboard',           icon: LayoutDashboard },
  { label: 'Browse Courses',   href: '/dashboard/courses',   icon: BookOpen },
  { label: 'Purchase History', href: '/dashboard/purchases', icon: ShoppingBag },
  { label: 'Cart',             href: '/dashboard/cart',      icon: ShoppingCart },
];

interface Props {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: Props) {
  const { user, isLoading } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const isLoggedIn = !isLoading && !!user;

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* ── Sidebar (logged-in only) ────────────────────── */}
      {isLoggedIn && (
        <>
          {/* Mobile backdrop */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar panel */}
          <aside
            className={cn(
              'fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/8 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            {/* Logo + close (mobile only) */}
            <div className="flex h-16 items-center justify-between border-b border-white/8 px-5">
              <Link href="/" className="text-xl font-bold">
                <span className="gradient-text">Waypoint</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
                aria-label="Close sidebar"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav items — no user chip, no logout */}
            <nav className="mt-4 flex-1 space-y-0.5 px-3">
              {studentNav.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);
                const isCart = href === '/dashboard/cart';
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon size={17} />
                    <span className="flex-1">{label}</span>
                    {isCart && count > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                        {count}
                      </span>
                    )}
                    {isActive && <ChevronRight size={14} className="text-blue-400/50" />}
                  </Link>
                );
              })}
            </nav>

            {/* Footer: copyright only */}
            <div className="border-t border-white/8 px-5 py-4">
              <p className="text-xs text-slate-600">Waypoint Academy © 2025</p>
            </div>
          </aside>

          {/* Desktop spacer */}
          <div className="hidden w-64 flex-shrink-0 lg:block" />
        </>
      )}

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <LandingNavbar
          isLoggedIn={isLoggedIn}
          isLoading={isLoading}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function LandingNavbar({
  isLoggedIn,
  isLoading,
  user,
  onMenuClick,
}: {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: any;
  onMenuClick: () => void;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">

        {/* Left: hamburger (logged-in mobile) + logo */}
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <button
              onClick={onMenuClick}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          )}
          {/* Logo: always on guest, only on mobile when logged-in (desktop sidebar already has it) */}
          <Link
            href="/"
            className={cn(
              'text-xl font-bold tracking-tight sm:text-2xl',
              isLoggedIn && 'lg:hidden'
            )}
          >
            <span className="gradient-text">Waypoint</span>
          </Link>
        </div>

        {/* Right */}
        {!isLoading && (
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              /* Avatar dropdown — same as inside the app */
              <NavUserDropdown user={user} />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-white hover:opacity-90">
                    <span className="hidden sm:inline">Register Free</span>
                    <span className="sm:hidden">Register</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </motion.header>
  );
}

// ─── Avatar dropdown ──────────────────────────────────────────────────────────

function NavUserDropdown({ user }: { user: any }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-xs font-bold text-white">
          {user?.name?.[0]?.toUpperCase() ?? 'U'}
        </span>
        <span className="hidden sm:block max-w-[120px] truncate">{user?.name}</span>
        <ChevronDown
          size={13}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40"
          >
            {/* User info */}
            <div className="border-b border-white/8 px-4 py-3">
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="mt-0.5 text-xs capitalize text-slate-400">{user?.role}</p>
            </div>

            {/* Links */}
            <div className="py-1.5">
              <DropdownLink href="/dashboard/profile" icon={<Eye size={14} />} onClick={() => setOpen(false)}>
                View Profile
              </DropdownLink>
              <DropdownLink href="/dashboard/profile/edit" icon={<Settings size={14} />} onClick={() => setOpen(false)}>
                Edit Profile
              </DropdownLink>
            </div>

            {/* Logout */}
            <div className="border-t border-white/8 py-1.5">
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownLink({
  href,
  icon,
  onClick,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
    >
      <span className="text-slate-400">{icon}</span>
      {children}
    </Link>
  );
}
