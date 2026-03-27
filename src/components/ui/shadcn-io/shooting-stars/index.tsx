'use client';

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, memo } from "react";

interface ShootingStarsProps {
  className?: string;
  starColor?: string;
  trailColor?: string;
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starWidth?: number;
  starHeight?: number;
}

interface Star {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  opacity: number;
  active: boolean;
  timer: number;
  delay: number;
}

const ShootingStarsInner: React.FC<ShootingStarsProps> = ({
  className,
  minSpeed = 8,
  maxSpeed = 18,
  minDelay = 800,
  maxDelay = 2400,
  starHeight = 1.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let W = 0, H = 0;
    let isVisible = true;

    const stars: Star[] = Array.from({ length: 4 }, () => createStar(0, 0)); // Reduced from 6 to 4

    function createStar(W: number, H: number): Star {
      const side = Math.floor(Math.random() * 2);
      const x = side === 0 ? Math.random() * (W || window.innerWidth) : 0;
      const y = side === 0 ? 0 : Math.random() * (H || window.innerHeight);
      return {
        x, y,
        angle: 35 + Math.random() * 20,
        speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
        length: 60 + Math.random() * 80,
        opacity: 0,
        active: false,
        timer: 0,
        delay: minDelay + Math.random() * (maxDelay - minDelay),
      };
    }

    function resize() {
      W = canvas!.width = canvas!.offsetWidth;
      H = canvas!.height = canvas!.offsetHeight;
    }

    // Use IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          last = performance.now();
          rafId = requestAnimationFrame(draw);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let last = performance.now();
    let lastDraw = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    function draw(now: number) {
      if (!isVisible) {
        rafId = 0;
        return;
      }

      rafId = requestAnimationFrame(draw);

      // Throttle to 30fps
      const drawDelta = now - lastDraw;
      if (drawDelta < FRAME_INTERVAL) return;
      lastDraw = now - (drawDelta % FRAME_INTERVAL);

      const dt = Math.min(now - last, 32);
      last = now;

      ctx!.clearRect(0, 0, W, H);

      for (const s of stars) {
        if (!s.active) {
          s.timer += dt;
          if (s.timer >= s.delay) {
            const side = Math.floor(Math.random() * 2);
            s.x = side === 0 ? Math.random() * W : -10;
            s.y = side === 0 ? -10 : Math.random() * H * 0.6;
            s.angle = 30 + Math.random() * 25;
            s.speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
            s.length = 60 + Math.random() * 100;
            s.opacity = 1;
            s.active = true;
            s.timer = 0;
            s.delay = minDelay + Math.random() * (maxDelay - minDelay);
          }
          continue;
        }

        const rad = (s.angle * Math.PI) / 180;
        const dx = Math.cos(rad) * s.speed * (dt / 16);
        const dy = Math.sin(rad) * s.speed * (dt / 16);

        s.x += dx;
        s.y += dy;

        const margin = 80;
        const distToEdge = Math.min(W - s.x, H - s.y, s.x, s.y);
        s.opacity = Math.min(1, distToEdge / margin);

        if (s.x > W + 20 || s.y > H + 20 || s.x < -20) {
          s.active = false;
          s.timer = 0;
          continue;
        }

        const tailX = s.x - Math.cos(rad) * s.length;
        const tailY = s.y - Math.sin(rad) * s.length;

        const grad = ctx!.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(96,165,250,0)`);
        grad.addColorStop(0.6, `rgba(96,165,250,${s.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(59,130,246,${s.opacity})`);

        ctx!.strokeStyle = grad;
        ctx!.lineWidth = starHeight;
        ctx!.lineCap = 'round';
        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(s.x, s.y);
        ctx!.stroke();

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, starHeight * 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${s.opacity * 0.9})`;
        ctx!.fill();
      }
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full absolute inset-0", className)}
      style={{ display: 'block' }}
    />
  );
};

export const ShootingStars = memo(ShootingStarsInner);
