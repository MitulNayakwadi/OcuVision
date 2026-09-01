import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroCanvas } from '@/three/HeroCanvas';
import { OutlineDisplay } from '@/components/ui/OutlineDisplay';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { PillLink } from '@/components/ui/PillButton';
import { HeroControlPanel } from './HeroControlPanel';
import { HERO } from '@/lib/content';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useParallaxOffset } from '@/hooks/useParallaxOffset';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Responsive hero composition.
 *
 * From `md` (tablet) and `lg` (desktop) up:
 * The 3D model and outline lettering own the background layer with parallax
 * drift, while copy and the console are arranged with clean visual depth.
 *
 * Below `md` (mobile):
 * The model sits in its own dedicated, responsive showcase container within
 * the flow between copy and the control panel.
 */
export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const isMdOrUp = useMediaQuery('(min-width: 768px)');
  const parallax = useParallaxOffset(14);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const canvasOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  const still = reduced ? {} : undefined;

  return (
    <section
      ref={heroRef}
      aria-labelledby="hero-title"
      className="relative min-h-[100svh] overflow-hidden md:min-h-[720px] lg:h-[100svh] lg:min-h-[680px]"
    >
      {/* ---------------- Tablet/Desktop (md+): Outline display type ---------------- */}
      {isMdOrUp && (
        <motion.div
          style={still ?? { y: headlineY, opacity: headlineOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[12vh] z-headline px-container lg:top-[15vh]"
        >
          <motion.div
            className="mx-auto max-w-container"
            initial={reduced ? false : { opacity: 0, y: 64 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 1.15, delay: reduced ? 0 : 0.12, ease: EASE }}
          >
            <div
              style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)` }}
              className="will-change-transform"
            >
              <OutlineDisplay lines={HERO.headlineLines}>{HERO.headline}</OutlineDisplay>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ---------------- Tablet/Desktop (md+): Background 3D Model ---------------- */}
      {isMdOrUp && (
        <motion.div
          style={still ?? { opacity: canvasOpacity, scale: canvasScale }}
          className="absolute inset-0 z-canvas"
        >
          <motion.div
            className="absolute inset-0"
            initial={reduced ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0 : 1.6, ease: EASE, delay: reduced ? 0 : 0.15 }}
          >
            <div className="absolute inset-0 md:translate-x-[8%] md:-translate-y-[2%] lg:translate-x-[9%] lg:-translate-y-[3%]">
              <HeroCanvas />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ---------------- Interface layer ---------------- */}
      <motion.div
        style={still ?? { y: contentY }}
        className="relative z-surface mx-auto flex max-w-container flex-col justify-end px-gutter pb-8 pt-[88px] sm:pt-[96px] md:h-full md:px-container md:pb-7 md:pt-[104px]"
      >
        {/* ---- Copy ---- */}
        <motion.div
          className="shrink-0 max-w-[28rem] lg:max-w-[32rem]"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.32, ease: EASE }}
        >
          <Eyebrow withRule tone="vitality">
            {HERO.eyebrow}
          </Eyebrow>

          <h1 id="hero-title" className="sr-only">
            {HERO.headline} — {HERO.subhead}
          </h1>

          <p className="mt-3.5 max-w-[26rem] text-[clamp(0.9rem,1.4vw,1.05rem)] leading-relaxed text-slate-warm">
            {HERO.subhead}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <PillLink to="/screen" variant="dark" size="md" className="w-full sm:w-auto">
              {HERO.primaryCta}
            </PillLink>
            <PillLink to="/about#solution" variant="glass" size="md" className="w-full sm:w-auto">
              {HERO.secondaryCta}
            </PillLink>
          </div>

          <p className="mt-5 max-w-[22rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-slate-cool">
            {HERO.chip}
          </p>
        </motion.div>

        {/* ---- Mobile Model Showcase (< md only) ---- */}
        {!isMdOrUp && (
          <div className="relative my-4 flex h-[17rem] w-full items-center justify-center overflow-hidden rounded-panel md:hidden">
            {/* Ambient outline behind the eye */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-headline px-2 opacity-35">
              <OutlineDisplay lines={HERO.headlineLines}>{HERO.headline}</OutlineDisplay>
            </div>
            <div className="relative z-canvas h-full w-full">
              <HeroCanvas />
            </div>
          </div>
        )}

        {/* ---- Console ---- */}
        <motion.div
          className="mt-6 md:mt-8 shrink-0 w-full"
          initial={reduced ? false : { opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : 0.5, ease: EASE }}
        >
          <HeroControlPanel />
        </motion.div>
      </motion.div>
    </section>
  );
}
