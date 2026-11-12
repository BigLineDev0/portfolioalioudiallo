import { useRef, type ReactNode } from 'react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { site } from '../../data/site';
import { useReveal } from '../../hooks/useReveal';
import { ContactForm } from '../contact/ContactForm';
import { BrandIcon } from '../ui/BrandIcon';
import { SectionHeader } from '../ui/SectionHeader';

interface ContactCardProps {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  external?: boolean;
}

function ContactCard({ href, icon, label, value, external = false }: ContactCardProps) {
  return (
    <a
      data-reveal
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-canvas/50 p-4 transition-[border-color,background-color] hover:border-accent/50 hover:bg-canvas sm:p-5"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className="shrink-0 text-accent">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium">
          {label}
          {external && <span className="sr-only"> (nouvel onglet)</span>}
        </span>
        <span className="block text-sm break-all text-muted">{value}</span>
      </span>
      <ArrowUpRight
        size={18}
        strokeWidth={1.75}
        className="shrink-0 text-muted transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
        aria-hidden="true"
      />
    </a>
  );
}

const ICON = { size: 20, strokeWidth: 1.75, 'aria-hidden': true } as const;

export function Contact() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="contact" ref={root} className="section relative bg-surface" aria-labelledby="titre-contact">
      <div className="page">
        <SectionHeader id="titre-contact" title="Contactez-moi">
          Un projet, une mission ou un poste à pourvoir&nbsp;? Écrivez-moi, je vous réponds par email.
        </SectionHeader>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="grid content-start gap-3 lg:col-span-5">
            <h3 className="mb-2 text-h3" data-reveal>
              Restons en contact
            </h3>
            <ContactCard href={`mailto:${site.email}`} icon={<Mail {...ICON} />} label="Email" value={site.email} />
            <ContactCard href={site.phoneHref} icon={<Phone {...ICON} />} label="Téléphone" value={site.phone} />
            <ContactCard
              href={site.github}
              icon={<BrandIcon name="github" />}
              label="GitHub"
              value={site.githubLabel}
              external
            />
            <ContactCard
              href={site.linkedin}
              icon={<BrandIcon name="linkedin" />}
              label="LinkedIn"
              value={site.name}
              external
            />

            <div data-reveal className="mt-4 border-l-2 border-accent py-1 pl-5">
              <p className="flex items-center gap-2.5 font-medium">
                <span className="status-dot" aria-hidden="true" />
                {site.availability}
              </p>
              <p className="mt-2 text-sm text-muted">{site.availabilityDetail}</p>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <MapPin size={16} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
                Basé à {site.location}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7" data-reveal>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
