import { useRef } from 'react';
import { aboutParagraphs, aboutStatement } from '../../data/about';
import { education } from '../../data/experiences';
import { useReveal } from '../../hooks/useReveal';
import { both, gsap, MQ, useGSAP } from '../../lib/gsap';
import { SectionHeader } from '../ui/SectionHeader';

export function About() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      mm.add(
        MQ.motion,
        () => {
          // Photo dévoilée de bas en haut par un masque, avec un léger zoom arrière
          gsap
            .timeline({ scrollTrigger: { trigger: '[data-photo]', start: 'top 80%', once: true } })
            .fromTo(
              '[data-photo]',
              { clipPath: 'inset(100% 0% 0% 0% round 2rem)' },
              { clipPath: 'inset(0% 0% 0% 0% round 2rem)', duration: 1.4, ease: 'expo.inOut' },
            )
            .from('[data-photo] img', { scale: 1.3, duration: 1.8, ease: 'expo.out' }, 0.2);

          // Formations : chaque carte se dévoile de bas en haut, l'une après l'autre
          gsap.fromTo(
            '[data-education]',
            { clipPath: 'inset(100% 0% 0% 0% round 1rem)', y: 30 },
            {
              clipPath: 'inset(0% 0% 0% 0% round 1rem)',
              y: 0,
              duration: 1.1,
              stagger: 0.15,
              ease: 'expo.out',
              scrollTrigger: { trigger: '[data-education-list]', start: 'top 85%', once: true },
            },
          );

          gsap.from('[data-statement-accent]', {
            backgroundSize: '0% 2px',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: '[data-statement-accent]', start: 'top 80%', once: true },
          });
        },
        section,
      );

      // Desktop : la photo glisse légèrement dans son cadre pendant le défilement (profondeur)
      mm.add(
        both(MQ.motion, MQ.desktop),
        () => {
          gsap.fromTo(
            '[data-photo-inner]',
            { yPercent: 3 },
            {
              yPercent: -3,
              ease: 'none',
              scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        },
        section,
      );
    },
    { scope: root },
  );

  return (
    <section id="a-propos" ref={root} className="section relative bg-surface" aria-labelledby="titre-a-propos">
      <div className="page">
        <SectionHeader id="titre-a-propos" title="À propos" />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <figure
                data-photo
                className="relative mx-auto aspect-[4/5] w-full max-w-[19rem] overflow-hidden rounded-[2rem] border border-line bg-raised shadow-lift sm:max-w-sm lg:max-w-none"
              >
                <div data-photo-inner className="absolute -inset-y-[4%] inset-x-0">
                  <img
                    className="h-full w-full object-cover object-[50%_18%]"
                    src="/images/aliou-800.webp"
                    srcSet="/images/aliou-480.webp 480w, /images/aliou-800.webp 800w"
                    sizes="(min-width: 1024px) 34vw, (min-width: 640px) 384px, 90vw"
                    width={800}
                    height={1000}
                    alt="Portrait d'Aliou DIALLO, bras croisés, en chemise bleue."
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-4">
            <p className="font-display text-[clamp(1.875rem,1.4rem+2vw,3rem)] leading-[1.12]" data-reveal>
              {aboutStatement.text}{' '}
              <span
                data-statement-accent
                className="bg-gradient-to-r from-accent to-accent bg-[length:100%_2px] bg-bottom-left bg-no-repeat text-accent"
              >
                {aboutStatement.accent}
              </span>
            </p>

            <h3 className="mt-12 text-h3" data-reveal>
              Qui suis-je
            </h3>
            <div className="mt-5 space-y-5 text-[1.0625rem] leading-relaxed text-muted">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph.text.slice(0, 24)} data-reveal>
                  {paragraph.lead && <strong className="font-medium text-ink">{paragraph.lead}</strong>}
                  {paragraph.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <h3 className="text-h3" data-reveal>
            Formations
          </h3>
          <ol data-education-list className="mt-6 grid gap-4 md:grid-cols-3 md:gap-6">
            {education.map((item) => (
              <li
                key={item.id}
                data-education
                className="flex flex-col rounded-2xl border border-line border-l-2 border-l-accent bg-canvas/60 p-6 sm:p-7"
              >
                <p className="text-sm text-muted">
                  <time dateTime={item.period.datetime[0]}>{item.period.label.split(' – ')[0]}</time>
                  {' – '}
                  <time dateTime={item.period.datetime[1]}>{item.period.label.split(' – ')[1]}</time>
                </p>
                <p className="mt-2 font-display text-[1.375rem] leading-snug text-ink">{item.title}</p>
                <p className="mt-auto pt-4 text-muted">{item.school}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
