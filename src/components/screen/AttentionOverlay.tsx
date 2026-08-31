import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers } from '@/components/ui/Icons';
import type { AttentionRegion, UploadedImage } from '@/types';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

/**
 * The submitted image with attention rollout drawn over it.
 *
 * The regions are also a list of buttons beneath the frame. Highlighting a blob on
 * hover alone would make the explanation unreachable by keyboard — and the
 * explanation is the point of showing it at all.
 */
export function AttentionOverlay({
  image,
  regions,
}: {
  image: UploadedImage;
  regions: AttentionRegion[];
}) {
  // React's useId produces ":r0:", and colons break `url(#…)` references, so the
  // raw id is only ever used after stripping them.
  const gradientId = `attention-${useId().replace(/:/g, '')}`;
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotionSafe();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-vitality-ink">
          Attention rollout
        </p>

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          className={cn(
            'inline-flex h-8 items-center gap-2 rounded-chip border px-3.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200 ease-clinical',
            visible
              ? 'border-vitality/45 bg-vitality-soft text-vitality-ink'
              : 'border-slate-hair bg-white/60 text-slate-cool hover:text-charcoal',
          )}
        >
          <Layers className="h-3 w-3" />
          Overlay {visible ? 'on' : 'off'}
        </button>
      </div>

      {/* ---------------- Frame ---------------- */}
      <div className="relative mt-4 aspect-square overflow-hidden rounded-card border border-slate-hair bg-charcoal">
        {image.isDicom ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_38%_50%,#8F5A33,#2A1B12_72%)]"
          />
        ) : (
          <img
            src={image.previewUrl}
            alt="Analysed retinal image"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {image.isDicom && (
          <p className="absolute inset-x-0 bottom-0 bg-charcoal/70 px-4 py-2.5 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-white/60">
            DICOM pixel data not rendered in-browser — regions are indicative
          </p>
        )}

        {visible && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <radialGradient id={gradientId}>
                <stop offset="0%" stopColor="#FF5A3C" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#FF5A3C" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#FF5A3C" stopOpacity="0" />
              </radialGradient>
            </defs>

            {regions.map((region, i) => {
              const isActive = active === i;
              return (
                <g key={region.label}>
                  <motion.circle
                    cx={region.x}
                    cy={region.y}
                    r={region.r}
                    fill={`url(#${gradientId})`}
                    initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: isActive ? 1 : region.weight * 0.82,
                      scale: isActive ? 1.14 : 1,
                    }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    transition={{
                      duration: reduced ? 0 : 0.5,
                      delay: reduced ? 0 : i * 0.09,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                  {isActive && (
                    <circle
                      cx={region.x}
                      cy={region.y}
                      r={region.r}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="0.4"
                      strokeDasharray="2 1.6"
                      opacity="0.9"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* ---------------- Region list ---------------- */}
      <ul className="mt-4 space-y-1.5">
        {regions.map((region, i) => (
          <li key={region.label}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
              onFocus={() => setActive(i)}
              onBlur={() => setActive((cur) => (cur === i ? null : cur))}
              className={cn(
                'flex w-full items-center gap-3 rounded-chip px-2.5 py-1.5 text-left transition-colors duration-200',
                active === i ? 'bg-vitality-soft' : 'hover:bg-white/70',
              )}
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-vitality"
                style={{ opacity: 0.35 + region.weight * 0.65 }}
              />
              <span className="flex-1 text-[12.5px] leading-snug text-charcoal">
                {region.label}
              </span>
              <span className="font-mono text-[10px] tracking-[0.08em] text-slate-cool">
                {Math.round(region.weight * 100)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-cool">
        Weights are the normalised contribution of each region to the verdict,
        aggregated across all twelve encoder blocks. The regions cluster on the optic
        disc and cup, which is where glaucomatous damage is visible.
      </p>
    </div>
  );
}
