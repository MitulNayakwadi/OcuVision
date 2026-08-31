import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroCanvas } from '@/three/HeroCanvas';
import { OutlineDisplay } from '@/components/ui/OutlineDisplay';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PillLink } from '@/components/ui/PillButton';
import { HeroStatsCard } from './HeroStatsCard';
import { HeroControlPanel } from './HeroControlPanel';
import { HERO } from '@/lib/content';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useParallaxOffset } from '@/hooks/useParallaxOffset';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Two compositions in one component.
 *
 * From `lg` up the model owns the frame: outline lettering edge to edge across
 * the top, the chrome globe rising through it, and a bottom cluster of copy,
 * activity card and console laid out as a grid — a grid rather than absolute
 * placement because at 720px tall a centred card and a bottom console overlap,
 * and no magic offset survives every viewport height.
 *
 * Below `lg` nothing can float over the model, so it takes a reserved band in
 * the flow. The canvas stays absolutely positioned in both cases — it has to sit
 * outside the parallax transform to drift independently of the copy — so the
 * 19rem spacer and the 19rem canvas band are deliberately the same number:
 * change one, change both.
 */

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  // A dozen pixels of counter-travel: enough to separate the type from the model
  // in depth, small enough that nobody reads it as movement.
  const parallax = useParallaxOffset(14);

  // Root-mode Lenis keeps window.scrollY authoritative, so these offsets are
  // correct even while the smooth-scroll animation is mid-flight.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const canvasOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  // The headline drifts down as the page scrolls up: it lags the scroll, which
  // is what separates it in depth from the model.
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  const still = reduced ? {} : undefined;

  return (
    <section
      ref={heroRef}
      aria-labelledby="hero-title"
      className="relative min-h-[100svh] overflow-hidden lg:h-[100svh] lg:min-h-[680px]"
    >
      {/* ---------------- Outline display type, behind the model ---------------- */}
      <motion.div
        style={still ?? { y: headlineY, opacity: headlineOpacity }}
        className="pointer-events-none absolute inset-x-0 top-[15.5rem] z-headline px-gutter lg:top-[15vh] lg:px-container"
      >
        <motion.div
          className="mx-auto max-w-container"
          initial={reduced ? false : { opacity: 0, y: 64 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 1.15, delay: reduced ? 0 : 0.12, ease: EASE }}
        >
          {/* Mouse parallax rides on its own element: the animate/initial pair above
              owns this node's transform, and the scroll drift owns the one above it. */}
          <div
            style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}
            className="will-change-transform"
          >
            <OutlineDisplay lines={HERO.headlineLines}>{HERO.headline}</OutlineDisplay>
          </div>
        </motion.div>
      </motion.div>

      {/* ---------------- The model ---------------- */}
      <motion.div
        style={still ?? { opacity: canvasOpacity, scale: canvasScale }}
        className="absolute inset-x-0 top-[20.5rem] z-canvas h-[19rem] lg:inset-0 lg:top-0 lg:h-auto"
      >
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0 : 1.6, ease: EASE, delay: reduced ? 0 : 0.15 }}
        >
          {/* Shifted off-centre from lg so the globe clears the copy column.
              A plain div, because both wrappers above own their `transform`. */}
          <div className="absolute inset-0 lg:translate-x-[9%] lg:-translate-y-[3%]">
            <HeroCanvas />
          </div>
        </motion.div>
      </motion.div>

      {/* ---------------- Interface layer ---------------- */}
      {/* One flex column below lg, a two-column bottom-anchored grid from lg.
          Explicit row/column placement rather than a wrapper div, because the
          card belongs beside the copy at lg but below the model band on mobile,
          and a wrapper would force one order on both. */}
      <motion.div
        style={still ?? { y: contentY }}
        className="relative z-surface mx-auto flex max-w-container flex-col px-gutter pb-8 pt-[100px] lg:grid lg:h-full lg:grid-cols-[minmax(0,25rem)_1fr] lg:content-end lg:gap-x-card-gap lg:gap-y-6 lg:px-container lg:pb-7 lg:pt-[104px]"
      >
        {/* ---- Copy ---- */}
        <motion.div
          className="shrink-0 lg:col-start-1 lg:row-start-1 lg:self-end"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.32, ease: EASE }}
        >
          <Eyebrow withRule tone="vitality">
            {HERO.eyebrow}
          </Eyebrow>

          {/* The accessible heading. The outline lettering above is decorative
              duplication, so it is aria-hidden and this carries the h1. */}
          <h1 id="hero-title" className="sr-only">
            {HERO.headline} — {HERO.subhead}
          </h1>

          <p className="mt-3.5 max-w-[22rem] text-[clamp(0.9rem,1.4vw,1rem)] leading-relaxed text-slate-warm">
            {HERO.subhead}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <PillLink to="/screen" variant="dark" size="md">
              {HERO.primaryCta}
            </PillLink>
            <PillLink to="/about#solution" variant="glass" size="md">
              {HERO.secondaryCta}
            </PillLink>
          </div>

          <p className="mt-5 max-w-[20rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-slate-cool">
            {HERO.chip}
          </p>
        </motion.div>

        {/* Reserved band for the model, small screens only. */}
        <div aria-hidden="true" className="h-[19rem] shrink-0 lg:hidden" />

        {/* ---- Activity card ---- */}
        <motion.div
          className="w-full max-w-[19rem] lg:col-start-2 lg:row-start-1 lg:justify-self-end lg:self-end"
          initial={reduced ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.5, ease: EASE }}
        >
          <HeroStatsCard />
        </motion.div>

        {/* ---- Console ---- */}
        <motion.div
          className="mt-8 shrink-0 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mt-0"
          initial={reduced ? false : { opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : 0.62, ease: EASE }}
        >
          <HeroControlPanel />
        </motion.div>
      </motion.div>
    </section>
  );
}
