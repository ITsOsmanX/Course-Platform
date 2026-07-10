"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star, Users, Tag, ArrowLeft, BookOpen, Clock,
  ShoppingCart, LogIn, Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { ApiCourse } from "@/types";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CourseCard from "@/components/shared/course-card";
import { toast } from "sonner";

export default function PublicCourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, hasItem } = useCart();

  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [related, setRelated] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/courses/${id}`)
      .then((r) => {
        const c: ApiCourse = r.data;
        setCourse(c);
        // Fetch related courses by same category
        return api.get("/courses", { params: { category: c.category } });
      })
      .then((r) => {
        const others: ApiCourse[] = (r.data.courses ?? []).filter(
          (c: ApiCourse) => c._id !== id
        ).slice(0, 3);
        setRelated(others);
      })
      .catch(() => router.replace("/courses"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to login, preserve return destination
      router.push(`/login?redirect=/courses/${id}`);
      return;
    }
    if (!course) return;
    setCheckingOut(true);
    try {
      const res = await api.post("/payments/checkout", { courseId: course._id });
      window.location.href = res.data.url;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to start checkout.");
      setCheckingOut(false);
    }
  };

  const inCart = course ? hasItem(course._id) : false;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
      </div>
    );
  }

  if (!course) return null;

  const instructorName =
    typeof course.instructor === "object" ? course.instructor.name : "Instructor";

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero banner */}
        <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
          <Image
            src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400"}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={14} /> All Courses
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-3">
            {/* ── Left: detail ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 lg:col-span-2"
            >
              {/* Title */}
              <div>
                <span className="mb-3 inline-block rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium capitalize text-blue-400">
                  {course.category}
                </span>
                <h1 className="text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl">
                  {course.title}
                </h1>
                <p className="mt-2 text-slate-400">by {instructorName}</p>

                <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-400">
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
                    {course.tags.length || "Multiple"} topics
                  </span>
                </div>
              </div>

              {/* About */}
              <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-6">
                <h2 className="mb-3 font-semibold text-white">About this course</h2>
                <p className="leading-7 text-slate-300">{course.description}</p>
              </div>

              {/* What you'll learn */}
              {course.tags.length > 0 && (
                <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-6">
                  <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">
                    <Tag size={16} className="text-blue-400" /> Topics Covered
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

              {/* Course includes */}
              <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-6">
                <h2 className="mb-4 font-semibold text-white">This course includes</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: <BookOpen size={15} />, text: "Full course access" },
                    { icon: <Clock size={15} />, text: "Lifetime access" },
                    { icon: <Star size={15} />, text: "Certificate on completion" },
                    { icon: <Users size={15} />, text: "Community access" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <span className="text-blue-400">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile purchase card — shown below content on small screens */}
              <div className="lg:hidden">
                <PurchaseCard
                  course={course}
                  inCart={inCart}
                  checkingOut={checkingOut}
                  isLoggedIn={!!user}
                  onPurchase={handlePurchase}
                  onAddToCart={() =>
                    addItem({
                      courseId: course._id,
                      title: course.title,
                      price: course.price,
                      imageUrl: course.imageUrl,
                      category: course.category,
                    })
                  }
                />
              </div>
            </motion.div>

            {/* ── Right: sticky purchase card (desktop) ──── */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-6">
                <PurchaseCard
                  course={course}
                  inCart={inCart}
                  checkingOut={checkingOut}
                  isLoggedIn={!!user}
                  onPurchase={handlePurchase}
                  onAddToCart={() =>
                    addItem({
                      courseId: course._id,
                      title: course.title,
                      price: course.price,
                      imageUrl: course.imageUrl,
                      category: course.category,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* ── More courses like this ─────────────────────── */}
          {related.length > 0 && (
            <section className="mt-20 pb-20">
              <h2 className="mb-8 text-xl font-bold text-white sm:text-2xl">
                More courses in{" "}
                <span className="capitalize text-blue-400">{course.category}</span>
              </h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {related.map((c) => (
                  <CourseCard key={c._id} course={c} basePath="/courses" />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Purchase Card ─────────────────────────────────────────────────────────────

function PurchaseCard({
  course,
  inCart,
  checkingOut,
  isLoggedIn,
  onPurchase,
  onAddToCart,
}: {
  course: ApiCourse;
  inCart: boolean;
  checkingOut: boolean;
  isLoggedIn: boolean;
  onPurchase: () => void;
  onAddToCart: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/30">
      {/* Course thumbnail */}
      <div className="relative mb-5 h-40 overflow-hidden rounded-xl">
        <Image
          src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      <p className="text-3xl font-bold text-blue-400">${course.price}</p>

      <ul className="my-5 space-y-2.5 text-sm text-slate-300">
        {[
          { icon: <BookOpen size={14} />, text: "Full course access" },
          { icon: <Clock size={14} />, text: "Lifetime access" },
          { icon: <Star size={14} />, text: "Certificate on completion" },
        ].map((item) => (
          <li key={item.text} className="flex items-center gap-2.5">
            <span className="text-blue-400">{item.icon}</span>
            {item.text}
          </li>
        ))}
      </ul>

      <button
        onClick={onPurchase}
        disabled={checkingOut}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {checkingOut ? (
          <><Loader2 size={16} className="animate-spin" /> Redirecting…</>
        ) : isLoggedIn ? (
          "Purchase Course"
        ) : (
          <><LogIn size={16} /> Sign in to Purchase</>
        )}
      </button>

      {isLoggedIn && (
        <button
          onClick={onAddToCart}
          disabled={inCart}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition ${
            inCart
              ? "cursor-default border-green-500/30 bg-green-600/10 text-green-400"
              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          {inCart ? (
            <><ShoppingCart size={14} /> Added to Cart</>
          ) : (
            <><ShoppingCart size={14} /> Add to Cart</>
          )}
        </button>
      )}

      {!isLoggedIn && (
        <p className="mt-3 text-center text-xs text-slate-500">
          <Link href="/register" className="text-blue-400 hover:underline">Create a free account</Link>
          {" "}to get started
        </p>
      )}
    </div>
  );
}
