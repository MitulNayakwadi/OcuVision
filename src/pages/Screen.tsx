import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Bolt, Check, Shield } from '@/components/ui/Icons';
import { UploadZone } from '@/components/screen/UploadZone';
import { AnalyzingState } from '@/components/screen/AnalyzingState';
import { ResultsPanel } from '@/components/screen/ResultsPanel';
import { ModelManagerCard } from '@/components/screen/ModelManagerCard';
import { runMockInference } from '@/lib/advisory';
import { fetchModelStatus, switchModelCheckpoint, runModelInference } from '@/lib/api';
import { STAGE_BY_ID, VERDICT } from '@/lib/glaucoma';
import { DISCLAIMER, PIPELINE_STAGES } from '@/lib/content';
import type { ModelStatus, ScreeningResult, UploadedImage } from '@/types';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

type Phase = 'idle' | 'analyzing' | 'done';

/** How far down the pipeline each phase has actually got. */
const REACHED: Record<Phase, number> = {
  idle: 0,
  analyzing: 4,
  done: 6,
};

export function Screen() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const reduced = useReducedMotionSafe();

  // Tracks ongoing async inference call
  const pendingInference = useRef<Promise<ScreeningResult> | null>(null);

  // Object URLs are a manual allocation: the browser holds the blob until it is
  // revoked, so the live one is tracked outside state and released on every
  // replacement as well as on unmount.
  const objectUrl = useRef<string | null>(null);

  const refreshStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const status = await fetchModelStatus();
      setModelStatus(status);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  const handleSelectCheckpoint = useCallback(async (name: string) => {
    setIsSwitching(true);
    try {
      const res = await switchModelCheckpoint(name);
      if (res.success && res.status) {
        setModelStatus(res.status);
      } else {
        await refreshStatus();
      }
    } finally {
      setIsSwitching(false);
    }
  }, [refreshStatus]);

  const release = useCallback(() => {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
  }, []);

  useEffect(() => release, [release]);

  const clear = useCallback(() => {
    release();
    setImage(null);
    setResult(null);
    setPhase('idle');
    pendingInference.current = null;
  }, [release]);

  const handleSelect = useCallback(
    (next: UploadedImage) => {
      release();
      objectUrl.current = next.previewUrl || null;
      setImage(next);
      setResult(null);
      setPhase('idle');
      pendingInference.current = null;
    },
    [release],
  );

  const handleStartAnalyze = useCallback(() => {
    if (!image) return;

    // If real PyTorch model backend is loaded, start real inference
    if (modelStatus?.connected && modelStatus?.model_loaded && !image.isDicom) {
      pendingInference.current = runModelInference(image.file).catch((err) => {
        console.warn('PyTorch inference failed, falling back to mock:', err);
        return {
          ...runMockInference(image.file.name, image.file.size),
          source: 'mock' as const,
        };
      });
    } else {
      pendingInference.current = Promise.resolve({
        ...runMockInference(image.file.name, image.file.size),
        source: 'mock' as const,
      });
    }

    setPhase('analyzing');
  }, [image, modelStatus]);

  const handleComplete = useCallback(async () => {
    if (!image) return;

    if (pendingInference.current) {
      const inferenceResult = await pendingInference.current;
      setResult(inferenceResult);
    } else {
      setResult(runMockInference(image.file.name, image.file.size));
    }

    setPhase('done');
  }, [image]);

  const handleReset = useCallback(() => {
    clear();
    window.__lenis?.scrollTo('#console', { offset: -120 });
  }, [clear]);

  // One stage further than the phase alone once an image is loaded, since
  // acquisition genuinely is complete at that point.
  const reached = phase === 'idle' && image ? 1 : REACHED[phase];

  const isLiveModel = Boolean(modelStatus?.connected && modelStatus?.model_loaded);
  const activeModelName = modelStatus?.active_checkpoint;

  return (
    <>
      <PageHero
        eyebrow="Screening console"
        title="RUN A SCREENING"
        titleLines={['RUN A', 'SCREENING']}
        headingId="screen-title"
        body="Submit a colour fundus photograph. The system links directly to your PyTorch ViT-Base/16 model (best_model.pth or latest_checkpoint.pth) to return an explainable verdict, cup-to-disc ratio (CDR), severity staging, self-attention rollout map, and clinical triage window."
        meta={[
          {
            label: 'Active Model',
            value: isLiveModel ? (activeModelName ?? 'ViT-Base/16') : 'ViT-Base/16 (Demo)',
          },
          {
            label: 'Inference Engine',
            value: isLiveModel ? `PyTorch (${modelStatus?.device ?? 'CPU'})` : 'Client Simulated',
          },
          {
            label: 'Median latency',
            value: isLiveModel ? '~180 ms' : '2.4 s',
          },
        ]}
      />

      {/* ---------------- Console ---------------- */}
      <Section id="console" className="!pt-0">
        <ProcessTrack reached={reached} />

        {/* Model Checkpoint Management Card */}
        <div className="mt-6 sm:mt-card-gap">
          <ModelManagerCard
            status={modelStatus}
            loading={statusLoading}
            onRefresh={refreshStatus}
            onSelectCheckpoint={handleSelectCheckpoint}
            isSwitching={isSwitching}
          />
        </div>

        <div className="mt-6 sm:mt-card-gap">
          {/* Phase swap is a crossfade: the three states are the same task at
              three moments, not three different places. */}
          <AnimatePresence mode="wait" initial={false}>
            {phase === 'idle' && (
              <PhaseSwap key="idle" reduced={reduced}>
                <UploadZone
                  image={image}
                  onSelect={handleSelect}
                  onClear={clear}
                  onAnalyze={handleStartAnalyze}
                  isLiveModel={isLiveModel}
                  activeModelName={activeModelName}
                />
              </PhaseSwap>
            )}

            {phase === 'analyzing' && (
              <PhaseSwap key="analyzing" reduced={reduced}>
                <AnalyzingState
                  onComplete={handleComplete}
                  checkpointName={activeModelName}
                  isLiveModel={isLiveModel}
                />
              </PhaseSwap>
            )}

            {phase === 'done' && result && image && (
              <PhaseSwap key="done" reduced={reduced}>
                <ResultsPanel image={image} result={result} onReset={handleReset} />
              </PhaseSwap>
            )}
          </AnimatePresence>
        </div>

        {/* Phase changes are visual; this makes them audible too. */}
        <p aria-live="polite" className="sr-only">
          {phase === 'idle' && image && `${image.file.name} ready for analysis.`}
          {phase === 'analyzing' && 'Analysing image.'}
          {phase === 'done' &&
            result &&
            `Analysis complete. ${result.detected ? VERDICT.positive : VERDICT.negative}, confidence ${result.confidence.toFixed(1)} per cent${
              result.stage ? `, ${STAGE_BY_ID[result.stage].label} stage` : ''
            }, cup-to-disc ratio ${result.cdr.toFixed(2)}, ${result.severity} priority.`}
        </p>

        {/* ---------------- Standing notes ---------------- */}
        <div className="mt-6 sm:mt-card-gap grid gap-4 sm:gap-6 md:grid-cols-2">
          <GlassCard variant="well" radius="panel" className="p-5 sm:p-7">
            <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-vitality-ink">
              <Shield className="h-3.5 w-3.5" />
              PyTorch Model Architecture
            </p>
            <p className="mt-3.5 text-[13px] leading-relaxed text-slate-warm sm:mt-4 sm:text-[13.5px]">
              The screening pipeline executes a Vision Transformer (ViT-Base/16) backbone.
              Place <code className="font-mono text-charcoal">best_model.pth</code> or <code className="font-mono text-charcoal">latest_checkpoint.pth</code> in the <code className="font-mono text-charcoal">models/</code> directory to link your weights directly to the inference engine.
            </p>
          </GlassCard>

          <GlassCard variant="well" radius="panel" className="p-5 sm:p-7">
            <p className="flex items-center gap-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-copper">
              <Bolt className="h-3.5 w-3.5" />
              Scope of the output
            </p>
            <p className="mt-3.5 text-[13px] leading-relaxed text-slate-warm sm:mt-4 sm:text-[13.5px]">
              {DISCLAIMER}
            </p>
          </GlassCard>
        </div>
      </Section>
    </>
  );
}

