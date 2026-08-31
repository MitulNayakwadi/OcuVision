import { GlassCard } from '@/components/ui/GlassCard';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { ArrowRight, Bolt, EyeScan, Upload } from '@/components/ui/Icons';
import { HOW_IT_WORKS } from '@/lib/content';

const ICONS = [Upload, Bolt, EyeScan];

/**
 * Three steps, left to right. The connector rail is drawn between the circular
 * markers rather than around the cards, so the strip reads as one path at every
 * breakpoint — it just turns vertical below `md`.
 */
export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeader
        eyebrow="How screening works"
        title="Three steps, about a second"
        body="No account, no upload, no waiting on a queue. The image is read in this browser tab and the report comes back before you have looked up from the camera."
        titleId="how-it-works-title"
        aside={
          <ShimmerButton to="/screen" iconRight={<ArrowRight className="h-4 w-4" />}>
            Initiate Scan Sequence
          </ShimmerButton>
        }
      />

      <Reveal as="ol" stagger={0.1} className="mt-12 grid gap-6 md:grid-cols-3">
        {HOW_IT_WORKS.map((step, i) => {
          const Icon = ICONS[i] ?? Upload;
          const last = i === HOW_IT_WORKS.length - 1;

          return (
            <RevealItem as="li" key={step.index} className="relative h-full">
              <GlassCard radius="panel" className="flex h-full flex-col p-7">
                <div className="relative flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="relative z-[1] grid h-12 w-12 shrink-0 place-items-center rounded-full bg-chrome ring-1 ring-inset ring-white/70"
                  >
                    <Icon className="h-5 w-5 text-charcoal" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-copper">
                    {step.index}
                  </span>

                  {/* Rail to the next step. Starts past the marker so nothing
                      dangles, and stops at the card edge — the gap between cards
                      completes the line visually. */}
                  {!last && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[3.75rem] right-[-2.75rem] top-1/2 hidden h-[2px] -translate-y-1/2 bg-slate-hair md:block"
                    />
                  )}
                </div>

                <h3 className="mt-6 font-display text-[15px] uppercase leading-tight text-charcoal">
                  {step.title}
                </h3>
                <p className="mt-3.5 flex-1 text-[13.5px] leading-relaxed text-slate-warm">
                  {step.body}
                </p>
              </GlassCard>
            </RevealItem>
          );
        })}
      </Reveal>
    </Section>
  );
}
