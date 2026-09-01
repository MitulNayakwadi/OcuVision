import { Section, SectionHeader } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Accordion } from '@/components/ui/Accordion';
import { FadeIn } from '@/components/ui/Reveal';
import { PIPELINE_STEPS, SOLUTION_INTRO } from '@/lib/content';

/**
 * The inference path, stage by stage. The accordion keeps the whole chain visible
 * as a list of titles while only one stage's detail and tensor shape is open —
 * the shape of the data is the through-line, so every panel states it.
 */
export function SolutionAccordion() {
  return (
    <Section id="solution">
      <SectionHeader
        eyebrow="Our solution"
        title="From Pixels To A Triage Window"
        titleId="solution-title"
        body={SOLUTION_INTRO}
      />

      <FadeIn className="mt-10 sm:mt-14">
        <GlassCard radius="panel" className="px-4 py-2 sm:px-9 sm:py-4">
          <Accordion steps={PIPELINE_STEPS} />
        </GlassCard>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-8">
        <p className="max-w-prose text-[13px] leading-relaxed text-slate-cool">
          Tensor shapes are for the reference configuration: a 224×224 input, 16×16
          patches, a 768-dimensional embedding and twelve encoder blocks. Changing the
          input resolution changes the sequence length, not the architecture.
        </p>
      </FadeIn>
    </Section>
  );
}
