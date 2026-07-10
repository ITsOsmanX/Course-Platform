// Standalone navbar — used only inside LandingLayout.
// External pages should use <LandingLayout> instead of importing this directly.
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, isLoading } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight sm:text-2xl">
          <span className="gradient-text">Waypoint</span>
        </Link>

        {!isLoading && (
          <div className="flex items-center gap-2">
            {user ? (
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button className="bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-white hover:opacity-90">
                  <LayoutDashboard size={14} className="mr-1.5" />
                  <span className="hidden sm:inline">
                    {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </span>
                  <span className="sm:hidden">App</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">Login</Button>
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
