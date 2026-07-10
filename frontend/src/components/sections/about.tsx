"use client";

import {
  Award,
  BookOpen,
  GraduationCap,
  Laptop,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import AnimatedReveal from "@/components/shared/animated-reveal";
import SectionHeading from "@/components/shared/section-heading";

const features = [
  {
    title: "Industry Experts",
    description:
      "Learn from engineers and designers working at top companies.",
    icon: GraduationCap,
  },
  {
    title: "Project Based",
    description:
      "Build real-world applications instead of watching endless videos.",
    icon: Laptop,
  },
  {
    title: "Certificates",
    description:
      "Earn verified certificates for every completed course.",
    icon: Award,
  },
  {
    title: "350+ Lessons",
    description:
      "A growing library covering modern technologies.",
    icon: BookOpen,
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="landing-section container px-4 sm:px-6"
    >
      <SectionHeading
        eyebrow="Why Waypoint"
        title="Learning built for the modern developer."
        description="Every course is designed around practical projects, expert mentorship, and real-world skills that employers value."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <AnimatedReveal
              key={feature.title}
              delay={index * 0.1}
            >
              <Card className="glass hover-card h-full rounded-3xl border-white/10">
                <CardContent className="p-5 sm:p-8">

                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/15">
                    <Icon className="h-7 w-7 text-blue-400" />
                  </div>

                  <h3 className="mb-3 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="leading-7 text-slate-400">
                    {feature.description}
                  </p>

                </CardContent>
              </Card>
            </AnimatedReveal>
          );
        })}

      </div>

      <AnimatedReveal delay={0.4}>
        <div className="glass mt-16 rounded-2xl p-8 sm:mt-20 sm:rounded-3xl sm:p-12">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <h2 className="text-3xl font-bold text-blue-400 sm:text-4xl">25K+</h2>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">Active Students</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-400 sm:text-4xl">350+</h2>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">Video Lessons</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-400 sm:text-4xl">50+</h2>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">Expert Mentors</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-400 sm:text-4xl">98%</h2>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">Satisfaction</p>
            </div>
          </div>
        </div>
      </AnimatedReveal>
    </section>
  );
}