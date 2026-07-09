"use client";

import { useMemo, useState } from "react";

import { Search } from "lucide-react";

import { courses } from "@/lib/data";

import CourseCard from "@/components/shared/course-card";
import SectionHeading from "@/components/shared/section-heading";
import AnimatedReveal from "@/components/shared/animated-reveal";

import { Input } from "@/components/ui/input";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const categories = [
  "All",
  "Frontend",
  "Backend",
  "Programming",
  "Design",
  "AI",
];

export default function FeaturedCourses() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        category === "All" ||
        course.category === category;

      const matchesSearch =
        course.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        course.instructor
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <section
      id="courses"
      className="container"
    >
      <SectionHeading
        eyebrow="Featured Courses"
        title="Discover your next skill."
        description="Learn through real-world projects taught by industry professionals."
      />

      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="relative max-w-md w-full">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <Input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search courses..."
            className="pl-10"
          />
        </div>

        <Tabs
          value={category}
          onValueChange={setCategory}
        >
          <TabsList className="flex flex-wrap">
            {categories.map((item) => (
              <TabsTrigger
                key={item}
                value={item}
              >
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course, index) => (
          <AnimatedReveal
            key={course.id}
            delay={index * 0.08}
          >
            <CourseCard course={course} />
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
}