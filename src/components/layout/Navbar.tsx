import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Download, Moon, Sun } from 'lucide-react';
import { navItems, site, type SectionId } from '../../data/site';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useTheme } from '../../hooks/useTheme';
import { MQ } from '../../lib/gsap';
import { MobileMenu } from './MobileMenu';

const SECTION_IDS = navItems.map((item) => item.id);

/**
 * En-tête fixe, toujours visible : transparent en haut de page, pilule de verre compacte dès que la page défile.
 */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return scrolled;
}

/** Liens desktop, avec une pastille qui glisse sous la section active. */
function DesktopLinks({ active }: { active: SectionId }) {
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const place = () => {
      const link = list.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
      if (!link) return;
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translate(${link.offsetLeft}px, -50%)`;
      indicator.style.opacity = '1';
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active]);

  return (
    <ul ref={listRef} className="relative flex items-center">
      <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
      {navItems.map((item) => (
        <li key={item.id}>
          <a className="nav-link" href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Navbar() {
  const active = useScrollSpy(SECTION_IDS);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();
  const isDesktop = useMediaQuery(MQ.desktop);
  const cvRef = useMagnetic<HTMLAnchorElement>(0.25);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Passage en affichage large (rotation, redimensionnement) : le menu desktop prend le relais
  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setMenuOpen(false);
    if (restoreFocus) burgerRef.current?.focus();
  }, []);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled} data-menu-open={menuOpen}>
        <div className="page">
          <div className="header-bar">
            <a href="#accueil" className="logo">
              {site.shortName}
            </a>

            <nav aria-label="Navigation principale" className="hidden lg:block">
              <DesktopLinks active={active} />
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                className="btn-icon"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
              >
                {theme === 'dark' ? (
                  <Sun size={20} strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <Moon size={20} strokeWidth={1.75} aria-hidden="true" />
                )}
              </button>
              <a
                ref={cvRef}
                className="btn btn-primary hidden px-4 sm:inline-flex"
                href={site.cv.href}
                download={site.cv.fileName}
              >
                <Download size={16} strokeWidth={1.75} aria-hidden="true" />
                {site.cv.label}
              </a>
              <button
                ref={burgerRef}
                type="button"
                className="burger lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="menu-mobile"
                aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} active={active} onClose={closeMenu} toggleRef={burgerRef} />
    </>
  );
}
