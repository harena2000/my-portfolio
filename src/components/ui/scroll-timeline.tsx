"use client";

/**
 * Vertical timeline whose rail "draws" itself as the user scrolls.
 * Nodes light up as the fill passes them and cards reveal on entry.
 *
 * Works inside a scrollable ancestor (e.g. a snap panel with overflow-y:auto)
 * as well as with window scrolling.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ScrollTimelineItem {
  id: string | number;
  /** Full date range, e.g. "Jan 2026 — Jun 2026" */
  date: string;
  /** Short sticky label shown in the left column on desktop, e.g. "2026" */
  marker?: string;
  title: string;
  subtitle?: string;
  content: string;
  tags?: string[];
  icon?: React.ElementType<{ className?: string }>;
  current?: boolean;
}

interface ScrollTimelineLabels {
  current: string;
  past: string;
  stack: string;
}

interface ScrollTimelineProps {
  items: ScrollTimelineItem[];
  labels?: Partial<ScrollTimelineLabels>;
  className?: string;
}

const DEFAULT_LABELS: ScrollTimelineLabels = {
  current: "Current",
  past: "Past",
  stack: "Stack",
};

// Rail x-position = center of the node column
const RAIL = "left-[18px] md:left-[162px]";

/**
 * Nearest ancestor that actually scrolls vertically, or null for the window.
 * Wrappers marked overflow-y:auto that grow with their content are skipped.
 */
function findScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node && node !== document.body) {
    const { overflowY } = getComputedStyle(node);
    const scrollable = overflowY === "auto" || overflowY === "scroll";
    if (scrollable && node.scrollHeight > node.clientHeight + 1) return node;
    node = node.parentElement;
  }
  return null;
}

export default function ScrollTimeline({ items, labels: labelOverrides, className }: ScrollTimelineProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const reducedMotion = useReducedMotion();

  const listRef = useRef<HTMLOListElement>(null);
  // IntersectionObserver root: the scroll parent, or null for the viewport
  const rootRef = useRef<HTMLElement | null>(null);
  // useScroll container: never null (framer-motion waits forever on an empty ref);
  // document.scrollingElement means "the window"
  const scrollerRef = useRef<HTMLElement | null>(null);

  // Resolve before framer-motion's effects read the refs
  useLayoutEffect(() => {
    rootRef.current = findScrollParent(listRef.current);
    scrollerRef.current =
      rootRef.current ?? (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
  }, []);

  // Progress of the list through the viewport...
  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    container: scrollerRef,
    offset: ["start 65%", "end 65%"],
  });
  // ...and of the scroll container itself, so reaching the bottom always completes the line
  const { scrollYProgress: containerProgress } = useScroll({ container: scrollerRef });

  // When the container can't scroll at all, draw the whole line once the list is visible
  const noScrollFill = useMotionValue(0);
  const listInView = useInView(listRef, { root: rootRef, amount: 0.3 });
  useEffect(() => {
    if (!listInView) return;
    const el = scrollerRef.current;
    if (el && el.scrollHeight - el.clientHeight < 8) noScrollFill.set(1);
  }, [listInView, noScrollFill]);

  const rawFill = useTransform(
    [listProgress, containerProgress, noScrollFill] as MotionValue<number>[],
    ([list, container, fallback]: number[]) =>
      reducedMotion ? 1 : Math.max(list, container >= 0.99 ? 1 : 0, fallback)
  );
  const fill = useSpring(rawFill, { stiffness: 140, damping: 30, mass: 0.4 });
  const tipTop = useTransform(fill, (v) => `${v * 100}%`);
  const tipOpacity = useTransform(fill, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <ol ref={listRef} className={cn("relative space-y-8 md:space-y-10", className)}>
      {/* Rail */}
      <div aria-hidden className={cn("absolute top-2 bottom-2 w-px -translate-x-1/2 bg-white/10", RAIL)}>
        <motion.div
          className="absolute inset-x-[-3px] top-0 h-full origin-top rounded-full bg-gradient-to-b from-blue-400 via-blue-500 to-cyan-400 opacity-60 blur-[4px]"
          style={{ scaleY: fill }}
        />
        <motion.div
          className="absolute inset-0 origin-top bg-gradient-to-b from-blue-400 via-blue-500 to-cyan-400"
          style={{ scaleY: fill }}
        />
        <motion.div
          className="absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_4px_rgba(34,211,238,0.6)]"
          style={{ top: tipTop, opacity: tipOpacity }}
        />
      </div>

      {items.map((item) => (
        <TimelineRow
          key={item.id}
          item={item}
          labels={labels}
          fill={fill}
          listRef={listRef}
          rootRef={rootRef}
          reducedMotion={!!reducedMotion}
        />
      ))}
    </ol>
  );
}

