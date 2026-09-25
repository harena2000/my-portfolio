/** Seed-only content that wasn't in the old cv.ts: galleries, detail-page settings, site settings. */

type Gallery = { title: string; titleFr: string; screens: { src: string; label: string }[] }[]

/** Screenshot galleries from the former hard-coded /projects/mento and /projects/singsong pages */
export const galleries: Record<string, Gallery> = {
  mento: [
    {
      title: 'Welcome & Authentication',
      titleFr: 'Accueil & Authentification',
      screens: [
      { src: '/images/mento/01-welcome-screen.png', label: 'Welcome' },
      { src: '/images/mento/02-sign-in.png', label: 'Sign In' },
      { src: '/images/mento/03-sign-up.png', label: 'Sign Up' },
      ],
    },
    {
      title: 'OTP Verification',
      titleFr: 'Vérification OTP',
      screens: [
      { src: '/images/mento/04-otp.png', label: 'OTP Input' },
      { src: '/images/mento/05-otp-success.png', label: 'OTP Success' },
      { src: '/images/mento/06-otp-error.png', label: 'OTP Error' },
      ],
    },
    {
      title: 'Chat Room',
      titleFr: 'Salle de discussion',
      screens: [
      { src: '/images/mento/07-chat-default.png', label: 'Default' },
      { src: '/images/mento/08-chat-discussion.png', label: 'Discussion' },
      { src: '/images/mento/09-chat-discussion-scroll.png', label: 'Scroll' },
      { src: '/images/mento/10-chat-microphone.png', label: 'Microphone' },
      { src: '/images/mento/11-chat-vocal-loading.png', label: 'Vocal Loading' },
      ],
    },
    {
      title: 'User Profile',
      titleFr: 'Profil utilisateur',
      screens: [
      { src: '/images/mento/12-user-profile.png', label: 'Profile' },
      ],
    },
    {
      title: 'Package & Pricing',
      titleFr: 'Forfaits & Tarifs',
      screens: [
      { src: '/images/mento/13-package-freemium.png', label: 'Freemium' },
      { src: '/images/mento/14-package-pro-monthly.png', label: 'Pro Monthly' },
      { src: '/images/mento/15-package-gold-annual.png', label: 'Gold Annual' },
      ],
    },
    {
      title: 'Onboarding',
      titleFr: 'Intégration',
      screens: [
      { src: '/images/mento/16-onboarding-q2.png', label: 'Question 2' },
      { src: '/images/mento/17-onboarding-q4.png', label: 'Question 4' },
      { src: '/images/mento/18-onboarding-q5-progress.png', label: 'Progress' },
      { src: '/images/mento/19-onboarding-q7.png', label: 'Question 7' },
      { src: '/images/mento/20-onboarding-interstitial.png', label: 'Interstitial' },
      { src: '/images/mento/21-onboarding-completed.png', label: 'Completed' },
      ],
    },
  ],
  singsong: [
    {
      title: 'Splash & Home',
      titleFr: 'Accueil',
      screens: [
      { src: '/images/singsong/01-splash-screen.png', label: 'Splash Screen' },
      { src: '/images/singsong/02-dashboard.png', label: 'Dashboard' },
      ],
    },
    {
      title: 'Songs & Lyrics',
      titleFr: 'Chansons & Paroles',
      screens: [
      { src: '/images/singsong/03-songs.png', label: 'All Songs' },
      { src: '/images/singsong/04-lyrics.png', label: 'Lyrics' },
      ],
    },
    {
      title: 'Library',
      titleFr: 'Bibliothèque',
      screens: [
      { src: '/images/singsong/05-playlist.png', label: 'Playlist' },
      ],
    },
    {
      title: 'Resources & Settings',
      titleFr: 'Ressources & Paramètres',
      screens: [
      { src: '/images/singsong/06-resources.png', label: 'Resources' },
      { src: '/images/singsong/07-language.png', label: 'Language' },
      ],
    },
  ],
}

/** Keyed by the English project title in ./data.ts */
export const projectExtras: Record<
  string,
  { slug?: string; accent?: 'blue' | 'purple' | 'emerald'; icon?: 'smartphone' | 'music' | 'globe' | 'map' | 'layers' | 'code'; tagline?: { en: string; fr: string } }
> = {
  ZakaJiaby: { slug: 'zakajiaby' },
  'WebGIS Platform': { slug: 'webgis-platform' },
  InsideGolf: { slug: 'insidegolf' },
  'Product Ticketing': { slug: 'product-ticketing' },
  SingSong: {
    slug: 'singsong',
    accent: 'purple',
    icon: 'music',
    tagline: { en: 'Youth Hymnal App', fr: 'Application de cantiques pour la jeunesse' },
  },
  MENTO: {
    slug: 'mento',
    accent: 'blue',
    icon: 'smartphone',
    tagline: { en: 'Mental Health Companion', fr: 'Compagnon de santé mentale' },
  },
}

/** Values that used to be hard-coded in Hero.tsx, Contact.tsx and ResumeDocument.tsx */
export const settings = {
  openToWork: true,
  yearsOfExperience: 4,
  heroBadges: ['Flutter', 'Next.js', 'TypeScript', 'Vue.js', 'Express.js'],
  // EmailJS public identifiers (previously constants in Contact.tsx)
  emailjs: { serviceId: 'service_vjp2u4k', templateId: 'template_862cspe', publicKey: 'n2PoQohU4NjWDSAco' },
  city: { en: 'Antananarivo, Madagascar', fr: 'Antananarivo, Madagascar' },
  // Ambohimanambola, Antananarivo
  location: { lat: -18.93, lng: 47.6 },
}
