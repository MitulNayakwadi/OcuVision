export type Severity = 'routine' | 'watch' | 'urgent';

export type Modality = 'Colour Fundus' | 'FFA' | 'Either';

/**
 * Glaucoma severity stage. `null` on a negative screen — staging a disease the
 * model did not detect is exactly the kind of overclaim this build avoids.
 */
export type Stage = 'early' | 'moderate' | 'advanced';

export interface StageBand {
  id: Stage;
  label: string;
  /** Inclusive vertical cup-to-disc ratio band this stage covers. */
  cdr: [number, number];
  /** What the disc looks like at this stage. */
  description: string;
  /** Triage tier a positive screen at this stage maps to. */
  severity: Severity;
}

/**
 * A condition the model does *not* detect. Listed on the site deliberately: an
 * ophthalmic screening tool that silently ignores retinal detachment is more
 * dangerous than one that says so on the page.
 */
export interface RoadmapCondition {
  id: string;
  name: string;
  short: string;
  /** Why it is out of scope for v1, in clinical terms. */
  note: string;
  modality: Modality;
}

export interface QuarterPoint {
  quarter: string;
  confidence: number;
  /** Neutral comparison series — the convolutional baseline. */
  baseline: number;
}

/** One day of the mock weekly risk-score trend. */
export interface RiskPoint {
  day: string;
  label: string;
  /** Screening risk score, 0–100. Above `REFERRAL_THRESHOLD` is referable. */
  risk: number;
  scans: number;
}

export interface PipelineStep {
  id: string;
  index: string;
  title: string;
  summary: string;
  detail: string;
  tensor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  focus: string;
  bio: string;
  responsibilities: string[];
}

/**
 * One screening run. Binary by design — the head has two outputs, so the result
 * carries a verdict plus the clinical measurements behind it, never a class list.
 */
export interface ScreeningResult {
  /** True when glaucomatous optic neuropathy is predicted. */
  detected: boolean;
  /** Softmax probability of the reported verdict, as a percentage. */
  confidence: number;
  /** Populated only on a positive screen. */
  stage: Stage | null;
  severity: Severity;
  /** Vertical cup-to-disc ratio estimated from the disc segmentation. */
  cdr: number;
  /** ISNT quadrant carrying the thinnest neuroretinal rim. */
  thinnestSector: string;
  /** Retinal nerve fibre layer wedge defect present. */
  rnflDefect: boolean;
  attentionRegions: AttentionRegion[];
  latencyMs: number;
}

export interface AttentionRegion {
  /** Percentage coordinates within the image frame. */
  x: number;
  y: number;
  /** Radius as a percentage of frame width. */
  r: number;
  /** Normalised activation, 0–1. */
  weight: number;
  label: string;
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  width: number | null;
  height: number | null;
  isDicom: boolean;
}
