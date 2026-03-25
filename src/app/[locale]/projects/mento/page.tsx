"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useCallback } from "react";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

/* ── screen data ────────────────────────────────────────────── */
interface ScreenGroup {
  title: string;
  titleFr: string;
  screens: { src: string; label: string }[];
}

const SCREEN_GROUPS: ScreenGroup[] = [
  {
    title: "Welcome & Authentication",
    titleFr: "Accueil & Authentification",
    screens: [
      { src: "/images/mento/01-welcome-screen.png", label: "Welcome" },
      { src: "/images/mento/02-sign-in.png", label: "Sign In" },
      { src: "/images/mento/03-sign-up.png", label: "Sign Up" },
    ],
  },
  {
    title: "OTP Verification",
    titleFr: "Vérification OTP",
    screens: [
      { src: "/images/mento/04-otp.png", label: "OTP Input" },
      { src: "/images/mento/05-otp-success.png", label: "OTP Success" },
      { src: "/images/mento/06-otp-error.png", label: "OTP Error" },
    ],
  },
  {
    title: "Chat Room",
    titleFr: "Salle de discussion",
    screens: [
      { src: "/images/mento/07-chat-default.png", label: "Default" },
      { src: "/images/mento/08-chat-discussion.png", label: "Discussion" },
      { src: "/images/mento/09-chat-discussion-scroll.png", label: "Scroll" },
      { src: "/images/mento/10-chat-microphone.png", label: "Microphone" },
      { src: "/images/mento/11-chat-vocal-loading.png", label: "Vocal Loading" },
    ],
  },
  {
    title: "User Profile",
    titleFr: "Profil utilisateur",
    screens: [
      { src: "/images/mento/12-user-profile.png", label: "Profile" },
    ],
  },
  {
    title: "Package & Pricing",
    titleFr: "Forfaits & Tarifs",
    screens: [
      { src: "/images/mento/13-package-freemium.png", label: "Freemium" },
      { src: "/images/mento/14-package-pro-monthly.png", label: "Pro Monthly" },
      { src: "/images/mento/15-package-gold-annual.png", label: "Gold Annual" },
    ],
  },
  {
    title: "Onboarding",
    titleFr: "Intégration",
    screens: [
      { src: "/images/mento/16-onboarding-q2.png", label: "Question 2" },
      { src: "/images/mento/17-onboarding-q4.png", label: "Question 4" },
      { src: "/images/mento/18-onboarding-q5-progress.png", label: "Progress" },
      { src: "/images/mento/19-onboarding-q7.png", label: "Question 7" },
      { src: "/images/mento/20-onboarding-interstitial.png", label: "Interstitial" },
      { src: "/images/mento/21-onboarding-completed.png", label: "Completed" },
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
          <div className="rounded-[40px] border-[6px] border-gray-700 bg-gray-900 p-2 shadow-2xl shadow-blue-500/10">
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
export default function MentoPreviewPage() {
  const t = useTranslations("nav");
  const router = useRouter();
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

  // Flatten for lightbox navigation
  const getLightboxScreens = () => {
    if (!lightbox) return { screens: [], index: 0 };
    const group = SCREEN_GROUPS[lightbox.groupIdx];
    return { screens: group.screens, index: lightbox.screenIdx };
  };

  const { screens: lbScreens, index: lbIndex } = getLightboxScreens();

  return (
    <div className="min-h-dvh bg-[#0a0f1a]">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0f1a]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white sm:text-xl">MENTO</h1>
            <p className="text-xs text-gray-400 sm:text-sm">
              Mental Health Companion — Flutter, Firebase, Gemini, Stripe
            </p>
          </div>
          <div className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
            <Smartphone size={14} />
            {allScreensFlat.length} screens
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-600/10 to-transparent px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
              <Smartphone size={14} />
              AUREON — Mobile Application
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              MENTO
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">
              Your personal companion for mental strength. An app that helps you
              organize your thoughts, understand your feelings, and gain new
              perspectives. Modern psychology made simple and accessible.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {["Flutter", "Firebase", "Gemini", "Stripe"].map((tech) => (
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
              <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent" />
              <h3 className="whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-blue-400">
                {group.title}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-l from-blue-500/30 to-transparent" />
            </div>

            {/* Screen grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {group.screens.map((screen, screenIdx) => (
                <motion.button
                  key={screenIdx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => openLightbox(groupIdx, screenIdx)}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-2 transition-colors hover:border-blue-500/20 hover:bg-white/[0.04]"
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
