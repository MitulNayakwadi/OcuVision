import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Weight = 'hero' | 'strong' | 'thin';
type Scale = 'hero' | 'section' | 'panel';

const WEIGHTS: Record<Weight, string> = {
  hero: 'text-outline',
  strong: 'text-outline-strong',
  thin: 'text-outline-thin',
};

const SCALES: Record<Scale, string> = {
  // Capped so "CLARITY BEGINS HERE" (~11.8em in Archivo Black) still sets on a
  // single line inside the 1440px container.
  hero: 'text-[clamp(2.4rem,7.4vw,7rem)] leading-[0.88] tracking-[-0.02em]',
  section: 'text-[clamp(2.2rem,6vw,5.2rem)] leading-[0.9] tracking-[-0.015em]',
  panel: 'text-[clamp(1.6rem,3.4vw,2.8rem)] leading-[0.95] tracking-[-0.01em]',
};

/**
 * Massive outline-stroke display type. No fill, so the 3D scene and the ambient
 * gradient read straight through the letterforms.
 */
export function OutlineHeading({
  children,
  as: Tag = 'h2',
  weight = 'strong',
  scale = 'section',
  className,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  weight?: Weight;
  scale?: Scale;
  className?: string;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        'font-display uppercase',
        WEIGHTS[weight],
        SCALES[scale],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Filled counterpart, for headings that sit on glass rather than over the scene. */
export function SolidHeading({
  children,
  as: Tag = 'h2',
  className,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        'font-display uppercase text-charcoal text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.02] tracking-[-0.01em]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
