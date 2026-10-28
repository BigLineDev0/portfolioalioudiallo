// Bascule clair / sombre. Le thème initial est posé par le script inline du <head> (pas de flash).
// Script classique (pas de module) : il fonctionne aussi quand index.html est ouvert directement.
(function () {
  var STORAGE_KEY = 'theme';
  // Couleur de la barre du navigateur mobile, alignée sur --c-canvas de chaque thème
  var BROWSER_COLORS = { dark: '#13110E', light: '#F6F2EB' };

  var root = document.documentElement;
  var button = document.getElementById('theme-toggle');
  var themeColor = document.querySelector('meta[name="theme-color"]');
  if (!button) return;

  function readSaved() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (themeColor) themeColor.setAttribute('content', BROWSER_COLORS[theme]);
    button.setAttribute('aria-label', theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
  }

  apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  button.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      // Stockage indisponible (navigation privée stricte) : le choix vaut pour la session en cours
    }
  });

  // Tant que l'utilisateur n'a rien choisi, on suit les changements du système
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (event) {
    if (!readSaved()) apply(event.matches ? 'light' : 'dark');
  });
})();
