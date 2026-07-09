import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext"; // 👈 Imported our new provider

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Waypoint Academy",
    template: "%s | Waypoint Academy",
  },
  description: "Master modern development through immersive, project-based online courses designed for developers, designers, and creators.",
  keywords: ["online courses", "web development", "react", "nextjs", "typescript", "ui design", "education"],
  authors: [{ name: "Waypoint Academy" }],
  openGraph: {
    title: "Waypoint Academy",
    description: "Learn faster with beautifully designed, project-based courses.",
    url: "https://waypoint.com",
    siteName: "Waypoint Academy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waypoint Academy",
    description: "Modern online learning platform for developers and creators.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen bg-background text-foreground antialiased`}>
        <AuthProvider> {/* 👈 Wrapped around children nodes */}
          {children}
        </AuthProvider>

        <Toaster
          position="top-right"
          richColors
          expand
          closeButton
        />
      </body>
    </html>
  );
}