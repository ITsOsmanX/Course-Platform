"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const productLinks = [
  { name: "Courses", href: "#courses" },
  { name: "Pricing", href: "#pricing" },
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
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="gradient-text text-3xl font-bold">
              Waypoint
            </h2>

            <p className="mt-5 max-w-md text-slate-400 leading-7">
              Learn modern technologies with beautifully designed,
              project-based courses taught by industry experts.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" size="icon">
                <Mail className="h-5 w-5" />
              </Button>

              <Button variant="outline" size="icon">
                <FaGithub className="h-5 w-5" />
              </Button>

              <Button variant="outline" size="icon">
                <FaXTwitter className="h-5 w-5" />
              </Button>

              <Button variant="outline" size="icon">
                <FaLinkedin className="h-5 w-5" />
              </Button>

              <Button variant="outline" size="icon">
                <FaInstagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Product
            </h3>

            <ul className="space-y-3">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Company
            </h3>

            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Newsletter
            </h3>

            <p className="mb-4 text-sm text-slate-400">
              Subscribe for updates on new courses and features.
            </p>

            <Input placeholder="Email address" />

            <Button className="mt-4 w-full">
              Subscribe
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} Waypoint Academy. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}