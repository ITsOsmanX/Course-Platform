'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Loader2, X, BookOpen, Star } from 'lucide-react';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import api from '@/lib/api';
import type { ApiCourse } from '@/types';
import { toast } from 'sonner';

const CATEGORIES = ['development', 'design', 'programming', 'ai', 'backend', 'frontend'];

interface CourseForm {
  title: string;
  description: string;
  category: string;
  price: string;
  imageUrl: string;
  tags: string;
  videoUrl: string;
}

const EMPTY_FORM: CourseForm = {
  title: '',
  description: '',
  category: 'development',
  price: '',
  imageUrl: '',
  tags: '',
  videoUrl: '',
};

export default function AdminCoursesPage() {
  useSetPageTitle('Courses');

  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CourseForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiCourse | null>(null);
  const [deleting, setDeleting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const fetchCourses = () => {
    setLoading(true);
    api
      .get('/admin/courses')
      .then((r) => setCourses(r.data.courses ?? []))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);
  useEffect(() => { if (showForm) titleRef.current?.focus(); }, [showForm]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.price) {
      toast.error('Title, description and price are required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/courses', {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl.trim() || undefined,
        tags: form.tags,
        videoUrl: form.videoUrl.trim() || undefined,
      });
      toast.success('Course created!');
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchCourses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to create course.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/courses/${deleteTarget._id}`);
      toast.success('Course deleted');
      setDeleteTarget(null);
      fetchCourses();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFeatured = async (course: ApiCourse) => {
    try {
      await api.patch(`/admin/courses/${course._id}/featured`);
      toast.success(`Course ${course.isFeatured ? 'unfeatured' : 'featured'} successfully`);
      fetchCourses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update featured status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {loading ? '…' : `${courses.length} course${courses.length !== 1 ? 's' : ''}`}
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400"
        >
          <Plus size={15} /> New Course
        </button>
      </div>

      {/* Course grid */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-800/60" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookOpen size={44} className="mb-4 text-slate-600" />
          <h3 className="text-lg font-semibold text-white">No courses yet</h3>
          <p className="mt-2 text-sm text-slate-500">Create your first course to get started.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseAdminCard
              key={course._id}
              course={course}
              onDelete={() => setDeleteTarget(course)}
              onToggleFeatured={() => handleToggleFeatured(course)}
            />
          ))}
        </div>
      )}

      {/* Create course panel */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-white/10 bg-slate-900 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
              <h2 className="font-semibold text-white">New Course</h2>
              <button
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate} className="flex flex-1 flex-col gap-5 p-6">
              <Field label="Course Title *">
                <input
                  ref={titleRef}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Full-Stack Next.js Masterclass"
                  className={inputCls}
                  required
                />
              </Field>

              <Field label="Description *">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What will students learn in this course?"
                  rows={4}
                  className={inputCls + ' resize-none'}
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category *">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputCls}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Price (USD) *">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="49"
                    className={inputCls}
                    required
                  />
                </Field>
              </div>

              <Field label="Image URL" hint="Paste a direct image URL (Unsplash, etc.)">
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/…"
                  className={inputCls}
                />
              </Field>

              {/* Image preview */}
              {form.imageUrl && (
                <div className="relative h-36 overflow-hidden rounded-xl">
                  <Image
                    src={form.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => {}}
                  />
                </div>
              )}

              <Field label="Tags" hint="Comma-separated — e.g. react, typescript, nextjs">
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="react, nextjs, typescript"
                  className={inputCls}
                />
              </Field>

              <Field label="Video URL" hint="YouTube link for course preview">
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={inputCls}
                />
              </Field>

              <div className="mt-auto flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-slate-400 transition hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:opacity-60"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {saving ? 'Creating…' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Delete Course?</h3>
            <p className="mt-2 text-sm text-slate-400">
              Permanently delete{' '}
              <span className="font-semibold text-white">"{deleteTarget.title}"</span>?
              This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {deleting && <Loader2 size={13} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20';

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-300">{label}</label>
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
      {children}
    </div>
  );
}

function CourseAdminCard({
  course,
  onDelete,
  onToggleFeatured,
}: {
  course: ApiCourse;
  onDelete: () => void;
  onToggleFeatured: () => void;
}) {
  const instructorName =
    typeof course.instructor === 'object' ? course.instructor.name : 'Admin';

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/8 bg-slate-900/70 transition hover:-translate-y-0.5">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={
            course.imageUrl ||
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'
          }
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-medium capitalize text-black">
          {course.category}
        </span>
        {course.isFeatured && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400/90 px-2.5 py-0.5 text-[11px] font-medium text-black">
            <Star size={10} fill="currentColor" /> Featured
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white line-clamp-2">{course.title}</h3>
        <p className="mt-1 text-xs text-slate-500">by {instructorName}</p>
        <p className="mt-2 text-xs text-slate-500 line-clamp-2">{course.description}</p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-amber-400">${course.price}</span>
          <div className="flex gap-2">
            <button
              onClick={onToggleFeatured}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition ${
                course.isFeatured
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                  : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
              title={course.isFeatured ? 'Unfeature course' : 'Feature course'}
            >
              <Star size={12} fill={course.isFeatured ? 'currentColor' : 'none'} />
              {course.isFeatured ? 'Unfeature' : 'Feature'}
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
