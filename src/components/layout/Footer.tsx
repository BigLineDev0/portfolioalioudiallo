import { useRef } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { site } from '../../data/site';
import { gsap, MQ, useGSAP } from '../../lib/gsap';
import { BrandIcon } from '../ui/BrandIcon';

const ICON = { size: 18, strokeWidth: 1.75, 'aria-hidden': true } as const;

const linkClass =
  'group inline-flex min-h-tap items-center gap-3 text-ink transition-colors hover:text-accent';

/** Flèche discrète qui apparaît au survol des liens externes */
const External = () => (
  <ArrowUpRight
    size={14}
    strokeWidth={1.75}
    className="-translate-x-1 text-accent opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
    aria-hidden="true"
  />
);

/**
 * Pied de page : les informations du site (identité, disponibilité, coordonnées, réseaux, localisation,
 * copyright), sans rubrique de navigation supplémentaire. Les colonnes apparaissent l'une après l'autre.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const footer = root.current;
      if (!footer) return;
      const mm = gsap.matchMedia();
      mm.add(
        MQ.motion,
        () => {
          gsap
            .timeline({ scrollTrigger: { trigger: footer, start: 'top 90%', once: true } })
            .from('[data-foot]', { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.08, ease: 'power3.out' })
            .from('[data-foot-rule]', { scaleX: 0, duration: 1.2, ease: 'expo.out' }, 0.2);
        },
        footer,
      );
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="border-t border-line">
      <div className="page pt-16 pb-8 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div data-foot className="md:col-span-2 lg:col-span-5 lg:pr-10">
            <a href="#accueil" className="font-display text-[1.75rem] leading-none">
              {site.name}
            </a>
            <p className="mt-3 text-muted">{site.roles[0]}</p>
            <div className="mt-8 max-w-sm border-l-2 border-accent pl-5">
              <p className="flex items-center gap-2.5 font-medium">
                <span className="status-dot" aria-hidden="true" />
                {site.availability}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{site.availabilityDetail}</p>
            </div>
          </div>

          <div data-foot className="lg:col-span-3">
            <p className="footer-label">Coordonnées</p>
            <ul className="mt-3">
              <li>
                <a className={linkClass} href={`mailto:${site.email}`}>
                  <Mail {...ICON} className="text-accent" />
                  <span className="break-all">{site.email}</span>
                </a>
              </li>
              <li>
                <a className={linkClass} href={site.phoneHref}>
                  <Phone {...ICON} className="text-accent" />
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>

          <div data-foot className="lg:col-span-2">
            <p className="footer-label">Réseaux</p>
            <ul className="mt-3">
              <li>
                <a className={linkClass} href={site.github} target="_blank" rel="noopener noreferrer">
                  <BrandIcon name="github" size={18} className="text-accent" />
                  GitHub<span className="sr-only"> (nouvel onglet)</span>
                  <External />
                </a>
              </li>
              <li>
                <a className={linkClass} href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  <BrandIcon name="linkedin" size={18} className="text-accent" />
                  LinkedIn<span className="sr-only"> (nouvel onglet)</span>
                  <External />
                </a>
              </li>
            </ul>
          </div>

          <div data-foot className="lg:col-span-2">
            <p className="footer-label">Localisation</p>
            <p className="mt-3 inline-flex min-h-tap items-center gap-3">
              <MapPin {...ICON} className="text-accent" />
              {site.location}
            </p>
          </div>
        </div>

        <span data-foot-rule className="mt-14 block h-px origin-left bg-line" aria-hidden="true" />
        <p data-foot className="pt-6 text-sm text-muted">
          © {new Date().getFullYear()} {site.name}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
