// Section À propos : textes repris du site précédent.
import { NBSP } from './site';

/** Phrase mise en exergue, tirée du premier paragraphe. */
export const aboutStatement = { text: 'Je choisis les outils en fonction du projet,', accent: "pas l'inverse." };

/** Le premier paragraphe commence par un passage en gras (lead). */
export const aboutParagraphs: { lead?: string; text: string }[] = [
  {
    lead: 'Développeur Full-Stack',
    text:
      `, je conçois des applications web et mobiles complètes${NBSP}: interfaces, API, bases de données et, quand le ` +
      "besoin s'y prête, fonctionnalités d'intelligence artificielle. Je travaille avec plusieurs écosystèmes (Python " +
      'avec Django et FastAPI, PHP avec Laravel, TypeScript avec Angular, React et Vue.js, Flutter et React Native pour ' +
      "le mobile) et je choisis les outils en fonction du projet, pas l'inverse.",
  },
  {
    text:
      "Mon parcours associe une formation universitaire, une Licence puis un Master en conception et développement " +
      `d'applications, à une formation intensive chez Simplon Sénégal tournée vers la pratique${NBSP}: projets en ` +
      "équipe, Git Flow, délais courts. J'y ai conçu SenLab, une plateforme de gestion pour les laboratoires de " +
      'recherche, dont le laboratoire UMRED est le site pilote.',
  },
  {
    text:
      "Formateur chez Groupe Codeurs, j'ai accompagné des apprenants et préparé des supports de cours. Cette expérience " +
      "m'a appris à structurer mon travail et à expliquer clairement mes choix techniques, en équipe comme face à un client.",
  },
  {
    text: 'Je suis ouvert aux postes en entreprise, aux missions freelance et aux collaborations sur des projets utiles.',
  },
];
