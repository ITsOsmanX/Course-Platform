"use client";

import { useState } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setIsSubmitting(true);

    try {
      await login(values);

      toast.success("Welcome back!");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          "Invalid email or password."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-8 space-y-2">
        <h1 className="gradient-text text-4xl font-bold">
          Welcome Back
        </h1>

        <p className="text-slate-400">
          Sign in to continue learning and access your dashboard.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({
              field,
            }: {
              field: ControllerRenderProps<LoginValues, "email">;
            }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  Email Address
                </FormLabel>

                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({
              field,
            }: {
              field: ControllerRenderProps<LoginValues, "password">;
            }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-slate-300">
                    Password
                  </FormLabel>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-sky-400 transition hover:text-sky-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-white transition-all duration-300 hover:opacity-90"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-sky-400 transition hover:text-sky-300"
        >
          Create account
        </Link>
      </p>
    </>
  );
}