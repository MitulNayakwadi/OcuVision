import type Lenis from 'lenis';

declare global {
  interface Window {
    /** Set by <SmoothScroll> so route changes and anchor links can drive Lenis. */
    __lenis?: Lenis;
  }
}

export {};
