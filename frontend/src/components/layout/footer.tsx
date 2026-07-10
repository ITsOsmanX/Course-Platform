"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const productLinks = [
  { name: "Browse Courses", href: "/courses" },
  { name: "Certificates", href: "#" },
  { name: "Community", href: "#" },
];

const companyLinks = [
  { name: "About", href: "#about" },
  { name: "Careers", href: "#" },
  { name: "Blog", href: "#" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="container mx-auto px-4 pb-8 pt-14 sm:px-6 sm:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h2 className="gradient-text text-3xl font-bold">Waypoint</h2>
            <p className="mt-4 max-w-md leading-7 text-slate-400">
              Learn modern technologies with beautifully designed, project-based
              courses taught by industry experts.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[Mail, FaGithub, FaXTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
                <Button key={i} variant="outline" size="icon" className="border-white/10 bg-white/5 hover:bg-white/10">
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-400 transition hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-400 transition hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Newsletter</h3>
            <p className="mb-4 text-sm text-slate-400">
              Updates on new courses and features.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none"
              />
              <Button className="bg-blue-600 hover:bg-blue-500 px-3">→</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/8" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Waypoint Academy. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-slate-300 transition">Privacy</Link>
            <Link href="#" className="hover:text-slate-300 transition">Terms</Link>
            <Link href="#" className="hover:text-slate-300 transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
