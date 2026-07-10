'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, Tag, ArrowLeft, ShoppingCart, Check, Loader2, BookOpen, Clock } from 'lucide-react';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import type { ApiCourse } from '@/types';
import { toast } from 'sonner';

export default function CourseDetailPage() {
  useSetPageTitle('Course Details');
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, hasItem } = useCart();

  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/courses/${id}`)
      .then((r) => setCourse(r.data))
      .catch(() => router.replace('/dashboard/courses'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleBuyNow = async () => {
    if (!user) {
      router.push(`/login?redirect=/dashboard/courses/${id}`);
      return;
    }
    if (!course) return;
    setCheckingOut(true);
    try {
      const res = await api.post('/payments/checkout', { courseId: course._id });
      window.location.href = res.data.url;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to start checkout. Please try again.');
      setCheckingOut(false);
    }
  };

  const inCart = course ? hasItem(course._id) : false;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
      </div>
    );
  }

  if (!course) return null;

  const instructorName = typeof course.instructor === 'object' ? course.instructor.name : 'Instructor';

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={15} /> Back to Courses
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left — course info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Hero image */}
          <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80">
            <Image
              src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900'}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium capitalize text-white">
              {course.category}
            </span>
          </div>

          {/* Title & meta */}
          <div>
            <h1 className="text-2xl font-bold leading-snug text-white sm:text-3xl">{course.title}</h1>
            <p className="mt-2 text-sm text-slate-400">by {instructorName}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {course.rating.toFixed(1)} rating
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {course.reviewCount.toLocaleString()} reviews
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} />
                {course.tags.length} modules
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-6">
            <h2 className="mb-3 font-semibold text-white">About this course</h2>
            <p className="leading-relaxed text-slate-300">{course.description}</p>
          </div>

          {/* Tags */}
          {course.tags.length > 0 && (
            <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-6">
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
                <Tag size={16} /> Topics Covered
              </h2>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-blue-500/30 bg-blue-600/10 px-3 py-1 text-xs capitalize text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — sticky purchase card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/30">
            <p className="text-3xl font-bold text-blue-400">${course.price}</p>

            <ul className="my-5 space-y-2.5 text-sm text-slate-300">
              {[
                { icon: <BookOpen size={14} />, text: 'Full course access' },
                { icon: <Clock size={14} />, text: 'Lifetime access' },
                { icon: <Star size={14} />, text: 'Certificate on completion' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2.5">
                  <span className="text-blue-400">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>

            <button
              onClick={handleBuyNow}
              disabled={checkingOut}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkingOut ? (
                <><Loader2 size={16} className="animate-spin" /> Redirecting to Stripe…</>
              ) : (
                'Purchase Course'
              )}
            </button>

            <button
              onClick={() =>
                !inCart &&
                addItem({
                  courseId: course._id,
                  title: course.title,
                  price: course.price,
                  imageUrl: course.imageUrl,
                  category: course.category,
                })
              }
              disabled={inCart}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition ${
                inCart
                  ? 'border-green-500/30 bg-green-600/10 text-green-400 cursor-default'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {inCart ? <><Check size={14} /> In Cart</> : <><ShoppingCart size={14} /> Add to Cart</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
