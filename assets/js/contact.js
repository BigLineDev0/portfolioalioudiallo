// Formulaire de contact envoyé via Formspree (aucun backend à maintenir, offre gratuite suffisante pour un portfolio).
// Mise en service : créer un formulaire sur https://formspree.io, puis coller son identifiant ci-dessous
// (la partie après /f/ dans l'URL fournie, par exemple « xyzabcde »). Cet identifiant est public par nature.
// Script classique (pas de module) : tout est encapsulé pour ne rien exposer en global.
(function () {
  const FORMSPREE_ID = '[À COMPLÉTER]';
  const CONTACT_EMAIL = 'alioudiallo.py@gmail.com';

  const isConfigured = /^[a-z0-9]+$/i.test(FORMSPREE_ID);
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Règles de validation : chaque fonction renvoie un message d'erreur, ou une chaîne vide si le champ est valide
  const RULES = {
    nom: (field) => (field.value.trim().length >= 2 ? '' : 'Indiquez votre nom (2 caractères minimum).'),
    email: (field) =>
      EMAIL_PATTERN.test(field.value.trim()) ? '' : 'Indiquez une adresse email valide, par exemple nom@domaine.com.',
    sujet: (field) => (field.value.trim().length >= 3 ? '' : 'Indiquez le sujet de votre message.'),
    message: (field) =>
      field.value.trim().length >= 20 ? '' : 'Votre message doit contenir au moins 20 caractères.',
    consentement: (field) => (field.checked ? '' : 'Cochez cette case pour que je puisse vous répondre.'),
  };

  const form = document.getElementById('contact-form');
  if (form) {
    const statusBox = document.getElementById('contact-status');
    const submit = document.getElementById('contact-submit');
    const honeypot = form.elements.namedItem('_gotcha');
    const fields = Object.keys(RULES).map((name) => form.elements.namedItem(name));
    let submittedOnce = false;

    const showFieldError = (field, message) => {
      const error = document.getElementById(`${field.id}-erreur`);
      field.setAttribute('aria-invalid', String(Boolean(message)));
      error.textContent = message;
      error.hidden = !message;
    };

    const validate = (field) => {
      const message = RULES[field.name](field);
      showFieldError(field, message);
      return !message;
    };

    const buildMailto = () => {
      const subject = form.elements.namedItem('sujet').value.trim() || 'Contact depuis le portfolio';
      const body = `${form.elements.namedItem('message').value.trim()}\n\n${form.elements.namedItem('nom').value.trim()}`;
      return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    // Message d'état (annoncé par la région aria-live), avec un lien email de secours si besoin
    const setStatus = (type, text, withMailto = false) => {
      statusBox.replaceChildren();
      statusBox.className = `text-sm ${type === 'error' ? 'text-danger' : 'text-ink'}`;
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      if (withMailto) {
        const link = document.createElement('a');
        link.className = 'link font-medium';
        link.href = buildMailto();
        link.textContent = `écrire directement à ${CONTACT_EMAIL}`;
        paragraph.append(' Vous pouvez ', link, '.');
      }
      statusBox.append(paragraph);
    };

    const setLoading = (loading) => {
      submit.disabled = loading;
      submit.setAttribute('aria-busy', String(loading));
      submit.querySelector('[data-icon-idle]').classList.toggle('hidden', loading);
      submit.querySelector('[data-icon-busy]').classList.toggle('hidden', !loading);
      submit.querySelector('[data-label]').textContent = loading ? 'Envoi en cours…' : 'Envoyer le message';
    };

    // Après une première tentative, les erreurs se mettent à jour pendant la saisie
    for (const field of fields) {
      const event = field.type === 'checkbox' ? 'change' : 'input';
      field.addEventListener(event, () => {
        if (submittedOnce) validate(field);
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      submittedOnce = true;

      const invalid = fields.filter((field) => !validate(field));
      if (invalid.length) {
        const plural = invalid.length > 1 ? 's' : '';
        setStatus('error', `${invalid.length} champ${plural} à corriger.`);
        invalid[0].focus();
        return;
      }

      // Champ piège rempli : c'est un robot, on fait comme si l'envoi avait réussi
      if (honeypot.value) {
        form.reset();
        setStatus('success', 'Merci, votre message a bien été envoyé.');
        return;
      }

      if (!isConfigured) {
        setStatus('error', "L'envoi en ligne n'est pas encore activé.", true);
        return;
      }

      setLoading(true);
      setStatus('info', 'Envoi en cours…');
      try {
        const data = new FormData(form);
        data.set('_subject', `Portfolio : ${data.get('sujet')}`);
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(`Formspree a répondu ${response.status}`);

        form.reset();
        submittedOnce = false;
        fields.forEach((field) => field.removeAttribute('aria-invalid'));
        setStatus('success', 'Merci, votre message a bien été envoyé. Je vous réponds par email.');
      } catch {
        setStatus('error', "Le message n'a pas pu être envoyé.", true);
      } finally {
        setLoading(false);
      }
    });
  }
})();
