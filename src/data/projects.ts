// Projets : textes, technologies et liens repris tels quels du site précédent.
// Ajouter une capture : déposer le fichier dans public/images/projets/ (paysage, 960 px de large au moins),
// puis renseigner `image`. Sans image, la carte affiche une couverture typographique.
import { NBSP } from './site';

export type Category = 'web' | 'ia' | 'mobile' | 'formation';
export type Filter = 'tous' | Category;

export const filters: { id: Filter; label: string }[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'web', label: 'Web' },
  { id: 'ia', label: 'IA' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'formation', label: 'Formation' },
];

export interface ProjectLink {
  kind: 'code' | 'demo';
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  /** Complément du nom pour les lecteurs d'écran : « Code de SenLab », « Démo d'AgriMétéo »... */
  of: string;
  description: string;
  categories: Category[];
  tech: string[];
  image?: { src: string; width: number; height: number; alt: string };
  links: ProjectLink[];
  /** Projet mis en avant en tête de section (filtre « Tous »), avec la mention affichée dans son badge. */
  featured?: string;
}

const gh = (repo: string) => `https://github.com/BigLineDev0/${repo}`;

export const projects: Project[] = [
  {
    id: 'senlab',
    title: 'SenLab',
    of: 'de SenLab',
    featured: 'Projet de certification',
    description:
      "Plateforme de gestion des rendez-vous, des équipements et de la maintenance pour les laboratoires de recherche. " +
      "Projet de certification, avec le laboratoire UMRED de l'Université Iba Der Thiam de Thiès comme site pilote.",
    categories: ['web', 'ia', 'formation'],
    tech: ['Angular', 'Django REST', 'PostgreSQL', 'FastAPI', 'Tailwind CSS'],
    image: { src: '/images/projets/senlab.webp', width: 1280, height: 621, alt: 'Tableau de bord de SenLab' },
    links: [
      { kind: 'code', label: 'Code', href: gh('umred-backend-api') },
      { kind: 'demo', label: 'Démo', href: 'https://senlab.site/' },
    ],
  },
  {
    id: 'and-setal',
    title: 'Andë Sétal',
    of: "d'Andë Sétal",
    description:
      "Application citoyenne pour suivre la salubrité à Dakar Plateau. J'étais lead dev frontend dans une équipe de 4, " +
      'avec 8 jours pour intégrer et développer, en Git Flow.',
    categories: ['web', 'formation'],
    tech: ['Angular', 'TypeScript', 'Django REST', 'MySQL', 'Git Flow'],
    image: {
      src: '/images/projets/and-setal.webp',
      width: 1280,
      height: 1357,
      alt: `Tableau de bord d'Andë Sétal${NBSP}: indicateurs des signalements et carte du Plateau`,
    },
    links: [{ kind: 'code', label: 'Code', href: gh('and-setal') }],
  },
  {
    id: 'smarthelp',
    title: 'SmartHelp',
    of: 'de SmartHelp',
    description:
      'Micro-service qui analyse une réclamation client reçue en audio (Whisper), en image (ViT) ou en texte ' +
      '(RAG sur une base interne), avec une interface Angular.',
    categories: ['ia', 'web'],
    tech: ['FastAPI', 'Whisper', 'ViT', 'sentence-transformers', 'Angular'],
    links: [
      { kind: 'code', label: 'Code API', href: gh('smarthelp-support-multimodal') },
      { kind: 'code', label: 'Code front', href: gh('smarthelp-ui-frontend') },
    ],
  },
  {
    id: 'controle-qualite',
    title: 'Contrôle Qualité Produit',
    of: 'de Contrôle Qualité Produit',
    description:
      `API de vision FastAPI qui classe la photo d'un produit comme «${NBSP}conforme${NBSP}» ou «${NBSP}défaut${NBSP}», ` +
      'avec un modèle Hugging Face en zero-shot, sans entraînement spécifique.',
    categories: ['ia', 'web'],
    tech: ['FastAPI', 'Hugging Face', 'zero-shot'],
    links: [{ kind: 'code', label: 'Code', href: gh('controle-qualite-produit') }],
  },
  {
    id: 'agrimeteo',
    title: 'AgriMétéo Sénégal',
    of: "d'AgriMétéo",
    description:
      'Météo agricole des 14 régions du Sénégal, avec une carte interactive et des graphiques. ' +
      "Les données viennent de l'API OpenWeatherMap.",
    categories: ['web'],
    tech: ['Angular', 'Tailwind CSS', 'Chart.js', 'OpenWeatherMap'],
    image: {
      src: '/images/projets/agrimeteo.webp',
      width: 960,
      height: 600,
      alt: `AgriMétéo${NBSP}: carte des régions du Sénégal et météo du jour`,
    },
    links: [
      { kind: 'code', label: 'Code', href: gh('AgriMeteo') },
      { kind: 'demo', label: 'Démo', href: 'https://agri-meteo-ten.vercel.app/' },
    ],
  },
  {
    id: 'eco-stock',
    title: 'Eco-Stock',
    of: "d'Eco-Stock",
    description:
      `Gestion de stocks alimentaires${NBSP}: API Django REST et PostgreSQL, interface Angular avec renouvellement ` +
      'automatique du jeton JWT, le tout lancé avec Docker Compose.',
    categories: ['web'],
    tech: ['Angular', 'Django REST', 'PostgreSQL', 'Docker'],
    image: {
      src: '/images/projets/eco-stock.webp',
      width: 941,
      height: 563,
      alt: `Requête Postman sur l'API Eco-Stock${NBSP}: liste des produits`,
    },
    links: [
      { kind: 'code', label: 'Code front', href: gh('eco-stock-frontend') },
      { kind: 'code', label: 'Code API', href: gh('eco-stock-api') },
    ],
  },
  {
    id: 'chatbot-rag',
    title: 'Chatbot RAG',
    of: 'du chatbot RAG',
    description:
      'Chatbot qui répond aux questions des apprenants à partir du règlement intérieur de la formation. ' +
      "D'abord un prototype Streamlit, ensuite une API Django REST.",
    categories: ['ia', 'formation'],
    tech: ['Python', 'LangChain', 'OpenRouter', 'Streamlit', 'Django REST'],
    links: [{ kind: 'code', label: 'Code', href: gh('chat-rag-api') }],
  },
  {
    id: 'joj-news',
    title: 'JOJ News',
    of: 'de JOJ News',
    description:
      "Site d'actualités sur les JOJ Dakar 2026. Les articles sont résumés par le modèle Mistral, exécuté en local avec Ollama.",
    categories: ['web', 'ia', 'formation'],
    tech: ['Django', 'MySQL', 'Bootstrap', 'Ollama'],
    image: {
      src: '/images/projets/joj-news.webp',
      width: 960,
      height: 600,
      alt: "Page d'accueil de JOJ News Dakar 2026",
    },
    links: [{ kind: 'code', label: 'Code', href: gh('Brief-JOJ-NEWS') }],
  },
  {
    id: 'sunu-idees',
    title: 'SUNU-IDEES',
    of: 'de SUNU-IDEES',
    description:
      'Boîte à idées collaborative. Les idées sont stockées dans Supabase et un modèle de langage est appelé via OpenRouter.',
    categories: ['web', 'ia'],
    tech: ['JavaScript', 'Vite', 'Tailwind CSS', 'Supabase', 'OpenRouter API'],
    image: {
      src: '/images/projets/sunu-idees.webp',
      width: 960,
      height: 600,
      alt: `SUNU-IDEES${NBSP}: formulaire d'idée et liste des idées`,
    },
    links: [
      { kind: 'code', label: 'Code', href: gh('sunu-idees') },
      { kind: 'demo', label: 'Démo', href: 'https://sunu-idees.vercel.app/' },
    ],
  },
  {
    id: 'clone-wave',
    title: 'Clone Wave Mobile',
    of: 'du clone Wave',
    description:
      `Clone d'une application de paiement mobile, en trois étapes${NBSP}: l'API Laravel, l'interface Angular, ` +
      "puis l'application Flutter.",
    categories: ['mobile', 'web'],
    tech: ['Laravel', 'Angular', 'Flutter'],
    links: [{ kind: 'code', label: 'Code API', href: gh('Wave-clone-api') }],
  },
  {
    id: 'sta',
    title: 'STA',
    of: 'de STA',
    description: `Système de Traçabilité d'Activité${NBSP}: journal des actions, tableau de bord et gestion des utilisateurs.`,
    categories: ['web', 'formation'],
    tech: ['Django', 'MySQL', 'Bootstrap 5', 'Ollama'],
    image: { src: '/images/projets/sta.webp', width: 960, height: 600, alt: 'Tableau de bord STA' },
    links: [{ kind: 'code', label: 'Code', href: gh('brief-STA-Django') }],
  },
  {
    id: 'star-buffet',
    title: 'Restaurant Star Buffet',
    of: 'de Star Buffet',
    description: "Site vitrine d'un restaurant, avec menu et réservation, en HTML et CSS.",
    categories: ['web', 'formation'],
    tech: ['HTML', 'CSS'],
    image: {
      src: '/images/projets/star-buffet.webp',
      width: 960,
      height: 600,
      alt: "Page d'accueil du restaurant Star Buffet",
    },
    links: [
      { kind: 'code', label: 'Code', href: gh('atelier6-html-css') },
      { kind: 'demo', label: 'Démo', href: 'https://atelier6-html-css.vercel.app/' },
    ],
  },
  {
    id: 'todo-react',
    title: 'Todo List React',
    of: 'de la Todo List',
    description: 'Liste de tâches avec priorités et filtres, en React et TypeScript.',
    categories: ['web'],
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    image: {
      src: '/images/projets/todo-react.webp',
      width: 640,
      height: 400,
      alt: `Todo List${NBSP}: saisie d'une tâche et filtres par priorité`,
    },
    links: [
      { kind: 'code', label: 'Code', href: gh('todo-react-js') },
      { kind: 'demo', label: 'Démo', href: 'https://todo-react-js-theta.vercel.app/' },
    ],
  },
];
