'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import api from '@/lib/api';
import type { ContactMessage } from '@/types';
import { toast } from 'sonner';

export default function AdminMessagesPage() {
  useSetPageTitle('Messages');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'replied' | 'pending'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const toggleReply = async (msg: ContactMessage) => {
    setActionId(msg._id);
    try {
      await api.patch(`/admin/messages/${msg._id}/reply`);
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, isReplied: !m.isReplied } : m))
      );
      toast.success(msg.isReplied ? 'Marked as pending' : 'Marked as replied');
    } catch {
      toast.error('Action failed');
    } finally {
      setActionId(null);
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === 'replied') return m.isReplied;
    if (filter === 'pending') return !m.isReplied;
    return true;
  });

  const repliedCount = messages.filter((m) => m.isReplied).length;
  const pendingCount = messages.filter((m) => !m.isReplied).length;

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'All', value: 'all', count: messages.length },
          { label: 'Pending', value: 'pending', count: pendingCount },
          { label: 'Replied', value: 'replied', count: repliedCount },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as typeof filter)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
              filter === tab.value
                ? 'border-blue-500/40 bg-blue-600/15 text-blue-400'
                : 'border-white/10 bg-slate-900 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                filter === tab.value ? 'bg-blue-600/30 text-blue-300' : 'bg-white/10 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Message list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-800/60" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare size={40} className="mb-4 text-slate-600" />
          <p className="font-semibold text-white">No messages</p>
          <p className="mt-1 text-sm text-slate-500">
            {filter !== 'all' ? 'Try switching the filter above.' : 'Contact submissions will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg._id}
              className={`rounded-2xl border p-5 transition ${
                msg.isReplied
                  ? 'border-white/5 bg-slate-900/40 opacity-70'
                  : 'border-white/8 bg-slate-900/70'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: sender info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-sm font-bold text-white">
                    {msg.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">{msg.name}</p>
                      {msg.isReplied && (
                        <span className="rounded-full bg-green-600/15 px-2 py-0.5 text-[10px] font-medium text-green-400">
                          Replied
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{msg.email}</p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Right: toggle reply */}
                <button
                  onClick={() => toggleReply(msg)}
                  disabled={actionId === msg._id}
                  title={msg.isReplied ? 'Mark as pending' : 'Mark as replied'}
                  className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                    msg.isReplied
                      ? 'border-green-500/30 bg-green-600/10 text-green-400 hover:bg-green-600/20'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-blue-500/30 hover:text-white'
                  } disabled:opacity-50`}
                >
                  {actionId === msg._id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : msg.isReplied ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <Circle size={12} />
                  )}
                  {msg.isReplied ? 'Replied' : 'Mark Replied'}
                </button>
              </div>

              {/* Message body */}
              <p className="mt-4 rounded-xl bg-white/3 px-4 py-3 text-sm leading-relaxed text-slate-300">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
