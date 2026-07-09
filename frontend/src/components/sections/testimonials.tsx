"use client";

import { Star } from "lucide-react";

import { testimonials } from "@/lib/data";

import AnimatedReveal from "@/components/shared/animated-reveal";
import SectionHeading from "@/components/shared/section-heading";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="container"
    >
      <SectionHeading
        eyebrow="Testimonials"
        title="Loved by thousands of learners."
        description="Our students have gone on to land jobs, launch products, and grow their careers."
      />

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((person, index) => (
          <AnimatedReveal
            key={person.id}
            delay={index * 0.1}
          >
            <Card className="h-full rounded-3xl border-white/10 bg-slate-900/60">
              <CardContent className="flex h-full flex-col p-8">

                <div className="mb-6 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="fill-yellow-400 text-yellow-400"
                      size={18}
                    />
                  ))}
                </div>

                <p className="flex-1 text-slate-300 leading-7">
                  "{person.quote}"
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={person.image}
                      alt={person.name}
                    />
                    <AvatarFallback>
                      {person.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h4 className="font-semibold">
                      {person.name}
                    </h4>

                    <p className="text-sm text-slate-400">
                      {person.role}
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
}