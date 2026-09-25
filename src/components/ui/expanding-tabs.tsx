"use client";

/**
 * Pill-shaped tab list with icon-only inactive tabs.
 * Selecting a tab expands it to reveal its label with a layout animation.
 */

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 30,
  mass: 0.7,
};

export interface ExpandingTab {
  id: string;
  label: string;
  icon: React.ElementType<{ className?: string; "aria-hidden"?: boolean }>;
}

interface ExpandingTabsProps {
  tabs: ExpandingTab[];
  value: string;
  onValueChange: (id: string) => void;
  "aria-label"?: string;
  size?: "sm" | "md";
  className?: string;
}

const SIZES = {
  sm: { tab: "h-9 pl-[9px]", idle: "w-9", icon: "size-[18px]", label: "text-xs", list: "gap-1 p-1" },
  md: { tab: "h-10 pl-2.5", idle: "w-10", icon: "size-5", label: "text-sm", list: "gap-2 p-1.5" },
};

export default function ExpandingTabs({
  tabs,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  size = "md",
  className,
}: ExpandingTabsProps) {
  const s = SIZES[size];

  return (
    <motion.div
      layout
      transition={SPRING}
      aria-label={ariaLabel}
      className={cn(
        "flex max-w-[calc(100vw-1.5rem)] items-center rounded-full border border-white/[0.07] bg-[#050d1f]/60 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.35)]",
        s.list,
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = value === tab.id;

        return (
          <motion.button
            key={tab.id}
            layout
            type="button"
            aria-current={isActive ? "true" : undefined}
            aria-label={tab.label}
            title={tab.label}
            onClick={() => onValueChange(tab.id)}
            whileHover={isActive ? undefined : { scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={SPRING}
            className={cn(
              "relative flex shrink-0 cursor-pointer items-center justify-start overflow-hidden rounded-full outline-none",
              "focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050d1f]",
              s.tab,
              isActive
                ? "gap-2 pr-4 bg-gradient-to-b from-blue-500/45 to-blue-600/25 shadow-[0_7px_18px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.18)]"
                : cn(
                    s.idle,
                    "bg-white/[0.04] shadow-[0_3px_9px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-white/[0.08]"
                  )
            )}
          >
            <motion.span
              layout="position"
              animate={{ scale: isActive ? 1.03 : 1, opacity: isActive ? 1 : 0.6 }}
              transition={SPRING}
              className={cn(
                "flex shrink-0 items-center justify-center",
                isActive ? "text-blue-200" : "text-white"
              )}
            >
              <Icon className={s.icon} aria-hidden />
            </motion.span>

            <AnimatePresence initial={false}>
              {isActive && (
                <motion.span
                  layout
                  initial={{ opacity: 0, x: -7 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -7 }}
                  transition={SPRING}
                  className={cn("whitespace-nowrap font-semibold tracking-[0.01em] text-white", s.label)}
                >
                  {tab.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
