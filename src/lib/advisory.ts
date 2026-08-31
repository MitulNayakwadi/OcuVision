import type { AttentionRegion, ScreeningResult, Severity, Stage } from '@/types';
import { REFERRAL_THRESHOLD, STAGES, STAGE_BY_ID } from '@/lib/glaucoma';

interface AdvisoryCopy {
  /** Triage tier name shown on the chip. */
  tier: string;
  label: string;
  /** How soon the patient should be seen. */
  window: string;
  headline: string;
  body: string;
  actions: string[];
}

/**
 * Advisory copy per triage tier. This is the layer that turns a probability into
 * something a clinician can act on, and it is written in plain language on purpose:
 * the reader may be a general practitioner or an optometrist, not a glaucoma
 * specialist.
 */
export const ADVISORY_COPY: Record<Severity, AdvisoryCopy> = {
  routine: {
    tier: 'Routine',
    label: 'Routine recall',
    window: 'Re-screen in 12 months',
    headline: 'Low risk — no glaucomatous disc changes found',
    body: 'The optic disc appearance is within the physiological range: the cup-to-disc ratio is unremarkable, the neuroretinal rim follows the ISNT rule and no nerve fibre layer wedge defect was found. Return the patient to the standard screening interval.',
    actions: [
      'Return to routine recall at 12 months',
      'Record the cup-to-disc estimate as a structural baseline for comparison',
      'Screen sooner if a first-degree relative has glaucoma, or if intraocular pressure is raised on any future check',
    ],
  },
  watch: {
    tier: 'Referral',
    label: 'Refer within 3 months',
    window: 'Ophthalmology review within 3 months',
    headline: 'Signs of an elevated cup-to-disc ratio — refer for confirmation',
    body: 'The disc shows cupping and rim thinning consistent with early to moderate glaucomatous damage. Structural signs on a photograph are not a diagnosis: confirmation needs intraocular pressure, gonioscopy, a visual field test and ideally OCT of the nerve fibre layer.',
    actions: [
      'Refer to ophthalmology for a full glaucoma workup within three months',
      'Request Goldmann applanation tonometry, gonioscopy and a threshold visual field',
      'Ask for OCT retinal nerve fibre layer thickness to quantify the loss objectively',
      'Examine the fellow eye — inter-eye asymmetry is itself a diagnostic sign',
    ],
  },
  urgent: {
    tier: 'Urgent',
    label: 'Urgent referral',
    window: 'Ophthalmology review this week',
    headline: 'Advanced cupping detected — arrange prompt specialist review',
    body: 'Rim loss extends close to the disc margin, the pattern seen once a large share of the axons have already gone. What remains is preventable, and the rate of further loss depends on how quickly pressure-lowering treatment starts, so this should not wait for a routine clinic slot.',
    actions: [
      'Arrange an ophthalmology appointment within one week',
      'Measure intraocular pressure now and document it with the referral',
      'Send the fundus image and this attention map with the referral letter',
      'Counsel the patient that existing field loss will not recover, and that treatment protects what is left',
    ],
  },
};

/** Tier colours. Each is paired with a label everywhere it appears. */
export const SEVERITY_STYLES: Record<
  Severity,
  { text: string; bg: string; border: string; dot: string; hex: string }
> = {
  routine: {
    text: 'text-[#1F7A4C]',
    bg: 'bg-[#1F7A4C]/10',
    border: 'border-[#1F7A4C]/25',
    dot: 'bg-[#1F7A4C]',
    hex: '#1F7A4C',
  },
  watch: {
    text: 'text-[#A66A00]',
    bg: 'bg-[#A66A00]/10',
    border: 'border-[#A66A00]/25',
    dot: 'bg-[#A66A00]',
    hex: '#A66A00',
  },
  urgent: {
    text: 'text-[#BA1A1A]',
    bg: 'bg-[#BA1A1A]/10',
    border: 'border-[#BA1A1A]/25',
    dot: 'bg-[#BA1A1A]',
    hex: '#BA1A1A',
  },
};

