import type { TooltipProps } from 'recharts';

interface Row {
  label: string;
  value: string;
  /** Swatch colour. Identity is carried by the swatch, never by the text colour. */
  tone: string;
}

/**
 * Shared tooltip surface. Values and labels stay in ink tokens; the small square
 * beside each row carries series identity. Kept out of Recharts' default styling
 * entirely so it matches the glass system.
 */
export function ChartTooltipCard({
  title,
  rows,
  footnote,
}: {
  title: string;
  rows: Row[];
  footnote?: string;
}) {
  return (
    <div className="glass-solid pointer-events-none min-w-[10rem] rounded-card px-3.5 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-cool">
        {title}
      </p>
      <ul className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-[12px] text-slate-warm">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-[2px]"
                style={{ background: row.tone }}
              />
              {row.label}
            </span>
            <span className="font-display text-[13px] leading-none text-charcoal">
              {row.value}
            </span>
          </li>
        ))}
      </ul>
      {footnote && (
        <p className="mt-2 border-t border-slate-hair pt-2 text-[10px] leading-snug text-slate-cool">
          {footnote}
        </p>
      )}
    </div>
  );
}

/** Recharts adapter for the activity line: one series, absolute scan counts. */
export function ActivityTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as { label: string; scans: number };
  return (
    <ChartTooltipCard
      title={point.label}
      rows={[{ label: 'Scans completed', value: String(point.scans), tone: '#FF5A3C' }]}
    />
  );
}

/** Recharts adapter for the weekly risk trend: mean score plus the day's volume. */
export function RiskTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as { label: string; risk: number; scans: number };
  return (
    <ChartTooltipCard
      title={point.label}
      rows={[{ label: 'Mean risk score', value: String(point.risk), tone: '#FF5A3C' }]}
      footnote={`Averaged across ${point.scans} images screened that day`}
    />
  );
}

/** Recharts adapter for the quarterly comparison: ViT against the CNN control. */
export function ConfidenceTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as { confidence: number; baseline: number };
  const delta = point.confidence - point.baseline;
  return (
    <ChartTooltipCard
      title={`${label} · Sensitivity`}
      rows={[
        {
          label: 'OcuVision ViT',
          value: `${point.confidence.toFixed(1)}%`,
          tone: '#FF5A3C',
        },
        {
          label: 'ResNet-50 control',
          value: `${point.baseline.toFixed(1)}%`,
          tone: '#3A3E3E',
        },
      ]}
      footnote={`${delta > 0 ? '+' : ''}${delta.toFixed(1)} points over the control`}
    />
  );
}
