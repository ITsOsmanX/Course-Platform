"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">Waypoint</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button className="bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-white hover:opacity-90">
              Register Free
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}