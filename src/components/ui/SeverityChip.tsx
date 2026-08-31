import { ADVISORY_COPY, SEVERITY_STYLES } from '@/lib/advisory';
import type { Severity } from '@/types';
import { cn } from '@/lib/cn';

/**
 * Triage state as a chip. Colour is never the only signal — the tier is spelled
 * out in text beside the dot, so the chip survives greyscale printing and CVD.
 */
export function SeverityChip({
  severity,
  label,
  size = 'md',
  className,
}: {
  severity: Severity;
  /** Overrides the default tier wording. */
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const style = SEVERITY_STYLES[severity];

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-chip border font-mono uppercase tracking-[0.1em]',
        style.bg,
        style.border,
        style.text,
        size === 'sm' ? 'h-6 px-2.5 text-[9px]' : 'h-7 px-3 text-[10px]',
        className,
      )}
    >
      <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
      {label ?? ADVISORY_COPY[severity].label}
    </span>
  );
}
