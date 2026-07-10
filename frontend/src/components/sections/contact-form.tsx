"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";

import AnimatedReveal from "@/components/shared/animated-reveal";
import SectionHeading from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await api.post("/contact", data);
      toast.success("Message sent! We'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  }

  return (
    <section id="contact" className="landing-section container px-4 sm:px-6">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something amazing together."
        description="Questions about our courses? We'd love to hear from you."
      />

      <AnimatedReveal>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur sm:rounded-3xl sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Input
                placeholder="Your name"
                className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Email address"
                type="email"
                className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <Textarea
              rows={6}
              placeholder="Tell us about your goals..."
              className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
              {...register("message")}
            />
            {errors.message && (
              <p className="mt-1.5 text-xs text-red-400">{errors.message.message}</p>
            )}
          </div>

          <Button
            className="mt-6 bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 text-white hover:opacity-90"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending…" : "Send Message"}
          </Button>
        </form>
      </AnimatedReveal>
    </section>
  );
}
