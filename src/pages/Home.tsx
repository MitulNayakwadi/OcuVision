import { Hero } from '@/components/home/Hero';
import { IntelligencePanel } from '@/components/home/IntelligencePanel';
import { DiagnosticSection } from '@/components/home/DiagnosticSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { StatisticsSection } from '@/components/home/StatisticsSection';
import { ScopeSection } from '@/components/home/ScopeSection';
import { ModalityBand } from '@/components/home/ModalityBand';
import { DatasetSection } from '@/components/home/DatasetSection';
import { ClosingCta } from '@/components/home/ClosingCta';

/**
 * Home reads as one argument: the claim, why a transformer, what glaucoma looks
 * like to the model, how a screening run goes, what the console has been seeing,
 * what is deliberately out of scope, the imaging, the training data — then the call
 * to action.
 *
 * The scope section sits before the dataset rather than at the end on purpose: a
 * reader who bounces halfway should still have seen what the model does not detect.
 */
export function Home() {
  return (
    <>
      <Hero />
      <IntelligencePanel />
      <DiagnosticSection />
      <HowItWorks />
      <StatisticsSection />
      <ScopeSection />
      <ModalityBand />
      <DatasetSection />
      <ClosingCta />
    </>
  );
}
