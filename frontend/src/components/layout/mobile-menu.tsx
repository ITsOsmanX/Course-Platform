"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { name: "About", href: "#about" },
  { name: "Courses", href: "#courses" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 md:hidden hover:bg-white/10">
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Waypoint</SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium hover:text-blue-500"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}