// Navigation : en-tête translucide au scroll, scrollspy et menu mobile accessible.
(function () {
  var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // En-tête : fond translucide dès que la page défile
  var header = document.getElementById('site-header');
  if (header) {
    var updateHeader = function () {
      header.setAttribute('data-scrolled', String(window.scrollY > 8));
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  // Scrollspy : met en évidence le lien de la section qui croise la ligne à ~40 % de l'écran
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  if (links.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      links.forEach(function (link) {
        if (link.hash === '#' + id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    links.forEach(function (link) {
      var section = document.querySelector(link.hash);
      if (section) spy.observe(section);
    });
  }

  // Menu mobile : panneau compact sous l'en-tête. Le bouton ouvre et ferme ; Échap ou un clic sur le voile ferment ;
  // le focus reste entre le bouton et les liens tant que le panneau est ouvert.
  var toggle = document.getElementById('menu-toggle');
  var panel = document.getElementById('menu-mobile');
  var overlay = document.getElementById('menu-voile');
  if (!toggle || !panel || !overlay) return;

  function isOpen() {
    return !panel.hidden;
  }

  function open() {
    panel.hidden = false;
    overlay.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fermer le menu');
    var firstLink = panel.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function close(restoreFocus) {
    if (!isOpen()) return;
    panel.hidden = true;
    overlay.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) close(true);
    else open();
  });
  overlay.addEventListener('click', function () {
    close(true);
  });

  // Un lien du menu ferme le panneau ; le navigateur gère ensuite le saut vers la section
  panel.addEventListener('click', function (event) {
    if (event.target.closest('a')) close(false);
  });

  document.addEventListener('keydown', function (event) {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      close(true);
      return;
    }
    if (event.key !== 'Tab') return;
    var focusable = [toggle].concat(Array.prototype.slice.call(panel.querySelectorAll(FOCUSABLE)));
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Passage en affichage large (rotation, redimensionnement) : le menu desktop prend le relais
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (event) {
    if (event.matches) close(false);
  });
})();
