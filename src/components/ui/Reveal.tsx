import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-entrance wrapper. Wrap a section in <Reveal> and its <RevealItem>
 * children stagger in. Under reduced-motion both render in final state with no
 * transition, so nothing is hidden from the user.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  as = 'div',
  y = 32,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'div' | 'section' | 'ul' | 'ol' | 'header';
  y?: number;
  id?: string;
}) {
  const reduced = useReducedMotionSafe();
  const MotionTag = motion[as];

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : delay },
    },
  };

  return (
    <MotionTag
      id={id}
      className={className}
      variants={container}
      initial={reduced ? 'show' : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-80px 0px -80px 0px' }}
      style={{ '--reveal-y': `${y}px` } as React.CSSProperties}
    >
      {children}
    </MotionTag>
  );
}

const itemVariants = (reduced: boolean, y: number): Variants => ({
  hidden: { opacity: 0, y: reduced ? 0 : y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.65, ease: EASE },
  },
});

export function RevealItem({
  children,
  className,
  y = 28,
  as = 'div',
  id,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: 'div' | 'li' | 'h2' | 'h3' | 'p' | 'span' | 'article';
  id?: string;
}) {
  const reduced = useReducedMotionSafe();
  const MotionTag = motion[as];
  return (
    <MotionTag id={id} className={className} variants={itemVariants(reduced, y)}>
      {children}
    </MotionTag>
  );
}

/** One-off reveal for elements that are not inside a Reveal container. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotionSafe();
  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
