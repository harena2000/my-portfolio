"use client";
import { motion } from "framer-motion";
import { Briefcase, FileText, Folder, HomeIcon, Mail, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const dispatchNav = (detail: { id?: string; index?: number }) =>
  window.dispatchEvent(new CustomEvent("navigateToSection", { detail }));

export function Navbar() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const lastManualNavRef = useRef<number | null>(null);
  const IGNORE_MS = 800; // ignore sectionChanged events for this many ms after manual nav

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { index?: number } | undefined;
      if (detail?.index === undefined) return;

      // ignore updates right after a manual navigation triggered by the navbar click
      const last = lastManualNavRef.current;
      if (last && Date.now() - last < IGNORE_MS) return;

      setActiveIndex(detail.index);
    };

    window.addEventListener("sectionChanged", handler as EventListener);
    return () => window.removeEventListener("sectionChanged", handler as EventListener);
  }, []);

  const handleClick = (index: number, id?: string) => {
    // mark manual navigation time to suppress incoming sectionChanged events
    // eslint-disable-next-line react-hooks/purity
    lastManualNavRef.current = Date.now();
    // optimistically set active index so the UI updates immediately
    setActiveIndex(index);
    dispatchNav({ id, index });
    // clear the ref after IGNORE_MS to avoid permanent suppression
    window.setTimeout(() => {
      lastManualNavRef.current = null;
    }, IGNORE_MS + 50);
  };

  type NavItem = {
    label: string;
    icon: React.ElementType<{ className?: string }>;
    index: number;
    id?: string;
  };

  const items: NavItem[] = [
    { label: "Home", icon: HomeIcon, index: 0, id: "home" },
    { label: "Skills", icon: Zap, index: 1, id: "skills" },
    { label: "Project", icon: Folder, index: 2, id: "project" },
    { label: "Experience", icon: Briefcase, index: 3, id: "experience" },
    { label: "Contact", icon: Mail, index: 4, id: "contact" },
    { label: "Resume", icon: FileText, index: 5, id: "resume" },
  ];

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-5 z-50"
    >
      <div className="mx-auto max-w-lg px-4">
        <div className="relative rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 px-3 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-2 relative">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = item.index === activeIndex;

              return (
                <button
                  key={item.label}
                  onClick={() => handleClick(item.index, item.id)}
                  title={item.label}
                  aria-current={isActive ? "true" : undefined}
                  className={
                    "relative flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-transform duration-150 " +
                    (isActive ? "text-white" : "text-white/70 hover:bg-white/5 hover:text-white")
                  }
                >
                  <motion.div
                    initial={false}
                    animate={isActive ? { y: [-2, -8, -2] } : { y: 0 }}
                    transition={isActive ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 }}
                    className="flex items-center justify-center"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>

                  <motion.span
                    className="mt-1 text-[11px] font-medium"
                    initial={{ opacity: 0.85, y: 2 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.85, y: 2 }}
                    transition={{ duration: 0.18 }}
                  >
                    {item.label}
                  </motion.span>

                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-2 left-2 right-2 h-[3px] bg-white rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}