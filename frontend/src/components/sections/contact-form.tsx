"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: FormData) {
    console.log(data);

    toast.success("Message sent successfully!");

    reset();
  }

  return (
    <section
      id="contact"
      className="container"
    >
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something amazing together."
        description="Questions about our courses? We'd love to hear from you."
      />

      <AnimatedReveal>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur"
        >
          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <Input
                placeholder="Your name"
                {...register("name")}
              />

              {errors.name && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Email address"
                type="email"
                {...register("email")}
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

          </div>

          <div className="mt-6">
            <Textarea
              rows={7}
              placeholder="Tell us about your goals..."
              {...register("message")}
            />

            {errors.message && (
              <p className="mt-2 text-sm text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            className="mt-8"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </AnimatedReveal>
    </section>
  );
}