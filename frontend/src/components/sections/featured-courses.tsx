"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import api from "@/lib/api";
import type { ApiCourse } from "@/types";
import CourseCard from "@/components/shared/course-card";
import SectionHeading from "@/components/shared/section-heading";
import AnimatedReveal from "@/components/shared/animated-reveal";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/courses", { params: { sort: "rating" } })
      .then((r) => setCourses((r.data.courses ?? []).slice(0, 6)))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="courses" className="landing-section container px-4 sm:px-6">
      <SectionHeading
        eyebrow="Featured Courses"
        title="Discover your next skill."
        description="Learn through real-world projects taught by industry professionals."
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl bg-slate-800/50" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <p className="text-lg font-semibold text-white">No courses yet</p>
          <p className="mt-2 text-sm">Check back soon — new courses are being added.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, index) => (
              <AnimatedReveal key={course._id} delay={index * 0.07}>
                <CourseCard course={course} basePath="/courses" />
              </AnimatedReveal>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/courses"
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Browse All Courses <ArrowRight size={15} />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
