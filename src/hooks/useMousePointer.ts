import { useEffect, useRef } from 'react';

export interface PointerState {
  /** Normalised −1 → 1, left → right. */
  x: number;
  /** Normalised −1 → 1, top → bottom. */
  y: number;
  /** performance.now() of the last real movement. */
  lastMove: number;
  /** False until the user has actually moved a pointer (touch devices stay false). */
  active: boolean;
}

/**
 * Module-level singleton. React Three Fiber renders into its own reconciler root,
 * so sharing pointer state through React context would need an explicit bridge.
 * A single store that both trees read from is simpler and — because it is written
 * imperatively rather than through setState — costs zero re-renders per frame.
 */
export const pointer: PointerState = { x: 0, y: 0, lastMove: 0, active: false };

let listeners = 0;
let detach: (() => void) | null = null;

function attach() {
  const onMove = (event: PointerEvent) => {
    // Ignore coarse pointers: a finger "position" is meaningless between taps.
    if (event.pointerType === 'touch') return;
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    pointer.lastMove = performance.now();
    pointer.active = true;
  };

  const onLeave = () => {
    pointer.active = false;
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerleave', onLeave);

  detach = () => {
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
  };
}

/** Subscribes the calling component to the shared pointer store. */
export function useMousePointer(): PointerState {
  const ref = useRef(pointer);

  useEffect(() => {
    listeners += 1;
    if (listeners === 1) attach();
    return () => {
      listeners -= 1;
      if (listeners === 0 && detach) {
        detach();
        detach = null;
      }
    };
  }, []);

  return ref.current;
}
