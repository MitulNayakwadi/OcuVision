import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { CountUp } from '@/components/ui/CountUp';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { Table } from '@/components/ui/Icons';
import { RiskTooltip } from '@/components/charts/ChartTooltip';
import { REFERRAL_THRESHOLD, WEEKLY_RISK } from '@/lib/glaucoma';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

const VIT = '#FF5A3C';
const AXIS = '#6B7076';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

/** Non-zero ticks: the interesting band is 20–80, and 0–100 wastes half the plot. */
const TICKS = [20, 40, 60, 80];

/**
 * "Your Statistics" — the mean glaucoma risk score across each day's screened
 * images.
 *
 * One series, so no legend box: the panel title names the measure. The dashed
 * reference line at the referral threshold is what makes the shape mean something —
 * without it a rising curve is just a rising curve.
 *
 * A table view is offered because `#FF5A3C` on the warm canvas sits at 2.94:1, below
 * the 3:1 non-text minimum, so the plot alone cannot be the only way to read the
 * numbers.
 */
export function StatisticsSection() {
  const reduced = useReducedMotionSafe();
  const [asTable, setAsTable] = useState(false);

  const { mean, peak, referable } = useMemo(() => {
    const sum = WEEKLY_RISK.reduce((acc, d) => acc + d.risk, 0);
    const max = WEEKLY_RISK.reduce((a, b) => (b.risk > a.risk ? b : a));
    return {
      mean: Math.round(sum / WEEKLY_RISK.length),
      peak: max,
      referable: WEEKLY_RISK.filter((d) => d.risk >= REFERRAL_THRESHOLD).length,
    };
  }, []);

  return (
    <Section id="statistics">
      <SectionHeader
        eyebrow="Your statistics"
        title="This week on the console"
        body="The mean glaucoma risk score across every image screened, day by day. The score is the model's calibrated probability scaled to 0–100 — a cohort-level trend, not any one patient's reading."
        titleId="statistics-title"
      />

      <Reveal className="mt-10 sm:mt-12">
        <RevealItem>
          <GlassCard radius="panel" className="p-5 sm:p-7 lg:p-8">
            {/* ---- Header: figure, then the view toggle ---- */}
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <Eyebrow withRule tone="vitality">
                  Mean risk score
                </Eyebrow>
                <p className="mt-4 flex items-end gap-4">
                  <span className="font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-none text-charcoal">
                    <CountUp value={mean} />
                  </span>
                  <span className="pb-1.5 text-[12.5px] leading-snug text-slate-warm">
                    of 100
                    <br />
                    <span className="text-slate-cool">
                      {referable} of {WEEKLY_RISK.length} days above threshold
                    </span>
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAsTable((v) => !v)}
                aria-pressed={asTable}
                className="inline-flex items-center gap-2 rounded-chip border border-slate-hair px-3.5 py-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-slate-cool transition-colors duration-200 hover:border-charcoal/25 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vitality/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                <Table className="h-3.5 w-3.5" />
                {asTable ? 'Show chart' : 'Show table'}
              </button>
            </div>

            {/* ---- Plot / table ---- */}
            {asTable ? (
              <div className="mt-8 overflow-x-auto" data-lenis-prevent>
                <table className="w-full min-w-[26rem] border-collapse text-left">
                  <caption className="sr-only">
                    Mean glaucoma risk score and images screened, by day of the week
                  </caption>
                  <thead>
                    <tr className="border-b border-slate-hair">
                      {['Day', 'Risk score', 'Images', 'Status'].map((head) => (
                        <th
                          key={head}
                          scope="col"
                          className="pb-3 font-mono text-[9.5px] uppercase tracking-[0.12em] text-slate-cool"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {WEEKLY_RISK.map((point) => {
                      const over = point.risk >= REFERRAL_THRESHOLD;
                      return (
                        <tr key={point.day} className="border-b border-slate-hair last:border-b-0">
                          <th
                            scope="row"
                            className="py-3 text-[13px] font-medium text-charcoal"
                          >
                            {point.label}
                          </th>
                          <td className="py-3 font-mono text-[12.5px] text-charcoal">
                            {point.risk}
                          </td>
                          <td className="py-3 font-mono text-[12.5px] text-slate-warm">
                            {point.scans}
                          </td>
                          <td
                            className={cn(
                              'py-3 text-[12.5px]',
                              over ? 'text-[#A66A00]' : 'text-[#1F7A4C]',
                            )}
                          >
                            {over ? 'Above threshold' : 'Below threshold'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-8 h-[268px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={WEEKLY_RISK}
                    margin={{ top: 16, right: 16, bottom: 4, left: -24 }}
                  >
                    <defs>
                      <linearGradient id="risk-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={VIT} stopOpacity={0.24} />
                        <stop offset="100%" stopColor={VIT} stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} stroke="rgba(26,28,28,0.07)" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: AXIS, fontSize: 10, fontFamily: MONO }}
                      dy={8}
                      interval={0}
                    />
                    <YAxis
                      domain={[10, 90]}
                      ticks={TICKS}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: AXIS, fontSize: 10, fontFamily: MONO }}
                      width={52}
                    />
                    <Tooltip
                      content={<RiskTooltip />}
                      cursor={{ stroke: 'rgba(26,28,28,0.22)', strokeWidth: 1 }}
                      offset={14}
                    />

                    {/* The line the shape has to be read against. */}
                    <ReferenceLine
                      y={REFERRAL_THRESHOLD}
                      stroke="#A66A00"
                      strokeDasharray="5 4"
                      strokeWidth={1.5}
                      label={{
                        value: `Referral threshold · ${REFERRAL_THRESHOLD}`,
                        position: 'insideTopRight',
                        fill: '#A66A00',
                        fontSize: 9.5,
                        fontFamily: MONO,
                        dy: -6,
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke={VIT}
                      strokeWidth={2}
                      fill="url(#risk-fill)"
                      dot={{ r: 3.5, fill: VIT, stroke: '#FFFFFF', strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: VIT, stroke: '#FFFFFF', strokeWidth: 2 }}
                      isAnimationActive={!reduced}
                      animationDuration={1100}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="mt-6 border-t border-slate-hair pt-5 text-[12.5px] leading-relaxed text-slate-cool">
              Risk peaked on <span className="text-charcoal">{peak.label}</span> at{' '}
              <span className="font-mono text-charcoal">{peak.risk}</span>, {peak.risk - REFERRAL_THRESHOLD}{' '}
              points above the referral threshold. Demonstration figures — this
              prototype stores no screening history.
            </p>
          </GlassCard>
        </RevealItem>
      </Reveal>
    </Section>
  );
}
