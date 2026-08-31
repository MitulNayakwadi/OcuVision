import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SceneLighting } from './SceneLighting';
import { EyeModel } from './EyeModel';

interface EyeSceneProps {
  simplified?: boolean;
  reducedMotion?: boolean;
  className?: string;
}

/**
 * Loading state for the GLB. A chrome-gradient disc on the model's own mark,
 * breathing — the shape that is about to appear, rather than a spinner hanging in
 * empty 3D space. Rendered through drei's `Html` because the fallback has to sit
 * inside the Canvas to be a Suspense boundary for the loader.
 */
function LoadingFallback() {
  return (
    <Html center prepend style={{ pointerEvents: 'none' }}>
      <div
        role="status"
        aria-label="Loading the eye model"
        className="grid h-[clamp(11rem,26vw,19rem)] w-[clamp(11rem,26vw,19rem)] animate-breathe place-items-center rounded-full bg-chrome blur-[2px]"
      >
        <span className="h-[42%] w-[42%] rounded-full bg-[radial-gradient(circle_at_38%_34%,rgba(184,122,75,0.55),rgba(26,28,28,0.65)_62%)]" />
      </div>
    </Html>
  );
}

/**
 * The hero canvas. Deliberately non-interactive as far as the DOM is concerned:
 * `pointer-events-none` lets the headline and buttons underneath stay clickable
 * while the model still tracks the cursor through the global pointer store.
 */
export function EyeScene({
  simplified = false,
  reducedMotion = false,
  className,
}: EyeSceneProps) {
  return (
    <Canvas
      className={className}
      // Capped at 1.5×: chrome is all specular, so the extra samples of a 3× phone
      // display are indistinguishable and cost most of the fill rate.
      dpr={[1, simplified ? 1.25 : 1.5]}
      camera={{ position: [0, 0, 6.4], fov: 35, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.18,
      }}
      // The model breathes and drifts continuously, so there is no still frame
      // to freeze on — a demand loop would just add stutter.
      frameloop={reducedMotion ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Suspense fallback={<LoadingFallback />}>
        <SceneLighting simplified={simplified} />
        <EyeModel simplified={simplified} />
      </Suspense>
    </Canvas>
  );
}

export default EyeScene;
