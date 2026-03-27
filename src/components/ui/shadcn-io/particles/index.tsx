'use client';

import React, { useEffect, useRef, memo } from "react";
import { cn } from "@/lib/utils";

export interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  color?: string;
  vx?: number;
  vy?: number;
  refresh?: boolean;
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const ParticlesInner: React.FC<ParticlesProps> = ({
  className = '',
  quantity = 60,
  staticity = 50,
  ease = 50,
  size = 0.5,
  color = '#3b82f6',
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const rgb = hexToRgb(color);
    let W = 0, H = 0;
    let rafId: number;
    const mouse = { x: 0, y: 0 };
    let mouseThrottle = 0;
    let isVisible = true;

    type Particle = {
      x: number; y: number;
      tx: number; ty: number;
      sz: number;
      alpha: number; targetAlpha: number;
      dx: number; dy: number;
      mag: number;
    };

    let particles: Particle[] = [];

    function makeParticle(): Particle {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        tx: 0, ty: 0,
        sz: size + Math.random() * size,
        alpha: 0,
        targetAlpha: 0.1 + Math.random() * 0.5,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.15,
        mag: 0.5 + Math.random() * 3,
      };
    }

    function resize() {
      W = container!.offsetWidth;
      H = container!.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + 'px';
      canvas!.style.height = H + 'px';
      ctx!.scale(dpr, dpr);
      particles = Array.from({ length: quantity }, makeParticle);
    }

    // Use IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          rafId = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Throttled mouse handler
    function onMouseMove(e: MouseEvent) {
      const now = performance.now();
      if (now - mouseThrottle < 50) return; // ~20fps throttle for mouse
      mouseThrottle = now;
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left - W / 2;
      mouse.y = e.clientY - rect.top - H / 2;
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let lastTime = 0;
    const TARGET_FPS = 30; // Cap at 30fps — particles don't need 60fps
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    function draw(now: number) {
      if (!isVisible) {
        rafId = 0;
        return;
      }

      rafId = requestAnimationFrame(draw);

      // Throttle to target FPS
      const delta = now - lastTime;
      if (delta < FRAME_INTERVAL) return;
      lastTime = now - (delta % FRAME_INTERVAL);

      ctx!.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Edge fade
        const edge = Math.min(p.x + p.tx, W - p.x - p.tx, p.y + p.ty, H - p.y - p.ty);
        const fade = Math.min(1, Math.max(0, edge / 20));
        if (fade > 0.01) {
          p.alpha += (p.targetAlpha * fade - p.alpha) * 0.05;
        } else {
          p.alpha *= 0.95;
        }

        // Move
        p.x += p.dx + vx;
        p.y += p.dy + vy;

        // Magnetic pull toward mouse (eased)
        p.tx += (mouse.x / (staticity / p.mag) - p.tx) / ease;
        p.ty += (mouse.y / (staticity / p.mag) - p.ty) / ease;

        // Wrap around
        if (p.x < -p.sz) p.x = W + p.sz;
        else if (p.x > W + p.sz) p.x = -p.sz;
        if (p.y < -p.sz) p.y = H + p.sz;
        else if (p.y > H + p.sz) p.y = -p.sz;

        if (p.alpha < 0.01) continue;

        // Draw without save/restore for better performance
        ctx!.beginPath();
        ctx!.arc(p.x + p.tx, p.y + p.ty, p.sz, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${p.alpha})`;
        ctx!.fill();
      }
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, quantity]);

  return (
    <div ref={containerRef} className={cn('pointer-events-none', className)} aria-hidden>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export const Particles = memo(ParticlesInner);
Particles.displayName = 'Particles';
