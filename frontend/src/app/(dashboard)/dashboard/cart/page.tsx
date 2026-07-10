'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function CartPage() {
  useSetPageTitle('Cart');
  const { items, removeItem, total } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null); // courseId being checked out

  // Single-course checkout
  const handleCheckout = async (courseId: string) => {
    if (!user) {
      window.location.href = '/login?redirect=/dashboard/cart';
      return;
    }
    setLoading(courseId);
    try {
      const res = await api.post('/payments/checkout', { courseId });
      window.location.href = res.data.url;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Checkout failed. Please try again.');
      setLoading(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <ShoppingCart size={48} className="mb-4 text-slate-600" />
        <h2 className="text-xl font-semibold text-white">Your cart is empty</h2>
        <p className="mt-2 text-sm text-slate-400">Add courses from the catalog to get started.</p>
        <Link
          href="/dashboard/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Browse Courses <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart items */}
      <div className="space-y-4 lg:col-span-2">
        <h2 className="text-lg font-semibold text-white">
          {items.length} item{items.length !== 1 ? 's' : ''} in your cart
        </h2>

        {items.map((item) => (
          <div
            key={item.courseId}
            className="flex gap-4 rounded-2xl border border-white/8 bg-slate-900/70 p-4"
          >
            {/* Thumbnail */}
            <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl">
              <Image
                src={item.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="font-semibold text-white line-clamp-2 leading-snug">{item.title}</p>
                <span className="mt-1 inline-block rounded-full bg-blue-600/15 px-2 py-0.5 text-[11px] capitalize text-blue-400">
                  {item.category}
                </span>
              </div>
              <p className="text-lg font-bold text-blue-400">${item.price}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end justify-between gap-3">
              <button
                onClick={() => removeItem(item.courseId)}
                aria-label="Remove from cart"
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => handleCheckout(item.courseId)}
                disabled={loading === item.courseId}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
              >
                {loading === item.courseId ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <ArrowRight size={12} />
                )}
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 rounded-2xl border border-white/10 bg-slate-900 p-6">
          <h3 className="mb-4 font-semibold text-white">Order Summary</h3>

          <div className="space-y-2.5 text-sm">
            {items.map((item) => (
              <div key={item.courseId} className="flex justify-between text-slate-400">
                <span className="line-clamp-1 flex-1 pr-2">{item.title}</span>
                <span className="flex-shrink-0 font-medium text-white">${item.price}</span>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-white/8" />

          <div className="flex justify-between text-base font-semibold text-white">
            <span>Total</span>
            <span className="text-blue-400">${total}</span>
          </div>

          <p className="mt-3 text-center text-xs text-slate-500">
            Each course is purchased individually via Stripe.
          </p>

          <Link
            href="/dashboard/courses"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
