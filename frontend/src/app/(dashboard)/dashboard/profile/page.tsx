'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import type { UserProfile } from '@/types';
import { User, Mail, ShieldCheck, Calendar, BookOpen, Pencil } from 'lucide-react';

export default function ViewProfilePage() {
  useSetPageTitle('Profile');
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
      </div>
    );
  }

  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const initials = (profile?.name ?? user?.name ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Profile card */}
      <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-2xl font-bold text-white shadow-lg">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">{profile?.name ?? user?.name}</h2>
            <p className="mt-1 text-sm capitalize text-slate-400">{profile?.role ?? user?.role}</p>
          </div>

          {/* Edit button */}
          <Link
            href="/dashboard/profile/edit"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <Pencil size={14} /> Edit Profile
          </Link>
        </div>

        {/* Details list */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InfoRow icon={<User size={15} />} label="Full Name" value={profile?.name ?? '—'} />
          <InfoRow icon={<Mail size={15} />} label="Email Address" value={profile?.email ?? '—'} />
          <InfoRow
            icon={<ShieldCheck size={15} />}
            label="Role"
            value={<span className="capitalize">{profile?.role ?? '—'}</span>}
          />
          <InfoRow icon={<Calendar size={15} />} label="Member Since" value={joinDate} />
          <InfoRow
            icon={<BookOpen size={15} />}
            label="Courses Purchased"
            value={String(profile?.purchaseHistory?.length ?? 0)}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/3 px-4 py-3">
      <span className="mt-0.5 text-blue-400">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}
