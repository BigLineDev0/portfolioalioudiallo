// Identité, coordonnées et navigation : source unique pour l'en-tête, l'accueil, le contact et le pied de page.

/** Espace insécable, placé avant les deux-points et à l'intérieur des guillemets français. */
export const NBSP = ' ';

export const site = {
  name: 'Aliou DIALLO',
  shortName: `A.${NBSP}DIALLO`,
  email: 'alioudiallo.py@gmail.com',
  phone: '+221 78 475 16 39',
  phoneHref: 'tel:+221784751639',
  github: 'https://github.com/BigLineDev0',
  githubLabel: 'github.com/BigLineDev0',
  linkedin: 'https://www.linkedin.com/in/aliou-diallo-6704681a1/',
  location: 'Dakar, Sénégal',
  cv: { href: '/CV_Aliou_DIALLO.pdf', fileName: 'CV_Aliou_DIALLO.pdf', label: 'Télécharger mon CV' },
  availability: 'Disponible pour de nouvelles missions',
  availabilityDetail: `Postes en entreprise, missions freelance ou collaborations${NBSP}: parlons de votre projet.`,
  /** Rôles écrits tour à tour dans l'accueil ; le premier reste affiché en mouvement réduit. */
  roles: ['Développeur Full-Stack & IA', 'Développeur Web et Mobile', 'Intégrateur de solutions IA'],
  heroIntro:
    "Je conçois et développe des applications web et mobiles complètes, de l'interface à l'API et à la base de données. " +
    "Polyvalent, je travaille aussi bien en Python et PHP qu'en TypeScript ou en Dart, et j'intègre l'intelligence " +
    "artificielle lorsqu'elle sert le projet.",
} as const;

/** Les six entrées de navigation, dans l'ordre du site actuel. Le bouton CV complète la barre. */
export const navItems = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'a-propos', label: 'À propos' },
  { id: 'projets', label: 'Projets' },
  { id: 'competences', label: 'Compétences' },
  { id: 'experiences', label: 'Expériences' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof navItems)[number]['id'];
