import { CountUp } from '@/components/ui/CountUp';
import { HERO_STATS } from '@/lib/content';
import { cn } from '@/lib/cn';

/**
 * Three headline figures. Values count up on entry rather than fading in, because
 * a number that resolves reads as a measurement instead of a graphic.
 */
export function StatRow({ className }: { className?: string }) {
  return (
    <dl className={cn('grid grid-cols-3 gap-x-4', className)}>
      {HERO_STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            'flex flex-col',
            i > 0 && 'border-l border-slate-hair pl-4 sm:pl-6',
          )}
        >
          <dd className="font-display text-[clamp(1.5rem,3vw,2.15rem)] leading-none text-charcoal">
            <CountUp
              value={stat.value}
              decimals={stat.decimals}
              suffix={stat.suffix}
            />
          </dd>
          <dt className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-vitality-ink">
            {stat.label}
          </dt>
          <p className="mt-1.5 text-[11px] leading-snug text-slate-cool">{stat.note}</p>
        </div>
      ))}
    </dl>
  );
}
