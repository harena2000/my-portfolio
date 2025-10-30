"use client";
import { motion } from "framer-motion";
import { MenuDockItem } from "@/components/ui/shadcn-io/menu-dock";
import { Briefcase, FileText, Folder, HomeIcon, Mail, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const dispatchNav = (detail: { id?: string; index?: number }) =>
  window.dispatchEvent(new CustomEvent("navigateToSection", { detail }));

export function Navbar() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { index?: number } | undefined;
      if (detail?.index !== undefined) setActiveIndex(detail.index);
    };
    window.addEventListener("sectionChanged", handler as EventListener);
    return () => window.removeEventListener("sectionChanged", handler as EventListener);
  }, []);

  type NavItem = {
    label: string;
    icon: React.ElementType<{ className?: string }>;
    index: number;
    onClick: () => void;
  }

  const items: NavItem[] = [
    { label: "Home", icon: HomeIcon, index: 0, onClick: () => {
      setActiveIndex(0);
      dispatchNav({ id: "home", index: 0 })
    } },
    { label: "Skills", icon: Zap, index: 1, onClick: () => {
      setActiveIndex(1);
      dispatchNav({ id: "skills", index: 1 })
    } },
    { label: "Project", icon: Folder, index: 2, onClick: () => {
      setActiveIndex(2);
      dispatchNav({ id: "project", index: 2 })
    } },
    { label: "Experience", icon: Briefcase, index: 3, onClick: () => {
      setActiveIndex(3);
      dispatchNav({ id: "experience", index: 3 })
    } },
    { label: "Contact", icon: Mail, index: 4, onClick: () => {
      setActiveIndex(4);
      dispatchNav({ id: "contact", index: 4 })
    } },
    { label: "Resume", icon: FileText, index: 5, onClick: () => {
      setActiveIndex(5);
      dispatchNav({ id: "resume", index: 5 })
    } },
  ];

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-5 z-50"
    >
      {/* Outer dock box */}
      <div className="mx-auto max-w-lg px-4">
        <div className="relative rounded-2xl bg-white/6 backdrop-blur-md border border-white/10 px-3 py-3 shadow-lg">
          {/* inner dock row */}
          <div className="flex items-center justify-between gap-2 relative">
            {items.map((item, i) => {
              const Icon = item.icon;
              const isActive = item.index === activeIndex;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick?.();
                  }}
                  title={item.label}
                  aria-current={isActive ? "true" : undefined}
                  className={
                    "relative flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-transform duration-150 " +
                    (isActive
                      ? "text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white")
                  }
                >
                  {/* Animated icon only */}
                  <motion.div
                    initial={false}
                    animate={isActive ? { y: [-2, -8, -2] } : { y: 0 }}
                    transition={isActive ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 }}
                    className="flex items-center justify-center"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>

                  {/* Label */}
                  <motion.span
                    className="mt-1 text-[11px] font-medium"
                    initial={{ opacity: 0.85, y: 2 }}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.85, y: 2 }}
                    transition={{ duration: 0.18 }}
                  >
                    {item.label}
                  </motion.span>

                  {/* Shared animated underline: rendered only for active item but uses layoutId so it animates between buttons */}
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