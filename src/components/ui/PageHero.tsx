import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';
import { OutlineDisplay } from './OutlineDisplay';
import { Reveal, RevealItem } from './Reveal';
import { cn } from '@/lib/cn';

/**
 * Page masthead for the routes that have no 3D hero. The headline is drawn as
 * fit-to-width outline type so it always sets on one line at the container's
 * measure, with a real `<h1>` alongside it for the accessibility tree.
 */
export function PageHero({
  eyebrow,
  title,
  titleLines,
  headingId,
  body,
  meta,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  /** Hand-broken version of `title` for narrow screens. See `OutlineDisplay`. */
  titleLines?: string[];
  headingId?: string;
  body: string;
  meta?: { label: string; value: string }[];
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden px-gutter pb-10 pt-[100px] sm:pb-14 sm:pt-[124px] lg:px-container lg:pb-20 lg:pt-[156px]',
        className,
      )}
    >
      {/* Warm bloom, mirroring the hero's ambient field on the deeper pages. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-4 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(255,90,60,0.15),transparent_68%)] blur-2xl"
      />

      <div className="relative mx-auto max-w-container">
        <Reveal>
          <RevealItem>
            <Eyebrow withRule tone="vitality">
              {eyebrow}
            </Eyebrow>
          </RevealItem>

          {/* The visible headline is drawn type; this is the one screen readers get. */}
          <h1 id={headingId} className="sr-only">
            {title}
          </h1>

          <RevealItem className="mt-6" y={40}>
            <OutlineDisplay strokeWidth={2} lines={titleLines}>
              {title}
            </OutlineDisplay>
          </RevealItem>

          <div className="mt-8 flex flex-col gap-6 border-t border-slate-hair pt-6 sm:mt-11 sm:gap-8 sm:pt-8 lg:flex-row lg:items-start lg:justify-between lg:gap-card-gap">
            <RevealItem
              as="p"
              className="max-w-prose text-[14.5px] leading-relaxed text-slate-warm sm:text-[15.5px]"
            >
              {body}
            </RevealItem>

            {meta && (
              <RevealItem className="shrink-0">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-5 lg:justify-end">
                  {meta.map((entry) => (
                    <div key={entry.label} className="min-w-0 sm:min-w-[7.5rem]">
                      <dt className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-cool">
                        {entry.label}
                      </dt>
                      <dd className="mt-1 font-display text-[13.5px] uppercase leading-tight text-charcoal sm:mt-1.5 sm:text-[14.5px]">
                        {entry.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </RevealItem>
            )}

            {aside && <RevealItem className="shrink-0">{aside}</RevealItem>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
