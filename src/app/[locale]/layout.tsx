import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

const montserratFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Harena Rico | Portfolio",
  description: "Full-stack Mobile & Web Developer — Flutter, Next.js, TypeScript, GIS",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className={`${montserratFont.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
