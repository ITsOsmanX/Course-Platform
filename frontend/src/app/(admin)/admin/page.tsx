'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, BookOpen, DollarSign, ShoppingBag, MessageSquare, TrendingUp } from 'lucide-react';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import api from '@/lib/api';
import type { AdminStats } from '@/types';

export default function AdminDashboardPage() {
  useSetPageTitle('Dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats?.metrics;
  const charts = stats?.charts;

  return (
    <div className="space-y-8">
      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={<Users size={20} />}
          label="Total Students"
          value={loading ? '…' : (metrics?.totalUsers ?? 0).toLocaleString()}
          color="blue"
        />
        <MetricCard
          icon={<BookOpen size={20} />}
          label="Total Courses"
          value={loading ? '…' : (metrics?.totalCourses ?? 0).toLocaleString()}
          color="violet"
        />
        <MetricCard
          icon={<DollarSign size={20} />}
          label="Total Revenue"
          value={loading ? '…' : `$${(metrics?.totalRevenue ?? 0).toLocaleString()}`}
          color="green"
        />
        <MetricCard
          icon={<ShoppingBag size={20} />}
          label="Total Sales"
          value={loading ? '…' : (metrics?.totalSales ?? 0).toLocaleString()}
          color="amber"
        />
        <MetricCard
          icon={<MessageSquare size={20} />}
          label="Contact Messages"
          value={loading ? '…' : (metrics?.totalMessages ?? 0).toLocaleString()}
          color="sky"
        />
        <MetricCard
          icon={<TrendingUp size={20} />}
          label="Avg. Revenue / Sale"
          value={
            loading
              ? '…'
              : metrics?.totalSales
              ? `$${((metrics.totalRevenue ?? 0) / metrics.totalSales).toFixed(2)}`
              : '$0'
          }
          color="pink"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Monthly Revenue & Sales */}
        <ChartCard title="Monthly Revenue & Sales">
          {loading ? (
            <Skeleton />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={charts?.monthlyRevenue ?? []} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sales" name="Sales" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* User Growth */}
        <ChartCard title="User Growth">
          {loading ? (
            <Skeleton />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={charts?.userGrowth ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line
                  type="monotone"
                  dataKey="students"
                  name="New Students"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ fill: '#38bdf8', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const colorMap: Record<string, string> = {
  blue:   'border-blue-500/20   bg-blue-500/5   text-blue-400',
  violet: 'border-violet-500/20 bg-violet-500/5 text-violet-400',
  green:  'border-green-500/20  bg-green-500/5  text-green-400',
  amber:  'border-amber-500/20  bg-amber-500/5  text-amber-400',
  sky:    'border-sky-500/20    bg-sky-500/5    text-sky-400',
  pink:   'border-pink-500/20   bg-pink-500/5   text-pink-400',
};

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const cls = colorMap[color] ?? colorMap.blue;
  const [border, bg, text] = cls.split(' ');
  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-5 ${border} ${bg}`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ${text}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-6">
      <h3 className="mb-5 font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

function Skeleton() {
  return <div className="h-60 animate-pulse rounded-xl bg-slate-800/60" />;
}
