"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-24">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="container grid items-center gap-16 lg:grid-cols-2">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Badge className="mb-6 bg-blue-600">
            🚀 New AI Courses Available
          </Badge>

          <h1 className="text-5xl font-black leading-tight md:text-7xl">
            Learn the
            <span className="gradient-text"> skills </span>
            companies actually hire for.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
            Join thousands of learners mastering React, Next.js,
            AI, Backend Development, UI Design, and more through
            project-based learning.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Browse Courses
            </Button>

          </div>

          <div className="mt-12 flex flex-wrap gap-8">

            <div>
              <h3 className="text-3xl font-bold">25K+</h3>
              <p className="text-slate-400">
                Students
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold">350+</h3>
              <p className="text-slate-400">
                Lessons
              </p>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-3xl font-bold">
                4.9
                <Star className="fill-yellow-400 text-yellow-400" />
              </h3>

              <p className="text-slate-400">
                Average Rating
              </p>
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
          <div className="glass overflow-hidden rounded-3xl shadow-2xl">

            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
              alt="Students learning online"
              width={900}
              height={700}
              className="h-auto w-full object-cover"
              priority
            />

          </div>

          <div className="glass absolute -bottom-8 -left-8 rounded-2xl p-6 shadow-xl">
            <p className="text-4xl font-bold text-blue-400">
              +12k
            </p>

            <p className="text-slate-300">
              New Students This Month
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}