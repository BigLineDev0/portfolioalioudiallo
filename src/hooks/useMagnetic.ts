import { useRef } from 'react';
import { both, gsap, MQ, useGSAP } from '../lib/gsap';

/**
 * Effet « bouton magnétique » : l'élément se décale légèrement vers le curseur puis revient en place.
 * Actif uniquement avec une souris et sans demande de mouvement réduit.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;
      const mm = gsap.matchMedia();
      mm.add(both(MQ.motion, MQ.finePointer), () => {
        const xTo = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' });

        const onMove = (event: PointerEvent) => {
          const box = element.getBoundingClientRect();
          xTo((event.clientX - (box.left + box.width / 2)) * strength);
          yTo((event.clientY - (box.top + box.height / 2)) * strength);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        element.addEventListener('pointermove', onMove);
        element.addEventListener('pointerleave', onLeave);
        return () => {
          element.removeEventListener('pointermove', onMove);
          element.removeEventListener('pointerleave', onLeave);
        };
      });
    },
    { scope: ref },
  );

  return ref;
}
