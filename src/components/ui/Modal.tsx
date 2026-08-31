import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { IconButton } from './PillButton';
import { Close } from './Icons';
import { Eyebrow } from './Eyebrow';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  maxWidth = 'max-w-2xl',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-modal flex items-end justify-center p-4 sm:items-center sm:p-6"
          role="presentation"
        >
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/25 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={`glass-solid relative z-10 w-full ${maxWidth} max-h-[86vh] overflow-hidden rounded-panel`}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{
              duration: reduced ? 0 : 0.36,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <header className="flex items-start justify-between gap-6 border-b border-slate-hair px-6 py-5 sm:px-8">
              <div className="min-w-0">
                {eyebrow && (
                  <Eyebrow className="mb-2" tone="vitality">
                    {eyebrow}
                  </Eyebrow>
                )}
                <h2 className="font-display text-[clamp(1.25rem,2.6vw,1.75rem)] uppercase leading-tight text-charcoal">
                  {title}
                </h2>
              </div>
              <IconButton
                label="Close dialog"
                onClick={onClose}
                size={40}
                variant="outline"
                className="mt-1"
              >
                <Close className="h-4 w-4" />
              </IconButton>
            </header>

            <div
              className="max-h-[58vh] overflow-y-auto px-6 py-6 sm:px-8"
              data-lenis-prevent
            >
              {children}
            </div>

            {footer && (
              <footer className="border-t border-slate-hair px-6 py-4 sm:px-8">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Long-form legal / policy body copy, consistently typeset. */
export function ProseSections({
  sections,
  updated,
}: {
  sections: { heading: string; body: string }[];
  updated?: string;
}) {
  return (
    <div className="space-y-6">
      {updated && (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-cool">
          {updated}
        </p>
      )}
      {sections.map((section) => (
        <section key={section.heading}>
          <h3 className="mb-1.5 text-[15px] font-semibold text-charcoal">
            {section.heading}
          </h3>
          <p className="max-w-prose text-sm leading-relaxed text-slate-warm">
            {section.body}
          </p>
        </section>
      ))}
    </div>
  );
}
