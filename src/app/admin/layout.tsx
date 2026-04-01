import type { Metadata } from "next";
import QueryProvider from "@/components/admin/layout/QueryProvider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Admin Panel | Harena Rico Portfolio",
  description: "Admin backoffice for managing portfolio content",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#0f0f0f] text-white antialiased"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
