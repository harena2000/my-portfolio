import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harena Rico | Portfolio",
  description: "Full-stack Mobile & Web Developer — Flutter, Next.js, TypeScript, GIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This root layout is intentionally minimal.
  // The actual layout with Navbar and providers is in [locale]/layout.tsx
  return children as React.ReactElement;
}
