"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Smartphone, Music } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

/* ── screen data ────────────────────────────────────────────── */
interface ScreenGroup {
  title: string;
  titleFr: string;
  screens: { src: string; label: string }[];
}

const SCREEN_GROUPS: ScreenGroup[] = [
  {
    title: "Splash & Home",
    titleFr: "Accueil",
    screens: [
      { src: "/images/singsong/01-splash-screen.png", label: "Splash Screen" },
      { src: "/images/singsong/02-dashboard.png", label: "Dashboard" },
    ],
  },
  {
    title: "Songs & Lyrics",
    titleFr: "Chansons & Paroles",
    screens: [
      { src: "/images/singsong/03-songs.png", label: "All Songs" },
      { src: "/images/singsong/04-lyrics.png", label: "Lyrics" },
    ],
  },
  {
    title: "Library",
    titleFr: "Bibliothèque",
    screens: [
      { src: "/images/singsong/05-playlist.png", label: "Playlist" },
    ],
  },
  {
    title: "Resources & Settings",
    titleFr: "Ressources & Paramètres",
    screens: [
      { src: "/images/singsong/06-resources.png", label: "Resources" },
      { src: "/images/singsong/07-language.png", label: "Language" },
    ],
  },
];

/* ── lightbox component ─────────────────────────────────────── */
function Lightbox({
  screens,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  screens: { src: string; label: string }[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X size={24} />
      </button>

      {/* Prev button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Next button */}
      {currentIndex < screens.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Image in phone frame */}
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
          {/* Phone frame */}
          <div className="rounded-[40px] border-[6px] border-gray-700 bg-gray-900 p-2 shadow-2xl shadow-purple-500/10">
            <div className="overflow-hidden rounded-[32px]">
              <Image
                src={screens[currentIndex].src}
                alt={screens[currentIndex].label}
                width={750}
                height={1624}
                className="h-auto w-full"
                quality={95}
              />
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-400">
          {screens[currentIndex].label} — {currentIndex + 1} / {screens.length}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ── main page ──────────────────────────────────────────────── */
export default function SingSongPreviewPage() {
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.startsWith('/fr') ? 'fr' : 'en';

  // Override the global overflow:hidden on html/body so this page can scroll,
  // and hide the main portfolio navbar so only the project header shows.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyHeight = body.style.height;

    html.style.overflow = "auto";
    body.style.overflow = "auto";
    html.style.height = "auto";
    body.style.height = "auto";

    // Hide the main portfolio navbar (it's a fixed div, not a <nav>)
    const navbar = document.querySelector(".fixed.top-0.left-0.right-0.z-50") as HTMLElement | null;
    if (navbar) navbar.style.display = "none";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.height = prevHtmlHeight;
      body.style.height = prevBodyHeight;
      if (navbar) navbar.style.display = "";
    };
  }, []);

  const [lightbox, setLightbox] = useState<{
    groupIdx: number;
    screenIdx: number;
  } | null>(null);

  const allScreensFlat = SCREEN_GROUPS.flatMap((g) => g.screens);

  const openLightbox = useCallback(
    (groupIdx: number, screenIdx: number) => {
      setLightbox({ groupIdx, screenIdx });
    },
    []
  );

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const getLightboxScreens = () => {
    if (!lightbox) return { screens: [], index: 0 };
    const group = SCREEN_GROUPS[lightbox.groupIdx];
    return { screens: group.screens, index: lightbox.screenIdx };
  };

  const { screens: lbScreens, index: lbIndex } = getLightboxScreens();

  return (
    <div className="min-h-dvh bg-[#0a0a12]">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a12]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => router.push(`/${locale}#project`)}
            className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white sm:text-xl">SingSong</h1>
            <p className="text-xs text-gray-400 sm:text-sm">
              Youth Hymnal App — Flutter, Firebase, Supabase
            </p>
          </div>
          <div className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
            <Smartphone size={14} />
            {allScreensFlat.length} screens
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-600/10 via-pink-600/5 to-transparent px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 text-sm text-purple-400">
              <Music size={14} />
              Mobile Application
            </div>
            <h2 className="mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
              SingSong
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">
              A multilingual hymnal and song app for Adventist Youth. Browse 900+
              songs, view lyrics, create playlists, and access resources — all in
              Malagasy, French, and English.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {["Flutter", "Firebase", "Supabase"].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300 ring-1 ring-white/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Screen groups */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        {SCREEN_GROUPS.map((group, groupIdx) => (
          <motion.section
            key={groupIdx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            {/* Section title */}
            <div className="mb-6 flex items-center gap-3">
              <h3 className="whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-purple-400">
                {group.title}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
            </div>

            {/* Screen grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {group.screens.map((screen, screenIdx) => (
                <motion.button
                  key={screenIdx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => openLightbox(groupIdx, screenIdx)}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-2 transition-colors hover:border-purple-500/20 hover:bg-white/[0.04]"
                >
                  {/* Phone mockup */}
                  <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                    <Image
                      src={screen.src}
                      alt={screen.label}
                      width={375}
                      height={812}
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            screens={lbScreens}
            currentIndex={lbIndex}
            onClose={closeLightbox}
            onPrev={() =>
              setLightbox((prev) =>
                prev ? { ...prev, screenIdx: prev.screenIdx - 1 } : null
              )
            }
            onNext={() =>
              setLightbox((prev) =>
                prev ? { ...prev, screenIdx: prev.screenIdx + 1 } : null
              )
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
