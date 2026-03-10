"use client";

import { Contact, Experience, Hero, Projects, Skills } from "@/app/pages";
import { Particles } from "@/components/ui/shadcn-io/particles";
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Keyboard navigation (desktop only)
  useEffect(() => {
    if (isMobile) return;
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
  }, [isMobile]);

  // Navigate to section by index or id
  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { id?: string; index?: number } | undefined;
      const container = containerRef.current;
      if (!container) return;

      if (isMobile) {
        // On mobile: vertical scroll to section by id
        const targetId = detail?.id;
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (detail?.index !== undefined) {
          const sections = ["home", "skills", "project", "experience", "contact"];
          const id = sections[detail.index];
          if (id) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        return;
      }

      // Desktop: horizontal scroll
      if (detail?.index !== undefined && typeof detail.index === "number") {
        container.scrollTo({ left: window.innerWidth * detail.index, behavior: "smooth" });
        return;
      }
      if (detail?.id) {
        const el = document.getElementById(detail.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          container.scrollTo({ left: container.scrollLeft + (rect.left - containerRect.left), behavior: "smooth" });
        }
      }
    };

    window.addEventListener("navigateToSection", handler as EventListener);
    return () => window.removeEventListener("navigateToSection", handler as EventListener);
  }, [isMobile]);

  // Track current section for navbar highlight
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;

    if (isMobile) {
      // On mobile: use IntersectionObserver to track visible section
      const sections = ["home", "skills", "project", "experience", "contact"];
      const observers: IntersectionObserver[] = [];

      sections.forEach((id, index) => {
        const el = document.getElementById(id);
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index } }));
            }
          },
          { threshold: 0.5 }
        );
        obs.observe(el);
        observers.push(obs);
      });

      window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index: 0 } }));
      return () => observers.forEach((o) => o.disconnect());
    }

    // Desktop: scroll-based tracking
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const index = Math.round(container.scrollLeft / (window.innerWidth || 1));
        window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index } }));
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index: 0 } }));

    return () => {
      container.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className={
        isMobile
          ? // Mobile: normal vertical scroll
            "relative w-screen overflow-x-hidden overflow-y-auto text-white scrollbar-none"
          : // Desktop: horizontal snap scroll
            "relative min-h-screen w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex scrollbar-none text-white"
      }
      style={{ background: "linear-gradient(135deg, #020818 0%, #050d1f 40%, #040c1c 100%)" }}
    >
      {/* Background — fixed layer */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ willChange: "transform" }}>
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-800/5 rounded-full blur-3xl" />
        <ShootingStars className="absolute inset-0" />
        <Particles className="absolute inset-0" quantity={isMobile ? 40 : 80} ease={60} staticity={50} color="#3b82f6" size={0.5} />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── MOBILE: stacked vertical sections ── */}
      {isMobile ? (
        <div className="relative z-10 flex flex-col">
          <section id="home" className="min-h-dvh flex items-center justify-center py-20 px-4">
            <Hero />
          </section>
          <section id="skills" className="min-h-dvh flex items-center justify-center py-16 px-4">
            <Skills />
          </section>
          <section id="project" className="flex items-start justify-center py-16 px-4">
            <Projects />
          </section>
          <section id="experience" className="min-h-dvh flex items-center justify-center py-16 px-4">
            <Experience />
          </section>
          <section id="contact" className="min-h-dvh flex items-center justify-center py-16 px-4 pb-24">
            <Contact />
          </section>
        </div>
      ) : (
        /* ── DESKTOP: horizontal snap sections ── */
        <>
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
        </>
      )}
    </div>
  );
}
