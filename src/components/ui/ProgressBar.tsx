import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface ProgressBarProps {
  label: string;
  display: string;
  /** 0–100 fill percentage. */
  value: number;
  caption?: string;
  className?: string;
  tone?: 'vitality' | 'copper' | 'charcoal';
}

const TONES = {
  vitality: 'bg-vitality',
  copper: 'bg-copper',
  charcoal: 'bg-charcoal-soft',
};

/**
 * Metric bar that fills on scroll-into-view. The numeric value is always
 * rendered as text, so the bar is decoration rather than the only encoding.
 */
export function ProgressBar({
  label,
  display,
  value,
  caption,
  className,
  tone = 'vitality',
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotionSafe();

  return (
    <div ref={ref} className={cn('w-full', className)}>
      <div className="mb-2.5 flex items-baseline justify-between gap-4">
        <span className="text-[13px] font-medium text-slate-warm">{label}</span>
        <span className="font-display text-[clamp(1.1rem,2vw,1.5rem)] leading-none text-charcoal">
          {display}
        </span>
      </div>

      <div
        role="meter"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${display}`}
        className="h-2 w-full overflow-hidden rounded-chip bg-[rgba(26,28,28,0.07)]"
      >
        <motion.div
          className={cn('h-full rounded-chip', TONES[tone])}
          initial={{ width: reduced ? `${value}%` : 0 }}
          animate={inView ? { width: `${value}%` } : undefined}
          transition={{
            duration: reduced ? 0 : 1.1,
            ease: [0.22, 1, 0.36, 1],
            delay: reduced ? 0 : 0.1,
          }}
        />
      </div>

      {caption && (
        <p className="mt-2 text-[12px] leading-snug text-slate-cool">{caption}</p>
      )}
    </div>
  );
}
