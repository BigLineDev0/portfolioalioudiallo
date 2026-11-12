import { useCallback, useEffect, useState, type RefObject } from 'react';
import { MQ } from '../lib/gsap';

interface Metrics {
  step: number;
  perView: number;
  count: number;
  pages: number;
  maxScroll: number;
}

/** Mesure le carrousel : largeur d'un pas (carte + espacement), cartes par vue, nombre de pages. */
function measure(track: HTMLElement): Metrics | null {
  const slots = track.querySelectorAll<HTMLElement>('[data-slot]');
  if (!slots.length) return null;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.columnGap) || 0;
  const content = track.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const step = slots[0].offsetWidth + gap;
  const perView = Math.max(1, Math.floor((content + gap + 1) / step));
  return {
    step,
    perView,
    count: slots.length,
    pages: Math.max(1, Math.ceil(slots.length / perView)),
    maxScroll: track.scrollWidth - track.clientWidth,
  };
}

const behavior = (): ScrollBehavior => (window.matchMedia(MQ.reduce).matches ? 'auto' : 'smooth');

/**
 * Carrousel horizontal natif (scroll-snap) avec pagination : page courante, nombre de pages, navigation,
 * glisser à la souris et flèches du clavier. `resetKey` remet le carrousel au début (changement de filtre).
 */
export function useCarousel(trackRef: RefObject<HTMLElement | null>, resetKey: unknown) {
  const [state, setState] = useState({ page: 0, pages: 1, perView: 1, count: 0 });

  const update = useCallback(() => {
    const track = trackRef.current;
    const metrics = track && measure(track);
    if (!track || !metrics) return;
    const page =
      track.scrollLeft >= metrics.maxScroll - 4
        ? metrics.pages - 1
        : Math.round(track.scrollLeft / (metrics.step * metrics.perView));
    setState((current) =>
      current.page === page &&
      current.pages === metrics.pages &&
      current.perView === metrics.perView &&
      current.count === metrics.count
        ? current
        : { page, pages: metrics.pages, perView: metrics.perView, count: metrics.count },
    );
  }, [trackRef]);

  const goTo = useCallback(
    (page: number) => {
      const track = trackRef.current;
      const metrics = track && measure(track);
      if (!track || !metrics) return;
      const target = Math.max(0, Math.min(page, metrics.pages - 1));
      track.scrollTo({ left: Math.min(target * metrics.perView * metrics.step, metrics.maxScroll), behavior: behavior() });
    },
    [trackRef],
  );

  // Suivi du défilement et des changements de taille
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => ((frame = 0), update()));
    };
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [trackRef, update]);

  // Nouveau contenu (filtre) : retour au début
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: 0, behavior: 'auto' });
    update();
  }, [resetKey, trackRef, update]);

  // Souris : glisser pour faire défiler, puis accrochage sur la carte la plus proche
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let startX = 0;
    let startLeft = 0;
    let dragging = false;
    let releaseTimer = 0;

    const onMove = (event: PointerEvent) => {
      const dx = event.clientX - startX;
      if (!dragging && Math.abs(dx) > 6) {
        dragging = true;
        track.dataset.dragging = 'true';
      }
      if (dragging) track.scrollLeft = startLeft - dx;
    };

    const onUp = (event: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (!dragging) return;
      const metrics = measure(track);
      if (metrics) {
        const dx = event.clientX - startX;
        // Un geste court suffit à passer à la carte suivante ou précédente
        const raw = track.scrollLeft / metrics.step;
        const index = Math.abs(dx) > metrics.step * 0.15 ? (dx < 0 ? Math.ceil(raw) : Math.floor(raw)) : Math.round(raw);
        track.scrollTo({ left: Math.min(Math.max(0, index * metrics.step), metrics.maxScroll), behavior: behavior() });
      }
      // L'accrochage et les clics reviennent une fois l'animation terminée
      releaseTimer = window.setTimeout(() => delete track.dataset.dragging, 450);
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      window.clearTimeout(releaseTimer);
      startX = event.clientX;
      startLeft = track.scrollLeft;
      dragging = false;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const metrics = measure(track);
      if (!metrics) return;
      event.preventDefault();
      track.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * metrics.step, behavior: behavior() });
    };

    // Empêche le glisser-déposer natif des images et des liens pendant le geste
    const onDragStart = (event: DragEvent) => event.preventDefault();

    track.addEventListener('pointerdown', onDown);
    track.addEventListener('keydown', onKey);
    track.addEventListener('dragstart', onDragStart);
    return () => {
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('keydown', onKey);
      track.removeEventListener('dragstart', onDragStart);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.clearTimeout(releaseTimer);
    };
  }, [trackRef]);

  return {
    ...state,
    goTo,
    prev: () => goTo(state.page - 1),
    next: () => goTo(state.page + 1),
  };
}
