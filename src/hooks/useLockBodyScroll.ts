import { useEffect } from 'react';

/** Freezes background scroll (and Lenis) while a modal or overlay is open. */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { overflow, paddingRight } = document.body.style;
    const gutter = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    document.documentElement.classList.add('lenis-stopped');

    // Lenis animates window scroll, so `overflow: hidden` alone will not hold it
    // — the instance has to be told to stand down.
    window.__lenis?.stop();

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      document.documentElement.classList.remove('lenis-stopped');
      window.__lenis?.start();
    };
  }, [locked]);
}
