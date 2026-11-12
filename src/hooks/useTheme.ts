import { useCallback, useEffect, useState } from 'react';
import { MQ } from '../lib/gsap';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';
/** Couleur de la barre du navigateur mobile, alignée sur --canvas de chaque thème */
const BROWSER_COLORS: Record<Theme, string> = { dark: '#13110E', light: '#F6F2EB' };

function readSaved(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
}

/**
 * Bascule clair / sombre. Le thème initial est posé par le script du <head> (aucun flash) ;
 * tant que rien n'est choisi, le thème suit le réglage du système.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BROWSER_COLORS[theme]);
  }, [theme]);

  useEffect(() => {
    const list = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event: MediaQueryListEvent) => {
      if (!readSaved()) setTheme(event.matches ? 'light' : 'dark');
    };
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    if (window.matchMedia(MQ.motion).matches) {
      root.classList.add('theme-transition');
      window.setTimeout(() => root.classList.remove('theme-transition'), 400);
    }
    setTheme((current) => {
      const next: Theme = current === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Stockage indisponible (navigation privée stricte) : le choix vaut pour la session en cours
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
