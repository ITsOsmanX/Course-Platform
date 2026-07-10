"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import type { ApiCourse } from "@/types";
import CourseCard from "@/components/shared/course-card";
import LandingLayout from "@/components/layout/landing-layout";
import Footer from "@/components/layout/footer";

const CATEGORIES = ["All", "development", "design", "programming", "ai", "backend", "frontend"];
const SORTS = [
  { label: "Newest", value: "" },
  { label: "Price: Low → High", value: "price-low" },
  { label: "Price: High → Low", value: "price-high" },
  { label: "Top Rated", value: "rating" },
];

export default function PublicCoursesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "";

  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", searchInput), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput, updateParam]);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    api
      .get("/courses", { params })
      .then((r) => setCourses(r.data.courses ?? []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  return (
    <LandingLayout>
      <main className="flex-1 px-4 py-12 sm:px-6">
        <div className="container mx-auto space-y-8">
          {/* Header */}
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Browse Courses</h1>
            <p className="mt-2 text-slate-400">Find the course that fits your goals.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="appearance-none rounded-xl border border-white/10 bg-slate-900 py-2.5 pl-8 pr-6 text-sm text-slate-300 focus:outline-none"
              >
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = cat === "All" ? !category : category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => updateParam("category", cat === "All" ? "" : cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "border border-white/10 bg-slate-900 text-slate-400 hover:border-blue-500/40 hover:text-white"
                  }`}
                >
                  {cat === "All" ? "All Categories" : cat}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-3xl bg-slate-800/50" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-white">No courses found</p>
              <p className="mt-2 text-sm text-slate-400">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500">{courses.length} course{courses.length !== 1 ? "s" : ""} found</p>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((c) => <CourseCard key={c._id} course={c} basePath="/courses" />)}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </LandingLayout>
  );
}
