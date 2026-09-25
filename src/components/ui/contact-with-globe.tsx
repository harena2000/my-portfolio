"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { geoGraticule, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import { cn } from "@/lib/utils";

type LatLng = [lat: number, lng: number];

interface GlobeMarker {
  location: LatLng;
  label?: string;
}

interface GlobeWireframeProps {
  className?: string;
  strokeWidth?: number;
  showGraticule?: boolean;
  graticuleOpacity?: number;
  /** Degrees per second */
  autoRotateSpeed?: number;
  /** When set, the globe stops auto-rotating and flies to this point */
  focus?: LatLng | null;
  initialLocation?: LatLng;
  markers?: GlobeMarker[];
  enableInteraction?: boolean;
}

interface WorldAtlas extends Topology {
  objects: { countries: GeometryCollection };
}

// Shared across instances; the atlas ships with the app and is loaded on demand
let countriesPromise: Promise<GeoPermissibleObjects[]> | null = null;
const loadCountries = () => {
  countriesPromise ??= import("world-atlas/countries-110m.json").then((mod) => {
    const world = (mod.default ?? mod) as unknown as WorldAtlas;
    return feature(world, world.objects.countries).features as GeoPermissibleObjects[];
  });
  return countriesPromise;
};

/** Shortest signed angular distance from a to b, in degrees */
const angleDelta = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;

export function GlobeWireframe({
  className,
  strokeWidth = 0.6,
  showGraticule = true,
  graticuleOpacity = 0.12,
  autoRotateSpeed = 8,
  focus = null,
  initialLocation = [0, 0],
  markers = [],
  enableInteraction = true,
}: GlobeWireframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  const [countries, setCountries] = useState<GeoPermissibleObjects[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // [lambda, phi] rotation, i.e. the negated lng/lat at the center of the view
  const [rotation, setRotation] = useState<[number, number]>([
    -initialLocation[1],
    -initialLocation[0],
  ]);
  const rotationRef = useRef(rotation);
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);
  const lastPointer = useRef<[number, number] | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Track size and visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize(entry.contentRect.width));
    const io = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.05,
    });
    ro.observe(el);
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // Load the atlas the first time the globe scrolls into view
  useEffect(() => {
    if (!isVisible || countries.length) return;
    let cancelled = false;
    loadCountries()
      .then((c) => !cancelled && setCountries(c))
      .catch((err) => console.error("Failed to load world atlas:", err));
    return () => {
      cancelled = true;
    };
  }, [isVisible, countries.length]);

  // Idle spin
  useEffect(() => {
    if (!isVisible || isDragging || focus || reducedMotion) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setRotation(([l, p]) => [(l + autoRotateSpeed * dt) % 360, p]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, isDragging, focus, reducedMotion, autoRotateSpeed]);

  // Fly to the focused location
  useEffect(() => {
    if (!focus || isDragging) return;
    const [from0, from1] = rotationRef.current;
    const to: [number, number] = [-focus[1], -focus[0]];
    const d0 = angleDelta(from0, to[0]);
    const d1 = to[1] - from1;
    const duration = reducedMotion ? 1 : 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setRotation([from0 + d0 * e, from1 + d1 * e]);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [focus, isDragging, reducedMotion]);

  const projection = useMemo(
    () =>
      geoOrthographic()
        .scale((size / 2) * 0.9)
        .translate([size / 2, size / 2])
        .rotate(rotation)
        .precision(0.3),
    [size, rotation]
  );
  const path = useMemo(() => geoPath(projection), [projection]);
  const graticule = useMemo(() => geoGraticule()(), []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!enableInteraction) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPointer.current = [e.clientX, e.clientY];
    setIsDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !lastPointer.current) return;
    const dx = e.clientX - lastPointer.current[0];
    const dy = e.clientY - lastPointer.current[1];
    lastPointer.current = [e.clientX, e.clientY];
    const k = 0.4;
    setRotation(([l, p]) => [l + dx * k, Math.max(-90, Math.min(90, p - dy * k))]);
  };
  const endDrag = () => {
    lastPointer.current = null;
    setIsDragging(false);
  };

  // A marker is visible when it sits on the hemisphere facing the viewer
  const center: [number, number] = [-rotation[0], -rotation[1]];
  const isFrontFacing = ([lat, lng]: LatLng) => {
    const toRad = Math.PI / 180;
    const cosC =
      Math.sin(center[1] * toRad) * Math.sin(lat * toRad) +
      Math.cos(center[1] * toRad) * Math.cos(lat * toRad) * Math.cos((lng - center[0]) * toRad);
    return cosC > 0;
  };

  return (
    <div ref={containerRef} className={cn("relative aspect-square w-full", className)}>
      {size > 0 && (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cn(
            "absolute inset-0 overflow-visible transition-opacity duration-1000 touch-pan-y",
            countries.length ? "opacity-100" : "opacity-0",
            enableInteraction && (isDragging ? "cursor-grabbing" : "cursor-grab")
          )}
          role="img"
          aria-label="Rotating globe"
        >
          <defs>
            <radialGradient id="globe-glow" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="rgb(59 130 246 / 0.14)" />
              <stop offset="100%" stopColor="rgb(59 130 246 / 0)" />
            </radialGradient>
          </defs>
          <path d={path({ type: "Sphere" }) ?? ""} fill="url(#globe-glow)" />
          {showGraticule && (
            <path
              d={path(graticule) ?? ""}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.6}
              opacity={graticuleOpacity}
            />
          )}
          <g fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round">
            {countries.map((c, i) => (
              <path key={i} d={path(c) ?? ""} />
            ))}
          </g>
          <path
            d={path({ type: "Sphere" }) ?? ""}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            opacity={0.6}
          />
          {markers.map((m, i) => {
            if (!isFrontFacing(m.location)) return null;
            const p = projection([m.location[1], m.location[0]]);
            if (!p) return null;
            return (
              <g key={i} transform={`translate(${p[0]} ${p[1]})`} className="text-blue-400">
                <circle r={10} fill="currentColor" opacity={0.25} className="animate-ping [transform-box:fill-box] [transform-origin:center]" />
                <circle r={4} fill="currentColor" stroke="white" strokeWidth={1.5} />
                {m.label && (
                  <text
                    x={9}
                    y={4}
                    fill="white"
                    fontSize={11}
                    fontWeight={600}
                    style={{ paintOrder: "stroke" }}
                    stroke="rgb(5 13 31 / 0.85)"
                    strokeWidth={3}
                  >
                    {m.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

/** Dotted horizontal rule */
export function FormDots({ className }: { className?: string }) {
  return (
    <div role="separator" aria-hidden className={cn("relative h-4 w-full shrink-0 text-white/20", className)}>
      <div
        className="absolute inset-0 bg-repeat"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
          backgroundSize: "6px 100%",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      />
    </div>
  );
}
