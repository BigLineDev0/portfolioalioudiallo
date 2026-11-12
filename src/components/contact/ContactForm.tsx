import { useRef, useState, type FormEvent } from 'react';
import { LoaderCircle, Send } from 'lucide-react';
import { site } from '../../data/site';
import { useMagnetic } from '../../hooks/useMagnetic';

// Formulaire envoyé via Formspree (aucun backend à maintenir). L'identifiant est lu dans la variable
// d'environnement VITE_FORMSPREE_ID (fichier .env en local, réglages du projet sur Vercel) : c'est la partie après
// /f/ dans l'URL fournie par formspree.io. Tant qu'il manque, aucun envoi n'est simulé : on propose l'email direct.
const FORMSPREE_ID = (import.meta.env.VITE_FORMSPREE_ID ?? '').trim();
const IS_CONFIGURED = /^[a-z0-9]+$/i.test(FORMSPREE_ID);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FieldName = 'nom' | 'email' | 'sujet' | 'message' | 'consentement';
type Values = { nom: string; email: string; sujet: string; message: string; consentement: boolean };
type Errors = Partial<Record<FieldName, string>>;
type Status = { type: 'error' | 'success' | 'info'; text: string; withMailto?: boolean } | null;

const EMPTY: Values = { nom: '', email: '', sujet: '', message: '', consentement: false };
const ORDER: FieldName[] = ['nom', 'email', 'sujet', 'message', 'consentement'];

// Règles reprises du site précédent : chaque règle renvoie un message d'erreur, ou une chaîne vide
const RULES: Record<FieldName, (values: Values) => string> = {
  nom: (v) => (v.nom.trim().length >= 2 ? '' : 'Indiquez votre nom (2 caractères minimum).'),
  email: (v) =>
    EMAIL_PATTERN.test(v.email.trim()) ? '' : 'Indiquez une adresse email valide, par exemple nom@domaine.com.',
  sujet: (v) => (v.sujet.trim().length >= 3 ? '' : 'Indiquez le sujet de votre message.'),
  message: (v) => (v.message.trim().length >= 20 ? '' : 'Votre message doit contenir au moins 20 caractères.'),
  consentement: (v) => (v.consentement ? '' : 'Cochez cette case pour que je puisse vous répondre.'),
};

const validateAll = (values: Values): Errors =>
  Object.fromEntries(ORDER.map((name) => [name, RULES[name](values)]).filter(([, message]) => message));

function buildMailto(values: Values) {
  const subject = values.sujet.trim() || 'Contact depuis le portfolio';
  const body = `${values.message.trim()}\n\n${values.nom.trim()}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const submitRef = useMagnetic<HTMLButtonElement>(0.2);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  // Après une première tentative, les erreurs se mettent à jour pendant la saisie
  const update = <K extends FieldName>(name: K, value: Values[K]) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (submittedOnce) setErrors(validateAll(next));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedOnce(true);
    const found = validateAll(values);
    setErrors(found);
    const invalid = ORDER.filter((name) => found[name]);
    if (invalid.length) {
      const plural = invalid.length > 1 ? 's' : '';
      setStatus({ type: 'error', text: `${invalid.length} champ${plural} à corriger.` });
      formRef.current?.querySelector<HTMLElement>(`[name="${invalid[0]}"]`)?.focus();
      return;
    }

    // Champ piège rempli : c'est un robot, on fait comme si l'envoi avait réussi
    if (honeypotRef.current?.value) {
      setValues(EMPTY);
      setStatus({ type: 'success', text: 'Merci, votre message a bien été envoyé.' });
      return;
    }

    if (!IS_CONFIGURED) {
      setStatus({ type: 'error', text: "L'envoi en ligne n'est pas encore activé.", withMailto: true });
      return;
    }

    setSending(true);
    setStatus({ type: 'info', text: 'Envoi en cours…' });
    try {
      const data = new FormData(formRef.current!);
      data.set('_subject', `Portfolio : ${values.sujet.trim()}`);
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Formspree a répondu ${response.status}`);
      setValues(EMPTY);
      setErrors({});
      setSubmittedOnce(false);
      setStatus({ type: 'success', text: 'Merci, votre message a bien été envoyé. Je vous réponds par email.' });
    } catch {
      setStatus({ type: 'error', text: "Le message n'a pas pu être envoyé.", withMailto: true });
    } finally {
      setSending(false);
    }
  };

  const fieldProps = (name: Exclude<FieldName, 'consentement'>, describedBy?: string) => ({
    id: name,
    name,
    className: 'field',
    value: values[name],
    required: true,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': [describedBy, errors[name] ? `${name}-erreur` : undefined].filter(Boolean).join(' ') || undefined,
    onChange: (event: { target: { value: string } }) => update(name, event.target.value),
  });

  const ErrorText = ({ name }: { name: FieldName }) =>
    errors[name] ? (
      <p className="field-error" id={`${name}-erreur`}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form
      ref={formRef}
      className="glass rounded-3xl p-6 sm:p-9"
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="titre-formulaire"
    >
      <h3 id="titre-formulaire" className="text-h3">
        Envoyer un message
      </h3>
      <p className="mt-2 text-sm text-muted">Tous les champs sont obligatoires.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="nom">
            Nom complet
          </label>
          <input type="text" autoComplete="name" {...fieldProps('nom')} />
          <ErrorText name="nom" />
        </div>
        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input type="email" inputMode="email" autoComplete="email" spellCheck={false} {...fieldProps('email')} />
          <ErrorText name="email" />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="sujet">
            Sujet
          </label>
          <input type="text" {...fieldProps('sujet')} />
          <ErrorText name="sujet" />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="message">
            Message
          </label>
          <textarea rows={6} {...fieldProps('message', 'message-aide')} className="field min-h-40 resize-y" />
          <p className="mt-2 text-xs text-muted" id="message-aide">
            20 caractères minimum.
          </p>
          <ErrorText name="message" />
        </div>

        {/* Piège à robots : champ invisible que seuls les robots remplissent */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="site-web">Ne pas remplir ce champ</label>
          <input ref={honeypotRef} id="site-web" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--accent)]"
              id="consentement"
              name="consentement"
              type="checkbox"
              value="oui"
              required
              checked={values.consentement}
              aria-invalid={errors.consentement ? true : undefined}
              aria-describedby={errors.consentement ? 'consentement-erreur' : undefined}
              onChange={(event) => update('consentement', event.target.checked)}
            />
            <label className="cursor-pointer text-sm text-muted" htmlFor="consentement">
              J'accepte que ces informations soient transmises via Formspree et utilisées uniquement pour me répondre.
            </label>
          </div>
          <ErrorText name="consentement" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:flex sm:flex-row-reverse sm:items-center sm:justify-between">
        <button ref={submitRef} type="submit" className="btn btn-primary w-full px-6 sm:w-auto" disabled={sending} aria-busy={sending}>
          {sending ? (
            <LoaderCircle size={16} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />
          ) : (
            <Send size={16} strokeWidth={1.75} aria-hidden="true" />
          )}
          {sending ? 'Envoi en cours…' : 'Envoyer le message'}
        </button>
        <div role="status" aria-live="polite" className={`text-sm ${status?.type === 'error' ? 'text-danger' : 'text-ink'}`}>
          {status && (
            <p>
              {status.text}
              {status.withMailto && (
                <>
                  {' '}
                  Vous pouvez{' '}
                  <a className="link font-medium" href={buildMailto(values)}>
                    écrire directement à {site.email}
                  </a>
                  .
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
