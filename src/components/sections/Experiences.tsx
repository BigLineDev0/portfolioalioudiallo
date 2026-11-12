import { useRef } from 'react';
import { experiences } from '../../data/experiences';
import { useReveal } from '../../hooks/useReveal';
import { gsap, MQ, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { SectionHeader } from '../ui/SectionHeader';

export function Experiences() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // La ligne se dessine au fil du défilement ; chaque repère s'allume quand elle l'atteint, puis la carte arrive
  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(
        MQ.motion,
        () => {
          const list = section.querySelector<HTMLElement>('[data-timeline]');
          if (!list) return;
          list.classList.add('timeline-armed');

          gsap.fromTo(
            '[data-rail]',
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 },
            },
          );

          gsap.utils.toArray<HTMLElement>('[data-entry]', list).forEach((entry) => {
            const marker = entry.querySelector('.timeline-marker');
            ScrollTrigger.create({
              trigger: entry,
              start: 'top 70%',
              onEnter: () => marker?.classList.add('is-lit'),
              onLeaveBack: () => marker?.classList.remove('is-lit'),
            });
            gsap
              .timeline({ scrollTrigger: { trigger: entry, start: 'top 80%', once: true } })
              .from(entry.querySelector('[data-period]'), { autoAlpha: 0, y: 20, duration: 0.7, ease: 'power3.out' })
              .from(entry.querySelector('[data-card]'), { autoAlpha: 0, x: 40, duration: 0.9, ease: 'power3.out' }, 0.1)
              .from(
                entry.querySelectorAll('[data-highlight]'),
                { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
                0.4,
              );
          });

          return () => list.classList.remove('timeline-armed');
        },
        section,
      );
    },
    { scope: root },
  );

  return (
    <section id="experiences" ref={root} className="section" aria-labelledby="titre-experiences">
      <div className="page">
        <SectionHeader id="titre-experiences" title="Expériences" />

        <ol data-timeline className="relative mx-auto max-w-5xl">
          {/* Rail : à gauche sur mobile, entre la colonne des dates et les cartes sur desktop */}
          <span
            className="absolute top-0 bottom-0 left-[5px] w-px bg-line md:left-[12.5rem]"
            aria-hidden="true"
          >
            <span data-rail className="absolute inset-0 origin-top bg-accent" />
          </span>

          {experiences.map((experience) => (
            <li
              key={experience.id}
              data-entry
              className="relative pb-14 pl-9 last:pb-0 md:grid md:grid-cols-[11rem_1fr] md:gap-x-12 md:pl-0"
            >
              <span className="timeline-marker top-1.5 left-0 md:top-[2.1rem] md:left-[calc(12.5rem-5px)]" aria-hidden="true" />

              <p data-period className="text-sm text-muted md:pt-7 md:text-right md:font-display md:text-lg md:text-ink">
                {experience.period.datetime.length > 1 ? (
                  <>
                    <time dateTime={experience.period.datetime[0]}>{experience.period.label.split(' – ')[0]}</time>
                    {' – '}
                    <time dateTime={experience.period.datetime[1]}>{experience.period.label.split(' – ')[1]}</time>
                  </>
                ) : (
                  <time dateTime={experience.period.datetime[0]}>{experience.period.label}</time>
                )}
              </p>

              <article data-card className="card mt-3 p-6 sm:p-8 md:mt-0">
                <h3 className="text-h3">{experience.role}</h3>
                <p className="mt-1 font-medium text-accent">{experience.organization}</p>
                <ul className="mt-5 grid gap-2.5 text-muted">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight} data-highlight className="relative pl-5">
                      <span className="absolute top-[0.7em] left-0 size-1.5 rounded-full bg-accent" aria-hidden="true" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {experience.tags.map((tag) => (
                    <li key={tag} className="badge">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
