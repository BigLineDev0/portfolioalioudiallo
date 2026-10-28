// Petits comportements de page : année du pied de page, rôle tapé dans l'accueil, bouton de retour en haut.
// Les autres comportements sont dans leurs propres scripts (theme, nav, reveal, projects, contact).
(function () {
  // Année du pied de page
  var year = String(new Date().getFullYear());
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (element) {
    element.textContent = year;
  });

  // Accueil : les rôles listés dans data-roles s'écrivent puis s'effacent tour à tour.
  // Le texte complet reste lisible par les lecteurs d'écran (voir index.html) ; sans animation, le premier rôle reste affiché.
  var typed = document.querySelector('[data-roles]');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typed && !reducedMotion) {
    var roles = typed.getAttribute('data-roles').split('|');
    var roleIndex = 0;
    var length = roles[0].length;
    var deleting = true;
    typed.classList.add('typed');

    var step = function () {
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
      typed.textContent = roles[roleIndex].slice(0, length);
      // Pause en fin de mot, effacement plus rapide que l'écriture
      var delay = deleting ? (length === roles[roleIndex].length ? 2200 : 35) : 75;
      if (!deleting && length === 0) delay = 300;
      window.setTimeout(step, delay);
    };
    window.setTimeout(step, 2500);
  }

  // Bouton de retour en haut : visible après un écran de défilement
  var toTop = document.getElementById('to-top');
  if (toTop) {
    var update = function () {
      toTop.setAttribute('data-visible', String(window.scrollY > window.innerHeight * 0.8));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }
})();
