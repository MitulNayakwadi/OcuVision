import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { Tabs } from '@/components/ui/Tabs';
import { Bolt, ArrowRight, Check } from '@/components/ui/Icons';
import { MODALITIES, PIPELINE_STAGES } from '@/lib/content';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

const TAB_ITEMS = MODALITIES.map((m) => ({
  id: m.id,
  label: m.id === 'cfp' ? 'Colour Fundus' : 'Angiography',
}));

/**
 * The hero's bottom console: modality selector, the primary CTA, and the
 * inference track. The track's completed segment stops at "Class prediction"
 * because that is genuinely where an unstarted session sits — it is a status
 * display, not decoration pretending to be full.
 */
export function HeroControlPanel({ className }: { className?: string }) {
  const [modality, setModality] = useState(MODALITIES[0].id);
  const reduced = useReducedMotionSafe();
  const active = MODALITIES.find((m) => m.id === modality) ?? MODALITIES[0];
  const doneCount = PIPELINE_STAGES.filter((s) => s.done).length;

  return (
    <GlassCard className={className} radius="panel" variant="default">
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {/* ---------- Row 1: controls ---------- */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Tabs
              items={TAB_ITEMS}
              active={modality}
              onChange={setModality}
              layoutGroup="hero-modality"
              label="Imaging modality"
              size="sm"
            />
            <p className="max-w-sm text-[12px] leading-snug text-slate-warm">
              <span className="font-semibold text-charcoal">{active.name}.</span>{' '}
              {active.detail[0]} · {active.detail[1]}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-slate-cool xl:block">
              {doneCount}/{PIPELINE_STAGES.length} stages ready
            </p>
            <ShimmerButton
              to="/screen"
              iconRight={<ArrowRight className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Start Screening
            </ShimmerButton>
          </div>
        </div>

        {/* ---------- Row 2: inference track ---------- */}
        <div className="mask-fade-r mt-5 border-t border-slate-hair pt-5">
          <ol className="no-scrollbar flex min-w-full items-start gap-0 overflow-x-auto pb-1">
            {PIPELINE_STAGES.map((stage, i) => {
              const isLastDone = stage.done && !PIPELINE_STAGES[i + 1]?.done;
              return (
                <li
                  key={stage.label}
                  className="flex min-w-[5.2rem] sm:min-w-[5.8rem] md:min-w-0 flex-1 shrink-0 md:shrink flex-col items-center gap-2"
                >
                  {/* Node + connectors on one row so the line meets the circle */}
                  <div className="flex w-full items-center">
                    <span
                      aria-hidden="true"
                      className={cn(
                        'h-[2px] flex-1 rounded-full',
                        i === 0
                          ? 'bg-transparent'
                          : PIPELINE_STAGES[i - 1].done
                            ? 'bg-vitality'
                            : 'bg-[rgba(26,28,28,0.12)]',
                      )}
                    />

                    <motion.span
                      className={cn(
                        'relative grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300',
                        stage.done
                          ? 'border-transparent bg-vitality text-white'
                          : 'border-[rgba(26,28,28,0.14)] bg-white/70 text-slate-cool',
                      )}
                      initial={reduced ? false : { scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: reduced ? 0 : 0.4,
                        delay: reduced ? 0 : 0.5 + i * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {stage.done ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Bolt className="h-3.5 w-3.5" />
                      )}

                      {/* Halo marks the current frontier — one node only. */}
                      {isLastDone && !reduced && (
                        <span
                          aria-hidden="true"
                          className="absolute -inset-1 animate-pulse-track rounded-full border border-vitality"
                        />
                      )}
                    </motion.span>

                    <span
                      aria-hidden="true"
                      className={cn(
                        'h-[2px] flex-1 rounded-full',
                        i === PIPELINE_STAGES.length - 1
                          ? 'bg-transparent'
                          : stage.done
                            ? 'bg-vitality'
                            : 'bg-[rgba(26,28,28,0.12)]',
                      )}
                    />
                  </div>

                  <span
                    className={cn(
                      'px-1 text-center text-[10px] leading-tight',
                      stage.done ? 'text-charcoal' : 'text-slate-cool',
                    )}
                  >
                    {stage.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </GlassCard>
  );
}
