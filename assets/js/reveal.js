// Apparition au scroll : légère translation + opacité, une seule fois par élément.
// Le CSS ne masque les éléments [data-reveal] que sous .reveal-ready : sans JS, ou si le mouvement
// est réduit, tout reste visible.
(function () {
  var items = document.querySelectorAll('[data-reveal]');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!items.length || reducedMotion || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  // Les éléments déjà visibles au chargement (rechargement en milieu de page) ne sont pas animés
  var viewportBottom = window.innerHeight;
  Array.prototype.forEach.call(items, function (item) {
    if (item.getBoundingClientRect().top < viewportBottom) item.classList.add('is-visible');
    else observer.observe(item);
  });
  document.documentElement.classList.add('reveal-ready');
})();
