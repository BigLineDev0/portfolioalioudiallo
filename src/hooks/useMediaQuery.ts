import { useCallback, useSyncExternalStore } from 'react';
import { MQ } from '../lib/gsap';

/** Suit une requête média et se met à jour quand elle change (rotation, réglage système...). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** true si la personne a demandé à réduire les animations. */
export const useReducedMotion = () => useMediaQuery(MQ.reduce);
