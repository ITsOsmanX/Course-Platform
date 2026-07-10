'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-10 text-center shadow-2xl shadow-black/40"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-600/15">
          <CheckCircle size={40} className="text-green-400" />
        </div>

        <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
        <p className="mt-3 text-slate-400">
          Your course has been added to your account. You can access it from your dashboard.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard/purchases"
            className="rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            View My Courses
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-6 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
