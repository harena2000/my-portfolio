/**
 * ============================================================
 *  CENTRALIZED DATA FILE
 *  All portfolio content lives here.
 *  Replace this static data with an API call later.
 * ============================================================
 */

export enum ProjectStatus {
  COMPLETED = "Completed",
  IN_PROGRESS = "In Progress",
  ON_STANDBY = "On Standby",
}

export interface Skill {
  name: string;
  level: number;
  logo: string;
}

export interface Experience {
  company: string;
  role: string;
  from: string;
  to: string;
  details: string;
  /** Technologies shown on the generated resume PDF. */
  tech?: string[];
}

export interface Education {
  period: string;
  degree: string;
  track?: string;
  school: string;
}

export interface Project {
  title: string;
  subtitle?: string;
  desc?: string;
  tech?: string[];
  status?: ProjectStatus | string;
  link?: string;
  /** Date range shown on the generated resume PDF. */
  period?: string;
}

export interface Contact {
  email: string;
  phone: string;
  address: string;
  github?: string;
  linkedin?: string;
}

export interface CVLocale {
  name: string;
  title: string;
  /** Profile photo used on the generated resume PDF (path under /public). */
  photo: string;
  contact: Contact;
  profile: string;
  skills: Skill[];
  languages: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
}

export const CVData: Record<string, CVLocale> = {
  en: {
    name: "Harena Rico Mahefaniaina",
    title: "Mobile & Web Developer",
    photo: "/profile.png",
    contact: {
      email: "harenaricom@gmail.com",
      phone: "+261 34 33 135 51",
      address: "Lot TR42 Ampahimanga, Ambohimanambola",
      github: "https://github.com/harena2000",
      linkedin: "https://linkedin.com/in/harena-rico",
    },
    profile: `Experienced full-stack mobile and web developer with over 4 years of expertise at Futurmap. Specialized in Flutter development with a strong command of modern web technologies (Node.js, Vue.js, Django, Next.js). Expert in GIS solutions and complex geospatial systems integration.`,
    skills: [
      { name: "Flutter", level: 90, logo: "/logos/flutter.svg" },
      { name: "Firebase", level: 90, logo: "/logos/firebase.svg" },
      { name: "Vue.js", level: 75, logo: "/logos/vue.svg" },
      { name: "TypeScript", level: 75, logo: "/logos/typescript.svg" },
      { name: "Express.js", level: 75, logo: "/logos/express.svg" },
      { name: "Next.js", level: 70, logo: "/logos/nextjs.svg" },
      { name: "React", level: 65, logo: "/logos/react.svg" },
      { name: "PostgreSQL", level: 70, logo: "/logos/postgresql.svg" },
      { name: "Laravel", level: 65, logo: "/logos/laravel.svg" },
    ],
    languages: ["French", "English"],
    education: [
      {
        period: "2019-2022",
        degree: "Bachelor's in Computer Science",
        track: "Software Engineering Track",
        school: "Zurcher Adventist University",
      },
      {
        period: "2018",
        degree: "High School Diploma",
        track: "Julien Ramaronjisoa",
        school: "Adventist Private High School",
      },
    ],
    experience: [
      {
        company: "Aureon Madagascar",
        role: "Lead Developer",
        from: "January 2026",
        to: "June 2026",
        details:
          "Lead developer responsible for technical architecture, team management, and development of mobile and web applications.",
        tech: ["Flutter", "Firebase", "Gemini"],
      },
      {
        company: "Futurmap",
        role: "Lead Mobile Developer",
        from: "October 2024",
        to: "January 2026",
        details:
          "Lead developer in the beyond map department for code maintainability, project management, and team supervision.",
        tech: ["Flutter", "Next.js", "Django"],
      },
      {
        company: "Futurmap",
        role: "Mobile Developer",
        from: "2022",
        to: "2024",
        details:
          "Development of mobile applications with Flutter, Java and Kotlin.",
        tech: ["Flutter", "Dart"],
      },
      {
        company: "Fitiavana.MG",
        role: "Fullstack Developer Vue / Laravel",
        from: "2021",
        to: "2022",
        details:
          "Developed a storage management application with Vue.js and Laravel.",
        tech: ["Vue.js", "Laravel"],
      },
    ],
    projects: [
      {
        title: "ZakaJiaby",
        subtitle: "Freelance | Cross-platform Web and Mobile",
        desc: "Mobile application for budget, event, and activity management for groups of people. Allows users to track expenses, plan events, and manage activities collaboratively within a user-friendly interface.",
        tech: ["Flutter", "Express.js", "PostgreSQL"],
        status: ProjectStatus.ON_STANDBY,
        period: "2023 - Present",
      },
      {
        title: "WebGIS Platform",
        subtitle: "Futurmap | Web GIS Application",
        desc: "Development of a complete WebGIS platform with QGIS integration. Creation of a custom QGIS plugin communicating via WebSocket to synchronize changes directly with the web application. Implementation of a system for displaying geospatial layers on images and an interactive map. Development of an innovative viewer transforming panoramic images into an immersive 360° experience.",
        tech: [
          "Django",
          "Next.js",
          "TypeScript",
          "Leaflet",
          "Docker",
          "QGIS",
          "Shadcn/ui",
          "PostgreSQL",
        ],
        status: ProjectStatus.COMPLETED,
        period: "September 2025 - January 2026",
      },
      {
        title: "InsideGolf",
        subtitle: "Futurmap | Cross-platform Mobile",
        desc: "Development of a dedicated mobile application for learning golf, offering an optimal user experience and advanced features for golf enthusiasts.",
        tech: ["Flutter", "Stripe", "Firebase"],
        status: ProjectStatus.COMPLETED,
        link: "https://play.google.com/store/apps/details?id=com.idevshop.oppgolf&pcampaignid=web_share",
        period: "February 2024 - April 2025",
      },
      {
        title: "Product Ticketing",
        subtitle: "Freelance | Web Application",
        desc: "Design and development of a complete product ticket management platform. With a robust architecture allowing for efficient request management, ticket tracking, and real-time collaboration.",
        tech: ["Express.js", "Vue.js", "TailwindCSS", "Docker", "PostgreSQL"],
        status: ProjectStatus.COMPLETED,
      },
      {
        title: "SingSong",
        subtitle: "Freelance | Mobile Application",
        desc: "A social karaoke mobile application allowing users to sing, listen, and record songs. This application is targeted for Adventists.",
        tech: ["Flutter"],
        status: ProjectStatus.COMPLETED,
        link: "/projects/singsong",
        period: "April - July 2024",
      },
      {
        title: "MENTO",
        subtitle: "AUREON | Mobile Application",
        desc: "MENTO is your personal companion for mental strength. An app that helps you organize your thoughts, understand your feelings, and gain new perspectives. No hocus-pocus, but modern psychology made simple and accessible.",
        tech: ["Flutter", "Firebase", "Gemini", "Stripe"],
        status: ProjectStatus.COMPLETED,
        link: "/projects/mento",
        period: "January 2026 - Present",
      },
    ],
  },
  fr: {
    name: "Harena Rico Mahefaniaina",
    title: "Développeur Mobile & Web",
    photo: "/profile.png",
    contact: {
      email: "harenaricom@gmail.com",
      phone: "+261 34 33 135 51",
      address: "Lot TR42 Ampahimanga, Ambohimanambola",
      github: "https://github.com/harena2000",
      linkedin: "https://linkedin.com/in/harena-rico",
    },
    profile: `Développeur mobile et web fullstack expérimenté avec plus de 4 ans d'expertise chez Futurmap. Spécialisé en développement Flutter avec une solide maîtrise des technologies web modernes (Node.js, Vue.js, Django, Next.js). Expert en solutions SIG et intégration de systèmes géospatiaux complexes.`,
    skills: [
      { name: "Flutter", level: 90, logo: "/logos/flutter.svg" },
      { name: "Firebase", level: 90, logo: "/logos/firebase.svg" },
      { name: "Vue.js", level: 75, logo: "/logos/vue.svg" },
      { name: "TypeScript", level: 75, logo: "/logos/typescript.svg" },
      { name: "Express.js", level: 75, logo: "/logos/express.svg" },
      { name: "Next.js", level: 70, logo: "/logos/nextjs.svg" },
      { name: "React", level: 65, logo: "/logos/react.svg" },
      { name: "PostgreSQL", level: 70, logo: "/logos/postgresql.svg" },
      { name: "Laravel", level: 65, logo: "/logos/laravel.svg" },
    ],
    languages: ["Français", "Anglais"],
    education: [
      {
        period: "2019-2022",
        degree: "Licence en Informatique",
        track: "Parcours Génie Logiciel",
        school: "Université Adventiste Zurcher",
      },
      {
        period: "2018",
        degree: "Baccalauréat",
        track: "Julien Ramaronjisoa",
        school: "Lycée Privé Adventiste",
      },
    ],
    experience: [
      {
        company: "Aureon Madagascar",
        role: "Lead Développeur",
        from: "Janvier 2026",
        to: "Juin 2026",
        details:
          "Lead développeur responsable de l'architecture technique, de la gestion d'équipe et du développement d'applications mobiles et web.",
        tech: ["Flutter", "Firebase", "Gemini"],
      },
      {
        company: "Futurmap",
        role: "Lead Développeur Mobile",
        from: "Octobre 2024",
        to: "Janvier 2026",
        details:
          "Lead développeur dans le département beyond map pour la maintenabilité des codes, du projet et l'encadrement de l'équipe.",
        tech: ["Flutter", "Next.js", "Django"],
      },
      {
        company: "Futurmap",
        role: "Développeur Mobile",
        from: "2022",
        to: "2024",
        details:
          "Développement d'applications mobile avec Flutter, Java et Kotlin.",
        tech: ["Flutter", "Dart"],
      },
      {
        company: "Fitiavana.MG",
        role: "Développeur Fullstack Vue / Laravel",
        from: "2021",
        to: "2022",
        details:
          "Développement d'une application de stockage avec Vue.js et Laravel.",
        tech: ["Vue.js", "Laravel"],
      },
    ],
    projects: [
      {
        title: "ZakaJiaby",
        subtitle: "Freelance | Web et Mobile Multi-plateforme",
        desc: "Application mobile de gestion budgétaire, d'événements et d'activités pour des groupes de personnes. Permet aux utilisateurs de suivre les dépenses, planifier des événements et gérer les activités de manière collaborative au sein d'une interface conviviale.",
        tech: ["Flutter", "Express.js", "PostgreSQL"],
        status: ProjectStatus.ON_STANDBY,
        period: "2023 - Présent",
      },
      {
        title: "Plateforme WebSIG",
        subtitle: "Futurmap | Application Web SIG",
        desc: "Développement d'une plateforme WebSIG complète avec une intégration du QGIS. Création d'un plugin QGIS personnalisé communiquant via WebSocket pour synchroniser les modifications directement avec l'application web. Mise en place d'un système d'affichage de couches géospatiales sur les images et une carte interactive. Développement d'un viewer innovant transformant les images panoramiques en expérience 360° immersive.",
        tech: [
          "Django",
          "Next.js",
          "TypeScript",
          "Leaflet",
          "Docker",
          "QGIS",
          "Shadcn/ui",
          "PostgreSQL",
        ],
        status: ProjectStatus.COMPLETED,
        period: "Septembre 2025 - Janvier 2026",
      },
      {
        title: "InsideGolf",
        subtitle: "Futurmap | Mobile Multi-plateforme",
        desc: "Développement d'une application mobile dédiée sur l'apprentissage du golf, offrant une expérience utilisateur optimale et des fonctionnalités avancées pour les passionnés de golf.",
        tech: ["Flutter", "Stripe", "Firebase"],
        status: ProjectStatus.COMPLETED,
        link: "https://play.google.com/store/apps/details?id=com.idevshop.oppgolf&pcampaignid=web_share",
        period: "Février 2024 - Avril 2025",
      },
      {
        title: "Product Ticketing",
        subtitle: "Freelance | Application Web",
        desc: "Conception et développement d'une plateforme de gestion de ticket complète des produits. Avec une architecture robuste permettant la gestion efficace des demandes, le suivi des tickets et la collaboration en temps réel.",
        tech: ["Express.js", "Vue.js", "TailwindCSS", "Docker", "PostgreSQL"],
        status: ProjectStatus.COMPLETED,
      },
      {
        title: "SingSong",
        subtitle: "Freelance | Application Mobile",
        desc: "Une application mobile de karaoké social permettant aux utilisateurs de chanter, d'écouter et d'enregistrer des chansons. Cette application est ciblée pour les Adventistes.",
        tech: ["Flutter"],
        status: ProjectStatus.COMPLETED,
        link: "/projects/singsong",
        period: "Avril - Juillet 2024",
      },
      {
        title: "MENTO",
        subtitle: "AUREON | Application Mobile",
        desc: "MENTO est votre compagnon personnel pour la force mentale. Une application qui vous aide à organiser vos pensées, comprendre vos émotions et acquérir de nouvelles perspectives. Pas de charlatanisme, mais de la psychologie moderne rendue simple et accessible.",
        tech: ["Flutter", "Firebase", "Gemini", "Stripe"],
        status: ProjectStatus.COMPLETED,
        link: "/projects/mento",
        period: "Janvier 2026 - Présent",
      },
    ],
  },
};
