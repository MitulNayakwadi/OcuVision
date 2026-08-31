import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { CountUp } from '@/components/ui/CountUp';
import { Activity } from '@/components/ui/Icons';
import { WEEKLY_ACTIVITY } from '@/lib/glaucoma';
import { ActivityTooltip } from '@/components/charts/ChartTooltip';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

/**
 * The hero activity card. A single series, so no legend box — the title names
 * the measure. Only the peak day is directly labelled; every other value is
 * available on hover rather than printed on the plot.
 */
export function HeroStatsCard({ className }: { className?: string }) {
  const reduced = useReducedMotionSafe();

  const { total, peak, average } = useMemo(() => {
    const sum = WEEKLY_ACTIVITY.reduce((acc, d) => acc + d.scans, 0);
    const max = WEEKLY_ACTIVITY.reduce((a, b) => (b.scans > a.scans ? b : a));
    return { total: sum, peak: max, average: Math.round(sum / WEEKLY_ACTIVITY.length) };
  }, []);

  return (
    <GlassCard className={className} radius="card">
      <div className="px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-cool">
              This week
            </p>
            <h2 className="mt-1 font-display text-[15px] uppercase leading-none text-charcoal">
              Screening Activity
            </h2>
          </div>
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full bg-vitality-soft"
          >
            <Activity className="h-4 w-4 text-vitality-ink" />
          </span>
        </div>

        <div className="mt-4 flex items-end gap-5">
          <p className="font-display text-[clamp(1.75rem,3.4vw,2.4rem)] leading-none text-charcoal">
            <CountUp value={total} />
          </p>
          <div className="pb-1">
            <p className="text-[11px] leading-tight text-slate-warm">images analysed</p>
            <p className="text-[11px] leading-tight text-slate-cool">
              {average}/day average
            </p>
          </div>
        </div>
      </div>

      {/* Plot */}
      <div className="h-[104px] w-full px-1 pb-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={WEEKLY_ACTIVITY} margin={{ top: 6, right: 12, bottom: 0, left: 12 }}>
            <defs>
              <linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF5A3C" stopOpacity={0.26} />
                <stop offset="100%" stopColor="#FF5A3C" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Recessive grid: horizontal only, hairline weight. */}
            <CartesianGrid
              vertical={false}
              stroke="rgba(26,28,28,0.07)"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7076', fontSize: 10, fontFamily: 'Inter' }}
              dy={4}
              interval={0}
            />
            {/* Hidden but present: the domain padding keeps the line off the frame. */}
            <YAxis hide domain={[0, (max: number) => Math.ceil(max * 1.25)]} />
            <Tooltip
              content={<ActivityTooltip />}
              cursor={{ stroke: 'rgba(26,28,28,0.22)', strokeWidth: 1 }}
              offset={12}
            />
            <Area
              type="monotone"
              dataKey="scans"
              stroke="#FF5A3C"
              strokeWidth={2}
              fill="url(#activity-fill)"
              // 8px marker, ringed in the surface colour so it reads over the line.
              activeDot={{
                r: 4,
                fill: '#FF5A3C',
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
              dot={false}
              isAnimationActive={!reduced}
              animationDuration={1100}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-hair px-5 py-3">
        <p className="text-[11px] text-slate-warm">
          Busiest: <span className="font-semibold text-charcoal">{peak.label}</span>
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-vitality-ink">
          {peak.scans} scans
        </p>
      </div>
    </GlassCard>
  );
}
