import { useRef } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { site } from '../../data/site';
import { useMagnetic } from '../../hooks/useMagnetic';
import { both, fontsReady, gsap, MQ, SplitText, useGSAP } from '../../lib/gsap';
import { SocialLinks } from '../ui/SocialLinks';
import { TypedRole } from './TypedRole';

/** Étiquettes flottantes autour du portrait : des compétences réelles, regroupées par domaine. */
const CHIPS = [
  { label: 'Python · Django', position: 'top-[8%] -left-[8%]' },
  { label: 'Angular · React', position: 'top-[34%] -right-[12%]' },
  { label: 'Flutter', position: 'bottom-[20%] -left-[4%]' },
  { label: 'IA · RAG', position: 'bottom-[4%] right-[2%]' },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const projectsButton = useMagnetic<HTMLAnchorElement>();
  const cvButton = useMagnetic<HTMLAnchorElement>();

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const mm = gsap.matchMedia();

      // 1. Entrée : titre révélé mot par mot, portrait qui s'ouvre, textes qui montent, éléments qui flottent
      mm.add(MQ.motion, (context) => {
        const title = section.querySelector<HTMLElement>('[data-hero-title]');
        gsap.set(title, { autoAlpha: 0 });
        gsap.set('[data-hero-fade]', { autoAlpha: 0, y: 24 });
        gsap.set('[data-portrait]', { clipPath: 'circle(0% at 50% 50%)' });
        gsap.set('[data-portrait] img', { scale: 1.25 });
        gsap.set('[data-rings]', { autoAlpha: 0, scale: 0.85 });
        gsap.set('[data-float]', { autoAlpha: 0, scale: 0.8 });

        const intro = context.add('intro', () => {
          const split = SplitText.create(title, { type: 'words', mask: 'words' });
          gsap
            .timeline({ defaults: { ease: 'power3.out' } })
            .set(title, { autoAlpha: 1 })
            .from(split.words, { yPercent: 110, duration: 1.1, stagger: 0.1, ease: 'expo.out' }, 0.1)
            .to('[data-portrait]', { clipPath: 'circle(50% at 50% 50%)', duration: 1.4, ease: 'expo.inOut' }, 0)
            .to('[data-portrait] img', { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.3)
            .to('[data-rings]', { autoAlpha: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 0.5)
            .to('[data-hero-fade]', { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.4)
            .to('[data-float]', { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.6)' }, 1)
            .add(() => {
              gsap.utils.toArray<HTMLElement>('[data-float]', section).forEach((element, index) => {
                gsap.to(element, {
                  y: index % 2 ? 8 : -8,
                  duration: 3.2 + index * 0.7,
                  ease: 'sine.inOut',
                  repeat: -1,
                  yoyo: true,
                });
              });
            });
        }, section);
        fontsReady().then(() => intro());
      }, section);

      // 2. Souris : halo qui suit le curseur, anneaux qui se décalent légèrement
      mm.add(both(MQ.motion, MQ.finePointer), () => {
        const halo = section.querySelector<HTMLElement>('[data-halo]');
        const rings = section.querySelector<HTMLElement>('[data-rings]');
        const portrait = section.querySelector<HTMLElement>('[data-portrait-stage]');
        if (!halo || !rings || !portrait) return;

        // Le halo part du centre du portrait et y revient quand le curseur quitte l'accueil
        const home = () => {
          const box = portrait.getBoundingClientRect();
          const area = section.getBoundingClientRect();
          return { x: box.left + box.width / 2 - area.left, y: box.top + box.height / 2 - area.top };
        };
        const start = home();
        gsap.set(halo, { left: 0, top: 0, xPercent: -50, yPercent: -50, x: start.x, y: start.y });

        const haloX = gsap.quickTo(halo, 'x', { duration: 1.2, ease: 'power3.out' });
        const haloY = gsap.quickTo(halo, 'y', { duration: 1.2, ease: 'power3.out' });
        const ringsX = gsap.quickTo(rings, 'x', { duration: 1, ease: 'power3.out' });
        const ringsY = gsap.quickTo(rings, 'y', { duration: 1, ease: 'power3.out' });

        const onMove = (event: PointerEvent) => {
          const area = section.getBoundingClientRect();
          haloX(event.clientX - area.left);
          haloY(event.clientY - area.top);
          ringsX((event.clientX / window.innerWidth - 0.5) * 24);
          ringsY((event.clientY / window.innerHeight - 0.5) * 24);
        };
        const onLeave = () => {
          const position = home();
          haloX(position.x);
          haloY(position.y);
          ringsX(0);
          ringsY(0);
        };

        section.addEventListener('pointermove', onMove);
        section.addEventListener('pointerleave', onLeave);
        return () => {
          section.removeEventListener('pointermove', onMove);
          section.removeEventListener('pointerleave', onLeave);
        };
      }, section);

      // 3. Sortie (desktop) : le contenu s'estompe et le portrait remonte doucement pendant le défilement
      mm.add(both(MQ.motion, MQ.desktop), () => {
        const scrollTrigger = { trigger: section, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-content]', { y: -90, opacity: 0.15, ease: 'none', scrollTrigger });
        gsap.to('[data-portrait-stage]', { y: -50, ease: 'none', scrollTrigger });
      }, section);
    },
    { scope: root },
  );

  return (
    <section
      id="accueil"
      ref={root}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-[calc(var(--spacing-header)+2rem)] pb-20 lg:pb-24"
      aria-labelledby="titre-accueil"
    >
      <div data-halo className="hero-halo" aria-hidden="true" />

      <div className="page grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
        <div data-hero-content className="order-2 text-center lg:order-1 lg:col-span-7 lg:text-left">
          <h1 id="titre-accueil" data-hero-title className="text-hero">
            <span className="block">Aliou</span>
            <span className="block">DIALLO</span>
          </h1>

          <p data-hero-fade className="mt-6 min-h-[2.5em] font-display text-h3 sm:min-h-[1.25em]">
            <span className="sr-only">{site.roles.join(', ')}</span>
            <span aria-hidden="true">
              Je suis <TypedRole roles={site.roles} />
            </span>
          </p>

          <p data-hero-fade className="mx-auto mt-5 max-w-xl text-lead text-muted lg:mx-0">
            {site.heroIntro}
          </p>

          <div
            data-hero-fade
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a ref={projectsButton} className="btn btn-primary px-6" href="#projets">
              Voir mes projets
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </a>
            <a ref={cvButton} className="btn btn-secondary px-6" href={site.cv.href} download={site.cv.fileName}>
              <Download size={16} strokeWidth={1.75} aria-hidden="true" />
              {site.cv.label}
            </a>
          </div>

          <div data-hero-fade className="mt-8">
            <SocialLinks className="justify-center lg:justify-start" />
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end">
          <div data-portrait-stage className="portrait-stage">
            <div data-rings className="absolute inset-0" aria-hidden="true">
              <span className="ring ring-outer" />
              <span className="ring ring-line" />
              <span className="ring ring-arc" />
            </div>
            <div data-portrait className="portrait-frame">
              <img
                className="h-full w-full object-cover object-[50%_18%]"
                src="/images/aliou-800.webp"
                srcSet="/images/aliou-480.webp 480w, /images/aliou-800.webp 800w"
                sizes="(min-width: 1024px) 400px, 70vw"
                width={800}
                height={1000}
                alt="Portrait d'Aliou DIALLO, bras croisés, en chemise bleue."
                fetchPriority="high"
                decoding="async"
              />
            </div>
            {CHIPS.map((chip) => (
              <span key={chip.label} data-float className={`hero-chip hidden sm:inline-flex ${chip.position}`} aria-hidden="true">
                <span className="size-1.5 rounded-full bg-accent" />
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
