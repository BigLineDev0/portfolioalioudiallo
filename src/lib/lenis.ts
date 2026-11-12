// Défilement fluide : une seule instance Lenis, avancée par gsap.ticker (une seule boucle d'animation)
// et synchronisée avec ScrollTrigger. Jamais créée quand le mouvement réduit est demandé.
import Lenis from 'lenis';
import { gsap, MQ, ScrollTrigger } from './gsap';

/** Hauteur réservée à l'en-tête flottant lors d'un saut vers une ancre (en px). */
export const ANCHOR_OFFSET = 88;

let lenis: Lenis | null = null;
let lockCount = 0;

const tick = (time: number) => lenis?.raf(time * 1000);

export function startLenis(): Lenis | null {
  if (lenis) return lenis;
  if (window.matchMedia(MQ.reduce).matches) return null;

  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  if (lockCount > 0) lenis.stop();
  return lenis;
}

export function stopLenis(): void {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  gsap.ticker.lagSmoothing(500, 33);
  lenis.destroy();
  lenis = null;
}

export const getLenis = () => lenis;

/** Suspend le défilement (menu mobile, modale). Les appels s'empilent : autant de unlock que de lock. */
export function lockScroll(): void {
  lockCount += 1;
  document.documentElement.classList.add('scroll-locked');
  lenis?.stop();
}

export function unlockScroll(): void {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  document.documentElement.classList.remove('scroll-locked');
  lenis?.start();
}

/** Fait défiler jusqu'à un élément, en laissant la place de l'en-tête. */
export function scrollToElement(target: HTMLElement): void {
  if (lenis) {
    // Lenis applique déjà le scroll-padding-top de <html> (5,5 rem) : aucun décalage à ajouter
    lenis.scrollTo(target, { duration: 1.2 });
    return;
  }
  const offset = target.id === 'accueil' ? 0 : -ANCHOR_OFFSET;
  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  const reduce = window.matchMedia(MQ.reduce).matches;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
}

/**
 * Suit un lien d'ancre (« #projets ») : défilement, mise à jour de l'URL, puis focus sur la cible,
 * comme le ferait un saut d'ancre natif. Renvoie false si la cible n'existe pas.
 */
export function navigateTo(hash: string): boolean {
  const target = document.getElementById(decodeURIComponent(hash.replace(/^#/, '')));
  if (!target) return false;
  scrollToElement(target);
  history.replaceState(null, '', `#${target.id}`);
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  return true;
}
