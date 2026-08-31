import { GlassCard } from '@/components/ui/GlassCard';
import { SeverityChip } from '@/components/ui/SeverityChip';
import { ArrowRight, Clock, Siren } from '@/components/ui/Icons';
import { ADVISORY_COPY, SEVERITY_STYLES } from '@/lib/advisory';
import type { Severity } from '@/types';
import { cn } from '@/lib/cn';

/**
 * The advisory — the output that distinguishes this from a classifier. A class and
 * a probability tell a clinician what the model saw; this tells them what to do and
 * by when, which is the part that changes a patient pathway.
 */
export function AdvisoryCard({ severity }: { severity: Severity }) {
  const copy = ADVISORY_COPY[severity];
  const style = SEVERITY_STYLES[severity];
  const urgent = severity === 'urgent';

  return (
    <GlassCard
      as="section"
      radius="panel"
      aria-labelledby="advisory-headline"
      className={cn('relative overflow-hidden p-7 lg:p-8', style.border)}
    >
      {/* Severity as a structural edge, not just a text colour. */}
      <span
        aria-hidden="true"
        className={cn('absolute inset-y-0 left-0 w-[3px]', style.dot)}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SeverityChip severity={severity} />
        <span
          className={cn(
            'inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]',
            style.text,
          )}
        >
          {urgent ? <Siren className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
          {copy.window}
        </span>
      </div>

      <h3
        id="advisory-headline"
        className="mt-5 font-display text-[clamp(1.15rem,2.2vw,1.55rem)] uppercase leading-tight text-charcoal"
      >
        {copy.headline}
      </h3>

      <p className="mt-3.5 text-[14px] leading-relaxed text-slate-warm">{copy.body}</p>

      <p className="mt-7 font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-cool">
        Recommended actions
      </p>

      <ol className="mt-3.5 space-y-2.5">
        {copy.actions.map((action, i) => (
          <li
            key={action}
            className="flex items-start gap-3 rounded-card bg-white/55 px-4 py-3 text-[13px] leading-snug text-charcoal"
          >
            <span
              aria-hidden="true"
              className={cn(
                'mt-[1px] font-mono text-[10px] tracking-[0.1em]',
                style.text,
              )}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            {action}
          </li>
        ))}
      </ol>

      <p className="mt-6 flex items-start gap-2.5 border-t border-slate-hair pt-5 text-[11.5px] leading-relaxed text-slate-cool">
        <ArrowRight className="mt-[3px] h-3 w-3 shrink-0" />
        Decision support only. A qualified clinician must review the image and confirm
        this advisory before it is acted on.
      </p>
    </GlassCard>
  );
}
