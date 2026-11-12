import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useMediaQuery';

/**
 * Rôles écrits puis effacés tour à tour (repris du site précédent). Le texte est mis à jour directement
 * dans le DOM pour ne pas re-rendre l'accueil à chaque lettre. En mouvement réduit, le premier rôle reste affiché.
 * Le texte complet est lu par les lecteurs d'écran ailleurs : ce composant est masqué aux technologies d'assistance.
 */
export function TypedRole({ roles }: { roles: readonly string[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.textContent = roles[0];
    if (reduced) return;

    let roleIndex = 0;
    let length = roles[0].length;
    let deleting = true;
    let timer = 0;

    const step = () => {
      if (deleting) {
        length -= 1;
        if (length === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      } else {
        length += 1;
        if (length === roles[roleIndex].length) deleting = true;
      }
      element.textContent = roles[roleIndex].slice(0, length);
      // Pause en fin de mot, effacement plus rapide que l'écriture
      let delay = deleting ? (length === roles[roleIndex].length ? 2200 : 35) : 75;
      if (!deleting && length === 0) delay = 300;
      timer = window.setTimeout(step, delay);
    };

    timer = window.setTimeout(step, 4500);
    return () => window.clearTimeout(timer);
  }, [roles, reduced]);

  return (
    <span className="typed text-accent" ref={ref}>
      {roles[0]}
    </span>
  );
}
