'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, Users, SlidersHorizontal, ShoppingCart, Check } from 'lucide-react';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import type { ApiCourse } from '@/types';

const CATEGORIES = ['All', 'development', 'design', 'programming', 'ai', 'backend', 'frontend'];
const SORTS = [
  { label: 'Newest', value: '' },
  { label: 'Price: Low → High', value: 'price-low' },
  { label: 'Price: High → Low', value: 'price-high' },
  { label: 'Top Rated', value: 'rating' },
];

export default function BrowseCoursesPage() {
  useSetPageTitle('Browse Courses');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const [searchInput, setSearchInput] = useState(search);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  // Debounce search → URL param
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam('search', searchInput), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput, updateParam]);

  // Fetch on param change
  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;

    api
      .get('/courses', { params })
      .then((r) => setCourses(r.data.courses ?? []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  return (
    <div className="space-y-5">
      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="appearance-none rounded-xl border border-white/10 bg-slate-900 py-2.5 pl-8 pr-6 text-sm text-slate-300 focus:border-blue-500/50 focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = cat === 'All' ? !category : category === cat;
          return (
            <button
              key={cat}
              onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'border border-white/10 bg-slate-900 text-slate-400 hover:border-blue-500/40 hover:text-white'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-800/60" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold text-white">No courses found</p>
          <p className="mt-2 text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-500">{courses.length} course{courses.length !== 1 ? 's' : ''} found</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => <CourseCard key={c._id} course={c} />)}
          </div>
        </>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: ApiCourse }) {
  const { addItem, hasItem } = useCart();
  const inCart = hasItem(course._id);
  const instructorName = typeof course.instructor === 'object' ? course.instructor.name : 'Instructor';

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/8 bg-slate-900/70 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-900/20">
      <Link href={`/dashboard/courses/${course._id}`}>
        <div className="relative h-44 overflow-hidden">
          <Image
            src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-blue-600/90 px-2.5 py-0.5 text-[11px] font-medium capitalize text-white">
            {course.category}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/dashboard/courses/${course._id}`}>
          <h3 className="font-semibold text-white line-clamp-2 leading-snug hover:text-blue-300 transition-colors">
            {course.title}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-slate-500">by {instructorName}</p>

        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            {course.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {course.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-400">${course.price}</span>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/courses/${course._id}`}
              className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Details
            </Link>
            <button
              onClick={() => addItem({ courseId: course._id, title: course.title, price: course.price, imageUrl: course.imageUrl, category: course.category })}
              disabled={inCart}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                inCart
                  ? 'bg-green-600/20 text-green-400 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              {inCart ? <><Check size={12} /> Added</> : <><ShoppingCart size={12} /> Add to Cart</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
