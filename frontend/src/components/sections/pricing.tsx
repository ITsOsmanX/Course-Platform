"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { pricingTiers } from "@/lib/data";

import AnimatedReveal from "@/components/shared/animated-reveal";
import SectionHeading from "@/components/shared/section-heading";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="container"
    >
      <SectionHeading
        eyebrow="Pricing"
        title="Simple pricing for everyone."
        description="Choose the plan that best fits your learning journey."
      />

      <div className="mb-12 flex items-center justify-center gap-4">
        <span className={!yearly ? "font-semibold" : "text-slate-400"}>
          Monthly
        </span>

        <Switch
          checked={yearly}
          onCheckedChange={setYearly}
        />

        <span className={yearly ? "font-semibold" : "text-slate-400"}>
          Yearly
        </span>

        <Badge className="bg-green-600">
          Save 20%
        </Badge>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {pricingTiers.map((tier, index) => (
          <AnimatedReveal
            key={tier.name}
            delay={index * 0.1}
          >
            <Card
              className={`relative rounded-3xl border transition-all duration-300 ${
                tier.popular
                  ? "border-blue-500 bg-blue-950/40 shadow-xl"
                  : "border-white/10 bg-slate-900/60"
              }`}
            >
              {tier.popular && (
                <Badge className="absolute right-6 top-6 bg-blue-600">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="space-y-3">
                <h3 className="text-2xl font-bold">
                  {tier.name}
                </h3>

                <p className="text-slate-400">
                  {tier.description}
                </p>

                <div className="text-5xl font-black">
                  $
                  {yearly
                    ? tier.priceYearly
                    : tier.priceMonthly}

                  <span className="text-lg font-medium text-slate-400">
                    /{yearly ? "year" : "month"}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3"
                    >
                      <Check
                        className="text-green-500"
                        size={18}
                      />

                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-8 w-full"
                  size="lg"
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
}