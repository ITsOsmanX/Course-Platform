'use client';

import { useEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import api from '@/lib/api';
import type { Transaction } from '@/types';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-600/15 text-green-400',
  pending:   'bg-amber-600/15  text-amber-400',
  failed:    'bg-red-600/15    text-red-400',
  refunded:  'bg-slate-600/40  text-slate-400',
};

export default function AdminTransactionsPage() {
  useSetPageTitle('Transactions');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    // Reuse the same admin endpoint used for user management; fetch all transactions
    // via the export endpoint as JSON isn't available — instead use a dedicated fetch
    // The backend only exposes CSV export, so we list transactions from the export parsed
    // as text. For the table we use the Stripe webhook-populated Transaction collection.
    // Since no paginated JSON endpoint exists for transactions, we show what the CSV
    // export returns by triggering a fetch to the export route and parsing it.
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // The CSV export endpoint returns raw CSV — parse it client-side for the table
      const res = await api.get('/admin/transactions/export', {
        responseType: 'text',
      });
      const rows = parseCSV(res.data as string);
      setTransactions(rows as any);
    } catch {
      // If CSV parsing fails or endpoint is unavailable, show empty state
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/admin/transactions/export', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? '…' : `${transactions.length} transactions`}
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          {exporting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left text-xs text-slate-500">
                <th className="px-5 py-4 font-medium">Transaction ID</th>
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Course</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Currency</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 animate-pulse rounded bg-slate-800" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                (transactions as any[]).map((tx: any, i: number) => (
                  <tr key={i} className="border-b border-white/5 transition hover:bg-white/2">
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-500">
                      {tx.id?.slice(-8) ?? '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-white">{tx.userName ?? '—'}</p>
                        <p className="text-[11px] text-slate-500">{tx.userEmail ?? ''}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{tx.courseTitle ?? '—'}</td>
                    <td className="px-5 py-4 font-semibold text-white">${tx.amount ?? '—'}</td>
                    <td className="px-5 py-4 uppercase text-slate-400">{tx.currency ?? '—'}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                          STATUS_COLORS[tx.status?.toLowerCase()] ?? STATUS_COLORS.pending
                        }`}
                      >
                        {tx.status ?? 'pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {tx.date ? new Date(tx.date).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── CSV parser ───────────────────────────────────────────────────────────────
// Parses the CSV returned by GET /admin/transactions/export
// Header: Transaction ID,User Name,User Email,Course Title,Amount,Currency,Status,Created At
function parseCSV(csv: string): object[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  // Skip header row
  return lines.slice(1).map((line) => {
    // Handle quoted fields
    const cols: string[] = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) {
        cols.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur.trim());

    return {
      id:          cols[0] ?? '',
      userName:    cols[1] ?? '',
      userEmail:   cols[2] ?? '',
      courseTitle: cols[3] ?? '',
      amount:      cols[4] ?? '',
      currency:    cols[5] ?? '',
      status:      cols[6] ?? '',
      date:        cols[7] ?? '',
    };
  });
}
