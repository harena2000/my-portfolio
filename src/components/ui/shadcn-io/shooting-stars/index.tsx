'use client';

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

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

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  className,
  starColor = "#3b82f6",
  trailColor = "#60a5fa",
  minSpeed = 8,
  maxSpeed = 18,
  minDelay = 800,
  maxDelay = 2400,
  starWidth = 120,
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

    const stars: Star[] = Array.from({ length: 6 }, () => createStar(0, 0, minSpeed, maxSpeed, minDelay, maxDelay));

    function createStar(W: number, H: number, minSpeed: number, maxSpeed: number, minDelay: number, maxDelay: number): Star {
      const side = Math.floor(Math.random() * 2); // 0=top, 1=left
      const x = side === 0 ? Math.random() * (W || window.innerWidth) : 0;
      const y = side === 0 ? 0 : Math.random() * (H || window.innerHeight);
      return {
        x,
        y,
        angle: 35 + Math.random() * 20, // degrees, roughly diagonal
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

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let last = performance.now();

    function draw(now: number) {
      const dt = Math.min(now - last, 32); // cap at ~30fps delta to avoid huge jumps
      last = now;

      ctx!.clearRect(0, 0, W, H);

      for (const s of stars) {
        if (!s.active) {
          s.timer += dt;
          if (s.timer >= s.delay) {
            // Reset and activate
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

        // Fade out near edges
        const margin = 80;
        const distToEdge = Math.min(W - s.x, H - s.y, s.x, s.y);
        s.opacity = Math.min(1, distToEdge / margin);

        if (s.x > W + 20 || s.y > H + 20 || s.x < -20) {
          s.active = false;
          s.timer = 0;
          continue;
        }

        // Draw trail
        const tailX = s.x - Math.cos(rad) * s.length;
        const tailY = s.y - Math.sin(rad) * s.length;

        const grad = ctx!.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(96,165,250,0)`);
        grad.addColorStop(0.6, `rgba(96,165,250,${s.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(59,130,246,${s.opacity})`);

        ctx!.save();
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = starHeight;
        ctx!.lineCap = 'round';
        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(s.x, s.y);
        ctx!.stroke();

        // Bright head
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, starHeight * 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${s.opacity * 0.9})`;
        ctx!.fill();
        ctx!.restore();
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
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
