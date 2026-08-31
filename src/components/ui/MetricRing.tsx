import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface MetricRingProps {
  /** 0–100. */
  value: number;
  /** Text rendered inside the ring — always present, never colour-alone. */
  display: string;
  label: string;
  note?: string;
  size?: number;
  tone?: string;
  className?: string;
}

/**
 * Circular metric motif. The ring is drawn as an SVG arc so the stroke stays
 * crisp at any size, and the figure inside is real text for screen readers.
 */
export function MetricRing({
  value,
  display,
  label,
  note,
  size = 132,
  tone = '#FF5A3C',
  className,
}: MetricRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const reduced = useReducedMotionSafe();

  const stroke = 6;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);

  return (
    <div ref={ref} className={cn('flex items-center gap-4', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(26,28,28,0.08)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={tone}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: reduced ? offset : circumference }}
            animate={inView ? { strokeDashoffset: offset } : undefined}
            transition={{ duration: reduced ? 0 : 1.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display text-[clamp(1.05rem,2vw,1.4rem)] leading-none text-charcoal">
            {display}
          </span>
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-eyebrow font-semibold uppercase text-slate-cool">{label}</p>
        {note && <p className="mt-1 text-[12px] leading-snug text-slate-warm">{note}</p>}
      </div>
    </div>
  );
}
