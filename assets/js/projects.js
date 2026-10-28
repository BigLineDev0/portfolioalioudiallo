// Section Projets : photos manquantes, filtres par catégorie et liste repliée sur les premiers projets.
(function () {
  // Nombre de projets visibles tant que la liste n'est pas dépliée (filtre « Tous » uniquement)
  var COLLAPSED_COUNT = 6;

  // Photo absente ou introuvable : on retire l'image, l'icône de remplacement reste visible
  Array.prototype.forEach.call(document.querySelectorAll('.media img'), function (img) {
    var hide = function () {
      img.hidden = true;
    };
    if (img.complete && img.naturalWidth === 0) hide();
    else img.addEventListener('error', hide);
  });

  var bar = document.getElementById('filtres');
  var status = document.getElementById('projets-statut');
  var more = document.getElementById('projets-plus');
  if (!bar || !status || !more) return;

  var buttons = Array.prototype.slice.call(bar.querySelectorAll('[data-filter]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-project]'));
  var currentFilter = 'tous';
  var expanded = false;

  function render() {
    var matching = cards.filter(function (card) {
      return currentFilter === 'tous' || card.getAttribute('data-categories').split(' ').indexOf(currentFilter) !== -1;
    });
    var collapsible = currentFilter === 'tous' && matching.length > COLLAPSED_COUNT;

    cards.forEach(function (card) {
      var position = matching.indexOf(card);
      var visible = position !== -1 && (expanded || !collapsible || position < COLLAPSED_COUNT);
      card.hidden = !visible;
      if (visible) card.classList.add('is-visible'); // évite qu'une carte révélée ici reste transparente
    });

    more.hidden = !collapsible;
    more.setAttribute('aria-expanded', String(expanded));
    more.textContent = expanded ? 'Réduire la liste' : 'Voir tous les projets (' + matching.length + ')';
    return matching.length;
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      currentFilter = button.getAttribute('data-filter');
      buttons.forEach(function (other) {
        other.setAttribute('aria-pressed', String(other === button));
      });
      var count = render();
      var plural = count > 1 ? 's' : '';
      status.textContent = count + ' projet' + plural + ' trouvé' + plural + ', catégorie ' + button.textContent.trim() + '.';
    });
  });

  more.addEventListener('click', function () {
    expanded = !expanded;
    render();
    // En repliant, on revient au début de la liste pour ne pas laisser le lecteur dans le vide
    if (!expanded) document.getElementById('projets').scrollIntoView();
  });

  render();
  // Les filtres ne servent à rien sans JavaScript : ils ne s'affichent qu'ici
  bar.hidden = false;
})();
