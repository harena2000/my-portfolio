"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { ArrowRight, ArrowUpRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  /** 0–100, drives the node glow size and the progress bar */
  energy?: number;
  tags?: string[];
  /** Call-to-action shown at the bottom of the card */
  link?: { href: string; label: string; external?: boolean };
}

export interface RadialOrbitalTimelineLabels {
  completed: string;
  inProgress: string;
  pending: string;
  energy: string;
  tags: string;
  related: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  /** Rendered inside the pulsing core (e.g. a profile photo) */
  center?: React.ReactNode;
  labels?: Partial<RadialOrbitalTimelineLabels>;
  className?: string;
}

const DEFAULT_LABELS: RadialOrbitalTimelineLabels = {
  completed: "COMPLETE",
  inProgress: "IN PROGRESS",
  pending: "PENDING",
  energy: "Energy Level",
  tags: "Stack",
  related: "Connected Nodes",
};

const MAX_RADIUS = 220;
const NODE_SIZE = 44;
/** Degrees per second while auto-rotating */
const ROTATION_SPEED = 6;

export default function RadialOrbitalTimeline({
  timelineData,
  center,
  labels: labelOverrides,
  className,
}: RadialOrbitalTimelineProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };

  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [radius, setRadius] = useState(MAX_RADIUS);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  const autoRotate =
    activeNodeId === null && !isHovered && isVisible && !reducedMotion;

  // Respect the OS "reduce motion" setting
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Only animate while on screen (panels live side by side in a snap scroller)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Fit the orbit to the available width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const fit = Math.min(width, height) / 2 - NODE_SIZE - 16;
      setRadius(Math.max(110, Math.min(MAX_RADIUS, fit)));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Smooth, frame-rate independent rotation
  useEffect(() => {
    if (!autoRotate) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      setRotationAngle((prev) => (prev + ROTATION_SPEED * delta) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate]);

  const close = useCallback(() => setActiveNodeId(null), []);

  // Escape closes the open card
  useEffect(() => {
    if (activeNodeId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeNodeId, close]);

  const openNode = (id: number) => {
    if (activeNodeId === id) {
      close();
      return;
    }
    setActiveNodeId(id);

    // Rotate so the selected node sits at the top, taking the shortest path
    const index = timelineData.findIndex((item) => item.id === id);
    const target = 270 - (index / timelineData.length) * 360;
    setRotationAngle((prev) => {
      const diff = ((((target - prev) % 360) + 540) % 360) - 180;
      return prev + diff;
    });
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      close();
    }
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = (index / total) * 360 + rotationAngle;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    // Nodes toward the bottom feel "closer": brighter and on top
    const depth = (1 + Math.sin(radian)) / 2;
    const zIndex = Math.round(100 + 50 * depth);
    const opacity = 0.5 + 0.5 * depth;

    return { x, y, zIndex, opacity };
  };

  const activeItem = timelineData.find((item) => item.id === activeNodeId);
  const isRelatedToActive = (id: number) =>
    activeItem?.relatedIds.includes(id) ?? false;

  const statusLabel = (status: TimelineItem["status"]) =>
    status === "completed"
      ? labels.completed
      : status === "in-progress"
        ? labels.inProgress
        : labels.pending;

  const statusStyles = (status: TimelineItem["status"]) =>
    status === "in-progress"
      ? "text-emerald-300 bg-emerald-500/15 border-emerald-400/40"
      : status === "completed"
        ? "text-blue-200 bg-blue-500/15 border-blue-400/40"
        : "text-white/60 bg-white/5 border-white/20";

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full h-[clamp(480px,calc(100dvh-290px),640px)] flex items-center justify-center overflow-hidden select-none",
        className
      )}
    >
      <div
        ref={orbitRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1000px" }}
      >
        {/* Core */}
        <div
          className={cn(
            "absolute w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center z-10 transition-opacity duration-500",
            activeNodeId !== null && "opacity-40"
          )}
        >
          <div className="absolute w-24 h-24 rounded-full border border-blue-300/25 animate-ping opacity-70 [animation-duration:2.5s]" />
          <div className="absolute w-28 h-28 rounded-full border border-blue-300/15 animate-ping opacity-50 [animation-duration:2.5s] [animation-delay:0.8s]" />
          <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden bg-[#050d1f] ring-2 ring-white/20">
            {center}
          </div>
        </div>

        {/* Orbit rings */}
        <div
          className="absolute rounded-full border border-blue-400/15 pointer-events-none"
          style={{ width: radius * 2, height: radius * 2 }}
        />
        <div
          className="absolute rounded-full border border-dashed border-white/5 pointer-events-none"
          style={{ width: radius * 2 + 60, height: radius * 2 + 60 }}
        />

        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = activeNodeId === item.id;
          const isRelated = isRelatedToActive(item.id);
          const Icon = item.icon;
          const energy = item.energy ?? 60;
          const glow = energy * 0.5 + NODE_SIZE;

          return (
            <div
              key={item.id}
              className={cn(
                "absolute",
                // Only ease while snapping to a node; auto-rotation is per-frame
                !autoRotate && "transition-[transform,opacity] duration-700 ease-out"
              )}
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: isExpanded ? 200 : position.zIndex,
                opacity: isExpanded || isRelated ? 1 : activeNodeId !== null ? 0.45 : position.opacity,
              }}
            >
              {/* Glow */}
              <div
                className={cn(
                  "absolute rounded-full pointer-events-none",
                  isRelated && "animate-pulse"
                )}
                style={{
                  background:
                    "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0) 70%)",
                  width: glow,
                  height: glow,
                  left: -(glow - NODE_SIZE) / 2,
                  top: -(glow - NODE_SIZE) / 2,
                }}
              />

              <button
                type="button"
                aria-expanded={isExpanded}
                aria-label={`${item.title}${item.subtitle ? ` — ${item.subtitle}` : ""}, ${item.date}`}
                onClick={(e) => {
                  e.stopPropagation();
                  openNode(item.id);
                }}
                className={cn(
                  "relative w-11 h-11 rounded-full flex items-center justify-center border-2 cursor-pointer",
                  "transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-blue-400/50",
                  isExpanded
                    ? "bg-blue-500 text-white border-blue-200 shadow-[0_0_30px_rgba(59,130,246,0.7)] scale-125"
                    : isRelated
                      ? "bg-blue-500/30 text-white border-blue-300 animate-pulse"
                      : "bg-[#07112a] text-blue-200 border-blue-400/40 hover:border-blue-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.45)]"
                )}
              >
                <Icon size={18} />
              </button>

              <div
                className={cn(
                  "absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none transition-all duration-300",
                  isExpanded && "opacity-0"
                )}
              >
                <div className="text-xs font-semibold tracking-wide text-white/85">
                  {item.title}
                </div>
                {item.subtitle && (
                  <div className="text-[10px] font-medium text-blue-300/70">
                    {item.subtitle}
                  </div>
                )}
              </div>

              {isExpanded && (
                <Card
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-16 left-1/2 -translate-x-1/2 w-72 gap-3 py-4 bg-[#050d1f]/95 backdrop-blur-lg border-blue-400/30 text-white shadow-xl shadow-blue-500/10 overflow-visible animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-blue-300/50" />
                  <CardHeader className="px-4 gap-1">
                    <div className="flex justify-between items-center gap-2">
                      <Badge className={cn("px-2 text-[10px] tracking-wider", statusStyles(item.status))}>
                        {statusLabel(item.status)}
                      </Badge>
                      <span className="text-[11px] font-mono text-white/50 text-right">
                        {item.date}
                      </span>
                    </div>
                    <CardTitle className="text-sm mt-1 text-white">
                      {item.title}
                    </CardTitle>
                    {item.subtitle && (
                      <span className="text-xs font-medium text-blue-400">
                        {item.subtitle}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="px-4 text-xs text-white/75 leading-relaxed max-h-[clamp(160px,calc(100dvh-500px),340px)] overflow-y-auto scrollbar-furtif">
                    <p>{item.content}</p>

                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-[10px] uppercase tracking-wider font-medium text-white/50 mb-2">
                          {labels.tags}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-400/20 text-[11px] text-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.energy !== undefined && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center mb-1">
                          <span className="flex items-center">
                            <Zap size={10} className="mr-1" />
                            {labels.energy}
                          </span>
                          <span className="font-mono">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                            style={{ width: `${item.energy}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {item.relatedIds.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center mb-2">
                          <Link size={10} className="text-white/50 mr-1" />
                          <h4 className="text-[10px] uppercase tracking-wider font-medium text-white/50">
                            {labels.related}
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relatedId) => {
                            const relatedItem = timelineData.find((i) => i.id === relatedId);
                            if (!relatedItem) return null;
                            return (
                              <Button
                                key={relatedId}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 py-0 text-[11px] gap-1 border-white/15 bg-transparent hover:bg-blue-500/15 text-white/80 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openNode(relatedId);
                                }}
                              >
                                {relatedItem.title}
                                <ArrowRight className="size-3 text-white/50" />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {item.link && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        {item.link.external ? (
                          <a
                            href={item.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {item.link.label}
                            <ArrowUpRight className="size-3.5" />
                          </a>
                        ) : (
                          <NextLink
                            href={item.link.href}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {item.link.label}
                            <ArrowRight className="size-3.5" />
                          </NextLink>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
