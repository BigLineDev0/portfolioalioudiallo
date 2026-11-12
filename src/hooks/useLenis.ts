import { useEffect } from 'react';
import { getLenis, navigateTo, startLenis, stopLenis } from '../lib/lenis';
import { useReducedMotion } from './useMediaQuery';

/**
 * Démarre Lenis après le premier affichage et l'arrête si le mouvement réduit est activé en cours de visite.
 * Intercepte aussi les liens d'ancre (#section) pour qu'ils passent par Lenis et laissent la place de l'en-tête.
 */
export function useLenis(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    startLenis();
    return stopLenis;
  }, [reduced]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = (event.target as Element | null)?.closest('a[href^="#"]')?.getAttribute('href');
      // Sans Lenis (mouvement réduit), le navigateur gère le saut nativement
      if (!hash || hash === '#' || !getLenis()) return;
      if (navigateTo(hash)) event.preventDefault();
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