/** Stage chip colours — green / amber / red, always beside the stage name. */
export const STAGE_STYLES: Record<Stage, { text: string; bg: string; border: string; dot: string }> =
  {
    early: {
      text: 'text-[#1F7A4C]',
      bg: 'bg-[#1F7A4C]/10',
      border: 'border-[#1F7A4C]/25',
      dot: 'bg-[#1F7A4C]',
    },
    moderate: {
      text: 'text-[#A66A00]',
      bg: 'bg-[#A66A00]/10',
      border: 'border-[#A66A00]/25',
      dot: 'bg-[#A66A00]',
    },
    advanced: {
      text: 'text-[#BA1A1A]',
      bg: 'bg-[#BA1A1A]/10',
      border: 'border-[#BA1A1A]/25',
      dot: 'bg-[#BA1A1A]',
    },
  };

const SECTORS = ['Inferior', 'Superior', 'Inferotemporal', 'Superotemporal'];

/**
 * Attention regions clustered on the optic disc, because that is where a glaucoma
 * model looks. The disc sits temporally in a macula-centred photograph, so the
 * primary region is placed right of centre and the satellites fan out along the
 * arcuate nerve fibre bundles that carry the damage.
 */
function discRegions(seed: number, detected: boolean, sector: string): AttentionRegion[] {
  // Disc centre, jittered a few percent so repeat runs don't look stamped.
  const cx = 63 + (seed % 7);
  const cy = 46 + ((seed >> 3) % 6);

  const regions: AttentionRegion[] = [
    {
      x: cx,
      y: cy,
      r: 11,
      weight: 1,
      label: detected ? 'Enlarged optic cup' : 'Optic disc — cup within range',
    },
    {
      x: cx - 1,
      y: cy + 7,
      r: 6.5,
      weight: 0.78,
      label: detected ? `${sector} rim thinning` : `${sector} rim intact`,
    },
  ];

  if (detected) {
    regions.push(
      {
        x: cx - 13,
        y: cy + 12,
        r: 8,
        weight: 0.61,
        label: 'RNFL wedge defect, arcuate bundle',
      },
      {
        x: cx + 9,
        y: cy - 4,
        r: 5.5,
        weight: 0.44,
        label: 'Beta-zone peripapillary atrophy',
      },
    );
  } else {
    regions.push({
      x: cx - 12,
      y: cy + 10,
      r: 7,
      weight: 0.4,
      label: 'Arcuate bundle — no wedge defect',
    });
  }

  return regions;
}

/** Deterministic 32-bit hash, so the same file always screens the same way. */
function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

/** Falls through to `advanced`, since a ratio above every band is worse, not unknown. */
function stageForCdr(cdr: number): Stage {
  const match = STAGES.find((s) => cdr >= s.cdr[0] && cdr <= s.cdr[1]);
  return match ? match.id : 'advanced';
}

/**
 * Stand-in for the real inference call. Derived from the file's name and size so
 * that a given image is reproducible across reloads, which matters for a demo:
 * re-running the same photograph and getting a different verdict would rightly
 * destroy any confidence in the thing.
 */
export function runMockInference(fileName: string, fileSize: number): ScreeningResult {
  const seed = hashString(`${fileName}:${fileSize}`);

  // Roughly one in three screened images comes back positive — close to the
  // referable rate in an at-risk screening population, not in the general one.
  const detected = seed % 3 === 0;

  const sector = SECTORS[(seed >> 5) % SECTORS.length] ?? 'Inferior';

  // Positive: 0.58–0.92. Negative: 0.28–0.49, comfortably physiological.
  const cdr = detected
    ? Number((0.58 + ((seed >> 7) % 35) / 100).toFixed(2))
    : Number((0.28 + ((seed >> 7) % 22) / 100).toFixed(2));

  const stage = detected ? stageForCdr(cdr) : null;
  const severity: Severity = stage ? STAGE_BY_ID[stage].severity : 'routine';

  return {
    detected,
    confidence: Number((88.5 + ((seed >> 3) % 105) / 10).toFixed(1)),
    stage,
    severity,
    cdr,
    thinnestSector: sector,
    rnflDefect: detected && cdr >= 0.65,
    attentionRegions: discRegions(seed, detected, sector),
    latencyMs: 108 + (seed % 28),
  };
}

/** Risk score shown on the console gauge, derived from the same measurements. */
export function riskScore(result: ScreeningResult): number {
  const fromCdr = Math.round(((result.cdr - 0.25) / 0.7) * 100);
  const clamped = Math.min(97, Math.max(4, fromCdr));
  return result.detected ? Math.max(REFERRAL_THRESHOLD + 2, clamped) : Math.min(REFERRAL_THRESHOLD - 8, clamped);
}
