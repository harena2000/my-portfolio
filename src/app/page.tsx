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

      // prefer index-based horizontal scroll when provided
      if (detail?.index !== undefined && typeof detail.index === "number") {
        const left = window.innerWidth * detail.index;
        container.scrollTo({ left, behavior: "smooth" });
        return;
      }

      // fallback: try scroll to element by id (if sections rendered as anchors)
      if (detail?.id) {
        const el = document.getElementById(detail.id);
        if (el) {
          // compute element's left relative to container
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
    // emit initial position
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
      className="relative min-h-screen w-screen overflow-x-hidden overflow-y-auto snap-x snap-mandatory flex scrollbar-none scroll-smooth bg-gradient-to-b from-[#020618] via-[#0f1e64] to-[#132f9c] text-white"
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ShootingStars
          className="absolute inset-0"
          starColor="#9E00FF"
          trailColor="#2EB9DF"
          minSpeed={150}
          maxSpeed={350}
          minDelay={100}
          maxDelay={420}
        />
        <Particles
          className="absolute inset-0"
          quantity={2000}
          ease={30}
          staticity={50}
          color="#ffffff"
          size={0.8}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

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
    </main>
  );
}
