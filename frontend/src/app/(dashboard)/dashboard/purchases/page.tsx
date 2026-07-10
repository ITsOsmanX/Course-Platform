'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import api from '@/lib/api';
import type { UserProfile } from '@/types';
import { BookOpen, ArrowRight, ExternalLink } from 'lucide-react';

export default function PurchasesPage() {
  useSetPageTitle('Purchase History');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/users/profile')
      .then((r) => setProfile(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const purchases = profile?.purchaseHistory ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {loading ? '…' : `${purchases.length} course${purchases.length !== 1 ? 's' : ''} purchased`}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-800/60" />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookOpen size={44} className="mb-4 text-slate-600" />
          <h3 className="text-lg font-semibold text-white">No purchases yet</h3>
          <p className="mt-2 text-sm text-slate-400">
            Enroll in a course to see it here.
          </p>
          <Link
            href="/dashboard/courses"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Browse Courses <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map((course) => (
            <div
              key={course._id}
              className="overflow-hidden rounded-2xl border border-white/8 bg-slate-900/70 transition hover:-translate-y-0.5"
            >
              <div className="relative h-40">
                <Image
                  src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-green-600/90 px-2.5 py-0.5 text-[11px] font-medium text-white">
                  Enrolled
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white line-clamp-2">{course.title}</h3>
                <p className="mt-1 text-xs capitalize text-slate-500">{course.category}</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-400">${course.price}</span>
                  <Link
                    href={`/dashboard/courses/${course._id}`}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Open <ExternalLink size={11} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
