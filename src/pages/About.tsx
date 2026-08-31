import { PageHero } from '@/components/ui/PageHero';
import { WhyWeBuilt } from '@/components/about/WhyWeBuilt';
import { SolutionAccordion } from '@/components/about/SolutionAccordion';
import { MetricsPanel } from '@/components/about/MetricsPanel';
import { MissionTabs } from '@/components/about/MissionTabs';
import { ClosingCta } from '@/components/home/ClosingCta';
import { BRAND } from '@/lib/content';

/**
 * The team now lives inside MissionTabs rather than in a section of its own — the
 * brief asks for one Mission / Vision / Team / Research panel, and two separate
 * places to read about the same two people was the earlier structure's weakness.
 */
export function About() {
  return (
    <>
      <PageHero
        eyebrow="About the project"
        title="BUILT FOR THE CLINIC"
        titleLines={['BUILT FOR', 'THE CLINIC']}
        headingId="about-title"
        body={`${BRAND.researchTitle} — a research prototype that reads the optic disc in the context of the whole retina, answers one question about it properly, and ends every prediction with a next action instead of a probability.`}
        meta={[
          { label: 'Screens for', value: 'Glaucoma' },
          { label: 'Backbone', value: 'ViT-Base/16' },
          { label: 'Training corpus', value: 'EYEPACS' },
        ]}
      />

      <WhyWeBuilt />
      <SolutionAccordion />
      <MetricsPanel />
      <MissionTabs />
      <ClosingCta secondary={{ to: '/', label: 'Back to the overview' }} />
    </>
  );
}
