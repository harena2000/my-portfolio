"use client";

import { Contact, Experience, Hero, Projects, Resume, Skills } from "@/app/pages";
import { Particles } from "@/components/ui/shadcn-io/particles";
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { SectionContinueHint } from "@/components/SectionContinueHint";
import { useSectionCamera } from "@/components/home/useSectionCamera";
import { SECTIONS, SECTION_IDS, type SectionId } from "@/lib/section-map";
import { useCallback, useEffect, useRef, useState } from "react";

const SECTION_CONTENT: Record<SectionId, React.ReactNode> = {
  home: <Hero />,
  skills: <Skills />,
  project: <Projects />,
  experience: <Experience />,
  contact: <Contact />,
  resume: <Resume />,
};

// The staircase map needs a wheel/trackpad; phones and touch tablets get the stacked page
const STACKED_QUERY = "(max-width: 767px), (pointer: coarse)";

const PAGE_BACKGROUND = "linear-gradient(135deg, #020818 0%, #050d1f 40%, #040c1c 100%)";

/** One viewport-sized cell of the desktop map; scrolls vertically when its content overflows */
function MapPanel({ id, col, row, children }: { id: string; col: number; row: number; children: React.ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={panelRef}
      id={`section-${id}`}
      className="absolute z-10 overflow-y-auto overflow-x-hidden scrollbar-furtif"
      style={{
        left: `calc(var(--cell-w, 100vw) * ${col})`,
        top: `calc(var(--cell-h, 100dvh) * ${row})`,
        width: "var(--cell-w, 100vw)",
        height: "var(--cell-h, 100dvh)",
      }}
    >
      {/*
        Content flows naturally from top with generous padding.
        If content is taller than the viewport, the panel scrolls vertically.
        No min-h-full wrapper — that would prevent scrollHeight from exceeding clientHeight.
      */}
      <div className="w-full px-4 sm:px-6 md:px-8 pt-20 pb-12">{children}</div>
      {/* Scroll indicator — only visible when there's more content below */}
      <ScrollIndicator containerRef={panelRef} />
    </div>
  );
}

export default function HomeClient() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const [isStacked, setIsStacked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(STACKED_QUERY);
    const update = () => setIsStacked(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const camera = useSectionCamera({ enabled: !isStacked, viewportRef, worldRef });

  // Navigate to section (Navbar, hint pill, hero buttons, hash links)
  const navigateToSection = useCallback(
    (ev: Event) => {
      const detail = (ev as CustomEvent).detail as
        | { id?: string; index?: number; align?: "start" | "end"; instant?: boolean }
        | undefined;
      const idx = detail?.index ?? (detail?.id ? SECTION_IDS.indexOf(detail.id) : -1);
      if (idx === undefined || idx < 0 || idx >= SECTION_IDS.length) return;

      if (isStacked) {
        const smooth = !detail?.instant && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById(`section-${SECTION_IDS[idx]}`)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      } else {
        camera.current.flyTo(idx, { align: detail?.align, instant: detail?.instant });
      }
    },
    [isStacked, camera]
  );

  useEffect(() => {
    window.addEventListener("navigateToSection", navigateToSection as EventListener);
    return () => window.removeEventListener("navigateToSection", navigateToSection as EventListener);
  }, [navigateToSection]);

  // On mount, open the section named in the URL hash (e.g. /en#contact) directly
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const idx = SECTION_IDS.indexOf(hash);
    if (idx <= 0) return;
    // Small delay to let layout settle
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("navigateToSection", { detail: { id: hash, index: idx, instant: true } }));
    }, 100);
    return () => clearTimeout(timer);
  }, [isStacked]);

  // Stacked layout: track the active section as the page scrolls
  // (the desktop camera reports it itself)
  useEffect(() => {
    if (!isStacked) return;
    const observers = SECTION_IDS.flatMap((id, index) => {
      const el = document.getElementById(`section-${id}`);
      if (!el) return [];
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index } }));
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return [obs];
    });
    window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index: 0 } }));
    return () => observers.forEach((o) => o.disconnect());
  }, [isStacked]);

  const Background = (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/6 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-800/5 rounded-full blur-3xl" />
      <ShootingStars className="absolute inset-0" />
      <Particles
        className="absolute inset-0"
        quantity={isStacked ? 40 : 80}
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

  // ── STACKED (phones, touch tablets): vertical scroll ──
  if (isStacked) {
    return (
      <div
        className="relative w-screen min-h-screen overflow-x-hidden overflow-y-auto text-white scrollbar-none"
        style={{ background: PAGE_BACKGROUND }}
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

  // ── DESKTOP: staircase map, moved by the section camera ──
  return (
    <div ref={viewportRef} className="fixed inset-0 overflow-hidden text-white" style={{ background: PAGE_BACKGROUND }}>
      {Background}
      <SectionContinueHint />
      <div ref={worldRef} className="absolute left-0 top-0 will-change-transform">
        {SECTIONS.map((s) => (
          <MapPanel key={s.id} id={s.id} col={s.col} row={s.row}>
            {SECTION_CONTENT[s.id]}
          </MapPanel>
        ))}
      </div>
    </div>
  );
}
