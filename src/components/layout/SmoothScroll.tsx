import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

/**
 * Lenis in root/window mode, driven by our own RAF loop.
 *
 * Root mode is not a preference — it is a requirement. The alternative, a
 * transformed wrapper element, moves content with a CSS transform while
 * `window.scrollY` stays at 0, which silently breaks Framer Motion's
 * `useScroll` and every `whileInView` viewport calculation on the site.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    // Honour the OS setting: smoothed inertial scrolling is exactly the kind of
    // motion `prefers-reduced-motion` is asking us not to invent.
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      // We run the loop below; never let Lenis start a second one.
      autoRaf: false,
    });

    window.__lenis = lenis;

    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [reduced]);

  return <>{children}</>;
}
