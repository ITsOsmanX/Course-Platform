'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetValues) => {
    setIsSubmitting(true);
    try {
      const rawToken = params.token;
      await api.post(`/auth/reset-password/${rawToken}`, { password: values.password });
      toast.success('Password updated successfully! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Token is invalid or has expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-white">Create New Password</h1>
        <p className="text-sm text-neutral-400">Please enter a secure password sequence</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-300">New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="bg-neutral-950 border-neutral-800 text-white focus-visible:ring-amber-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-300">Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="bg-neutral-950 border-neutral-800 text-white focus-visible:ring-amber-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 text-neutral-950 hover:bg-amber-400 font-medium mt-2 cursor-pointer disabled:cursor-not-allowed">
            {isSubmitting ? 'Updating password...' : 'Update Password'}
          </Button>
        </form>
      </Form>
    </>
  );
}