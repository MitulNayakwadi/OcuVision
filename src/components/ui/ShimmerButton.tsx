import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface ShimmerButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  iconRight?: ReactNode;
}

/**
 * The primary conversion CTA. A light sweep runs across the fill continuously
 * and accelerates on hover; under reduced-motion it becomes a flat pill.
 */
export function ShimmerButton({
  children,
  to,
  onClick,
  className,
  iconRight,
}: ShimmerButtonProps) {
  const navigate = useNavigate();
  const reduced = useReducedMotionSafe();

  const handleClick = () => {
    if (onClick) onClick();
    if (to) navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-chip px-8 text-[15px] font-semibold text-white transition-transform duration-300 ease-clinical',
        !reduced && 'hover:-translate-y-0.5',
        className,
      )}
    >
      {/* Base fill keeps the pill solid if the animated layer is suppressed. */}
      <span aria-hidden="true" className="absolute inset-0 bg-vitality" />
      {!reduced && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-shimmer bg-shimmer opacity-90 [background-size:220%_100%] group-hover:[animation-duration:1.4s]"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-chip border border-white/40"
      />
      <span className="relative z-10 flex items-center gap-3 drop-shadow-[0_1px_0_rgba(120,30,10,0.35)]">
        {children}
        {iconRight}
      </span>
    </button>
  );
}