function TimelineRow({
  item,
  labels,
  fill,
  listRef,
  rootRef,
  reducedMotion,
}: {
  item: ScrollTimelineItem;
  labels: ScrollTimelineLabels;
  fill: MotionValue<number>;
  listRef: React.RefObject<HTMLOListElement | null>;
  rootRef: React.RefObject<HTMLElement | null>;
  reducedMotion: boolean;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(reducedMotion);
  const Icon = item.icon;

  // Light the node once the drawn line reaches it
  useMotionValueEvent(fill, "change", (v) => {
    const node = nodeRef.current;
    const list = listRef.current;
    if (!node || !list) return;
    const nodeCenter =
      node.getBoundingClientRect().top + node.offsetHeight / 2 - list.getBoundingClientRect().top;
    setLit(v * list.offsetHeight >= nodeCenter - 8);
  });

  return (
    <li className="relative flex gap-4 md:gap-6">
      {/* Sticky year (desktop) */}
      <div className="hidden md:block w-[120px] shrink-0 text-right">
        <div className="sticky top-24 pt-3">
          <div
            className={cn(
              "text-3xl font-bold tracking-tight tabular-nums transition-colors duration-500",
              lit ? "text-white" : "text-white/20"
            )}
          >
            {item.marker ?? item.date}
          </div>
          <div className={cn("mt-1 text-xs transition-colors duration-500", lit ? "text-blue-300/80" : "text-white/25")}>
            {item.date}
          </div>
        </div>
      </div>

      {/* Node */}
      <div aria-hidden className="relative z-10 w-9 shrink-0 pt-4">
        <div
          ref={nodeRef}
          className={cn(
            "relative flex size-9 items-center justify-center rounded-full border-2 bg-[#050d1f] transition-all duration-500",
            lit
              ? "border-blue-400 text-blue-200 shadow-[0_0_18px_rgba(59,130,246,0.55)]"
              : "border-white/15 text-white/30"
          )}
        >
          {item.current && lit && (
            <span className="absolute inset-[-5px] rounded-full border border-emerald-400/60 animate-ping [animation-duration:2s]" />
          )}
          {Icon && <Icon className="size-4" />}
        </div>
      </div>

      {/* Card */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ root: rootRef, once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          "group min-w-0 flex-1 rounded-xl border bg-white/5 p-4 backdrop-blur-sm transition-colors duration-300 sm:p-5",
          "hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
          lit ? "border-blue-500/25" : "border-white/10"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-tight text-white transition-colors duration-150 group-hover:text-blue-300 sm:text-lg">
              {item.title}
            </h3>
            {item.subtitle && <p className="mt-1 text-sm font-medium text-blue-400">{item.subtitle}</p>}
          </div>
          <Badge
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[11px]",
              item.current
                ? "border-emerald-500/30 bg-emerald-900/30 text-emerald-400"
                : "border-gray-700 bg-gray-800/80 text-gray-400"
            )}
          >
            {item.current && <span className="size-1.5 rounded-full bg-emerald-400" />}
            {item.current ? labels.current : labels.past}
          </Badge>
        </div>

        {/* Date inline on mobile (desktop shows it in the sticky column) */}
        <p className="mt-2 text-xs text-gray-500 md:hidden">{item.date}</p>

        <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.content}</p>

        {item.tags && item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/5 pt-3" aria-label={labels.stack}>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-blue-400/20 bg-blue-500/10 px-2 py-0.5 text-[11px] text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </li>
  );
}
