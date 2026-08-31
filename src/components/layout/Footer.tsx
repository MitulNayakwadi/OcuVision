import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ProseSections } from '@/components/ui/Modal';
import { PillButton } from '@/components/ui/PillButton';
import { LogoMark, ArrowUpRight, Check, Copy } from '@/components/ui/Icons';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { BRAND, CONTACT, DISCLAIMER, FOOTER_LINKS, LEGAL } from '@/lib/content';
import { cn } from '@/lib/cn';

type Legal = 'privacy' | 'terms' | 'contact' | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormState {
  name: string;
  email: string;
  organisation: string;
  message: string;
}

const EMPTY: FormState = { name: '', email: '', organisation: '', message: '' };

/**
 * Contact form. There is no backend behind this prototype, so rather than fake a
 * successful send the form validates properly and then hands the composed
 * message back to the visitor to send from their own client. Honest and still
 * useful.
 */
function ContactForm() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [composed, setComposed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = (state: FormState) => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (state.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!EMAIL_RE.test(state.email.trim()))
      next.email = 'Please enter a valid email address.';
    if (state.message.trim().length < 20)
      next.message = 'Please give us at least a sentence or two (20 characters).';
    return next;
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setComposed(
      [
        `Subject: ${BRAND.name} enquiry — ${values.name.trim()}`,
        '',
        `Name: ${values.name.trim()}`,
        `Email: ${values.email.trim()}`,
        values.organisation.trim() ? `Organisation: ${values.organisation.trim()}` : null,
        '',
        values.message.trim(),
      ]
        .filter((line) => line !== null)
        .join('\n'),
    );
  };

  const field = (key: keyof FormState) => ({
    id: `contact-${key}`,
    value: values[key],
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `contact-${key}-error` : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setValues((v) => ({ ...v, [key]: event.target.value }));
      if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    },
  });

  const inputClass = (key: keyof FormState) =>
    cn(
      'w-full rounded-card border bg-white/70 px-4 py-3 text-sm text-charcoal transition-colors duration-200 placeholder:text-slate-cool/70',
      errors[key]
        ? 'border-danger focus-visible:border-danger'
        : 'border-slate-hair hover:border-[rgba(26,28,28,0.18)]',
    );

  if (composed) {
    return (
      <div>
        <div className="mb-5 flex items-start gap-3 rounded-card bg-advisory-routine/10 px-4 py-4">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-advisory-routine" />
          <p className="text-sm leading-relaxed text-slate-warm">
            Your message is ready. This prototype has no server, so nothing was
            transmitted — copy the text below and send it from your own email
            client to reach the team.
          </p>
        </div>

        <pre className="no-scrollbar max-h-56 overflow-auto rounded-card bg-charcoal px-4 py-4 font-mono text-[12px] leading-relaxed text-canvas">
          {composed}
        </pre>

        <div className="mt-5 flex flex-wrap gap-3">
          <PillButton
            variant="dark"
            iconLeft={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(composed);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              } catch {
                // Clipboard blocked (insecure context or denied permission) —
                // the text is on screen and selectable, so this is recoverable.
                setCopied(false);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy message'}
          </PillButton>
          <PillButton
            variant="outline"
            onClick={() => {
              setComposed(null);
              setValues(EMPTY);
            }}
          >
            Write another
          </PillButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="mb-6 text-sm leading-relaxed text-slate-warm">{CONTACT.body}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-[12px] font-semibold text-charcoal"
          >
            Name <span className="text-vitality">*</span>
          </label>
          <input
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={inputClass('name')}
            {...field('name')}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className="mt-1.5 text-[12px] text-danger">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-[12px] font-semibold text-charcoal"
          >
            Email <span className="text-vitality">*</span>
          </label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@institution.org"
            className={inputClass('email')}
            {...field('email')}
          />
          {errors.email && (
            <p id="contact-email-error" role="alert" className="mt-1.5 text-[12px] text-danger">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="contact-organisation"
          className="mb-1.5 block text-[12px] font-semibold text-charcoal"
        >
          Organisation <span className="font-normal text-slate-cool">(optional)</span>
        </label>
        <input
          type="text"
          autoComplete="organization"
          placeholder="Clinic, hospital or university"
          className={inputClass('organisation')}
          {...field('organisation')}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-[12px] font-semibold text-charcoal"
        >
          Message <span className="text-vitality">*</span>
        </label>
        <textarea
          rows={5}
          placeholder="Which part of the work would you like to discuss?"
          className={cn(inputClass('message'), 'resize-y')}
          {...field('message')}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1.5 text-[12px] text-danger">
            {errors.message}
          </p>
        )}
      </div>

      <p className="mt-4 rounded-card bg-vitality-soft/50 px-4 py-3 text-[12px] leading-relaxed text-slate-warm">
        Do not include patient names, record numbers or retinal images in this
        form.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <PillButton type="submit" variant="primary" size="lg">
          Compose message
        </PillButton>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-cool">
          {CONTACT.affiliation}
        </p>
      </div>
    </form>
  );
}

export function Footer() {
  const [open, setOpen] = useState<Legal>(null);

  const linkClass =
    'group inline-flex items-center gap-1.5 text-[13px] text-slate-cool transition-colors duration-200 hover:text-charcoal';

  return (
    <>
      <footer className="relative mt-section border-t border-slate-hair">
        <div className="mx-auto max-w-[1400px] px-gutter py-16 lg:px-container">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            {/* ---------- Brand ---------- */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <LogoMark className="h-9 w-9" />
                <span className="font-display text-[15px] uppercase text-charcoal">
                  {BRAND.name}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-warm">
                {BRAND.researchTitle}
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-cool">
                {BRAND.domain}
              </p>
            </div>

            {/* ---------- Product ---------- */}
            <nav aria-label="Product">
              <Eyebrow className="mb-4">Product</Eyebrow>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.product.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ---------- Research ---------- */}
            <nav aria-label="Research">
              <Eyebrow className="mb-4">Research</Eyebrow>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.research.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ---------- Legal ---------- */}
            <div>
              <Eyebrow className="mb-4">Legal</Eyebrow>
              <ul className="space-y-2.5">
                {(
                  [
                    ['privacy', 'Privacy Policy'],
                    ['terms', 'Terms of Service'],
                    ['contact', 'Contact'],
                  ] as const
                ).map(([key, label]) => (
                  <li key={key}>
                    <button type="button" onClick={() => setOpen(key)} className={linkClass}>
                      {label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------- Disclaimer bar ---------- */}
          <div className="mt-14 rounded-card border border-slate-hair bg-white/50 px-5 py-4">
            <p className="text-[12px] leading-relaxed text-slate-warm">
              <span className="font-semibold uppercase tracking-[0.08em] text-vitality-ink">
                Research prototype ·{' '}
              </span>
              {DISCLAIMER}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-hair pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-cool">
              © 2026 {BRAND.name} · All rights reserved
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-cool">
              {BRAND.tagline}
            </p>
          </div>
        </div>
      </footer>

      <Modal
        open={open === 'privacy'}
        onClose={() => setOpen(null)}
        title={LEGAL.privacy.title}
        eyebrow="How we handle imaging data"
      >
        <ProseSections sections={LEGAL.privacy.sections} updated={LEGAL.privacy.updated} />
      </Modal>

      <Modal
        open={open === 'terms'}
        onClose={() => setOpen(null)}
        title={LEGAL.terms.title}
        eyebrow="Conditions of use"
      >
        <ProseSections sections={LEGAL.terms.sections} updated={LEGAL.terms.updated} />
      </Modal>

      <Modal
        open={open === 'contact'}
        onClose={() => setOpen(null)}
        title={CONTACT.title}
        eyebrow="Get in touch"
      >
        <ContactForm />
      </Modal>
    </>
  );
}