function PhaseSwap({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : -10 }}
      transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * The seven-stage pipeline as a node track. State is derived from the live phase
 * rather than hard-coded, so the track reports where the run actually is — and
 * the last node stays open, because clinician sign-off happens off-screen.
 */
function ProcessTrack({ reached }: { reached: number }) {
  return (
    <GlassCard radius="panel" className="overflow-hidden p-5 sm:p-6 lg:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-cool">
          Inference path
        </p>
        <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-cool">
          {reached} / {PIPELINE_STAGES.length} complete
        </p>
      </div>

      <ol
        className="mt-5 sm:mt-6 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-lenis-prevent
      >
        {PIPELINE_STAGES.map((stage, i) => {
          const done = i < reached;
          const active = i === reached;

          return (
            <li
              key={stage.label}
              className="relative flex min-w-[5.8rem] sm:min-w-[6.5rem] md:min-w-0 md:flex-1 shrink-0 md:shrink flex-col gap-2.5 sm:gap-3"
              aria-current={active ? 'step' : undefined}
            >
              <div className="relative flex items-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute left-[14px] right-0 top-1/2 h-[2px] -translate-y-1/2',
                    done ? 'bg-vitality/45' : 'bg-slate-hair',
                    i === PIPELINE_STAGES.length - 1 && 'hidden',
                  )}
                />
                <span
                  className={cn(
                    'relative z-[1] flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-300 ease-clinical',
                    done && 'border-vitality bg-vitality text-white',
                    active && 'border-vitality bg-canvas text-vitality-ink',
                    !done && !active && 'border-slate-hair bg-canvas text-slate-cool',
                  )}
                >
                  {done ? (
                    <Check className="h-3 w-3" />
                  ) : active ? (
                    <Bolt className="h-3 w-3" />
                  ) : (
                    <span className="font-mono text-[9px]">{i + 1}</span>
                  )}
                </span>
              </div>

              <span
                className={cn(
                  'pr-3 font-mono text-[9.5px] uppercase leading-snug tracking-[0.1em] transition-colors duration-300',
                  done || active ? 'text-charcoal' : 'text-slate-cool',
                )}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>
    </GlassCard>
  );
}
