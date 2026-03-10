"use client";

import { Contact, Experience, Hero, Projects, Skills } from "@/app/pages";
import { Particles } from "@/components/ui/shadcn-io/particles";
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars";
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

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as
        | { id?: string; index?: number }
        | undefined;
      const container = containerRef.current;
      if (!container) return;

      if (detail?.index !== undefined && typeof detail.index === "number") {
        const left = window.innerWidth * detail.index;
        container.scrollTo({ left, behavior: "smooth" });
        return;
      }

      if (detail?.id) {
        const el = document.getElementById(detail.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const left = container.scrollLeft + (rect.left - containerRect.left);
          container.scrollTo({ left, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("navigateToSection", handler as EventListener);
    return () =>
      window.removeEventListener("navigateToSection", handler as EventListener);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const width = window.innerWidth || 1;
        const index = Math.round(container.scrollLeft / width);
        window.dispatchEvent(
          new CustomEvent("sectionChanged", { detail: { index } })
        );
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    const initIndex = Math.round(
      container.scrollLeft / (window.innerWidth || 1)
    );
    window.dispatchEvent(
      new CustomEvent("sectionChanged", { detail: { index: initIndex } })
    );

    return () => {
      container.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen w-screen overflow-x-hidden overflow-y-auto snap-x snap-mandatory flex scrollbar-none scroll-smooth text-white"
      style={{
        background: 'linear-gradient(135deg, #020818 0%, #050d1f 30%, #071428 60%, #040c1c 100%)',
      }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-800/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl" />

        <ShootingStars
          className="absolute inset-0"
          starColor="#3b82f6"
          trailColor="#60a5fa"
          minSpeed={80}
          maxSpeed={200}
          minDelay={200}
          maxDelay={600}
        />
        <Particles
          className="absolute inset-0"
          quantity={800}
          ease={40}
          staticity={60}
          color="#3b82f6"
          size={0.6}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <section className="snap-center flex-shrink-0 w-screen h-dvh flex items-center justify-center relative z-10">
        <Hero />
      </section>

      <section className="snap-center flex-shrink-0 w-screen h-dvh flex items-center justify-center relative z-10">
        <Skills />
      </section>

      <section className="snap-center flex-shrink-0 w-screen min-h-dvh flex items-start justify-center relative z-10">
        <Projects />
      </section>

      <section className="snap-center flex-shrink-0 w-screen h-dvh flex items-center justify-center relative z-10">
        <Experience />
      </section>

      <section className="snap-center flex-shrink-0 w-screen h-dvh flex items-center justify-center relative z-10">
        <Contact />
      </section>
    </main>
  );
}
