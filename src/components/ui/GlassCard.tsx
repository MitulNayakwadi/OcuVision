import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'default' | 'solid' | 'well';

const VARIANTS: Record<Variant, string> = {
  default: 'glass',
  solid: 'glass-solid',
  well: 'glass-well',
};

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  /** Renders as <article>/<section> etc. when the card is a landmark. */
  as?: 'div' | 'section' | 'article' | 'aside' | 'li';
  radius?: 'card' | 'panel';
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  as: Tag = 'div',
  radius = 'card',
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        VARIANTS[variant],
        radius === 'panel' ? 'rounded-panel' : 'rounded-card',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
