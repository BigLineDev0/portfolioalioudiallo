import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { filters, projects, type Filter } from '../../data/projects';
import { useCarousel } from '../../hooks/useCarousel';
import { useReveal } from '../../hooks/useReveal';
import { gsap, MQ, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { FeaturedProject, ProjectCard } from '../projects/ProjectCard';
import { SectionHeader } from '../ui/SectionHeader';

const featured = projects.find((project) => project.featured);

export function Projects() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const firstBuild = useRef(true);
  const [filter, setFilter] = useState<Filter>('tous');
  const [status, setStatus] = useState('');

  // « Tous » : le projet mis en avant ouvre la section, le carrousel présente les autres.
  // Autre filtre : tous les projets de la catégorie sont dans le carrousel.
  const gallery =
    filter === 'tous'
      ? projects.filter((project) => project !== featured)
      : projects.filter((project) => project.categories.includes(filter));

  const carousel = useCarousel(trackRef, filter);
  const first = carousel.page * carousel.perView + 1;
  const last = Math.min(first + carousel.perView - 1, carousel.count);

  useReveal(root);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      const isFirst = firstBuild.current;
      firstBuild.current = false;

      // Le filtre change la hauteur de la section : les déclencheurs suivants sont recalculés
      if (!isFirst) ScrollTrigger.refresh();

      const mm = gsap.matchMedia();
      mm.add(
        MQ.motion,
        () => {
          // Entrée des cartes : à l'arrivée du carrousel la première fois, immédiatement après un filtre
          gsap.from(gsap.utils.toArray<HTMLElement>('[data-slot]', track), {
            autoAlpha: 0,
            y: isFirst ? 60 : 24,
            duration: isFirst ? 0.9 : 0.5,
            stagger: isFirst ? 0.1 : 0.05,
            ease: 'power3.out',
            scrollTrigger: isFirst ? { trigger: track, start: 'top 85%', once: true } : undefined,
          });

          // Cartes inclinées en 3D au survol (souris uniquement)
          if (!window.matchMedia(MQ.finePointer).matches) return;
          const cleanups = gsap.utils.toArray<HTMLElement>('[data-tilt]', track).map((card) => {
            gsap.set(card, { transformPerspective: 1000 });
            const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
            const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
            const onMove = (event: PointerEvent) => {
              if (track.dataset.dragging) return;
              const box = card.getBoundingClientRect();
              rotateY(((event.clientX - box.left) / box.width - 0.5) * 6);
              rotateX(-((event.clientY - box.top) / box.height - 0.5) * 6);
            };
            const onLeave = () => {
              rotateX(0);
              rotateY(0);
            };
            card.addEventListener('pointermove', onMove);
            card.addEventListener('pointerleave', onLeave);
            return () => {
              card.removeEventListener('pointermove', onMove);
              card.removeEventListener('pointerleave', onLeave);
            };
          });
          return () => cleanups.forEach((cleanup) => cleanup());
        },
        track,
      );
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  const choose = (next: Filter) => {
    if (next === filter) return;
    const count =
      next === 'tous' ? projects.length : projects.filter((project) => project.categories.includes(next)).length;
    const label = filters.find((item) => item.id === next)?.label ?? '';
    setFilter(next);
    setStatus(`${count} projet${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}, catégorie ${label}.`);
  };

  return (
    <section id="projets" ref={root} className="section overflow-x-clip" aria-labelledby="titre-projets">
      <div className="page">
        <div className="mb-12 flex flex-col gap-8 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader id="titre-projets" title="Mes projets" className="">
            Une sélection de projets web, mobile et IA, réalisés seul ou en équipe.
          </SectionHeader>

          <div data-reveal>
            <ul className="flex flex-wrap gap-2" aria-label="Filtrer les projets par catégorie">
              {filters.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="chip"
                    aria-pressed={filter === item.id}
                    onClick={() => choose(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="sr-only" aria-live="polite">
              {status}
            </p>
          </div>
        </div>

        {filter === 'tous' && featured && (
          <div data-reveal className="mb-6 lg:mb-8">
            <FeaturedProject project={featured} />
          </div>
        )}

        <div role="region" aria-roledescription="carrousel" aria-label="Projets">
          <ul id="projets-liste" ref={trackRef} className="project-track">
            {gallery.map((project) => (
              <li key={project.id} data-slot className="project-slot">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>

          {carousel.pages > 1 && (
            <div className="mt-8 flex items-center justify-between gap-4">
              {carousel.pages > 6 ? (
                // Beaucoup de pages (mobile) : un compteur remplace les points
                <p className="text-sm text-muted tabular-nums" aria-hidden="true">
                  <span className="text-ink">{carousel.page + 1}</span> / {carousel.pages}
                </p>
              ) : (
                <div className="flex flex-wrap items-center" role="group" aria-label="Pages du carrousel">
                  {Array.from({ length: carousel.pages }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      className="page-dot"
                      aria-controls="projets-liste"
                      aria-label={`Page ${index + 1} sur ${carousel.pages}`}
                      aria-current={carousel.page === index ? 'true' : undefined}
                      onClick={() => carousel.goTo(index)}
                    >
                      <span />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  className="carousel-button"
                  aria-controls="projets-liste"
                  aria-label="Projets précédents"
                  disabled={carousel.page === 0}
                  onClick={carousel.prev}
                >
                  <ArrowLeft size={18} strokeWidth={1.75} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="carousel-button"
                  aria-controls="projets-liste"
                  aria-label="Projets suivants"
                  disabled={carousel.page >= carousel.pages - 1}
                  onClick={carousel.next}
                >
                  <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
          <p className="sr-only" aria-live="polite">
            {carousel.count > 0 &&
              (first === last
                ? `Projet ${first} sur ${carousel.count}.`
                : `Projets ${first} à ${last} sur ${carousel.count}.`)}
          </p>
        </div>
      </div>
    </section>
  );
}
