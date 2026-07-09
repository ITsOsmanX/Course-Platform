'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsSubmitting(true);
    try {
      await login(values);
      toast.success('Welcome back!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-white">Sign In</h1>
        <p className="text-sm text-neutral-400">Access your courses and dashboard</p>
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-neutral-300">Password</FormLabel>
                  <Link href="/auth/forgot-password" className="text-xs text-amber-500 hover:underline">Forgot password?</Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="bg-neutral-950 border-neutral-800 text-white focus-visible:ring-amber-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 text-neutral-950 hover:bg-amber-400 font-medium mt-2">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-amber-500 hover:underline">Create account</Link>
      </p>
    </>
  );
}