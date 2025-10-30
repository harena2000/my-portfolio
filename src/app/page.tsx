"use client";

import { Contact, Experience, Hero, Projects, Skills } from "@/app/pages";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const scrollAmount = window.innerWidth;
      if (e.key === "ArrowRight")
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      if (e.key === "ArrowLeft")
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative h-dvh w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex scrollbar-none scroll-smooth bg-gradient-to-b from-[#020618] via-[#0f1e64] to-[#132f9c] text-white"
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
+        <div className="absolute inset-0 bg-[url('/images/background.jpg')] bg-center bg-cover opacity-30" />
+        <div className="absolute inset-0 bg-black/20" />
+      </div>

      <section className="snap-center flex-shrink-0 w-screen h-dvh flex items-center justify-center">
        <Hero />
      </section>

      <section className="snap-center flex-shrink-0 w-screen h-dvh flex items-center justify-center">
        <Skills />
      </section>

      <section className="snap-center flex-shrink-0 w-screen h-dvh flex items-center justify-center">
        <Projects />
      </section>

      <section className="snap-center flex-shrink-0 w-screen h-dvh flex items-center justify-center">
        <Experience />
      </section>

      <section className="snap-center flex-shrink-0 w-screen h-dvh flex items-center justify-center">
        <Contact />
      </section>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50">
        {["Home", "Skills", "Projects", "Experience", "Contact"].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-white/40 hover:bg-white transition cursor-pointer"
            whileHover={{ scale: 1.2 }}
            onClick={() => {
              const container = containerRef.current;
              if (container) {
                container.scrollTo({
                  left: window.innerWidth * i,
                  behavior: "smooth",
                });
              }
            }}
          />
        ))}
      </div>
      <footer className="fixed bottom-4 right-4 text-sm text-white/50 z-50">
        &copy; {new Date().getFullYear()} Harena Rico. All rights reserved.
      </footer>
    </main>
  );
}
