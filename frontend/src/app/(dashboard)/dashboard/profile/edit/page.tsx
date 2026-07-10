'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import api from '@/lib/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const editSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    { message: "Passwords don't match", path: ['confirmPassword'] }
  )
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password.length >= 6;
      }
      return true;
    },
    { message: 'Password must be at least 6 characters', path: ['password'] }
  );

type EditValues = z.infer<typeof editSchema>;

export default function EditProfilePage() {
  useSetPageTitle('Edit Profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  // Pre-fill from API
  useEffect(() => {
    api
      .get('/users/profile')
      .then((r) => {
        form.reset({ name: r.data.name, email: r.data.email, password: '', confirmPassword: '' });
      })
      .catch(() => toast.error('Failed to load profile data'))
      .finally(() => setLoading(false));
  }, [form]);

  const onSubmit = async (values: EditValues) => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        name: values.name,
        email: values.email,
      };
      // Only send password if the user filled it in
      if (values.password && values.password.length > 0) {
        payload.password = values.password;
      }

      await api.put('/users/profile', payload);
      toast.success('Profile updated successfully!');
      form.reset({ ...values, password: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link
        href="/dashboard/profile"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={14} /> Back to Profile
      </Link>

      <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-8">
        <h2 className="mb-6 text-xl font-bold text-white">Edit Profile</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t border-white/8 pt-4">
              <p className="mb-4 text-xs text-slate-500">
                Leave password fields blank to keep your current password.
              </p>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel className="text-slate-300">Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="mt-2 flex w-full items-center gap-2 bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-white hover:opacity-90 disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
