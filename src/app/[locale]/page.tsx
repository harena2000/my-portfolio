"use client";

import { Contact, Experience, Hero, Projects, Skills } from "@/app/pages";
import { Particles } from "@/components/ui/shadcn-io/particles";
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars";
import { useEffect, useRef, useState } from "react";

// Section IDs in order — used for nav tracking and keyboard nav
const SECTION_IDS = ["home", "skills", "project", "experience", "contact"];

export default function Home() {
  const outerRef = useRef<HTMLDivElement>(null); // horizontal snap container (desktop)
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Keyboard navigation (desktop: left/right arrows) ──
  useEffect(() => {
    if (isMobile) return;
    const handleKey = (e: KeyboardEvent) => {
      const outer = outerRef.current;
      if (!outer) return;
      if (e.key === "ArrowRight") outer.scrollBy({ left: window.innerWidth, behavior: "smooth" });
      if (e.key === "ArrowLeft") outer.scrollBy({ left: -window.innerWidth, behavior: "smooth" });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isMobile]);

  // ── Navigate to section by id or index ──
  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { id?: string; index?: number } | undefined;

      const resolveIndex = (): number | null => {
        if (detail?.index !== undefined) return detail.index;
        if (detail?.id) {
          const i = SECTION_IDS.indexOf(detail.id);
          return i >= 0 ? i : null;
        }
        return null;
      };

      const idx = resolveIndex();
      if (idx === null) return;

      if (isMobile) {
        // Mobile: scroll the page vertically to the section
        const el = document.getElementById(SECTION_IDS[idx]);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Desktop: scroll the outer container horizontally to the snap panel
        const outer = outerRef.current;
        if (outer) outer.scrollTo({ left: window.innerWidth * idx, behavior: "smooth" });
      }
    };

    window.addEventListener("navigateToSection", handler as EventListener);
    return () => window.removeEventListener("navigateToSection", handler as EventListener);
  }, [isMobile]);

  // ── Track active section for navbar highlight ──
  useEffect(() => {
    let raf = 0;

    if (isMobile) {
      // Mobile: IntersectionObserver on each section
      const observers: IntersectionObserver[] = [];
      SECTION_IDS.forEach((id, index) => {
        const el = document.getElementById(id);
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting)
              window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index } }));
          },
          { threshold: 0.4 }
        );
        obs.observe(el);
        observers.push(obs);
      });
      window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index: 0 } }));
      return () => observers.forEach((o) => o.disconnect());
    }

    // Desktop: track horizontal scroll position
    const outer = outerRef.current;
    if (!outer) return;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const index = Math.round(outer.scrollLeft / (window.innerWidth || 1));
        window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index } }));
      });
    };
    outer.addEventListener("scroll", onScroll, { passive: true });
    window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index: 0 } }));
    return () => {
      outer.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  // ── Shared background layer ──
  const Background = (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/6 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-800/5 rounded-full blur-3xl" />
      <ShootingStars className="absolute inset-0" />
      <Particles
        className="absolute inset-0"
        quantity={isMobile ? 40 : 80}
        ease={60}
        staticity={50}
        color="#3b82f6"
        size={0.5}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );

  // ─────────────────────────────────────────────
  // MOBILE: one long vertical page, sections stacked
  // ─────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        className="relative w-screen min-h-screen overflow-x-hidden overflow-y-auto text-white scrollbar-none"
        style={{ background: "linear-gradient(135deg, #020818 0%, #050d1f 40%, #040c1c 100%)" }}
      >
        {Background}
        <div className="relative z-10 flex flex-col">
          {/* Each section: min-h-screen so it fills the viewport, but grows if content is taller */}
          <section id="home" className="min-h-dvh w-full flex flex-col items-center justify-center py-20 px-4">
            <Hero />
          </section>
          <section id="skills" className="min-h-dvh w-full flex flex-col items-center justify-center py-16 px-4">
            <Skills />
          </section>
          <section id="project" className="w-full flex flex-col items-start justify-center py-16 px-4">
            <Projects />
          </section>
          <section id="experience" className="min-h-dvh w-full flex flex-col items-center justify-center py-16 px-4">
            <Experience />
          </section>
          <section id="contact" className="min-h-dvh w-full flex flex-col items-center justify-center py-16 px-4 pb-28">
            <Contact />
          </section>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // DESKTOP: horizontal snap, each panel scrolls vertically
  // ─────────────────────────────────────────────
  return (
    <div
      ref={outerRef}
      className="relative w-screen h-dvh overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex scrollbar-none text-white"
      style={{ background: "linear-gradient(135deg, #020818 0%, #050d1f 40%, #040c1c 100%)" }}
    >
      {Background}

      {/* Each section is a snap panel that is exactly 100vw wide and 100dvh tall,
          but its inner content div can scroll vertically */}
      {[
        { id: "home",       El: Hero },
        { id: "skills",     El: Skills },
        { id: "project",    El: Projects },
        { id: "experience", El: Experience },
        { id: "contact",    El: Contact },
      ].map(({ id, El }, idx) => (
        <section
          key={id}
          id={id}
          ref={(el) => { sectionRefs.current[idx] = el; }}
          className="snap-center flex-shrink-0 w-screen h-dvh relative z-10 overflow-y-auto scrollbar-furtif"
        >
          {/* Inner wrapper: min-h full so content is centered when short,
              grows naturally when content is taller than viewport */}
          <div className="min-h-full flex flex-col items-center justify-center">
            <El />
          </div>
        </section>
      ))}
    </div>
  );
}
