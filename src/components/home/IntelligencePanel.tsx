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

      <div className="mt-10 grid gap-6 sm:mt-14 lg:gap-card-gap lg:grid-cols-[0.92fr_1.08fr]">
        {/* ---------- The claim ---------- */}
        <Reveal>
          <RevealItem>
            <GlassCard variant="well" radius="panel" className="flex h-full flex-col p-6 sm:p-8 lg:p-10">
              <p className="text-[clamp(0.95rem,1.5vw,1.15rem)] leading-relaxed text-charcoal">
                {INTELLIGENCE.body}
              </p>

              <div className="mt-7 border-t border-slate-hair pt-6 sm:mt-10 sm:pt-8">
                <StatRow />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-slate-hair pt-6 sm:mt-10 sm:pt-8">
                <ShimmerButton to="/screen" iconRight={<ArrowRight className="h-4 w-4" />} className="w-full sm:w-auto">
                  Initiate Scan Sequence
                </ShimmerButton>
                <p className="text-[12px] leading-snug text-slate-cool">
                  One colour fundus photograph.
                  <br className="hidden sm:inline" />
                  {' '}Nothing leaves this tab.
                </p>
              </div>
            </GlassCard>
          </RevealItem>
        </Reveal>

        {/* ---------- The four supports ---------- */}
        <Reveal as="ul" stagger={0.09} className="flex flex-col md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6 lg:flex lg:flex-col">
          {INTELLIGENCE.points.map((point, i) => (
            <RevealItem
              as="li"
              key={point.title}
              className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-slate-hair py-5 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[2.75rem_1fr] sm:gap-x-5 sm:py-6 md:border-b md:py-4 lg:py-7"
            >
              <span
                aria-hidden="true"
                className="font-mono text-[11px] leading-[1.7] tracking-[0.14em] text-copper"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div>
                <h3 className="font-display text-[14px] uppercase leading-snug tracking-[0.005em] text-charcoal sm:text-[15px]">
                  {point.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-warm sm:mt-2.5 sm:text-[14px]">
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
