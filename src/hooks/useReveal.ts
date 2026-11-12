import type { RefObject } from 'react';
import { gsap, MQ, ScrollTrigger, useGSAP } from '../lib/gsap';

/**
 * Révélation au défilement, sur le modèle de la documentation : les éléments [data-reveal] d'une section
 * montent en fondu, l'un après l'autre, quand ils arrivent à l'écran, une seule fois.
 * En mouvement réduit, rien n'est masqué.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(
        MQ.motion,
        () => {
          const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
          if (!items.length) return;
          gsap.set(items, { autoAlpha: 0, y: 40 });
          ScrollTrigger.batch(items, {
            start: 'top 88%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', overwrite: true }),
          });
        },
        root,
      );
    },
    { scope },
  );
}
