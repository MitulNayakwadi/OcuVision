import { GlassCard } from '@/components/ui/GlassCard';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { AlertTriangle, Check, Compass } from '@/components/ui/Icons';
import { ROADMAP } from '@/lib/glaucoma';
import { SCOPE } from '@/lib/content';

/**
 * The scope statement, given a section of its own rather than a footnote.
 *
 * The dangerous failure mode for a single-disease screening tool is a clinician
 * reading a negative result as a clear retina, so what the model does *not* detect
 * gets the same visual weight as what it does — a dashed-border grid that reads as
 * unfinished on purpose.
 */
export function ScopeSection() {
  return (
    <Section id="scope">
      <SectionHeader
        eyebrow={SCOPE.eyebrow}
        title={SCOPE.title}
        body={SCOPE.detects}
        titleId="scope-title"
      />

      <Reveal className="mt-10 sm:mt-12">
        <RevealItem>
          <div className="grid gap-6 lg:gap-card-gap lg:grid-cols-[0.9fr_1.1fr]">
            {/* ---- In scope ---- */}
            <GlassCard radius="panel" className="flex flex-col p-6 sm:p-7 lg:p-8">
              <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-advisory-routine">
                <Check className="h-3.5 w-3.5" />
                Detected in this version
              </p>

              <h3 className="mt-5 font-display text-[clamp(1.35rem,2.6vw,1.9rem)] uppercase leading-tight text-charcoal">
                Glaucoma
              </h3>

              <ul className="mt-6 space-y-3">
                {[
                  'Binary verdict — glaucoma present or absent',
                  'Estimated vertical cup-to-disc ratio',
                  'Severity stage: early, moderate or advanced',
                  'Triage window and next clinical action',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-[13.5px] leading-snug text-charcoal">
                    <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-advisory-routine" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-auto pt-8">
                <span className="block rounded-card border border-[#BA1A1A]/20 bg-[#BA1A1A]/[0.06] p-4 text-[12px] leading-relaxed text-slate-warm">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mb-2 h-3.5 w-3.5 text-danger"
                  />
                  {SCOPE.note}
                </span>
              </p>
            </GlassCard>

            {/* ---- Out of scope ---- */}
            <div>
              <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-copper">
                <Compass className="h-3.5 w-3.5" />
                Roadmap — not detected
              </p>

              <p className="mt-4 max-w-prose text-[13.5px] leading-relaxed text-slate-warm">
                {SCOPE.excludes}
              </p>

              <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                {ROADMAP.map((condition) => (
                  <li key={condition.id}>
                    <GlassCard
                      as="article"
                      variant="well"
                      className="flex h-full flex-col border-dashed p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-display text-[13px] uppercase leading-tight text-charcoal">
                          {condition.name}
                        </h4>
                        <span className="shrink-0 rounded-chip border border-slate-hair px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-slate-cool">
                          v2+
                        </span>
                      </div>

                      <p className="mt-3 flex-1 text-[12px] leading-relaxed text-slate-warm">
                        {condition.note}
                      </p>

                      <p className="mt-4 border-t border-slate-hair pt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-cool">
                        {condition.modality === 'Either'
                          ? 'Fundus · FFA'
                          : condition.modality === 'FFA'
                            ? 'FFA'
                            : 'Colour fundus'}
                      </p>
                    </GlassCard>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </RevealItem>
      </Reveal>
    </Section>
  );
}
