'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  // Stripe cancel_url includes the course id so we can link back
  // e.g. /payments/cancel?courseId=abc — but the backend sets cancel_url to /courses/:id?payment=cancelled
  // so we just offer generic navigation here
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-10 text-center shadow-2xl shadow-black/40"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-600/15">
          <XCircle size={40} className="text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white">Payment Cancelled</h1>
        <p className="mt-3 text-slate-400">
          No charge was made. You can return to the course and try again whenever you're ready.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard/courses"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            Browse Courses
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-6 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
