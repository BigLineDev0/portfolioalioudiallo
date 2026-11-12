// Expériences et formations : textes repris du site précédent.
import { NBSP } from './site';

export interface Period {
  label: string;
  /** Dates machine pour <time>, dans l'ordre début, fin. */
  datetime: string[];
}

export interface Experience {
  id: string;
  period: Period;
  role: string;
  organization: string;
  highlights: string[];
  tags: string[];
}

export const experiences: Experience[] = [
  {
    id: 'simplon',
    period: { label: 'Novembre 2025 – octobre 2026', datetime: ['2025-11', '2026-10'] },
    role: 'Développeur Full-Stack en formation',
    organization: 'Simplon Sénégal',
    highlights: [
      'Lead dev frontend sur Andë Sétal, dans une équipe de 4 organisée en Git Flow, avec 8 jours pour livrer.',
      `Projet de certification${NBSP}: SenLab, avec le laboratoire UMRED comme site pilote.`,
      'Piste de pré-incubation en entrepreneuriat autour de SenLab.',
    ],
    tags: ['Angular', 'Django', 'FastAPI', 'PostgreSQL', 'RAG', 'Flutter'],
  },
  {
    id: 'groupe-codeurs',
    period: { label: 'Depuis 2022', datetime: ['2022'] },
    role: 'Assistant, formateur puis développeur full-stack',
    organization: 'Groupe Codeurs, Mbour',
    highlights: [
      'Accompagnement des apprenants sur leurs exercices et leurs projets.',
      'Préparation de supports de cours, par exemple une séance de révision HTML/CSS avec exercices.',
      'Interventions en développement web, en infographie et en bureautique.',
    ],
    tags: ['HTML', 'CSS', 'Pédagogie'],
  },
];

export interface Education {
  id: string;
  period: Period;
  title: string;
  school: string;
}

export const education: Education[] = [
  {
    id: 'simplon',
    period: { label: 'Novembre 2025 – octobre 2026', datetime: ['2025-11', '2026-10'] },
    title: 'Développement Web, Mobile et IA',
    school: 'Simplon Sénégal',
  },
  {
    id: 'master',
    period: { label: '2023 – 2025', datetime: ['2023', '2025'] },
    title: "Master Conception et Développement d'Applications",
    school: 'Université Numérique Cheikh Hamidou KANE',
  },
  {
    id: 'licence',
    period: { label: '2019 – 2022', datetime: ['2019', '2022'] },
    title: "Licence en Informatique, Développement d'Applications (IDA)",
    school: 'Université Numérique Cheikh Hamidou KANE',
  },
];
