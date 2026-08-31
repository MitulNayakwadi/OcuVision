import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { ChevronDown, Shield, EyeScan, Activity, AlertTriangle } from '@/components/ui/Icons';
import { DISCLAIMER } from '@/lib/content';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

/**
 * The session chip in the header. There is no account system behind this — the
 * prototype processes images locally — so the chip says exactly that rather than
 * implying a signed-in clinician who does not exist.
 */
export function ProfileDropdown({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    // Move focus into the menu so keyboard users are not left behind the trigger.
    menuRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const itemClass =
    'flex w-full items-center gap-3 rounded-chip px-3 py-2.5 text-left text-[13px] font-medium text-charcoal transition-colors duration-150 hover:bg-white/80';

  return (
    <>
      <div ref={wrapRef} className={cn('relative', className)}>
        <button
          ref={triggerRef}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="glass flex h-11 items-center gap-2.5 rounded-chip pl-1.5 pr-3.5 transition-all duration-200 ease-clinical hover:bg-white/90 hover:border-white"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full bg-copper-sheen font-display text-[10px] text-white"
          >
            OV
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-[12px] font-semibold text-charcoal">
              Demo session
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-slate-cool">
              Local only
            </span>
          </span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-slate-cool transition-transform duration-200',
              open && 'rotate-180',
            )}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              role="menu"
              aria-label="Session"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="glass-solid absolute right-0 top-[calc(100%+10px)] w-[17rem] origin-top-right rounded-card p-2"
            >
              <div className="mb-1 flex items-start gap-3 rounded-card bg-vitality-soft/60 px-3 py-3">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-vitality-ink" />
                <p className="text-[12px] leading-snug text-slate-warm">
                  Images are analysed in this browser. Nothing is uploaded, stored
                  or added to any training set.
                </p>
              </div>

              <Link to="/screen" role="menuitem" className={itemClass} onClick={() => setOpen(false)}>
                <EyeScan className="h-4 w-4 text-slate-cool" />
                Screen an image
              </Link>
              <Link
                to="/about#metrics"
                role="menuitem"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                <Activity className="h-4 w-4 text-slate-cool" />
                Model performance
              </Link>
              <button
                type="button"
                role="menuitem"
                className={itemClass}
                onClick={() => {
                  setOpen(false);
                  setShowDisclaimer(true);
                }}
              >
                <AlertTriangle className="h-4 w-4 text-slate-cool" />
                Research disclaimer
              </button>

              <p className="mt-1 border-t border-slate-hair px-3 pb-1 pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-cool">
                Prototype · No regulatory clearance
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal
        open={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        title="Research Disclaimer"
        eyebrow="Read before use"
        maxWidth="max-w-xl"
      >
        <p className="text-sm leading-relaxed text-slate-warm">{DISCLAIMER}</p>
        <ul className="mt-5 space-y-3">
          {[
            'This system screens for glaucoma only. It is not trained on — and cannot detect — diabetic or hypertensive retinopathy, retinal detachment, tears, tumours, ROP or optic neuritis.',
            'A negative result does not exclude disease. Symptomatic patients need assessment regardless of output.',
            'Attention maps indicate where the model looked, not a confirmed lesion boundary.',
            'Performance figures describe held-out research evaluation, not your camera or population.',
          ].map((line) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-slate-warm">
              <span
                aria-hidden="true"
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-vitality"
              />
              {line}
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
