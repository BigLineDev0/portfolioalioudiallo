// Point d'entrée unique de GSAP : les plugins sont enregistrés une seule fois, et tous les composants
// importent GSAP depuis ce fichier.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Requêtes média partagées par gsap.matchMedia() et les hooks. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  /** Souris ou pavé tactile : effets de curseur réservés à ces appareils */
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;

/** Combine plusieurs requêtes média (« et » logique). */
export const both = (...queries: string[]) => queries.join(' and ');

/** Attend les polices (pour que SplitText mesure le bon texte), sans bloquer plus de 1,5 s. */
export const fontsReady = (): Promise<unknown> =>
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((resolve) => setTimeout(resolve, 1500))]);

export { gsap, ScrollTrigger, SplitText, useGSAP };
