"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useEffect, useState } from "react";
import { SECTION_IDS, legDirection } from "@/lib/section-map";

/**
 * Desktop-only pill shown once the current section is scrolled to its end, telling the user
 * that scrolling further moves on to the next section (the arrow shows which way).
 */
function SectionContinueHintInner() {
  const t = useTranslations("Navbar");
  const [index, setIndex] = useState(0);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const onSection = (ev: Event) => {
      const i = (ev as CustomEvent<{ index?: number }>).detail?.index;
      if (typeof i === "number") setIndex(i);
    };
    window.addEventListener("sectionChanged", onSection);
    return () => window.removeEventListener("sectionChanged", onSection);
  }, []);

  useEffect(() => {
    const panel = document.getElementById(`section-${SECTION_IDS[index]}`);
    if (!panel) return;
    const check = () => setAtBottom(panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2);
    check();
    panel.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    // Content may grow after load (images, lazy sections)
    const timers = [600, 1500, 3000].map((ms) => setTimeout(check, ms));
    return () => {
      panel.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      timers.forEach(clearTimeout);
    };
  }, [index]);

  const nextId = SECTION_IDS[index + 1];
  const visible = atBottom && Boolean(nextId);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key={nextId}
          type="button"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() =>
            window.dispatchEvent(new CustomEvent("navigateToSection", { detail: { index: index + 1 } }))
          }
          className="fixed bottom-5 right-6 z-40 flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-[#050d1f]/60 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.35)] pl-4 pr-3 py-2 text-xs font-medium text-white/60 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80"
        >
          <span>
            {t("next")}: <span className="text-blue-300">{t(nextId)}</span>
          </span>
          {legDirection(index) === "down" ? (
            <ChevronDown className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export const SectionContinueHint = memo(SectionContinueHintInner);
