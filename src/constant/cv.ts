export enum ProjectStatus {
  COMPLETED = "Completed",
  IN_PROGRESS = "In Progress",
  ON_STANDBY = "On Standby",
}

export const CV = {
  name: "Harena Rico Mahefaniaina",
  title: "Développeur Mobile & Web",
  contact: {
    email: "harenaricom@gmail.com",
    phone: "+261 34 33 135 51",
    address: "Lot TR42 Ampahimanga, Ambohimanambola",
  },
  profile: `Développeur mobile et web fullstack expérimenté avec plus de 3 ans et demi d'expertise chez Futurmap. Spécialisé en développement Flutter avec une solide maîtrise des technologies web modernes (Node.js, Vue.js, Django, Next.js). Expert en solutions SIG et intégration de systèmes géospatiaux complexes.`,
  skills: [
    { name: "Flutter", level: 90, logo: "/logos/flutter.svg" },
    { name: "Vue.js", level: 75, logo: "/logos/vue.svg" },
    { name: "TypeScript", level: 75, logo: "/logos/typescript.svg" },
    { name: "Express.js", level: 75, logo: "/logos/express.svg" },
    { name: "Next.js", level: 70, logo: "/logos/nextjs.svg" },
    { name: "React", level: 65, logo: "/logos/react.svg" },
    { name: "PostgreSQL", level: 70, logo: "/logos/postgresql.svg" },
    { name: "Laravel", level: 65, logo: "/logos/laravel.svg" },
  ],
  experience: [
    {
      company: "Futurmap",
      role: "Lead Développeur mobile",
      from: "Juin 2024",
      to: "Present",
      details:
        "Lead développeur dans le département beyond map pour la maintenabilité des codes, du projet et l’encadrement de l’équipe.",
    },
    {
      company: "Futurmap",
      role: "Développeur mobile",
      from: "2022",
      to: "2024",
      details:
        "Développement d’applications mobile avec Flutter, Java et Kotlin.",
    },
    {
      company: "Fitiavana.MG",
      role: "Développeur mobile | Freelance",
      from: "2021",
      to: "2022",
      details: "Développer une application mobile avec Java.",
    },
  ],
  projects: [
    {
      title: "ZakaJiaby",
      subtitle: "Freelance | Web et Mobile Multi-plateforme",
      desc: "Application mobile de gestion budgétaire, d'événements et d'activités pour des groupes de personnes. Permet aux utilisateurs de suivre les dépenses, planifier des événements et gérer les activités de manière collaborative au sein d'une interface conviviale.",
      tech: ["Flutter", "Express.js", "PostgreSQL"],
      status: ProjectStatus.ON_STANDBY,
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
        "Shadecn/ui",
        "PostgreSQL",
      ],
      status: ProjectStatus.IN_PROGRESS,
    },
    {
      title: "InsideGolf",
      subtitle: "Futurmap | Mobile Multi-plateforme",
      desc: "Développement d'une application mobile dédiée sur l'apprentissage du golf, offrant une expérience utilisateur optimale et des fonctionnalités avancées pour les passionnés de golf.",
      tech: ["Flutter", "Stripe", "Firebase"],
      status: ProjectStatus.COMPLETED,
    },
    {
      title: "Product Ticketing",
      subtitle: "Freelance | Application Web",
      desc: "Conception et développement d'une plateforme de gestion de ticket complète des produits. Avec une architecture robuste permettant la gestion efficace des demandes, le suivi des tickets et la collaboration en temps réel.",
      tech: ["Express.js", "Vue.js", "TailwindCSS", "Docker", "PostgreSQL"],
      status: ProjectStatus.IN_PROGRESS,
    },
    {
      title: "SingSong",
      subtitle: "Freelance | Application Mobile",
      desc: "Une application mobile de karaoké social permettant aux utilisateurs de chanter, d'écouter et d'enregistre des chansons. Cette application est siblé pour les Adventistes",
      tech: ["Flutter"],
      status: ProjectStatus.COMPLETED,
    },
  ],
  resumeUrl: "/resume.pdf",
};
