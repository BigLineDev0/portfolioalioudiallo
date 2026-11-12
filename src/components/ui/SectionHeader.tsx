import type { ReactNode } from 'react';

interface SectionHeaderProps {
  id: string;
  title: string;
  children?: ReactNode;
  className?: string;
}

/** Titre de section aligné à gauche, avec le trait d'accent du site, et description facultative. */
export function SectionHeader({ id, title, children, className = 'mb-12 md:mb-16' }: SectionHeaderProps) {
  return (
    <header className={className}>
      <h2 id={id} className="section-title" data-reveal>
        {title}
      </h2>
      {children && (
        <p className="section-desc" data-reveal>
          {children}
        </p>
      )}
    </header>
  );
}
