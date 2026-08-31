import { GlassCard } from '@/components/ui/GlassCard';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { MODALITIES } from '@/lib/content';
import { cn } from '@/lib/cn';

/**
 * Vessel geometry for the modality glyphs. The same anatomy is drawn twice in two
 * palettes, which is the clinical point: one retina, two very different pictures.
 */
const ARCADES = [
  'M 62 50 C 78 44 96 40 118 46',
  'M 62 50 C 78 56 98 62 120 58',
  'M 62 50 C 72 34 84 24 104 20',
  'M 62 50 C 72 66 82 78 100 84',
  'M 62 50 C 54 38 44 30 30 28',
  'M 62 50 C 54 62 44 72 28 74',
];

const BRANCHES = [
  'M 90 43 C 96 36 104 33 112 34',
  'M 96 60 C 102 68 110 72 118 71',
  'M 84 27 C 90 22 98 20 106 22',
  'M 80 76 C 86 82 94 86 102 86',
  'M 46 33 C 42 27 36 23 30 22',
  'M 44 68 C 40 74 34 78 28 80',
];

function RetinaGlyph({ variant }: { variant: 'cfp' | 'ffa' }) {
  const ffa = variant === 'ffa';

  return (
    <svg
      viewBox="0 0 148 100"
      role="img"
      aria-label={
        ffa
          ? 'Fluorescein angiogram: bright dye-filled vessels on a dark retinal background'
          : 'Colour fundus photograph: optic disc, macula and vascular arcades'
      }
      className="h-full w-full"
    >
      <defs>
        <radialGradient id={`${variant}-ground`} cx="42%" cy="50%" r="72%">
          {ffa ? (
            <>
              <stop offset="0%" stopColor="#3A3E3E" />
              <stop offset="100%" stopColor="#1A1C1C" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#E8A87C" />
              <stop offset="55%" stopColor="#C87B4A" />
              <stop offset="100%" stopColor="#8F5A33" />
            </>
          )}
        </radialGradient>
        <radialGradient id={`${variant}-disc`} cx="50%" cy="50%" r="50%">
          {ffa ? (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#C8C8C8" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FFF6EC" />
              <stop offset="100%" stopColor="#F0C89A" />
            </>
          )}
        </radialGradient>
        <clipPath id={`${variant}-clip`}>
          <ellipse cx="74" cy="50" rx="70" ry="48" />
        </clipPath>
      </defs>

      <ellipse cx="74" cy="50" rx="70" ry="48" fill={`url(#${variant}-ground)`} />

      <g clipPath={`url(#${variant}-clip)`}>
        {/* Macula — a darkened zone on colour, a dark avascular centre on FFA. */}
        <ellipse
          cx="102"
          cy="52"
          rx="17"
          ry="15"
          fill={ffa ? 'rgba(0,0,0,0.42)' : 'rgba(90,44,20,0.4)'}
        />

        <g
          fill="none"
          stroke={ffa ? '#FFFFFF' : '#8C3B22'}
          strokeLinecap="round"
          opacity={ffa ? 0.95 : 0.8}
        >
          {ARCADES.map((d) => (
            <path key={d} d={d} strokeWidth={ffa ? 2.1 : 2.4} />
          ))}
          {BRANCHES.map((d) => (
            <path key={d} d={d} strokeWidth={ffa ? 1.1 : 1.3} opacity={0.75} />
          ))}
        </g>

        {/* Optic disc. */}
        <ellipse cx="62" cy="50" rx="12" ry="11.5" fill={`url(#${variant}-disc)`} />
        <ellipse
          cx="62"
          cy="50"
          rx="5.5"
          ry="5"
          fill={ffa ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.55)'}
        />

        {/* Leakage bloom — only meaningful on the angiogram. */}
        {ffa && (
          <ellipse cx="112" cy="38" rx="13" ry="10" fill="rgba(255,255,255,0.22)" />
        )}
      </g>

      <ellipse
        cx="74"
        cy="50"
        rx="70"
        ry="48"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * The two imaging modalities the model consumes. Presented as a pair rather than a
 * list because the contrast is the content — a colour photograph shows structure,
 * an angiogram shows perfusion, and several classes need both.
 */
export function ModalityBand() {
  return (
    <Section id="modalities">
      <SectionHeader
        eyebrow="Imaging modalities"
        title="Two views of the same retina"
        body="Colour fundus photography is the input every screening programme can already produce. Fluorescein angiography adds the vascular dimension a still photograph cannot carry — perfusion, leakage and barrier failure over time."
        titleId="modalities-title"
      />

      <Reveal as="ul" stagger={0.12} className="mt-14 grid gap-card-gap lg:grid-cols-2">
        {MODALITIES.map((modality, i) => (
          <RevealItem as="li" key={modality.id} className="h-full">
            <GlassCard
              as="article"
              radius="panel"
              className="flex h-full flex-col overflow-hidden p-0"
            >
              {/* ---- Glyph plate ---- */}
              <div
                className={cn(
                  'relative flex h-[220px] items-center justify-center px-10 py-8',
                  modality.id === 'ffa'
                    ? 'bg-[radial-gradient(120%_120%_at_30%_20%,rgba(26,28,28,0.06),rgba(26,28,28,0.02))]'
                    : 'bg-[radial-gradient(120%_120%_at_30%_20%,rgba(255,90,60,0.09),rgba(184,122,75,0.05))]',
                )}
              >
                <div className="h-full w-full max-w-[290px]">
                  <RetinaGlyph variant={modality.id === 'ffa' ? 'ffa' : 'cfp'} />
                </div>
                <span
                  aria-hidden="true"
                  className="absolute left-6 top-6 font-mono text-[10px] tracking-[0.16em] text-copper"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* ---- Copy ---- */}
              <div className="flex flex-1 flex-col border-t border-slate-hair p-8">
                <Eyebrow tone="warm">
                  {modality.id === 'ffa' ? 'Contrast · Timed sequence' : 'Non-invasive · Single frame'}
                </Eyebrow>

                <h3 className="mt-3.5 font-display text-[clamp(1.1rem,2vw,1.4rem)] uppercase leading-tight text-charcoal">
                  {modality.name}
                </h3>

                <p className="mt-4 flex-1 text-[14px] leading-relaxed text-slate-warm">
                  {modality.body}
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-slate-hair pt-5">
                  {modality.detail.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-slate-cool"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 translate-y-[-2px] rounded-full bg-copper"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
