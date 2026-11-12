import { ArrowUpRight } from 'lucide-react';
import { filters, type Project } from '../../data/projects';

const categoryLabel = (project: Project) =>
  project.categories.map((id) => filters.find((filter) => filter.id === id)?.label ?? id).join(' · ');

/** Monogramme du projet : initiales des deux premiers mots, ou majuscules d'un nom composé (SmartHelp : SH). */
function monogram(title: string) {
  const words = title.split(/\s+/);
  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  const capitals = title.match(/[A-Z]/g) ?? [];
  return capitals.length >= 2 ? capitals.slice(0, 2).join('') : title.slice(0, 2);
}

/** Visuel du projet : la capture, ou un monogramme sobre quand aucune capture n'existe encore. */
function ProjectMedia({ project, className = '' }: { project: Project; className?: string }) {
  return (
    <div className={`project-media ${className}`}>
      {project.image ? (
        <img
          src={project.image.src}
          width={project.image.width}
          height={project.image.height}
          alt={project.image.alt}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <span className="font-display text-[clamp(5rem,4rem+3vw,7rem)] leading-none tracking-[-0.04em] text-ink/15">
            {monogram(project.title)}
          </span>
        </div>
      )}
    </div>
  );
}

function Technologies({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {tech.map((name) => (
        <li key={name} className="badge">
          {name}
        </li>
      ))}
    </ul>
  );
}

function ProjectLinks({ project, className = '' }: { project: Project; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-x-6 ${className}`}>
      {project.links.map((link) => (
        <a key={link.href} className="project-link" href={link.href} target="_blank" rel="noopener noreferrer">
          {link.label}
          <span className="sr-only">
            {' '}
            {project.of} (nouvel onglet)
          </span>
          <ArrowUpRight size={16} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

/** Carte de la galerie : capture encadrée, catégories, titre, description, technologies, liens. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article data-tilt className="project-card">
      <ProjectMedia project={project} />
      <div className="flex flex-1 flex-col px-3 pt-6 pb-2 sm:px-4">
        <p className="text-sm text-accent">{categoryLabel(project)}</p>
        <h3 className="mt-2 font-display text-[1.75rem] leading-tight">{project.title}</h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{project.description}</p>
        <div className="mt-5">
          <Technologies tech={project.tech} />
        </div>
        <div className="mt-auto pt-6">
          <ProjectLinks project={project} className="border-t border-line pt-2" />
        </div>
      </div>
    </article>
  );
}

/** Projet mis en avant : texte à gauche, grande capture à droite (empilés sur mobile). */
export function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="project-feature">
      <div className="order-2 flex flex-col px-3 pt-8 pb-4 sm:px-6 lg:order-1 lg:col-span-5 lg:px-8 lg:py-10">
        {project.featured && (
          <p className="self-start rounded-full bg-accent px-3 py-1 text-xs font-medium text-on-accent">
            {project.featured}
          </p>
        )}
        <h3 className="mt-6 font-display text-[clamp(2.5rem,1.8rem+2.6vw,3.75rem)] leading-[1.02] tracking-[-0.02em]">
          {project.title}
        </h3>
        <p className="mt-3 text-sm text-accent">{categoryLabel(project)}</p>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{project.description}</p>
        <div className="mt-6">
          <Technologies tech={project.tech} />
        </div>
        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          {project.links.map((link) => (
            <a
              key={link.href}
              className={`btn ${link.kind === 'demo' ? 'btn-primary' : 'btn-secondary'} px-5`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.kind === 'demo' ? 'Voir la démo' : link.label}
              <span className="sr-only">
                {' '}
                {project.of} (nouvel onglet)
              </span>
              <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
      <ProjectMedia
        project={project}
        className="order-1 lg:order-2 lg:col-span-7 lg:aspect-auto lg:min-h-[28rem] [&_img]:object-left-top"
      />
    </article>
  );
}
