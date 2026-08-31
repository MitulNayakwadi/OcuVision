import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SmoothScroll } from './SmoothScroll';
import { useRouteScroll } from '@/hooks/useRouteScroll';

export function Layout() {
  useRouteScroll();

  return (
    <SmoothScroll>
      {/* Skip link: the hero canvas sits between the header and the content. */}
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-modal focus-visible:rounded-chip focus-visible:bg-charcoal focus-visible:px-5 focus-visible:py-3 focus-visible:text-sm focus-visible:text-canvas"
      >
        Skip to content
      </a>

      <div className="ambient-field relative min-h-screen">
        <Header />
        <main id="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
