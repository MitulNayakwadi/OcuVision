import { useCallback, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { LogoMark, Menu, ArrowRight } from '@/components/ui/Icons';
import { IconButton, PillLink } from '@/components/ui/PillButton';
import { ProfileDropdown } from './ProfileDropdown';
import { NavOverlay, type NavItem } from './NavOverlay';
import { BRAND } from '@/lib/content';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

const NAV: NavItem[] = [
  { label: 'Overview', to: '/' },
  { label: 'Screening', to: '/screen' },
  { label: 'About', to: '/about' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const reduced = useReducedMotionSafe();

  // Stable identity: useFocusTrap keys its effect on the escape handler, and a
  // fresh closure every render would re-trap and steal focus on each keystroke.
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Threshold rather than a continuous transform: the header either floats over
  // the hero or it is a glass bar, and the in-between states look like a bug.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-header transition-all duration-300 ease-clinical',
          scrolled
            ? 'border-b border-slate-hair bg-canvas/72 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent',
        )}
      >
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between gap-6 px-gutter lg:px-container">
          {/* ---------- Brand ---------- */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label={`${BRAND.name} home`}
          >
            <LogoMark className="h-9 w-9 transition-transform duration-300 ease-clinical group-hover:scale-105" />
            <span className="font-display text-[15px] uppercase tracking-[0.01em] text-charcoal">
              {BRAND.name}
            </span>
          </Link>

          {/* ---------- Centre nav ---------- */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="glass flex items-center gap-1 rounded-chip p-1.5">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.to === '/'} className="block">
                    {({ isActive }) => (
                      <span
                        className={cn(
                          'relative flex h-9 items-center rounded-chip px-4 text-[13px] font-medium transition-colors duration-200',
                          isActive
                            ? 'text-canvas'
                            : 'text-slate-cool hover:text-charcoal',
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-pill"
                            aria-hidden="true"
                            className="absolute inset-0 rounded-chip bg-charcoal"
                            transition={
                              reduced
                                ? { duration: 0 }
                                : { type: 'spring', stiffness: 420, damping: 34 }
                            }
                          />
                        )}
                        <span className="relative">{item.label}</span>
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Right cluster ---------- */}
          <div className="flex shrink-0 items-center gap-2.5">
            <PillLink
              to="/screen"
              variant="primary"
              size="md"
              className="hidden md:inline-flex"
              iconRight={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Start Screening
            </PillLink>

            <ProfileDropdown />

            {/* The overlay carries the same three destinations as the centre nav,
                so the trigger is hidden once that nav is visible. */}
            <IconButton
              label="Open menu"
              variant="dark"
              className="lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
            >
              <Menu className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </header>

      <NavOverlay open={menuOpen} onClose={closeMenu} items={NAV} />
    </>
  );
}
