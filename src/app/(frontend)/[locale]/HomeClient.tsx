"use client";

import { Contact, Experience, Hero, Projects, Resume, Skills } from "@/app/pages";
import { Particles } from "@/components/ui/shadcn-io/particles";
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { SectionContinueHint } from "@/components/SectionContinueHint";
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

export default function HomeClient() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const cancelWheelGlideRef = useRef<() => void>(() => {});

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
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      // Move by whole sections, even if the strip was left between two of them
      const pos = outer.scrollLeft / window.innerWidth;
      const index = e.key === "ArrowRight" ? Math.floor(pos + 0.01) + 1 : Math.ceil(pos - 0.01) - 1;
      window.dispatchEvent(new CustomEvent("navigateToSection", { detail: { index } }));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isMobile]);

  // Navigate to section
  const navigateToSection = useCallback(
    (ev: Event) => {
      const detail = (ev as CustomEvent).detail as
        | { id?: string; index?: number; align?: "start" | "end" }
        | undefined;
      const idx = detail?.index ?? (detail?.id ? SECTION_IDS.indexOf(detail.id) : -1);
      if (idx === undefined || idx < 0 || idx >= SECTION_IDS.length) return;
      cancelWheelGlideRef.current();
      const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";

      if (isMobile) {
        const el = document.getElementById(`section-${SECTION_IDS[idx]}`);
        if (el) el.scrollIntoView({ behavior, block: "start" });
      } else {
        const outer = outerRef.current;
        if (outer) {
          outer.scrollTo({ left: window.innerWidth * idx, behavior });
          // Land at the top of the target panel, or its bottom when coming back from the next one
          const panel = document.getElementById(`section-${SECTION_IDS[idx]}`);
          if (panel) panel.scrollTo({ top: detail?.align === "end" ? panel.scrollHeight : 0, behavior });
        }
      }
    },
    [isMobile]
  );

  // Desktop: when a panel is scrolled to its end, further vertical wheel input keeps going
  // sideways, sliding the next section in gradually. The strip stays wherever the user stops.
  useEffect(() => {
    if (isMobile) return;
    const outer = outerRef.current;
    if (!outer) return;

    const SPEED = 1.15; // horizontal px per vertical wheel px
    const FOLLOW = 0.18; // easing per 60fps frame
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let targetX = outer.scrollLeft;
    let cur = outer.scrollLeft;
    let raf = 0;
    let lastFrame = 0;
    let lastVerticalAt = 0;
    // After a slide the cursor hasn't moved, so the browser keeps aiming wheel events at the panel
    // that slid away; until the pointer moves again we scroll the visible panel ourselves
    let pointerStale = false;
    let vEl: HTMLElement | null = null;
    let vCur = 0;
    let vTarget = 0;
    let vRaf = 0;
    let vLastFrame = 0;

    const W = () => window.innerWidth || 1;
    const isAligned = (x: number) => Math.abs(x - Math.round(x / W()) * W()) < 1;
    const atEnd = (el: HTMLElement, dir: number) =>
      dir > 0 ? el.scrollTop + el.clientHeight >= el.scrollHeight - 2 : el.scrollTop <= 2;

    /** True if a scroller between the target and the panel can still move that way */
    const innerCanScroll = (target: EventTarget | null, panel: HTMLElement, dir: number) => {
      let node = target instanceof HTMLElement ? target : null;
      while (node && node !== panel) {
        const { overflowY } = getComputedStyle(node);
        if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight && !atEnd(node, dir)) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    // Snap only makes sense when resting exactly on a panel; mid-way it would yank the strip
    const syncSnap = () => {
      outer.style.scrollSnapType = isAligned(outer.scrollLeft) ? "" : "none";
    };

    /** Frame-rate independent exponential easing step */
    const ease = (from: number, to: number, dt: number) => {
      const next = from + (to - from) * (1 - Math.pow(1 - FOLLOW, dt / 16.67));
      return Math.abs(to - next) < 0.5 ? to : next;
    };

    const tick = (now: number) => {
      const dt = lastFrame ? Math.min(now - lastFrame, 64) : 16.67;
      lastFrame = now;
      cur = ease(cur, targetX, dt);
      outer.scrollLeft = cur;
      if (cur === targetX) {
        raf = 0;
        syncSnap();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const vTick = (now: number) => {
      if (!vEl) return;
      const dt = vLastFrame ? Math.min(now - vLastFrame, 64) : 16.67;
      vLastFrame = now;
      vCur = ease(vCur, vTarget, dt);
      vEl.scrollTop = vCur;
      vRaf = vCur === vTarget ? 0 : requestAnimationFrame(vTick);
    };

    const stopVertical = () => {
      cancelAnimationFrame(vRaf);
      vRaf = 0;
    };

    /** Smoothly scroll a panel vertically by d, clamped to its range */
    const scrollPanelBy = (panel: HTMLElement, d: number) => {
      if (vEl !== panel || !vRaf) {
        vEl = panel;
        vCur = vTarget = panel.scrollTop;
      }
      vTarget = Math.min(panel.scrollHeight - panel.clientHeight, Math.max(0, vTarget + d));
      if (reduceMotion) {
        vCur = vTarget;
        panel.scrollTop = vCur;
        return;
      }
      if (!vRaf) {
        vLastFrame = 0;
        vRaf = requestAnimationFrame(vTick);
      }
    };

    const glideTo = (x: number) => {
      targetX = x;
      pointerStale = true;
      stopVertical();
      outer.style.scrollSnapType = "none";
      if (reduceMotion) {
        cur = targetX;
        outer.scrollLeft = cur;
        syncSnap();
        return;
      }
      if (!raf) {
        lastFrame = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      const w = W();
      if (!raf) cur = outer.scrollLeft;
      const gliding = raf !== 0 || !isAligned(cur);
      const now = performance.now();
      const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      // A sideways-dominant event in the middle of a vertical gesture is trackpad wobble, not a
      // swipe; handing it to native scrolling would let CSS snap bounce the strip back
      const wobble = sideways && now - lastVerticalAt < 300;
      const horizontalIntent = sideways && !wobble;
      if (!sideways) lastVerticalAt = now;

      // Deliberate horizontal gestures on a resting strip stay native (trackpad swipe + snap)
      if (horizontalIntent && !gliding) return;

      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const d = (horizontalIntent ? e.deltaX : e.deltaY) * unit;
      if (d === 0) {
        if (wobble) e.preventDefault();
        return;
      }
      const dir = Math.sign(d);
      const x = raf ? targetX : cur;

      if (gliding || !isAligned(x)) {
        // Mid-slide: everything drives the strip, so native scrolling never fights the glide
        e.preventDefault();
        if (isAligned(x)) {
          // Already heading onto a panel edge: hold there until the slide lands, instead of
          // leaking the extra momentum into the incoming panel's vertical scroll
          const idx = Math.round(x / w);
          const next = idx + dir;
          if (raf && Math.sign(x - cur) === dir) return;
          if (next < 0 || next >= SECTION_IDS.length) return;
          glideTo(Math.min(x + w, Math.max(x - w, x + d * SPEED)));
          return;
        }
        const lo = Math.floor(x / w) * w;
        const hi = Math.ceil(x / w) * w;
        glideTo(Math.min(hi, Math.max(lo, x + d * SPEED)));
        return;
      }

      // Resting on a panel: scroll it vertically until its edge, then start sliding
      const idx = Math.round(x / w);
      const panel = document.getElementById(`section-${SECTION_IDS[idx]}`);
      if (!panel) return;
      const targetInPanel = e.target instanceof Node && panel.contains(e.target);
      // Native scrolling can only be trusted when the browser is aiming at the visible panel
      const manual = pointerStale || !targetInPanel || wobble || (vRaf !== 0 && vEl === panel);

      if (!manual && innerCanScroll(e.target, panel, dir)) return;
      if (!atEnd(panel, dir)) {
        if (manual) {
          e.preventDefault();
          scrollPanelBy(panel, d);
        }
        return;
      }

      const next = idx + dir;
      if (next < 0 || next >= SECTION_IDS.length) return;

      // Prepare the incoming panel so the path stays continuous
      const incoming = document.getElementById(`section-${SECTION_IDS[next]}`);
      if (incoming) incoming.scrollTop = dir > 0 ? 0 : incoming.scrollHeight;

      e.preventDefault();
      glideTo(Math.min(x + w, Math.max(x - w, x + d * SPEED)));
    };

    // Programmatic navigation (nav, arrows, hint pill) takes over from any glide in progress
    cancelWheelGlideRef.current = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      stopVertical();
      outer.style.scrollSnapType = "";
    };

    const freshPointer = () => {
      pointerStale = false;
    };

    outer.addEventListener("wheel", onWheel, { passive: false });
    outer.addEventListener("pointermove", freshPointer, { passive: true });
    outer.addEventListener("pointerdown", freshPointer, { passive: true });
    return () => {
      outer.removeEventListener("wheel", onWheel);
      outer.removeEventListener("pointermove", freshPointer);
      outer.removeEventListener("pointerdown", freshPointer);
      stopVertical();
      cancelAnimationFrame(raf);
      outer.style.scrollSnapType = "";
      cancelWheelGlideRef.current = () => {};
    };
  }, [isMobile]);

  useEffect(() => {
    window.addEventListener("navigateToSection", navigateToSection as EventListener);
    return () => window.removeEventListener("navigateToSection", navigateToSection as EventListener);
  }, [navigateToSection]);

  // On mount, check for a #section hash in the URL and navigate there
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const idx = SECTION_IDS.indexOf(hash);
    if (idx > 0) {
      // Small delay to let layout settle, then navigate
      const timer = setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('navigateToSection', { detail: { id: hash, index: idx } })
        );
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

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
      <SectionContinueHint sectionIds={SECTION_IDS} />

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
