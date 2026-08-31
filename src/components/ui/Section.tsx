import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';
import { OutlineHeading, SolidHeading } from './OutlineHeading';
import { Reveal, RevealItem } from './Reveal';
import { cn } from '@/lib/cn';

/**
 * Standard section shell: the 120px vertical rhythm, the page gutter, and the
 * 1440px measure. Every section on every page goes through this, so the rhythm
 * is defined once instead of being re-typed as ad-hoc padding.
 */
export function Section({
  children,
  id,
  className,
  bleed = false,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Skip the inner measure — for bands that need to run full width. */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative px-gutter py-section lg:px-container',
        // Anchored sections must clear the fixed header when jumped to.
        id && 'scroll-mt-[92px]',
        className,
      )}
    >
      {bleed ? children : <div className="mx-auto max-w-container">{children}</div>}
    </section>
  );
}

/**
 * Section masthead. `outline` promotes the title to hollow display type — used
 * sparingly, since the outline treatment loses its force if every section has it.
 */
export function SectionHeader({
  eyebrow,
  title,
  body,
  outline = false,
  align = 'left',
  className,
  aside,
  titleId,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  outline?: boolean;
  align?: 'left' | 'center';
  className?: string;
  /** Right-hand column content — a CTA or a stat, aligned to the baseline. */
  aside?: ReactNode;
  titleId?: string;
}) {
  // Branched rather than a shared component variable: the two headings take
  // different props, so a union type would not accept `scale`.
  const heading = outline ? (
    <OutlineHeading id={titleId} scale="section">
      {title}
    </OutlineHeading>
  ) : (
    <SolidHeading id={titleId}>{title}</SolidHeading>
  );

  return (
    <Reveal
      as="header"
      className={cn(
        'flex flex-col gap-6',
        // ReactNode admits 0, so coerce before using `aside` as a class guard.
        aside ? 'lg:flex-row lg:items-end lg:justify-between lg:gap-card-gap' : null,
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
        <RevealItem>
          <Eyebrow withRule={align === 'left'} tone="vitality">
            {eyebrow}
          </Eyebrow>
        </RevealItem>

        <RevealItem className="mt-4">{heading}</RevealItem>

        {body && (
          <RevealItem
            as="p"
            className={cn(
              'mt-5 max-w-prose text-[15px] leading-relaxed text-slate-warm',
              align === 'center' && 'mx-auto',
            )}
          >
            {body}
          </RevealItem>
        )}
      </div>

      {aside && <RevealItem className="shrink-0">{aside}</RevealItem>}
    </Reveal>
  );
}
