import { lazy, Suspense } from 'react';
import { CanvasFallback } from './CanvasFallback';
import { useMousePointer } from '@/hooks/useMousePointer';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useLowPowerDevice, useWebGLSupport } from '@/hooks/useWebGLSupport';

// Code-split: three.js + drei is the largest chunk in the app and must not sit
// on the critical path for the headline.
const EyeScene = lazy(() => import('./EyeScene'));

/**
 * Capability gate for the hero model.
 *
 * No WebGL, or an explicit reduced-motion preference → the CSS eye, which costs
 * nothing to download. Otherwise the real scene, in simplified form on phones
 * and low-core machines.
 */
export function HeroCanvas() {
  const webgl = useWebGLSupport();
  const reduced = useReducedMotionSafe();
  const lowPower = useLowPowerDevice();

  // Attach the shared pointer listener once, here, for the whole hero.
  useMousePointer();

  // `null` means the probe has not resolved yet — render the fallback rather
  // than an empty box, so there is never a blank frame.
  if (webgl !== true || reduced) {
    return <CanvasFallback />;
  }

  return (
    <Suspense fallback={<CanvasFallback />}>
      <EyeScene simplified={lowPower} reducedMotion={reduced} className="!absolute inset-0" />
    </Suspense>
  );
}
