import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Route-change scroll handling. Jumps to top on navigation, or to the hash
 * target when one is present — routed through Lenis so the motion matches the
 * rest of the site instead of hard-snapping.
 */
export function useRouteScroll(): void {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const lenis = window.__lenis;

    if (!hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    // Let the destination route paint before measuring the anchor.
    const id = window.setTimeout(() => {
      const target = document.querySelector(hash);
      if (!target) return;
      if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -120 });
      else (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }, 80);

    return () => window.clearTimeout(id);
  }, [pathname, hash]);
}
