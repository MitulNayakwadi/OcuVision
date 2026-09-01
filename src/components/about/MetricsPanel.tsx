import { Section, SectionHeader } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FadeIn } from '@/components/ui/Reveal';
import { Target } from '@/components/ui/Icons';
import { METRICS } from '@/lib/content';

const PROTOCOL = [
  { label: 'Backbone', value: 'ViT-Base/16, ImageNet-21k pretrained' },
  { label: 'Task', value: 'Glaucoma versus no glaucoma, binary' },
  { label: 'Split', value: 'Patient-level hold-out, iterative stratification' },
  { label: 'Primary safety metric', value: 'Sensitivity for referable glaucoma' },
];

/**
 * Evaluation figures.
 *
 * Only the metrics whose value *is* the number on the label get a bar: a bar
 * whose length does not encode its own figure is a lie about the data. Latency is
 * "lower is better" and has no natural 0–100 span, so it is set as a figure alone.
 */
export function MetricsPanel() {
  const bars = METRICS.filter((metric) => !metric.inverted);
  const figure = METRICS.find((metric) => metric.inverted);

  return (
    <Section id="metrics">
      <SectionHeader
        eyebrow="Evaluation"
        title="Measured Performance"
        titleId="metrics-title"
        body="Glaucoma-detection figures from the held-out test split of the research configuration — every number below describes the one task this model was trained and evaluated on. They describe the model as evaluated, not a certified device; the prototype in this browser is a demonstration and its outputs are illustrative."
      />

      <div className="mt-10 sm:mt-14 grid gap-6 lg:gap-card-gap lg:grid-cols-[1.12fr_0.88fr]">
        <FadeIn>
          <GlassCard radius="panel" className="h-full p-5 sm:p-7 lg:p-9">
            <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-vitality-ink">
              <Target className="h-3.5 w-3.5" />
              Glaucoma detection quality
            </p>

            <div className="mt-7 sm:mt-9 space-y-7 sm:space-y-9">
              {bars.map((metric) => (
                <ProgressBar
                  key={metric.id}
                  label={metric.label}
                  display={metric.display}
                  value={metric.value}
                  caption={metric.caption}
                />
              ))}
            </div>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="flex h-full flex-col rounded-panel bg-charcoal p-5 sm:p-7 lg:p-9">
            {figure && (
              <>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/45">
                  {figure.label}
                </p>
                <p className="mt-5 font-display text-[clamp(2.6rem,6vw,3.6rem)] leading-[0.9] text-canvas">
                  {figure.display}
                </p>
                <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/55">
                  {figure.caption} Lower is better, so this figure carries no bar —
                  there is no meaningful ceiling to measure it against.
                </p>
              </>
            )}

            <dl className="mt-auto space-y-3 border-t border-white/12 pt-7">
              {PROTOCOL.map((row) => (
                <div key={row.label} className="flex flex-col gap-1">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
                    {row.label}
                  </dt>
                  <dd className="text-[12.5px] leading-snug text-white/75">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
