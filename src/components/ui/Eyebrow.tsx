import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Uppercase wide-tracked micro-label. Used above every section heading. */
export function Eyebrow({
  children,
  className,
  withRule = false,
  tone = 'cool',
}: {
  children: ReactNode;
  className?: string;
  withRule?: boolean;
  tone?: 'cool' | 'vitality' | 'warm';
}) {
  const tones = {
    cool: 'text-slate-cool',
    vitality: 'text-vitality-ink',
    warm: 'text-slate-warm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 font-sans text-eyebrow font-semibold uppercase',
        tones[tone],
        className,
      )}
    >
      {withRule && (
        <span
          aria-hidden="true"
          className="h-px w-8 bg-current opacity-40"
        />
      )}
      {children}
    </span>
  );
}
