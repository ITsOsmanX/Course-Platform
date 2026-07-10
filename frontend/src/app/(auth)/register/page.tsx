"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    setIsSubmitting(true);

    try {
      const { confirmPassword, ...payload } = values;

      await register(payload);

      toast.success("Account created successfully!");

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-8 space-y-2">
        <h1 className="gradient-text text-4xl font-bold">
          Create Account
        </h1>

        <p className="text-slate-400">
          Join Waypoint and start learning with industry-leading courses.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  Full Name
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="John Doe"
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
            name="email"
            render={({ field }) => (
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
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  Password
                </FormLabel>

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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">
                  Confirm Password
                </FormLabel>

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
            className="mt-2 w-full cursor-pointer bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Creating account..."
              : "Create Account"}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-sky-400 transition hover:text-sky-300"
        >
          Sign In
        </Link>
      </p>
    </>
  );
}