'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 px-4 py-12 antialiased selection:bg-neutral-800">
      {/* Decorative Dark Glassmorphism Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-500/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-amber-500/10 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        {/* Branding */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-white hover:opacity-90">
            Waypoint<span className="text-amber-500">Academy</span>
          </Link>
        </div>

        {/* Form Container Card */}
        <div className="rounded-2xl border border-white/5 bg-neutral-900/40 p-8 backdrop-blur-xl shadow-2xl shadow-black/50">
          {children}
        </div>
      </motion.div>
    </div>
  );
}