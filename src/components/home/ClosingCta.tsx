import { OutlineDisplay } from '@/components/ui/OutlineDisplay';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { PillLink } from '@/components/ui/PillButton';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowRight } from '@/components/ui/Icons';
import { DISCLAIMER } from '@/lib/content';

/**
 * Closing call to action. The second and last outline-display moment on the page —
 * it bookends the hero, and holding the treatment back until here is what keeps it
 * from becoming wallpaper.
 *
 * `secondary` exists because the band closes both pages, and offering "read the
 * research" to someone already on the research page is a dead end.
 */
export function ClosingCta({
  secondary = { to: '/about', label: 'Read the research' },
}: {
  secondary?: { to: string; label: string };
}) {
  return (
    <section
      aria-labelledby="closing-title"
      className="relative overflow-hidden px-gutter py-14 sm:py-20 lg:py-section lg:px-container"
    >
      {/* Warm bloom, echoing the hero's ambient light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,90,60,0.14),rgba(184,122,75,0.06)_45%,transparent_70%)] blur-2xl"
      />

      <Reveal className="relative mx-auto flex max-w-container flex-col items-center text-center">
        <RevealItem>
          <Eyebrow tone="vitality">Start screening</Eyebrow>
        </RevealItem>

        <h2 id="closing-title" className="sr-only">
          Screen a retinal image
        </h2>

        <RevealItem className="mt-6 sm:mt-8 w-full">
          <OutlineDisplay strokeWidth={2} lines={['SCREEN', 'AN IMAGE']}>
            SCREEN AN IMAGE
          </OutlineDisplay>
        </RevealItem>

        <RevealItem
          as="p"
          className="mt-6 sm:mt-10 max-w-xl text-[14px] sm:text-[15px] leading-relaxed text-slate-warm"
        >
          Drop in a colour fundus photograph or an angiogram frame and get a graded
          class, an attention map and a triage window — in about the time it takes to
          look up from the camera.
        </RevealItem>

        <RevealItem className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <ShimmerButton to="/screen" iconRight={<ArrowRight className="h-4 w-4" />} className="w-full sm:w-auto">
            Initiate Scan Sequence
          </ShimmerButton>
          <PillLink to={secondary.to} variant="outline" size="lg" className="w-full sm:w-auto text-center justify-center">
            {secondary.label}
          </PillLink>
        </RevealItem>

        <RevealItem
          as="p"
          className="mt-12 max-w-2xl border-t border-slate-hair pt-7 text-[11.5px] leading-relaxed text-slate-cool"
        >
          {DISCLAIMER}
        </RevealItem>
      </Reveal>
    </section>
  );
}
