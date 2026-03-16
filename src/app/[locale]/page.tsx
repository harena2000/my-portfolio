"use client";

import { Contact, Experience, Hero, Projects, Resume, Skills } from "@/app/pages";
import { Particles } from "@/components/ui/shadcn-io/particles";
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { useCallback, useEffect, useRef, useState } from "react";

const SECTION_IDS = ["home", "skills", "project", "experience", "contact", "resume"];

/** A single snap panel that scrolls vertically when content overflows */
function SnapPanel({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={panelRef}
      id={`section-${id}`}
      className="snap-center flex-shrink-0 w-screen h-dvh relative z-10 overflow-y-auto overflow-x-hidden scrollbar-furtif"
    >
      {/*
        Content flows naturally from top with generous padding.
        If content is taller than h-dvh, the panel scrolls vertically.
        No min-h-full wrapper — that would prevent scrollHeight from exceeding clientHeight.
      */}
      <div className="w-full px-4 sm:px-6 md:px-8 pt-20 pb-12">
        {children}
      </div>
      {/* Scroll indicator — only visible when there's more content below */}
      <ScrollIndicator containerRef={panelRef} />
    </div>
  );
}

export default function Home() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Keyboard navigation (desktop)
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

  // Navigate to section
  const navigateToSection = useCallback(
    (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { id?: string; index?: number } | undefined;
      const idx = detail?.index ?? (detail?.id ? SECTION_IDS.indexOf(detail.id) : -1);
      if (idx === undefined || idx < 0) return;

      if (isMobile) {
        const el = document.getElementById(`section-${SECTION_IDS[idx]}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const outer = outerRef.current;
        if (outer) {
          outer.scrollTo({ left: window.innerWidth * idx, behavior: "smooth" });
          // Also scroll the target panel back to top
          const panel = document.getElementById(`section-${SECTION_IDS[idx]}`);
          if (panel) panel.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    [isMobile]
  );

  useEffect(() => {
    window.addEventListener("navigateToSection", navigateToSection as EventListener);
    return () => window.removeEventListener("navigateToSection", navigateToSection as EventListener);
  }, [navigateToSection]);

  // Track active section
  useEffect(() => {
    let raf = 0;
    if (isMobile) {
      const observers: IntersectionObserver[] = [];
      SECTION_IDS.forEach((id, index) => {
        const el = document.getElementById(`section-${id}`);
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting)
              window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index } }));
          },
          { threshold: 0.3 }
        );
        obs.observe(el);
        observers.push(obs);
      });
      window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index: 0 } }));
      return () => observers.forEach((o) => o.disconnect());
    }

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
          backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );

  // ── MOBILE: vertical scroll ──
  if (isMobile) {
    return (
      <div
        className="relative w-screen min-h-screen overflow-x-hidden overflow-y-auto text-white scrollbar-none"
        style={{ background: "linear-gradient(135deg, #020818 0%, #050d1f 40%, #040c1c 100%)" }}
      >
        {Background}
        <div className="relative z-10 flex flex-col">
          <div id="section-home" className="min-h-dvh w-full py-20 px-4">
            <Hero />
          </div>
          <div id="section-skills" className="min-h-dvh w-full py-16 px-4">
            <Skills />
          </div>
          <div id="section-project" className="w-full py-16 px-4">
            <Projects />
          </div>
          <div id="section-experience" className="min-h-dvh w-full py-16 px-4">
            <Experience />
          </div>
          <div id="section-contact" className="min-h-dvh w-full py-16 px-4">
            <Contact />
          </div>
          <div id="section-resume" className="min-h-dvh w-full py-16 px-4 pb-28">
            <Resume />
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP: horizontal snap, each panel scrolls vertically ──
  return (
    <div
      ref={outerRef}
      className="relative w-screen h-dvh overflow-y-hidden snap-x snap-mandatory flex scrollbar-none text-white"
      style={{
        background: "linear-gradient(135deg, #020818 0%, #050d1f 40%, #040c1c 100%)",
        overflowX: "auto",
      }}
    >
      {Background}

      <SnapPanel id="home">
        <Hero />
      </SnapPanel>
      <SnapPanel id="skills">
        <Skills />
      </SnapPanel>
      <SnapPanel id="project">
        <Projects />
      </SnapPanel>
      <SnapPanel id="experience">
        <Experience />
      </SnapPanel>
      <SnapPanel id="contact">
        <Contact />
      </SnapPanel>
      <SnapPanel id="resume">
        <Resume />
      </SnapPanel>
    </div>
  );
}
