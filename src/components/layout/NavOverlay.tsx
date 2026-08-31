import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { PillLink, IconButton } from '@/components/ui/PillButton';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowRight, ArrowUpRight, Close } from '@/components/ui/Icons';
import { DISCLAIMER, FOOTER_LINKS } from '@/lib/content';
import { cn } from '@/lib/cn';

export interface NavItem {
  label: string;
  to: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Deep links worth surfacing next to the three primary routes. */
const JUMP = [...FOOTER_LINKS.product.slice(1), FOOTER_LINKS.research[0]];

/**
 * Full-bleed navigation overlay, at every breakpoint — the reference composition
 * keeps the circular menu button on desktop too, so this is the desktop menu as
 * much as the small-screen one.
 *
 * It sits at `z-overlay`, above `z-header`, which means the header's own toggle is
 * covered while it is open. So the overlay carries its own close button, laid out
 * in a mirror of the header's container so the two land on exactly the same pixel.
 */
export function NavOverlay({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
}) {
  const reduced = useReducedMotionSafe();
  const panelRef = useRef<HTMLDivElement>(null);

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
        >
          <div className="absolute inset-0 bg-canvas/88 backdrop-blur-2xl" />

          {/* Close button — mirrors the header container so it sits on top of the
              button that opened it rather than near it. */}
          <div className="absolute inset-x-0 top-0 z-10">
            <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-end px-gutter lg:px-container">
              <IconButton label="Close menu" variant="dark" onClick={onClose}>
                <Close className="h-4 w-4" />
              </IconButton>
            </div>
          </div>

          <div className="relative flex h-full flex-col overflow-y-auto px-gutter pb-10 pt-24 lg:px-container lg:pt-32">
            <div className="mx-auto flex w-full max-w-container flex-1 flex-col gap-12 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-card-gap">
              {/* ---------- Primary routes ---------- */}
              <nav aria-label="Primary">
                <ul>
                  {items.map((item, i) => (
                    <motion.li
                      key={item.to}
                      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduced ? 0 : 0.45,
                        delay: reduced ? 0 : 0.06 + i * 0.06,
                        ease: EASE,
                      }}
                    >
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-baseline justify-between gap-6 border-b border-slate-hair py-4 font-display text-[clamp(2rem,8vw,4.5rem)] uppercase leading-none transition-colors duration-200 lg:py-5',
                            isActive
                              ? 'text-charcoal'
                              : 'text-slate-cool hover:text-charcoal',
                          )
                        }
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className="font-mono text-[10px] tracking-[0.14em] text-slate-cool"
                        >
                          0{i + 1}
                        </span>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* ---------- Deep links + standing disclaimer ---------- */}
              <motion.div
                className="flex flex-col gap-8 lg:pt-3"
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduced ? 0 : 0.45,
                  delay: reduced ? 0 : 0.26,
                  ease: EASE,
                }}
              >
                <div>
                  <Eyebrow withRule tone="cool">
                    Jump to
                  </Eyebrow>
                  <ul className="mt-4 space-y-0.5">
                    {JUMP.map((link) => (
                      <li key={link.to}>
                        <NavLink
                          to={link.to}
                          onClick={onClose}
                          className="group flex items-center justify-between gap-4 rounded-chip py-2.5 text-[14px] text-slate-cool transition-colors duration-200 hover:text-charcoal"
                        >
                          {link.label}
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-clinical group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>

                <PillLink
                  to="/screen"
                  size="lg"
                  variant="primary"
                  className="w-full"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                  onClick={onClose}
                >
                  Start Screening
                </PillLink>

                <p className="max-w-prose text-[11px] leading-relaxed text-slate-cool">
                  {DISCLAIMER}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
