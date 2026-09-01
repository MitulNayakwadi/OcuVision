import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ConfidenceTooltip } from '@/components/charts/ChartTooltip';
import { Table } from '@/components/ui/Icons';
import type { QuarterPoint } from '@/types';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

const VIT = '#FF5A3C';
const CONTROL = '#3A3E3E';
const INK = '#1A1C1C';
const AXIS = '#6B7076';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

/** Ticks are drawn explicitly so the non-zero baseline is disclosed, not hidden. */
const TICKS = [70, 80, 90, 100];

/**
 * Two series over four quarters: the Vision Transformer against the convolutional
 * control on the identical split.
 *
 * A line, not a grouped bar. Bars must be anchored at zero, which would compress
 * a four-point difference in the 70–100 band into invisibility; truncating a bar
 * axis to fix that would misstate the ratio between the marks. A line legitimately
 * carries a non-zero baseline, so long as the axis says so — hence the labelled
 * ticks starting at 70.
 *
 * Identity is never colour alone: the control is dashed as well as neutral, both
 * series are named in the legend, and the endpoints are labelled directly. The
 * table view carries the same numbers for anyone the chart does not serve.
 */
export function ConfidenceChart({
  points,
  diseaseName,
}: {
  points: QuarterPoint[];
  diseaseName: string;
}) {
  const reduced = useReducedMotionSafe();
  const [asTable, setAsTable] = useState(false);

  // Endpoint-only direct labels. Recharts has no per-index label hook, so the
  // label is a data field that is empty everywhere except the final quarter.
  const data = useMemo(
    () =>
      points.map((p, i) => ({
        ...p,
        confidenceLabel: i === points.length - 1 ? `${p.confidence.toFixed(1)}%` : '',
        baselineLabel: i === points.length - 1 ? `${p.baseline.toFixed(1)}%` : '',
      })),
    [points],
  );

  const last = points[points.length - 1];
  const first = points[0];
  const gain = last.confidence - first.confidence;
  const lead = last.confidence - last.baseline;

  return (
    <figure className="m-0">
      {/* ---------- Legend + view toggle ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <LegendKey tone={VIT} label="OcuVision ViT" />
          <LegendKey tone={CONTROL} label="ResNet-50 control" dashed />
        </ul>

        <button
          type="button"
          onClick={() => setAsTable((v) => !v)}
          aria-pressed={asTable}
          className={cn(
            'inline-flex h-8 items-center gap-2 rounded-chip border px-3.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200 ease-clinical',
            asTable
              ? 'border-charcoal bg-charcoal text-canvas'
              : 'border-slate-hair bg-white/60 text-slate-cool hover:text-charcoal',
          )}
        >
          <Table className="h-3 w-3" />
          {asTable ? 'Chart' : 'Table'}
        </button>
      </div>

      {/* ---------- Plot / table ---------- */}
      <div className="mt-6 h-[268px] w-full min-w-0">
        {asTable ? (
          <div className="h-full overflow-auto" data-lenis-prevent>
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                {diseaseName} — mean class sensitivity per quarter, Vision Transformer
                against the ResNet-50 control.
              </caption>
              <thead>
                <tr className="border-b border-slate-hair">
                  {['Quarter', 'ViT', 'Control', 'Delta'].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="pb-2.5 font-mono text-[10px] font-normal uppercase tracking-[0.12em] text-slate-cool"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {points.map((p) => (
                  <tr key={p.quarter} className="border-b border-slate-hair last:border-b-0">
                    <th
                      scope="row"
                      className="py-2.5 font-mono text-[11px] font-normal tracking-[0.08em] text-slate-warm"
                    >
                      {p.quarter}
                    </th>
                    <td className="py-2.5 font-display text-[13px] text-charcoal">
                      {p.confidence.toFixed(1)}%
                    </td>
                    <td className="py-2.5 font-display text-[13px] text-slate-cool">
                      {p.baseline.toFixed(1)}%
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-vitality-ink">
                      +{(p.confidence - p.baseline).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 22, right: 32, bottom: 4, left: -22 }}>
              <CartesianGrid
                vertical={false}
                stroke="rgba(26,28,28,0.07)"
                strokeDasharray="0"
              />
              <XAxis
                dataKey="quarter"
                axisLine={false}
                tickLine={false}
                tick={{ fill: AXIS, fontSize: 10, fontFamily: MONO, letterSpacing: '0.1em' }}
                dy={6}
              />
              <YAxis
                domain={[70, 100]}
                ticks={TICKS}
                axisLine={false}
                tickLine={false}
                width={52}
                tick={{ fill: AXIS, fontSize: 10, fontFamily: MONO }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                content={<ConfidenceTooltip />}
                cursor={{ stroke: 'rgba(26,28,28,0.22)', strokeWidth: 1 }}
              />

              {/* Control first, so the ViT line and its markers sit on top. */}
              <Line
                type="monotone"
                dataKey="baseline"
                stroke={CONTROL}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 3.5, fill: '#F9F9F8', stroke: CONTROL, strokeWidth: 2 }}
                activeDot={{ r: 4.5, fill: CONTROL, stroke: '#FFFFFF', strokeWidth: 2 }}
                isAnimationActive={!reduced}
                animationDuration={900}
              >
                <LabelList
                  dataKey="baselineLabel"
                  position="bottom"
                  offset={12}
                  fill={AXIS}
                  fontSize={11}
                  fontFamily={MONO}
                />
              </Line>

              <Line
                type="monotone"
                dataKey="confidence"
                stroke={VIT}
                strokeWidth={2}
                dot={{ r: 4, fill: '#F9F9F8', stroke: VIT, strokeWidth: 2 }}
                activeDot={{ r: 5, fill: VIT, stroke: '#FFFFFF', strokeWidth: 2 }}
                isAnimationActive={!reduced}
                animationDuration={1100}
              >
                <LabelList
                  dataKey="confidenceLabel"
                  position="top"
                  offset={12}
                  fill={INK}
                  fontSize={11}
                  fontFamily={MONO}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <figcaption className="mt-5 border-t border-slate-hair pt-4 text-[12px] leading-relaxed text-slate-cool">
        Mean class sensitivity for {diseaseName} across four development quarters on the
        held-out validation split — <span className="text-charcoal">+{gain.toFixed(1)} points</span>{' '}
        over the cycle, finishing{' '}
        <span className="text-charcoal">{lead.toFixed(1)} points</span> ahead of the
        convolutional control trained on the identical data.
      </figcaption>
    </figure>
  );
}

function LegendKey({
  tone,
  label,
  dashed = false,
}: {
  tone: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span aria-hidden="true" className="flex h-2.5 w-6 items-center">
        <span
          className="h-0.5 w-full"
          style={
            dashed
              ? {
                  backgroundImage: `repeating-linear-gradient(to right, ${tone} 0 5px, transparent 5px 9px)`,
                }
              : { background: tone }
          }
        />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-warm">
        {label}
      </span>
    </li>
  );
}
