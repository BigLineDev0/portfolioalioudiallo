import { Mail, Phone } from 'lucide-react';
import { site } from '../../data/site';
import { BrandIcon } from './BrandIcon';

const ICON = { size: 20, strokeWidth: 1.75, 'aria-hidden': true } as const;

/** GitHub, LinkedIn, email et téléphone en pastilles rondes (accueil). */
export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex gap-3 ${className}`} aria-label="Réseaux et contact">
      <li>
        <a className="social" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (nouvel onglet)">
          <BrandIcon name="github" />
        </a>
      </li>
      <li>
        <a
          className="social"
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn (nouvel onglet)"
        >
          <BrandIcon name="linkedin" />
        </a>
      </li>
      <li>
        <a className="social" href={`mailto:${site.email}`} aria-label={`Email : ${site.email}`}>
          <Mail {...ICON} />
        </a>
      </li>
      <li>
        <a className="social" href={site.phoneHref} aria-label={`Téléphone : ${site.phone}`}>
          <Phone {...ICON} />
        </a>
      </li>
    </ul>
  );
}
