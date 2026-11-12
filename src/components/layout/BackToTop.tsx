import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/** Bouton flottant de retour en haut, affiché après un écran de défilement. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 0.8);
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

  return (
    <a
      className="to-top"
      href="#accueil"
      data-visible={visible}
      aria-label="Retour en haut de page"
      tabIndex={visible ? undefined : -1}
    >
      <ArrowUp size={20} strokeWidth={1.75} aria-hidden="true" />
    </a>
  );
}
