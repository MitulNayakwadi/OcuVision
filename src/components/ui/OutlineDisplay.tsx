import { useEffect, useLayoutEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/** Font size used for measurement. The SVG scales, so this is only a unit basis. */
const BASE = 100;
const FAMILY = '"Archivo Black", Impact, sans-serif';

/** Rough per-character advance, used only before the real measurement lands. */
const ESTIMATED_ADVANCE = 0.63;
const ESTIMATED_HEIGHT = 0.76;

interface Box {
  width: number;
  ascent: number;
  descent: number;
}

function estimate(text: string): Box {
  return {
    width: text.length * ESTIMATED_ADVANCE * BASE,
    ascent: ESTIMATED_HEIGHT * BASE,
    descent: 0,
  };
}

/**
 * Measures the glyph run at `BASE` px so the SVG viewBox can be an exact fit.
 * A tight box is the whole point: it means `width: 100%` renders the line at
 * precisely the container width, with no leading above the caps and no wrap.
 */
function measure(text: string): Box | null {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return null;

  ctx.font = `${BASE}px ${FAMILY}`;
  const m = ctx.measureText(text);
  if (!m.width) return null;

  // actualBoundingBox* is the inked extent, which is what we want for all-caps:
  // it excludes the font's internal leading entirely.
  const ascent = m.actualBoundingBoxAscent || ESTIMATED_HEIGHT * BASE;
  const descent = Math.max(m.actualBoundingBoxDescent, 0);
  return { width: m.width, ascent, descent };
}

interface LineProps {
  text: string;
  className?: string;
  strokeWidth: number;
  stroke: string;
  title?: string;
}

/**
 * One line of outline type, fitted to its container's width.
 *
 * CSS `clamp(…vw…)` cannot promise this: the breakpoint at which a given string
 * wraps depends on the glyph widths, so every headline needs its own hand-tuned
 * cap and any copy edit re-breaks it. Here the run is measured once and drawn
 * into a tight `viewBox`, so the type scales with the container instead of with
 * the viewport, and the line can never break.
 *
 * The stroke is `non-scaling-stroke`, so its weight stays constant in device
 * pixels however far the geometry is scaled — and unlike `-webkit-text-stroke`
 * this renders in every browser, Firefox included.
 */
function FittedLine({ text, className, strokeWidth, stroke, title }: LineProps) {
  const [box, setBox] = useState<Box>(() => estimate(text));

  useLayoutEffect(() => {
    const next = measure(text);
    if (next) setBox(next);
  }, [text]);

  // Webfonts arrive after first paint on a cold cache, and the fallback's metrics
  // are not the same shape — so re-measure once Archivo Black is actually there.
  useEffect(() => {
    let cancelled = false;
    const remeasure = () => {
      if (cancelled) return;
      const next = measure(text);
      if (next) setBox(next);
    };

    document.fonts
      ?.load(`${BASE}px "Archivo Black"`)
      .then(remeasure)
      .catch(() => {});
    document.fonts?.ready.then(remeasure).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [text]);

  const height = box.ascent + box.descent;

  return (
    <svg
      viewBox={`0 0 ${box.width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      className={cn('block w-full overflow-visible', className)}
      shapeRendering="geometricPrecision"
    >
      <text
        x={box.width / 2}
        y={box.ascent}
        textAnchor="middle"
        fontFamily={FAMILY}
        fontSize={BASE}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      >
        {text}
      </text>
    </svg>
  );
}

/**
 * Outline display type that always sets on exactly one line, filling its
 * container's width edge to edge.
 *
 * `lines` supplies a hand-broken version used below `sm`. Fitting to width means
 * a long run on a 400px screen sets at around 28px cap height — technically
 * correct and no longer display type. Breaking it into two or three lines there
 * restores the scale, and the single fitted line returns from `sm` up.
 */
export function OutlineDisplay({
  children,
  lines,
  className,
  strokeWidth = 2,
  stroke = 'rgba(26, 28, 28, 0.3)',
  title,
}: {
  children: string;
  /** Narrow-viewport line break. Omit to keep one line at every width. */
  lines?: string[];
  className?: string;
  strokeWidth?: number;
  stroke?: string;
  /** Set only when the text is not duplicated by a real heading elsewhere. */
  title?: string;
}) {
  const line = (
    <FittedLine
      text={children}
      className={className}
      strokeWidth={strokeWidth}
      stroke={stroke}
      title={title}
    />
  );

  if (!lines) return line;

  return (
    <>
      <div
        className="flex flex-col gap-1.5 sm:hidden"
        role={title ? 'img' : undefined}
        aria-label={title}
      >
        {lines.map((text) => (
          <FittedLine
            key={text}
            text={text}
            className={className}
            strokeWidth={strokeWidth}
            stroke={stroke}
          />
        ))}
      </div>
      <div className="hidden sm:block">{line}</div>
    </>
  );
}
