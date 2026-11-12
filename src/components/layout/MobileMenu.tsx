import { useEffect, useRef, type RefObject } from 'react';
import { Download } from 'lucide-react';
import { navItems, site, type SectionId } from '../../data/site';
import { gsap, MQ, useGSAP } from '../../lib/gsap';
import { lockScroll, navigateTo, unlockScroll } from '../../lib/lenis';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface MobileMenuProps {
  open: boolean;
  active: SectionId;
  onClose: (restoreFocus: boolean) => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
}

/**
 * Menu mobile plein écran. GSAP déroule le panneau puis fait monter les liens l'un après l'autre ;
 * la fermeture rejoue l'animation à l'envers. Défilement suspendu, focus piégé, Échap pour fermer.
 */
export function MobileMenu({ open, active, onClose, toggleRef }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: MQ.motion, reduce: MQ.reduce }, (context) => {
        const { motion } = context.conditions as { motion: boolean };
        const tl = gsap.timeline({ paused: true });
        if (motion) {
          tl.fromTo(
            panel,
            { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' },
            { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.inOut' },
          ).from(
            '[data-menu-item]',
            { yPercent: 110, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
            '-=0.25',
          );
        } else {
          tl.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 });
        }
        timeline.current = tl;
        if (openRef.current) tl.progress(1);
        return () => {
          timeline.current = null;
        };
      }, panel);
    },
    { scope: panelRef },
  );

  // Ouverture / fermeture : animation, suspension du défilement, focus sur le premier lien
  useEffect(() => {
    if (!open) return;
    lockScroll();
    timeline.current?.timeScale(1).play();
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    }, 80);
    return () => {
      window.clearTimeout(focusTimer);
      unlockScroll();
      timeline.current?.timeScale(1.6).reverse();
    };
  }, [open]);

  // Clavier : Échap ferme, Tab reste entre le bouton du menu et les liens du panneau
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(true);
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current || !toggleRef.current) return;
      const focusable = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, toggleRef]);

  return (
    <div id="menu-mobile" ref={panelRef} className="mobile-menu lg:hidden" data-lenis-prevent>
      <nav
        aria-label="Navigation mobile"
        className="page flex min-h-full flex-col pt-[calc(var(--spacing-header)+2rem)] pb-10"
        onClick={(event) => {
          const link = (event.target as Element).closest('a');
          if (!link) return;
          onClose(false);
          // Lien de section : le défilement part une fois le panneau fermé et le défilement rétabli
          const hash = link.getAttribute('href');
          if (hash?.startsWith('#')) {
            event.preventDefault();
            window.setTimeout(() => navigateTo(hash), 0);
          }
        }}
      >
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="overflow-hidden">
              <a
                data-menu-item
                className="menu-link"
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto overflow-hidden pt-10">
          <a data-menu-item className="btn btn-primary w-full" href={site.cv.href} download={site.cv.fileName}>
            <Download size={16} strokeWidth={1.75} aria-hidden="true" />
            {site.cv.label}
          </a>
        </div>
      </nav>
    </div>
  );
}
