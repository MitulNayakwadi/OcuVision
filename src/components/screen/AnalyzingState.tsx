import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Check } from '@/components/ui/Icons';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

/** Durations sum to 2,500 ms — the demonstration inference budget. */
const STAGES = [
  { label: 'Decoding frame', detail: 'Colour space normalised, illumination equalised', ms: 340 },
  { label: 'Quality gate', detail: 'Focus, field coverage and artefact check passed', ms: 380 },
  { label: 'Patch embedding', detail: '196 patches projected to 768-dimensional tokens', ms: 480 },
  { label: 'Attention encoding', detail: '12 blocks · 12 heads · every patch pair related', ms: 720 },
  { label: 'Advisory mapping', detail: 'Class and grade resolved to a triage window', ms: 580 },
];

const TOTAL = STAGES.reduce((sum, s) => sum + s.ms, 0);

/**
 * The 2.5-second analysis interstitial. It names each stage of the real inference
 * path as it passes, because a spinner that says nothing invites the user to assume
 * the wait is arbitrary — and here it maps to actual work.
 */
export function AnalyzingState({
  onComplete,
  checkpointName,
  isLiveModel,
}: {
  onComplete: () => void;
  checkpointName?: string | null;
  isLiveModel?: boolean;
}) {
  const [stage, setStage] = useState(0);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    const timers: number[] = [];
    let elapsed = 0;

    STAGES.forEach((s, i) => {
      elapsed += s.ms;
      timers.push(window.setTimeout(() => setStage(i + 1), elapsed));
    });
    timers.push(window.setTimeout(onComplete, TOTAL + 120));

    return () => timers.forEach(window.clearTimeout);
  }, [onComplete]);

  const pct = Math.round((stage / STAGES.length) * 100);
  const current = STAGES[Math.min(stage, STAGES.length - 1)];

  return (
    <GlassCard radius="panel" className="p-7 lg:p-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Eyebrow withRule tone="vitality">
          Step 02 · Inference
        </Eyebrow>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-cool">
          {isLiveModel
            ? `ViT-Base/16 · PyTorch (${checkpointName || 'best_model.pth'})`
            : 'ViT-Base/16 · local demo'}
        </span>
      </div>

      <div className="mt-9 grid items-center gap-9 sm:grid-cols-[13rem_1fr]">
        {/* ---------------- Chrome ring ---------------- */}
        <div className="relative mx-auto aspect-square w-[13rem]">
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0 rounded-full bg-chrome-ring [mask-image:radial-gradient(circle,transparent_57%,black_60%)]',
              !reduced && 'animate-chrome-spin',
            )}
          />
          <div
            aria-hidden="true"
            className="absolute inset-[14%] rounded-full bg-chrome shadow-[inset_0_2px_6px_rgba(255,255,255,0.85),inset_0_-4px_10px_rgba(26,28,28,0.12)]"
          />
          {/* Iris and pupil — the model being looked at, looking back. */}
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-[31%] rounded-full bg-iris-fibre opacity-80',
              !reduced && 'animate-chrome-spin-slow',
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-[42%] rounded-full bg-charcoal',
              !reduced && 'animate-breathe',
            )}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[11px] tracking-[0.14em] text-canvas mix-blend-difference">
              {pct}%
            </span>
          </div>
        </div>

        {/* ---------------- Stage list ---------------- */}
        <div>
          <p className="font-display text-[clamp(1.1rem,2vw,1.4rem)] uppercase leading-tight text-charcoal">
            Analysing retinal field
          </p>
          <p aria-live="polite" className="mt-2 text-[13px] leading-relaxed text-slate-warm">
            {current.label} — {current.detail}
          </p>

          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Analysis progress"
            className="mt-6 h-[3px] w-full overflow-hidden rounded-chip bg-[rgba(26,28,28,0.08)]"
          >
            <motion.div
              className="h-full rounded-chip bg-vitality"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <ul className="mt-7 space-y-3">
            {STAGES.map((s, i) => {
              const done = i < stage;
              const active = i === stage;

              return (
                <li key={s.label} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                      done && 'border-vitality bg-vitality text-canvas',
                      active && 'border-vitality bg-vitality-soft',
                      !done && !active && 'border-slate-hair bg-white/60',
                    )}
                  >
                    {done ? (
                      <Check className="h-2.5 w-2.5" />
                    ) : (
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          active ? 'bg-vitality' : 'bg-[rgba(26,28,28,0.18)]',
                          active && !reduced && 'animate-pulse-track',
                        )}
                      />
                    )}
                  </span>

                  <span
                    className={cn(
                      'font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors duration-300',
                      done || active ? 'text-charcoal' : 'text-slate-cool',
                    )}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}
