"use client";

import { useEffect, useRef, type RefObject } from "react";
import { SECTIONS } from "@/lib/section-map";

type FlyOptions = { instant?: boolean; align?: "start" | "end" };

export interface SectionCamera {
  /** Glide straight (diagonally if needed) to a section */
  flyTo: (index: number, options?: FlyOptions) => void;
}

const SPEED = 1.15; // camera px per wheel px
const FOLLOW = 0.18; // easing per 60fps frame
const FLY_MS = 800;
const LAST = SECTIONS.length - 1;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Desktop camera over the staircase section map (src/lib/section-map.ts).
 *
 * The wheel scrolls the current section's content; once it reaches the end, the same wheel
 * movement carries the camera along the path to the next section (down or right), inch by inch.
 * The camera stays wherever the user stops. Navigation jumps fly straight to the target.
 *
 * `progress` is a position along the path: 0 = Home, 1 = Skills, … fractional mid-way.
 */
export function useSectionCamera({
  enabled,
  viewportRef,
  worldRef,
}: {
  enabled: boolean;
  viewportRef: RefObject<HTMLDivElement | null>;
  worldRef: RefObject<HTMLDivElement | null>;
}) {
  const api = useRef<SectionCamera>({ flyTo: () => {} });

  useEffect(() => {
    if (!enabled) return;
    const viewport = viewportRef.current;
    const world = worldRef.current;
    if (!viewport || !world) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── camera state ───────────────────────────────────────────
    let cur = 0; // rendered progress
    let target = 0; // where the wheel glide is heading
    let raf = 0;
    let lastFrame = 0;
    let fly: { fromX: number; fromY: number; index: number; start: number } | null = null;
    let flyRaf = 0;
    let emitted = -1;
    let camX = 0; // last applied camera position
    let camY = 0;
    let lastVerticalAt = 0;
    // After the camera moves, the cursor hasn't: the browser keeps aiming wheel events at the
    // section that moved away. Until the pointer moves again we scroll the visible one ourselves.
    let pointerStale = false;
    let vEl: HTMLElement | null = null;
    let vCur = 0;
    let vTarget = 0;
    let vRaf = 0;
    let vLastFrame = 0;

    const W = () => window.innerWidth || 1;
    const H = () => window.innerHeight || 1;
    const panelAt = (i: number) => document.getElementById(`section-${SECTIONS[i]?.id}`);
    const posOf = (i: number) => ({ x: SECTIONS[i].col * W(), y: SECTIONS[i].row * H() });
    /** Length in px of the leg from section i to i + 1 */
    const legLen = (i: number) => (SECTIONS[i + 1] && SECTIONS[i + 1].row !== SECTIONS[i].row ? H() : W());
    const cameraAt = (p: number) => {
      const i = Math.min(Math.floor(p), LAST);
      if (i >= LAST) return posOf(LAST);
      const a = posOf(i);
      const b = posOf(i + 1);
      const f = p - i;
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
    };
    const isAligned = (p: number) => {
      const r = Math.round(p);
      return Math.abs(p - r) * legLen(Math.min(Math.floor(p), LAST - 1)) < 0.5;
    };
    const atEnd = (el: HTMLElement, dir: number) =>
      dir > 0 ? el.scrollTop + el.clientHeight >= el.scrollHeight - 2 : el.scrollTop <= 2;

    /** True if a scroller between the target and the panel can still move that way */
    const innerCanScroll = (node: EventTarget | null, panel: HTMLElement, dir: number) => {
      let el = node instanceof HTMLElement ? node : null;
      while (el && el !== panel) {
        const { overflowY } = getComputedStyle(el);
        if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight && !atEnd(el, dir)) {
          return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    // ── rendering ──────────────────────────────────────────────
    const setCells = () => {
      world.style.setProperty("--cell-w", `${W()}px`);
      world.style.setProperty("--cell-h", `${H()}px`);
    };
    const apply = (x: number, y: number) => {
      camX = x;
      camY = y;
      world.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
    };
    const emit = (index: number) => {
      if (index === emitted) return;
      emitted = index;
      window.dispatchEvent(new CustomEvent("sectionChanged", { detail: { index } }));
    };
    // Sections the camera can see keep animating; the rest get [data-offscreen], which pauses
    // their looping CSS animations (see globals.css). `null` = all active (during a flight).
    let visibleKey = "";
    const setVisible = (indices: number[] | null) => {
      const key = indices ? indices.join(",") : "all";
      if (key === visibleKey) return;
      visibleKey = key;
      SECTIONS.forEach((_, i) => {
        const panel = panelAt(i);
        if (!panel) return;
        if (!indices || indices.includes(i)) panel.removeAttribute("data-offscreen");
        else panel.setAttribute("data-offscreen", "");
      });
    };
    const render = () => {
      const { x, y } = cameraAt(cur);
      apply(x, y);
      emit(Math.round(cur));
      setVisible([...new Set([Math.floor(cur), Math.ceil(cur)])]);
    };

    /** Frame-rate independent exponential easing step */
    const ease = (from: number, to: number, dt: number, epsilon: number) => {
      const next = from + (to - from) * (1 - Math.pow(1 - FOLLOW, dt / 16.67));
      return Math.abs(to - next) < epsilon ? to : next;
    };

    // ── wheel glide along the path ─────────────────────────────
    const tick = (now: number) => {
      const dt = lastFrame ? Math.min(now - lastFrame, 64) : 16.67;
      lastFrame = now;
      cur = ease(cur, target, dt, 0.5 / legLen(Math.min(Math.floor(cur), LAST - 1)));
      render();
      raf = cur === target ? 0 : requestAnimationFrame(tick);
    };

    const stopVertical = () => {
      cancelAnimationFrame(vRaf);
      vRaf = 0;
    };

    const glideTo = (p: number) => {
      target = Math.min(LAST, Math.max(0, p));
      pointerStale = true;
      stopVertical();
      if (reduceMotion) {
        cur = target;
        render();
        return;
      }
      if (!raf) {
        lastFrame = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    // ── manual vertical scroll of the visible section ──────────
    const vTick = (now: number) => {
      if (!vEl) return;
      const dt = vLastFrame ? Math.min(now - vLastFrame, 64) : 16.67;
      vLastFrame = now;
      vCur = ease(vCur, vTarget, dt, 0.5);
      vEl.scrollTop = vCur;
      vRaf = vCur === vTarget ? 0 : requestAnimationFrame(vTick);
    };

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

    // ── straight "fly to" for navigation ───────────────────────
    const flyTick = (now: number) => {
      if (!fly) return;
      const to = posOf(fly.index);
      const t = Math.min((now - fly.start) / FLY_MS, 1);
      const e = easeInOutCubic(t);
      apply(fly.fromX + (to.x - fly.fromX) * e, fly.fromY + (to.y - fly.fromY) * e);
      if (t < 1) {
        flyRaf = requestAnimationFrame(flyTick);
        return;
      }
      cur = target = fly.index;
      fly = null;
      flyRaf = 0;
      render();
    };

    const flyTo = (index: number, options: FlyOptions = {}) => {
      if (index < 0 || index > LAST) return;
      cancelAnimationFrame(raf);
      raf = 0;
      cancelAnimationFrame(flyRaf);
      stopVertical();
      pointerStale = true;

      const panel = panelAt(index);
      if (panel) panel.scrollTop = options.align === "end" ? panel.scrollHeight : 0;

      emit(index);
      if (options.instant || reduceMotion) {
        fly = null;
        cur = target = index;
        render();
        return;
      }
      // Start from wherever the camera is now (possibly mid-flight)
      fly = { fromX: camX, fromY: camY, index, start: performance.now() };
      setVisible(null);
      flyRaf = requestAnimationFrame(flyTick);
    };
    api.current = { flyTo };

    // ── wheel input ────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      if (fly) {
        e.preventDefault(); // let the navigation glide finish
        return;
      }
      if (!raf) cur = target;
      const gliding = raf !== 0 || !isAligned(cur);
      const now = performance.now();
      const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      // A sideways-dominant event in the middle of a vertical gesture is trackpad wobble
      const wobble = sideways && now - lastVerticalAt < 300;
      if (!sideways) lastVerticalAt = now;

      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      // Both axes travel along the path: down/right = forward, up/left = back
      const d = (sideways && !wobble ? e.deltaX : e.deltaY) * unit;
      if (d === 0) {
        e.preventDefault();
        return;
      }
      const dir = Math.sign(d);
      const p = raf ? target : cur;

      if (gliding || !isAligned(p)) {
        // Mid-leg: every wheel event drives the camera
        e.preventDefault();
        if (isAligned(p)) {
          const idx = Math.round(p);
          // Heading onto a section: hold until the camera lands, instead of leaking momentum
          // into the incoming section's own scroll
          if (raf && Math.sign(p - cur) === dir) return;
          if (idx + dir < 0 || idx + dir > LAST) return;
          const leg = dir > 0 ? idx : idx - 1;
          glideTo(Math.min(idx + 1, Math.max(idx - 1, p + (d * SPEED) / legLen(leg))));
          return;
        }
        const lo = Math.floor(p);
        glideTo(Math.min(lo + 1, Math.max(lo, p + (d * SPEED) / legLen(lo))));
        return;
      }

      // Resting on a section: scroll its content until the edge, then start the next leg
      const idx = Math.round(p);
      const panel = panelAt(idx);
      if (!panel) return;
      const targetInPanel = e.target instanceof Node && panel.contains(e.target);
      // Native scrolling can only be trusted when the browser aims at the visible section
      const manual = pointerStale || !targetInPanel || sideways || (vRaf !== 0 && vEl === panel);

      if (!manual && innerCanScroll(e.target, panel, dir)) return;
      if (!atEnd(panel, dir)) {
        if (manual) {
          e.preventDefault();
          scrollPanelBy(panel, d);
        }
        return;
      }

      const next = idx + dir;
      if (next < 0 || next > LAST) {
        e.preventDefault();
        return;
      }
      // Prepare the incoming section so the path stays continuous
      const incoming = panelAt(next);
      if (incoming) incoming.scrollTop = dir > 0 ? 0 : incoming.scrollHeight;

      e.preventDefault();
      const leg = dir > 0 ? idx : idx - 1;
      glideTo(Math.min(idx + 1, Math.max(idx - 1, p + (d * SPEED) / legLen(leg))));
    };

    // ── keyboard: ← / → step along the path ────────────────────
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const p = fly ? fly.index : cur;
      const index = e.key === "ArrowRight" ? Math.floor(p + 0.01) + 1 : Math.ceil(p - 0.01) - 1;
      flyTo(Math.min(LAST, Math.max(0, index)));
    };

    // ── focus safety ───────────────────────────────────────────
    // Tabbing into an off-camera section brings the camera there
    const onFocusIn = (e: FocusEvent) => {
      const section = (e.target as HTMLElement | null)?.closest?.('[id^="section-"]');
      if (!section) return;
      const index = SECTIONS.findIndex((s) => `section-${s.id}` === section.id);
      if (index < 0) return;
      if (fly ? fly.index !== index : !(isAligned(cur) && Math.round(cur) === index)) flyTo(index);
    };
    // Browsers may scroll an overflow:hidden box to reveal a focused element; undo that
    const onViewportScroll = () => {
      if (viewport.scrollTop || viewport.scrollLeft) viewport.scrollTo(0, 0);
    };
    const freshPointer = () => {
      pointerStale = false;
    };
    const onResize = () => {
      setCells();
      if (fly) return;
      render();
    };

    setCells();
    render();

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointermove", freshPointer, { passive: true });
    viewport.addEventListener("pointerdown", freshPointer, { passive: true });
    viewport.addEventListener("focusin", onFocusIn);
    viewport.addEventListener("scroll", onViewportScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointermove", freshPointer);
      viewport.removeEventListener("pointerdown", freshPointer);
      viewport.removeEventListener("focusin", onFocusIn);
      viewport.removeEventListener("scroll", onViewportScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(flyRaf);
      stopVertical();
      api.current = { flyTo: () => {} };
    };
  }, [enabled, viewportRef, worldRef]);

  return api;
}
