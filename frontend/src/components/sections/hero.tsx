"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="landing-section relative overflow-hidden pb-16 pt-20 sm:pb-24 sm:pt-28">
      {/* Background glow */}
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="container px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="mb-5 bg-blue-600 text-xs sm:text-sm">
              🚀 New AI Courses Available
            </Badge>

            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Learn the
              <span className="gradient-text"> skills </span>
              companies actually hire for.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:mt-8 sm:text-lg sm:leading-8">
              Join thousands of learners mastering React, Next.js, AI, Backend
              Development, and more through project-based learning.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-white hover:opacity-90">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  Browse Courses
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 sm:mt-12 sm:gap-8">
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">25K+</h3>
                <p className="mt-0.5 text-sm text-slate-400 sm:text-base">Students</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">350+</h3>
                <p className="mt-0.5 text-sm text-slate-400 sm:text-base">Lessons</p>
              </div>
              <div>
                <h3 className="flex items-center gap-1.5 text-2xl font-bold sm:text-3xl">
                  4.9
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                </h3>
                <p className="mt-0.5 text-sm text-slate-400 sm:text-base">Avg. Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass overflow-hidden rounded-2xl shadow-2xl sm:rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
                alt="Students learning online"
                width={900}
                height={600}
                className="h-auto w-full object-cover"
                priority
              />
            </div>

            <div className="glass absolute -bottom-5 -left-4 rounded-xl p-4 shadow-xl sm:-bottom-8 sm:-left-8 sm:rounded-2xl sm:p-6">
              <p className="text-2xl font-bold text-blue-400 sm:text-4xl">+12k</p>
              <p className="text-xs text-slate-300 sm:text-base">New Students This Month</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
