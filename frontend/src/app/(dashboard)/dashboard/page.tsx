'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import api from '@/lib/api';
import type { UserProfile } from '@/types';
import { BookOpen, ShoppingBag, ArrowRight, Star } from 'lucide-react';

export default function DashboardPage() {
  useSetPageTitle('Dashboard');
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/users/profile')
      .then((r) => setProfile(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const purchased = profile?.purchaseHistory ?? [];
  const greeting = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-2xl border border-white/8 bg-gradient-to-r from-blue-600/20 via-violet-600/10 to-transparent p-6">
        <h2 className="text-2xl font-bold text-white">
          Welcome back, {greeting} 👋
        </h2>
        <p className="mt-1 text-slate-400">
          Pick up where you left off or explore new courses.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={<BookOpen size={20} className="text-blue-400" />}
          label="Purchased Courses"
          value={loading ? '—' : String(purchased.length)}
          color="blue"
        />
        <StatCard
          icon={<ShoppingBag size={20} className="text-violet-400" />}
          label="Completed Courses"
          value="0"
          color="violet"
          note="Coming soon"
        />
      </div>

      {/* Continue Learning */}
      {!loading && purchased.length > 0 && (
        <section>
          <SectionHeader title="Continue Learning" href="/dashboard/purchases" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {purchased.slice(0, 3).map((course) => (
              <PurchasedCourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!loading && purchased.length === 0 && (
        <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-10 text-center">
          <BookOpen size={40} className="mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-semibold text-white">No courses yet</h3>
          <p className="mt-2 text-sm text-slate-400">
            Browse the catalog and enroll in your first course.
          </p>
          <Link
            href="/dashboard/courses"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Browse Courses <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-800/60" />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'violet';
  note?: string;
}) {
  const ring = color === 'blue' ? 'border-blue-500/20 bg-blue-500/5' : 'border-violet-500/20 bg-violet-500/5';
  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-5 ${ring}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {note && <p className="text-xs text-slate-600">{note}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm text-blue-400 transition hover:text-blue-300"
      >
        View all <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function PurchasedCourseCard({ course }: { course: { _id: string; title: string; category: string; price: number; imageUrl: string } }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-slate-900/70 transition hover:-translate-y-1">
      <div className="relative h-36 w-full">
        <Image
          src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
          alt={course.title}
          fill
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-blue-600/90 px-2.5 py-0.5 text-xs font-medium capitalize text-white">
          {course.category}
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-white line-clamp-2">{course.title}</h4>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-blue-400">${course.price}</span>
          <div className="flex items-center gap-1 text-xs text-yellow-400">
            <Star size={12} className="fill-yellow-400" />
            Enrolled
          </div>
        </div>
      </div>
    </div>
  );
}
