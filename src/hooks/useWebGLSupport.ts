import { useEffect, useState } from 'react';

/**
 * Probes for a usable WebGL context once, on mount. Returning `null` while the
 * probe runs lets callers render the static fallback rather than flashing an
 * empty canvas frame.
 */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    let ok = false;
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl');
      ok = Boolean(gl);
      // Release the probe context immediately — browsers cap concurrent contexts.
      if (gl && 'getExtension' in gl) {
        (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
      }
    } catch {
      ok = false;
    }
    setSupported(ok);
  }, []);

  return supported;
}

/** Coarse device-capability check used to shed geometry and samples on phones. */
export function useLowPowerDevice(): boolean {
  const [low, setLow] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 767px)').matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    setLow(narrow || cores <= 4);
  }, []);

  return low;
}
