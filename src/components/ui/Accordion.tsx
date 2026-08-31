import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PipelineStep } from '@/types';
import { cn } from '@/lib/cn';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { ChevronDown } from './Icons';

/**
 * Single-open accordion over the ViT inference stages. Height and opacity are
 * animated; under reduced-motion the panel simply appears.
 */
export function Accordion({ steps }: { steps: PipelineStep[] }) {
  const [open, setOpen] = useState<string | null>(steps[0]?.id ?? null);
  // useId yields ":r1:"; the colons are legal in an id but make the value
  // unusable in a selector or a `url(#…)`, so they come out here.
  const baseId = `accordion-${useId().replace(/:/g, '')}`;
  const reduced = useReducedMotionSafe();

  return (
    <div className="divide-y divide-slate-hair">
      {steps.map((step, i) => {
        const expanded = open === step.id;
        const buttonId = `${baseId}-${step.id}-button`;
        const panelId = `${baseId}-${step.id}-panel`;

        return (
          <div key={step.id}>
            <h3>
              <button
                id={buttonId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : step.id)}
                className="group flex w-full items-center gap-4 py-5 text-left transition-colors duration-200 sm:gap-6"
              >
                <span
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-full font-mono text-[12px] font-medium transition-all duration-300 ease-clinical',
                    expanded
                      ? 'bg-vitality text-white'
                      : 'bg-white/70 text-slate-cool ring-1 ring-inset ring-slate-hair group-hover:text-charcoal',
                  )}
                >
                  {step.index}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block font-display text-[clamp(1rem,2vw,1.35rem)] uppercase leading-tight transition-colors duration-200',
                      expanded ? 'text-charcoal' : 'text-charcoal/75 group-hover:text-charcoal',
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="mt-1 block text-[13px] leading-snug text-slate-cool">
                    {step.summary}
                  </span>
                </span>

                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'h-5 w-5 shrink-0 text-slate-cool transition-transform duration-300 ease-clinical',
                    expanded && 'rotate-180 text-vitality-ink',
                  )}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pl-0 sm:pl-16">
                    <p className="max-w-prose text-sm leading-relaxed text-slate-warm">
                      {step.detail}
                    </p>
                    <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-chip bg-white/70 px-4 py-2 ring-1 ring-inset ring-slate-hair">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-cool">
                        Shape
                      </span>
                      <code className="font-mono text-[12px] text-charcoal">
                        {step.tensor}
                      </code>
                    </div>
                    {i < steps.length - 1 && (
                      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-copper">
                        ↓ feeds {steps[i + 1].title}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
