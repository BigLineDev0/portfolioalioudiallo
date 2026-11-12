// Compétences : catégories et technologies reprises du site précédent, sans niveau de maîtrise.

const devicon = (path: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@2.17.0/icons/${path}`;
const simpleIcon = (name: string) => `https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/${name}.svg`;

/** Logo distant, ou glyphe Lucide quand aucun logo officiel n'existe. */
export type SkillIcon =
  | { type: 'logo'; src: string; /** logo noir : éclairci en thème sombre */ dark?: boolean }
  | { type: 'glyph'; name: 'rag' | 'llm' | 'scrum' };

export interface Skill {
  name: string;
  icon: SkillIcon;
}

export interface SkillGroup {
  id: string;
  title: string;
  items: Skill[];
}

const logo = (src: string, dark = false): SkillIcon => ({ type: 'logo', src, dark });

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    items: [
      { name: 'HTML', icon: logo(devicon('html5/html5-original.svg')) },
      { name: 'CSS', icon: logo(devicon('css3/css3-original.svg')) },
      { name: 'Tailwind CSS', icon: logo(devicon('tailwindcss/tailwindcss-original.svg')) },
      { name: 'JavaScript', icon: logo(devicon('javascript/javascript-original.svg')) },
      { name: 'TypeScript', icon: logo(devicon('typescript/typescript-original.svg')) },
      { name: 'Angular', icon: logo(devicon('angular/angular-original.svg')) },
      { name: 'React', icon: logo(devicon('react/react-original.svg')) },
      { name: 'Vue.js', icon: logo(devicon('vuejs/vuejs-original.svg')) },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    items: [
      { name: 'Python', icon: logo(devicon('python/python-original.svg')) },
      { name: 'Django', icon: logo(devicon('django/django-plain.svg'), true) },
      { name: 'Django REST Framework', icon: logo(devicon('djangorest/djangorest-original.svg')) },
      { name: 'FastAPI', icon: logo(devicon('fastapi/fastapi-original.svg')) },
      { name: 'PHP', icon: logo(devicon('php/php-original.svg')) },
      { name: 'Laravel', icon: logo(devicon('laravel/laravel-original.svg')) },
    ],
  },
  {
    id: 'donnees',
    title: 'Bases de données',
    items: [
      { name: 'PostgreSQL', icon: logo(devicon('postgresql/postgresql-original.svg')) },
      { name: 'MySQL', icon: logo(devicon('mysql/mysql-original.svg')) },
      { name: 'Supabase', icon: logo(devicon('supabase/supabase-original.svg')) },
      { name: 'Firebase', icon: logo(devicon('firebase/firebase-original.svg')) },
      { name: 'MongoDB', icon: logo(devicon('mongodb/mongodb-original.svg')) },
    ],
  },
  {
    id: 'ia',
    title: 'Intelligence artificielle',
    items: [
      { name: 'RAG', icon: { type: 'glyph', name: 'rag' } },
      { name: 'LangChain', icon: logo(simpleIcon('langchain'), true) },
      { name: 'Hugging Face', icon: logo(simpleIcon('huggingface'), true) },
      { name: 'Whisper', icon: logo(simpleIcon('openai'), true) },
      { name: 'Ollama', icon: logo(simpleIcon('ollama'), true) },
      { name: 'API de LLM', icon: { type: 'glyph', name: 'llm' } },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    items: [
      { name: 'Flutter', icon: logo(devicon('flutter/flutter-original.svg')) },
      { name: 'Dart', icon: logo(devicon('dart/dart-original.svg')) },
      { name: 'React Native', icon: logo(devicon('react/react-original.svg')) },
    ],
  },
  {
    id: 'outils',
    title: 'Outils et méthodes',
    items: [
      { name: 'Git et Git Flow', icon: logo(devicon('git/git-original.svg')) },
      { name: 'Docker', icon: logo(devicon('docker/docker-original.svg')) },
      { name: 'Postman', icon: logo(devicon('postman/postman-original.svg')) },
      { name: 'Figma', icon: logo(devicon('figma/figma-original.svg')) },
      { name: 'Trello', icon: logo(devicon('trello/trello-original.svg')) },
      { name: 'Vercel', icon: logo(devicon('vercel/vercel-original.svg'), true) },
      { name: 'n8n', icon: logo(simpleIcon('n8n'), true) },
      { name: 'Scrum', icon: { type: 'glyph', name: 'scrum' } },
    ],
  },
];
