import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { WHY_WE_BUILT } from '@/lib/content';

/**
 * The four premises the architecture had to answer. Laid out as a hairline grid
 * — a 1px background showing through a `gap-px` — so the cells read as one
 * instrument panel rather than four floating cards.
 */
export function WhyWeBuilt() {
  return (
    <Section id="why">
      <SectionHeader
        eyebrow="Motivation"
        title="Why We Built This"
        titleId="why-title"
        body="Four observations about glaucoma shaped the system. Each is a constraint the architecture had to answer — the reason for a transformer backbone, a two-class head and an advisory layer, rather than a preference."
      />

      <Reveal
        as="ul"
        stagger={0.08}
        className="mt-10 sm:mt-16 grid gap-px overflow-hidden rounded-panel bg-slate-hair sm:grid-cols-2"
      >
        {WHY_WE_BUILT.map((item) => (
          <RevealItem
            as="li"
            key={item.number}
            className="flex flex-col bg-white/60 p-6 sm:p-8 backdrop-blur-[18px] lg:p-10"
          >
            <div className="flex items-baseline gap-4">
              <span
                aria-hidden="true"
                className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none text-copper"
              >
                {item.number}
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 translate-y-[-0.35em] bg-slate-hair"
              />
            </div>

            <h3 className="mt-6 font-display text-[clamp(1.05rem,2vw,1.3rem)] uppercase leading-tight text-charcoal">
              {item.title}
            </h3>

            <p className="mt-4 text-[14px] leading-relaxed text-slate-warm">{item.body}</p>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
