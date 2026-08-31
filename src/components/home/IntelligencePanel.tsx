import { GlassCard } from '@/components/ui/GlassCard';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { ArrowRight } from '@/components/ui/Icons';
import { StatRow } from './StatRow';
import { INTELLIGENCE } from '@/lib/content';

/**
 * The architectural argument: why a transformer rather than a CNN. The long-form
 * claim sits on glass at the left, the four supporting points run as a hairline-
 * ruled list at the right — a list rather than a card grid, because these are one
 * argument in four parts and equal-weight cards would read as four features.
 */
export function IntelligencePanel() {
  return (
    <Section id="architecture">
      <SectionHeader
        eyebrow={INTELLIGENCE.eyebrow}
        title={INTELLIGENCE.title}
        outline
        titleId="architecture-title"
      />

      <div className="mt-14 grid gap-card-gap lg:grid-cols-[0.92fr_1.08fr]">
        {/* ---------- The claim ---------- */}
        <Reveal>
          <RevealItem>
            <GlassCard variant="well" radius="panel" className="flex h-full flex-col p-8 lg:p-10">
              <p className="text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-charcoal">
                {INTELLIGENCE.body}
              </p>

              <div className="mt-10 border-t border-slate-hair pt-8">
                <StatRow />
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-slate-hair pt-8">
                <ShimmerButton to="/screen" iconRight={<ArrowRight className="h-4 w-4" />}>
                  Initiate Scan Sequence
                </ShimmerButton>
                <p className="text-[12px] leading-snug text-slate-cool">
                  One colour fundus photograph.
                  <br />
                  Nothing leaves this tab.
                </p>
              </div>
            </GlassCard>
          </RevealItem>
        </Reveal>

        {/* ---------- The four supports ---------- */}
        <Reveal as="ul" stagger={0.09} className="flex flex-col">
          {INTELLIGENCE.points.map((point, i) => (
            <RevealItem
              as="li"
              key={point.title}
              className="group grid grid-cols-[2.75rem_1fr] gap-x-5 border-b border-slate-hair py-7 first:pt-0 last:border-b-0 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="font-mono text-[11px] leading-[1.7] tracking-[0.14em] text-copper"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div>
                <h3 className="font-display text-[15px] uppercase leading-snug tracking-[0.005em] text-charcoal">
                  {point.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-slate-warm">
                  {point.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
