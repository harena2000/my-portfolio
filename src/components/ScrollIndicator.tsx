"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface ScrollIndicatorProps {
  /** The scrollable container element */
  containerRef: React.RefObject<HTMLElement | null>;
}

export function ScrollIndicator({ containerRef }: ScrollIndicatorProps) {
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const check = () => {
      // Show indicator if there's more than 20px of content below
      const hasMore = el.scrollHeight - el.scrollTop - el.clientHeight > 20;
      setCanScrollDown(hasMore);
    };

    check();

    // Re-check on scroll, resize, and after animations settle
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });

    // Also check periodically for the first few seconds (content may load lazily)
    const intervals = [500, 1000, 2000, 3000];
    const timers = intervals.map((ms) => setTimeout(check, ms));

    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      timers.forEach(clearTimeout);
    };
  }, [containerRef]);

  return (
    <AnimatePresence>
      {canScrollDown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-0.5"
        >
          <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-white/30" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
