import { GlassCard } from '@/components/ui/GlassCard';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { SeverityChip } from '@/components/ui/SeverityChip';
import { ConfidenceChart } from './ConfidenceChart';
import { GLAUCOMA, QUARTERLY_SENSITIVITY, STAGES } from '@/lib/glaucoma';
import { STAGE_STYLES } from '@/lib/advisory';
import { cn } from '@/lib/cn';

/**
 * The clinical core of the home page: the one condition the model screens for, the
 * signs it keys on, how sensitivity moved against a convolutional control, and the
 * three severity stages a positive screen resolves to.
 *
 * No tabs, no class list — there is one condition, so a selector would imply a
 * choice the model does not offer.
 */
export function DiagnosticSection() {
  return (
    <Section id="glaucoma">
      <SectionHeader
        eyebrow="What we screen for"
        title="One condition, read properly"
        body="The whole encoder is spent on a single question: is this optic disc glaucomatous. That focus is what buys the sensitivity below — and it is also why the model is silent on everything else in the frame."
        titleId="glaucoma-title"
      />

      <div className="mt-10 grid gap-6 sm:mt-12 lg:gap-card-gap lg:grid-cols-[0.85fr_1.15fr]">
        {/* ---- Clinical detail ---- */}
        <Reveal>
          <RevealItem>
            <GlassCard radius="panel" className="flex h-full flex-col p-6 sm:p-7 lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Eyebrow tone="cool">{GLAUCOMA.modality}</Eyebrow>
                <SeverityChip severity="watch" size="sm" label="Referable when detected" />
              </div>

              <h3 className="mt-4 font-display text-[clamp(1.25rem,2.2vw,1.6rem)] uppercase leading-tight text-charcoal">
                {GLAUCOMA.full}
              </h3>

              <p className="mt-4 text-[14px] leading-relaxed text-slate-warm">
                {GLAUCOMA.description}
              </p>

              <p className="mt-7 font-mono text-[9.5px] uppercase tracking-[0.14em] text-vitality-ink">
                What the attention maps key on
              </p>
              <ul className="mt-3.5 flex-1 space-y-2.5">
                {GLAUCOMA.findings.map((finding) => (
                  <li
                    key={finding}
                    className="flex gap-3 border-b border-slate-hair pb-2.5 text-[13px] leading-snug text-charcoal last:border-b-0"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-vitality"
                    />
                    {finding}
                  </li>
                ))}
              </ul>

              <p className="mt-6 rounded-card bg-copper-soft/60 p-4 text-[12px] leading-relaxed text-slate-warm">
                {GLAUCOMA.burden}
              </p>
            </GlassCard>
          </RevealItem>
        </Reveal>

        {/* ---- Performance ---- */}
        <Reveal>
          <RevealItem>
            <GlassCard radius="panel" className="flex h-full flex-col p-5 sm:p-7 lg:p-8">
              <Eyebrow withRule tone="vitality">
                Validation sensitivity
              </Eyebrow>
              <div className="mt-6 flex-1 min-w-0">
                <ConfidenceChart points={QUARTERLY_SENSITIVITY} diseaseName={GLAUCOMA.name} />
              </div>
            </GlassCard>
          </RevealItem>
        </Reveal>
      </div>

      {/* ---------- Severity ladder ---------- */}
      <div className="mt-16 sm:mt-24">
        <Reveal className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <RevealItem>
            <Eyebrow withRule tone="warm">
              Severity staging
            </Eyebrow>
            <h3 className="mt-3.5 font-display text-[clamp(1.1rem,2vw,1.5rem)] uppercase leading-tight text-charcoal">
              Three stages, each with its own triage window
            </h3>
          </RevealItem>
          <RevealItem as="p" className="max-w-sm text-[12.5px] leading-relaxed text-slate-cool">
            Cup-to-disc ratio alone does not diagnose glaucoma — a large physiological
            cup exists — so every band pairs the ratio with the structural sign that
            has to accompany it.
          </RevealItem>
        </Reveal>

        <Reveal as="ul" stagger={0.08} className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {STAGES.map((stage) => {
            const style = STAGE_STYLES[stage.id];

            return (
              <RevealItem as="li" key={stage.id}>
                <GlassCard radius="panel" className="flex h-full flex-col p-5 sm:p-6 lg:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 rounded-chip border px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em]',
                        style.bg,
                        style.border,
                        style.text,
                      )}
                    >
                      <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
                      {stage.label}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.08em] text-slate-cool">
                      CDR {stage.cdr[0].toFixed(2)}–{stage.cdr[1].toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-4 flex-1 text-[13px] leading-relaxed text-slate-warm sm:mt-5">
                    {stage.description}
                  </p>

                  <p className="mt-5 border-t border-slate-hair pt-4 sm:mt-6">
                    <SeverityChip severity={stage.severity} size="sm" />
                  </p>
                </GlassCard>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}
