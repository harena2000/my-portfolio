"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Smartphone, Music, Globe, Map as MapIcon, Layers, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { ProjectDetail } from "@/lib/content-types";

const ICONS = { smartphone: Smartphone, music: Music, globe: Globe, map: MapIcon, layers: Layers, code: Code2 } as const;

// Full class names so Tailwind picks them up
const ACCENTS = {
  blue: {
    page: "bg-[#0a0f1a]",
    header: "bg-[#0a0f1a]/80",
    hero: "from-blue-600/10 to-transparent",
    badge: "bg-blue-500/10 text-blue-400",
    title: "text-white",
    group: "text-blue-400",
    rule: "from-blue-500/30",
    hover: "hover:border-blue-500/20",
    shadow: "shadow-blue-500/10",
  },
  purple: {
    page: "bg-[#0a0a12]",
    header: "bg-[#0a0a12]/80",
    hero: "from-purple-600/10 via-pink-600/5 to-transparent",
    badge: "bg-purple-500/10 text-purple-400",
    title: "bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent",
    group: "text-purple-400",
    rule: "from-purple-500/30",
    hover: "hover:border-purple-500/20",
    shadow: "shadow-purple-500/10",
  },
  emerald: {
    page: "bg-[#07110f]",
    header: "bg-[#07110f]/80",
    hero: "from-emerald-600/10 to-transparent",
    badge: "bg-emerald-500/10 text-emerald-400",
    title: "text-white",
    group: "text-emerald-400",
    rule: "from-emerald-500/30",
    hover: "hover:border-emerald-500/20",
    shadow: "shadow-emerald-500/10",
  },
} as const;

type Screen = ProjectDetail["screenGroups"][number]["screens"][number];

/* ── lightbox ──────────────────────────────────────────────── */
function Lightbox({
  screens,
  currentIndex,
  shadow,
  onClose,
  onPrev,
  onNext,
}: {
  screens: Screen[];
  currentIndex: number;
  shadow: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const screen = screens[currentIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onPrev();
      if (e.key === "ArrowRight" && currentIndex < screens.length - 1) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, screens.length, onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X size={24} />
      </button>

      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous"
          className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {currentIndex < screens.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next"
          className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        >
          <ChevronRight size={28} />
        </button>
      )}

      <motion.div
        key={currentIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mx-auto w-[280px] sm:w-[320px] md:w-[360px]">
          <div className={`rounded-[40px] border-[6px] border-gray-700 bg-gray-900 p-2 shadow-2xl ${shadow}`}>
            <div className="overflow-hidden rounded-[32px]">
              <Image
                src={screen.src}
                alt={screen.label}
                width={screen.width ?? 750}
                height={screen.height ?? 1624}
                sizes="360px"
                className="h-auto w-full"
                quality={95}
              />
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-400">
          {screen.label} — {currentIndex + 1} / {screens.length}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ── page ──────────────────────────────────────────────────── */
export default function ProjectGallery({ project }: { project: ProjectDetail }) {
  const t = useTranslations("ProjectPage");
  const locale = useLocale();
  const router = useRouter();
  const a = ACCENTS[project.accent] ?? ACCENTS.blue;
  const Icon = ICONS[project.icon as keyof typeof ICONS] ?? Smartphone;

  // The portfolio locks html/body scrolling for its horizontal snap layout;
  // this page scrolls normally, and hides the portfolio navbar in favour of its own header.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = [html.style.overflow, body.style.overflow, html.style.height, body.style.height];
    html.style.overflow = "auto";
    body.style.overflow = "auto";
    html.style.height = "auto";
    body.style.height = "auto";

    const navbar = document.querySelector(".fixed.top-0.left-0.right-0.z-50") as HTMLElement | null;
    if (navbar) navbar.style.display = "none";

    return () => {
      [html.style.overflow, body.style.overflow, html.style.height, body.style.height] = prev;
      if (navbar) navbar.style.display = "";
    };
  }, []);

  const [lightbox, setLightbox] = useState<{ groupIdx: number; screenIdx: number } | null>(null);
  const totalScreens = project.screenGroups.reduce((n, g) => n + g.screens.length, 0);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevScreen = useCallback(() => setLightbox((p) => (p ? { ...p, screenIdx: p.screenIdx - 1 } : null)), []);
  const nextScreen = useCallback(() => setLightbox((p) => (p ? { ...p, screenIdx: p.screenIdx + 1 } : null)), []);

  const badge = [project.organization, project.kind].filter(Boolean).join(" — ");
  const subtitle = [project.tagline, project.tech.join(", ")].filter(Boolean).join(" — ");

  return (
    <div className={`min-h-dvh ${a.page}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 border-b border-white/5 ${a.header} backdrop-blur-md`}>
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => router.push(`/${locale}#project`)}
            className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            {t("back")}
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white sm:text-xl">{project.title}</h1>
            {subtitle && <p className="truncate text-xs text-gray-400 sm:text-sm">{subtitle}</p>}
          </div>
          <div className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
            <Icon size={14} />
            {t("screens", { count: totalScreens })}
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className={`relative overflow-hidden bg-gradient-to-b ${a.hero} px-4 py-12 sm:py-16`}>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {badge && (
              <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm ${a.badge}`}>
                <Icon size={14} />
                {badge}
              </div>
            )}
            <h2 className={`mb-4 text-3xl font-bold sm:text-4xl md:text-5xl ${a.title}`}>{project.title}</h2>
            {project.desc && <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">{project.desc}</p>}
            {project.tech.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300 ring-1 ring-white/10">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Screen groups */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        {project.screenGroups.map((group, groupIdx) => (
          <motion.section
            key={groupIdx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <div className="mb-6 flex items-center gap-3">
              <h3 className={`whitespace-nowrap text-sm font-semibold uppercase tracking-wider ${a.group}`}>{group.title}</h3>
              <div className={`h-px flex-1 bg-gradient-to-r ${a.rule} to-transparent`} />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {group.screens.map((screen, screenIdx) => (
                <motion.button
                  key={screenIdx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setLightbox({ groupIdx, screenIdx })}
                  className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-2 transition-colors ${a.hover} hover:bg-white/[0.04]`}
                >
                  <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                    <Image
                      src={screen.src}
                      alt={screen.label}
                      width={screen.width ?? 375}
                      height={screen.height ?? 812}
                      sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
                      quality={80}
                    />
                  </div>
                  <p className="mt-2 truncate text-center text-[10px] text-gray-500 transition-colors group-hover:text-gray-300 sm:text-xs">
                    {screen.label}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            screens={project.screenGroups[lightbox.groupIdx].screens}
            currentIndex={lightbox.screenIdx}
            shadow={a.shadow}
            onClose={closeLightbox}
            onPrev={prevScreen}
            onNext={nextScreen}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
