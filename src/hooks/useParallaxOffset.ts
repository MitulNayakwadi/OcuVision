import { useEffect, useRef, useState } from 'react';
import { pointer, useMousePointer } from './useMousePointer';
import { useReducedMotionSafe } from './useReducedMotionSafe';

/**
 * Small mouse-parallax offset in pixels, eased on a RAF loop.
 *
 * Shares the module-level pointer store with the 3D scene, so the headline and the
 * model read the same cursor on the same frame. `strength` is the maximum travel
 * in pixels at full deflection; the sign is inverted relative to the pointer so the
 * layers separate — the type slides against the model rather than with it.
 *
 * Returns `{x: 0, y: 0}` and never starts a loop under `prefers-reduced-motion`.
 */
export function useParallaxOffset(strength = 12) {
  const reduced = useReducedMotionSafe();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useMousePointer();

  useEffect(() => {
    if (reduced) return;

    let frame = 0;

    const tick = () => {
      const targetX = -pointer.x * strength;
      const targetY = -pointer.y * strength * 0.6;

      const next = {
        x: current.current.x + (targetX - current.current.x) * 0.06,
        y: current.current.y + (targetY - current.current.y) * 0.06,
      };

      // Sub-tenth-of-a-pixel moves are invisible; skipping the setState keeps this
      // from re-rendering the hero on every frame once the cursor settles.
      if (
        Math.abs(next.x - current.current.x) > 0.05 ||
        Math.abs(next.y - current.current.y) > 0.05
      ) {
        current.current = next;
        setOffset(next);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, strength]);

  return reduced ? { x: 0, y: 0 } : offset;
}
