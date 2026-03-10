"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FileText, Folder, HomeIcon, Mail, Zap, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const dispatchNav = (detail: { id?: string; index?: number }) =>
  window.dispatchEvent(new CustomEvent("navigateToSection", { detail }));

export function Navbar() {
  const t = useTranslations('Navbar');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const lastManualNavRef = useRef<number | null>(null);
  const IGNORE_MS = 800;

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/fr') ? 'fr' : 'en';

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

  const handleLanguageChange = (locale: string) => {
    router.push(`/${locale}`);
    setShowLangMenu(false);
  };

  type NavItem = { label: string; icon: React.ElementType<{ className?: string }>; index: number; id?: string; };

  const items: NavItem[] = [
    { label: t('home'), icon: HomeIcon, index: 0, id: "home" },
    { label: t('skills'), icon: Zap, index: 1, id: "skills" },
    { label: t('project'), icon: Folder, index: 2, id: "project" },
    { label: t('experience'), icon: Briefcase, index: 3, id: "experience" },
    { label: t('contact'), icon: Mail, index: 4, id: "contact" },
    { label: t('resume'), icon: FileText, index: 5, id: "resume" },
  ];

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-4 z-50"
      style={{ willChange: 'transform, opacity' }}
    >
      <div className="mx-auto max-w-2xl px-4">
        <div className="relative rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-2 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between gap-1">
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
                    "relative flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-colors duration-200 " +
                    (isActive ? "text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80")
                  }
                >
                  {/* Shared animated background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 rounded-xl bg-blue-600/20 border border-blue-500/30"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  {/* Icon — CSS scale only, no framer-motion per item */}
                  <span className={`relative flex items-center justify-center transition-transform duration-200 ${isActive ? 'scale-110 -translate-y-px' : 'scale-100'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
                  </span>
                  <span className={`relative mt-0.5 text-[9px] font-medium transition-colors duration-150 ${isActive ? 'text-blue-300 opacity-100' : 'opacity-60'}`}>
                    {item.label}
                  </span>
                  {/* Shared animated underline */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-3 right-3 h-[2px] bg-blue-400 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex flex-col items-center justify-center w-11 h-11 rounded-xl text-white/50 hover:bg-white/5 hover:text-white/80 transition-colors duration-200"
                title="Language"
              >
                <Globe className="w-4 h-4" />
                <span className="mt-0.5 text-[9px] font-medium uppercase">{currentLocale}</span>
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {['en', 'fr'].map((locale) => (
                      <button
                        key={locale}
                        onClick={() => handleLanguageChange(locale)}
                        className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors duration-150 ${
                          currentLocale === locale
                            ? 'text-blue-400 bg-blue-900/30'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
