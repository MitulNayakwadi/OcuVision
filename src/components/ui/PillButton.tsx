import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'dark' | 'glass' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-vitality text-white border border-[rgba(255,255,255,0.35)] hover:bg-[#F04E31] active:bg-[#DC4326]',
  dark: 'bg-charcoal text-canvas border border-[rgba(255,255,255,0.12)] hover:bg-[#2A2E2E]',
  glass:
    'glass text-charcoal hover:bg-white/90 hover:border-white',
  ghost:
    'bg-transparent text-slate-cool hover:text-charcoal hover:bg-white/60',
  outline:
    'bg-transparent text-charcoal border border-[rgba(26,28,28,0.14)] hover:border-[rgba(26,28,28,0.32)] hover:bg-white/50',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px] gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-14 px-7 text-[15px] gap-2.5',
};

const SHARED =
  'inline-flex items-center justify-center rounded-chip font-medium transition-all duration-200 ease-clinical disabled:cursor-not-allowed disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap';

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
}

export const PillButton = forwardRef<
  HTMLButtonElement,
  CommonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(function PillButton(
  { children, variant = 'primary', size = 'md', className, iconLeft, iconRight, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(SHARED, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
});

interface PillLinkProps extends CommonProps {
  to: string;
}

export function PillLink({
  children,
  to,
  variant = 'primary',
  size = 'md',
  className,
  iconLeft,
  iconRight,
  ...rest
}: PillLinkProps & Omit<LinkProps, 'to' | 'className' | 'children'>) {
  return (
    <Link
      to={to}
      className={cn(SHARED, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Link>
  );
}

/** Circular icon-only control. `label` is required — it becomes the aria-label. */
export function IconButton({
  children,
  label,
  className,
  variant = 'glass',
  size = 44,
  ...rest
}: {
  children: ReactNode;
  label: string;
  className?: string;
  variant?: Variant;
  size?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label={label}
      title={label}
      style={{ width: size, height: size }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-200 ease-clinical',
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
