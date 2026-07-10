"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-[30rem] w-[30rem] rounded-full bg-sky-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />

      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}

        <div className="mb-10 text-center">

          <Link
            href="/"
            className="inline-block text-4xl font-bold"
          >
            <span className="gradient-text">
              Waypoint
            </span>
          </Link>

          <p className="mt-3 text-sm text-slate-400">
            Modern learning platform for developers & creators.
          </p>

        </div>

        {/* Card */}

        <div className="glass rounded-3xl border border-white/10 p-8 shadow-2xl shadow-blue-950/30">

          {children}

        </div>

      </motion.div>
    </div>
  );
}