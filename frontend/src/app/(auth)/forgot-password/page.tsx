'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import api from '@/lib/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', values);
    } catch (err) {
      // Silent catch to mitigate email harvesting enumeration security gaps
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center py-4">
        <h1 className="text-xl font-semibold text-white">Check your email</h1>
        <p className="text-sm text-neutral-400">
          If that email belongs to a registered profile, a secure link has been dispatched to it.
        </p>
        <Link href="/auth/login" className="inline-block text-sm text-amber-500 hover:underline mt-4">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-white">Reset Password</h1>
        <p className="text-sm text-neutral-400">Enter your email to request a secure reset link</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-300">Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" className="bg-neutral-950 border-neutral-800 text-white focus-visible:ring-amber-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 text-neutral-950 hover:bg-amber-400 font-medium mt-2 cursor-pointer disabled:cursor-not-allowed">
            {isSubmitting ? 'Sending link...' : 'Send Reset Link'}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Remembered your password?{' '}
        <Link href="/auth/login" className="text-amber-500 hover:underline">Sign in</Link>
      </p>
    </>
  );
}