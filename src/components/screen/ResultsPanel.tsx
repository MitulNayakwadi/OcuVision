import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { MetricRing } from '@/components/ui/MetricRing';
import { PillButton, PillLink } from '@/components/ui/PillButton';
import { SeverityChip } from '@/components/ui/SeverityChip';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowUpRight, Check, EyeScan } from '@/components/ui/Icons';
import { AttentionOverlay } from './AttentionOverlay';
import { AdvisoryCard } from './AdvisoryCard';
import { GLAUCOMA, REFERRAL_THRESHOLD, STAGE_BY_ID, VERDICT } from '@/lib/glaucoma';
import { STAGE_STYLES, riskScore } from '@/lib/advisory';
import type { ScreeningResult, UploadedImage } from '@/types';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The report. Four blocks in a fixed reading order — the verdict, what the model
 * looked at, the structural measurements behind the call, and what to do — because
 * a clinician skimming this should reach the advisory whether or not they read the
 * measurements.
 *
 * The verdict is binary, so there is no probability distribution to show: what
 * replaces it is the set of disc measurements that produced the call, since a
 * yes/no with no measurement behind it is not reviewable.
 */
export function ResultsPanel({
  image,
  result,
  onReset,
}: {
  image: UploadedImage;
  result: ScreeningResult;
  onReset: () => void;
}) {
  const reduced = useReducedMotionSafe();
  const stage = result.stage ? STAGE_BY_ID[result.stage] : null;
  const stageStyle = result.stage ? STAGE_STYLES[result.stage] : null;
  const risk = riskScore(result);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.65, ease: EASE }}
      className="space-y-card-gap"
    >
      {/* ---------------- Verdict ---------------- */}
      <GlassCard radius="panel" className="p-7 lg:p-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Eyebrow withRule tone="vitality">
            Step 03 · Report
          </Eyebrow>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-cool">
            {result.latencyMs} ms · {image.isDicom ? 'DICOM' : 'Colour fundus'}
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <SeverityChip severity={result.severity} size="sm" />

            <h2 className="mt-4 font-display text-[clamp(1.5rem,3.4vw,2.4rem)] uppercase leading-[1.02] text-charcoal">
              {result.detected ? VERDICT.positive : VERDICT.negative}
            </h2>

            {/* Stage only exists on a positive screen — on a negative one there is
                nothing to stage, and inventing an "Early" chip would read as a
                finding. */}
            {stage && stageStyle ? (
              <p className="mt-4 flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    'inline-flex h-7 items-center gap-2 rounded-chip border px-3 font-mono text-[10px] uppercase tracking-[0.1em]',
                    stageStyle.bg,
                    stageStyle.border,
                    stageStyle.text,
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn('h-1.5 w-1.5 rounded-full', stageStyle.dot)}
                  />
                  {stage.label} stage
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate-cool">
                  CDR {stage.cdr[0].toFixed(2)}–{stage.cdr[1].toFixed(2)} band
                </span>
              </p>
            ) : (
              <p className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#1F7A4C]">
                <Check className="h-3.5 w-3.5" />
                No stage assigned
              </p>
            )}

            <p className="mt-5 max-w-xl text-[13.5px] leading-relaxed text-slate-warm">
              {stage
                ? stage.description
                : 'The optic disc appearance falls within the physiological range on every measurement below. This is a negative glaucoma screen — it says nothing about any other condition in the same photograph.'}
            </p>
          </div>

          <div className="shrink-0 sm:pl-6">
            <MetricRing
              value={result.confidence}
              display={`${result.confidence.toFixed(1)}%`}
              label="Verdict confidence"
              note="Softmax probability for the reported verdict"
              size={148}
            />
          </div>
        </div>
      </GlassCard>

      {/* ---------------- Evidence ---------------- */}
      <div className="grid gap-card-gap lg:grid-cols-[0.92fr_1.08fr]">
        <GlassCard radius="panel" className="p-7">
          <AttentionOverlay image={image} regions={result.attentionRegions} />
        </GlassCard>

        <GlassCard radius="panel" className="flex flex-col p-7 lg:p-8">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-vitality-ink">
            Disc measurements
          </p>

          {/* The cup-to-disc ratio, as a bar against the 0.55 referral line. Its
              length encodes the ratio itself, on the full 0–1 scale the measure is
              defined on, so the bar cannot say something the number doesn't. */}
          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[13px] text-charcoal">
                Vertical cup-to-disc ratio
              </span>
              <span className="font-display text-[15px] leading-none text-charcoal">
                {result.cdr.toFixed(2)}
              </span>
            </div>

            <div
              role="meter"
              aria-valuenow={result.cdr}
              aria-valuemin={0}
              aria-valuemax={1}
              aria-label={`Vertical cup-to-disc ratio ${result.cdr.toFixed(2)} of a possible 1.00`}
              className="relative mt-2.5 h-2 w-full overflow-hidden rounded-chip bg-[rgba(26,28,28,0.07)]"
            >
              <motion.div
                className={cn(
                  'h-full rounded-chip',
                  result.detected ? 'bg-vitality' : 'bg-[#1F7A4C]',
                )}
                initial={{ width: reduced ? `${result.cdr * 100}%` : 0 }}
                animate={{ width: `${result.cdr * 100}%` }}
                transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.15, ease: EASE }}
              />
              {/* Referral line at 0.55 — the bar means nothing without it. */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-[55%] w-[1.5px] bg-[#A66A00]"
              />
            </div>

            <p className="mt-2 flex justify-between font-mono text-[9.5px] uppercase tracking-[0.1em] text-slate-cool">
              <span>0.00</span>
              <span className="text-[#A66A00]">Referral 0.55</span>
              <span>1.00</span>
            </p>
          </div>

          <dl className="mt-7 space-y-3.5 border-t border-slate-hair pt-6">
            {[
              {
                term: 'Thinnest rim sector',
                value: result.thinnestSector,
                note: 'ISNT order expects inferior thickest',
              },
              {
                term: 'RNFL wedge defect',
                value: result.rnflDefect ? 'Present' : 'Not detected',
                note: 'Nerve fibre layer, arcuate bundle',
              },
              {
                term: 'Risk score',
                value: `${risk} / 100`,
                note: `Referable at ${REFERRAL_THRESHOLD} and above`,
              },
            ].map((row) => (
              <div key={row.term} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <dt className="text-[13px] text-charcoal">{row.term}</dt>
                  <dd className="mt-0.5 text-[11px] leading-snug text-slate-cool">
                    {row.note}
                  </dd>
                </div>
                <dd className="shrink-0 font-mono text-[12.5px] text-charcoal">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 border-t border-slate-hair pt-6">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-cool">
              What the model is looking for
            </p>
            <ul className="mt-3.5 space-y-2">
              {GLAUCOMA.findings.slice(0, 4).map((finding) => (
                <li
                  key={finding}
                  className="flex gap-2.5 text-[12.5px] leading-snug text-slate-warm"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-copper"
                  />
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </div>

      {/* ---------------- Advisory ---------------- */}
      <AdvisoryCard severity={result.severity} />

      {/* ---------------- Next ---------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-panel border border-slate-hair bg-white/45 px-7 py-6">
        <p className="max-w-md text-[12.5px] leading-relaxed text-slate-cool">
          Screening a second image discards this report. Nothing is stored, so there is
          no history to return to.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <PillLink
            to="/#scope"
            variant="glass"
            size="md"
            iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
          >
            What this does not detect
          </PillLink>
          <PillButton
            variant="dark"
            size="md"
            onClick={onReset}
            iconRight={<EyeScan className="h-4 w-4" />}
          >
            Screen another image
          </PillButton>
        </div>
      </div>
    </motion.div>
  );
}
