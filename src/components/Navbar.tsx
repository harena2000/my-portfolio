"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FileText, Folder, HomeIcon, Mail, Zap, Globe } from "lucide-react";
import { useEffect, useRef, useState, memo } from "react";
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import ExpandingTabs, { type ExpandingTab } from "@/components/ui/expanding-tabs";

const dispatchNav = (detail: { id?: string; index?: number }) =>
  window.dispatchEvent(new CustomEvent("navigateToSection", { detail }));

const SECTION_IDS = ["home", "skills", "project", "experience", "contact", "resume"];

/** Round glass button matching the inactive tab style */
const orbButton =
  "flex items-center justify-center rounded-full border border-white/[0.07] bg-[#050d1f]/60 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.35)] text-white/70 hover:text-white hover:bg-white/[0.08] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80";

function LanguageSwitcher({
  currentLocale,
  placement,
  className,
}: {
  currentLocale: string;
  placement: "top" | "bottom";
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const offset = placement === "bottom" ? -6 : 6;

  const handleLanguageChange = (locale: string) => {
    router.push(`/${locale}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Language"
        title="Language"
        className={`${orbButton} gap-1 ${className ?? ""}`}
      >
        <Globe className="w-4 h-4" />
        <span className="text-[10px] font-semibold uppercase">{currentLocale}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: offset, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: offset, scale: 0.96 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={`absolute right-0 ${placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2"} bg-[#050d1f]/95 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl`}
          >
            {['en', 'fr'].map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors duration-150 ${
                  currentLocale === locale ? 'text-blue-400 bg-blue-900/30' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base">{locale === 'en' ? '🇬🇧' : '🇫🇷'}</span>
                <span className="font-medium">{locale === 'en' ? 'English' : 'Français'}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavbarInner() {
  const t = useTranslations('Navbar');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const lastManualNavRef = useRef<number | null>(null);
  const IGNORE_MS = 800;

  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/fr') ? 'fr' : 'en';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as { index?: number } | undefined;
      if (detail?.index === undefined) return;
      const last = lastManualNavRef.current;
      if (last && Date.now() - last < IGNORE_MS) return;
      setActiveIndex(detail.index);
    };
    window.addEventListener("sectionChanged", handler as EventListener);
    return () => window.removeEventListener("sectionChanged", handler as EventListener);
  }, []);

  const handleClick = (index: number, id?: string) => {
    lastManualNavRef.current = Date.now();
    setActiveIndex(index);
    dispatchNav({ id, index });
    window.setTimeout(() => { lastManualNavRef.current = null; }, IGNORE_MS + 50);
  };

  const icons = [HomeIcon, Zap, Folder, Briefcase, Mail, FileText];
  const tabs: ExpandingTab[] = SECTION_IDS.map((id, index) => ({
    id,
    label: t(id),
    icon: icons[index],
  }));

  const selectTab = (id: string) => handleClick(SECTION_IDS.indexOf(id), id);
  const activeId = SECTION_IDS[activeIndex] ?? SECTION_IDS[0];

  // ── MOBILE: bottom tab pill + floating language button ──
  if (isMobile) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.2 }}
          className="fixed top-3 right-3 z-50"
        >
          <LanguageSwitcher currentLocale={currentLocale} placement="bottom" className="h-9 px-3" />
        </motion.div>

        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.2 }}
          aria-label="Sections"
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-3 pb-3 safe-area-bottom"
        >
          <ExpandingTabs tabs={tabs} value={activeId} onValueChange={selectTab} size="sm" />
        </motion.nav>
      </>
    );
  }

  // ── DESKTOP: top floating pill ──
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-label="Sections"
      className="fixed top-0 left-0 right-0 z-50 pt-4 pb-3 bg-gradient-to-b from-[#020818]/80 via-[#020818]/40 to-transparent"
    >
      <div className="mx-auto flex w-fit items-center gap-2 px-4">
        <button
          type="button"
          onClick={() => handleClick(0, 'home')}
          className={`${orbButton} w-[52px] h-[52px] group`}
          title="Harena Rico"
          aria-label="Harena Rico — home"
        >
          <Image
            src="/logo.png"
            alt=""
            width={24}
            height={26}
            className="drop-shadow-[0_0_6px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] transition-all duration-300"
          />
        </button>

        <ExpandingTabs tabs={tabs} value={activeId} onValueChange={selectTab} />

        <LanguageSwitcher currentLocale={currentLocale} placement="bottom" className="h-[52px] px-4" />
      </div>
    </motion.nav>
  );
}

export const Navbar = memo(NavbarInner);
