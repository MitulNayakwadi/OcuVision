import { useEffect, useRef, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { Check, Copy, Database } from '@/components/ui/Icons';
import { DATASET } from '@/lib/content';
import { cn } from '@/lib/cn';

type CopyState = 'idle' | 'copied' | 'error';

/**
 * Provenance of the training data, with the loader call it takes to reproduce the
 * split. Real and runnable — a screenshot of a code block that cannot be copied is
 * decoration, so the button writes the actual snippet to the clipboard.
 */
export function DatasetSection() {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      // Absent in insecure contexts and older Safari, so this can genuinely fail.
      await navigator.clipboard.writeText(DATASET.snippet);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
    timer.current = window.setTimeout(() => setCopyState('idle'), 2400);
  };

  return (
    <Section id="dataset">
      <SectionHeader
        eyebrow={DATASET.eyebrow}
        title={DATASET.title}
        body={DATASET.body}
        titleId="dataset-title"
      />

      <div className="mt-14 grid gap-card-gap lg:grid-cols-[1.05fr_0.95fr]">
        {/* ---------- Loader ---------- */}
        <Reveal>
          <RevealItem>
            <div className="overflow-hidden rounded-panel border border-charcoal/10 bg-charcoal">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
                <span className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                  <Database className="h-3.5 w-3.5" />
                  Hugging Face · datasets
                </span>

                <button
                  type="button"
                  onClick={copy}
                  className={cn(
                    'inline-flex h-8 shrink-0 items-center gap-2 rounded-chip border px-3.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200 ease-clinical',
                    copyState === 'copied'
                      ? 'border-vitality/50 bg-vitality/15 text-vitality'
                      : 'border-white/15 text-white/70 hover:border-white/35 hover:text-white',
                  )}
                >
                  {copyState === 'copied' ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copyState === 'copied'
                    ? 'Copied'
                    : copyState === 'error'
                      ? 'Select manually'
                      : 'Copy'}
                </button>
              </div>

              <pre className="overflow-x-auto px-6 py-7 font-mono text-[12.5px] leading-[1.9] text-canvas">
                <code>{DATASET.snippet}</code>
              </pre>

              {/* Announced rather than shown — the button label already changes. */}
              <p aria-live="polite" className="sr-only">
                {copyState === 'copied'
                  ? 'Snippet copied to clipboard'
                  : copyState === 'error'
                    ? 'Clipboard unavailable — select the snippet and copy manually'
                    : ''}
              </p>
            </div>

            <p className="mt-5 text-[12.5px] leading-relaxed text-slate-cool">
              {DATASET.note}
            </p>
          </RevealItem>
        </Reveal>

        {/* ---------- Facts ---------- */}
        <Reveal>
          <RevealItem>
            <GlassCard variant="well" radius="panel" className="h-full p-8">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-vitality-ink">
                Corpus at a glance
              </p>

              <dl className="mt-6">
                {DATASET.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid gap-1 border-b border-slate-hair py-4 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[9.5rem_1fr] sm:gap-4"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-cool">
                      {fact.label}
                    </dt>
                    <dd className="text-[13.5px] leading-snug text-charcoal">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </GlassCard>
          </RevealItem>
        </Reveal>
      </div>
    </Section>
  );
}
