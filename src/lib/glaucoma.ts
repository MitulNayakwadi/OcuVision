import type { QuarterPoint, RiskPoint, RoadmapCondition, StageBand } from '@/types';

/**
 * The one condition this model screens for. Everything on the site keys off this
 * object; there is no class list and no disease selector, because the head has
 * two outputs.
 */
export const GLAUCOMA = {
  id: 'glaucoma',
  name: 'Glaucoma',
  full: 'Glaucomatous optic neuropathy',
  short: 'Glaucoma',
  modality: 'Colour Fundus' as const,
  description:
    'A progressive optic neuropathy in which retinal ganglion cell axons are lost at the optic disc, widening the cup relative to the disc and thinning the neuroretinal rim. The damage is irreversible and the visual field loss starts in the periphery, so a patient typically notices nothing until a substantial part of the nerve is already gone.',
  findings: [
    'Increased vertical cup-to-disc ratio',
    'Neuroretinal rim thinning and ISNT-rule violation',
    'Wedge-shaped retinal nerve fibre layer defects',
    'Disc-margin (Drance) haemorrhage',
    'Beta-zone peripapillary atrophy and inter-eye asymmetry',
  ],
  burden:
    'Glaucoma affects roughly 76 million people and is the leading cause of irreversible blindness worldwide. Around half of those affected in high-income countries — and the large majority elsewhere — are undiagnosed, because the disease is painless and asymptomatic until the visual field is measurably damaged.',
};

/** The verdict labels, kept in one place so the console and the copy agree. */
export const VERDICT = {
  positive: 'Glaucoma Detected',
  negative: 'No Glaucoma Detected',
};

/** Risk score above which a case is treated as referable. */
export const REFERRAL_THRESHOLD = 60;

/**
 * Severity staging. Cup-to-disc ratio alone does not diagnose glaucoma — a large
 * physiological cup exists — so each band pairs the ratio with the structural sign
 * that has to accompany it.
 */
export const STAGES: StageBand[] = [
  {
    id: 'early',
    label: 'Early',
    cdr: [0.55, 0.64],
    description:
      'Cup enlarged beyond the physiological range with the inferior or superior rim beginning to thin. Visual field loss, if present, is confined to a small paracentral or nasal defect.',
    severity: 'watch',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    cdr: [0.65, 0.79],
    description:
      'Clear ISNT-rule violation with a localised rim notch and a visible nerve fibre layer wedge defect. An arcuate field defect is usually established by this point.',
    severity: 'watch',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    cdr: [0.8, 0.95],
    description:
      'Rim loss approaching the disc margin, with baring of the lamina cribrosa and vessel bayonetting. Central acuity may still be normal while most of the peripheral field has gone.',
    severity: 'urgent',
  },
];

export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<
  StageBand['id'],
  StageBand
>;

/**
 * Conditions the model does not detect. Named on the site so that a negative
 * glaucoma screen is never mistaken for a clear retina — several of these are
 * sight- or life-threatening and sit in the same photograph.
 */
export const ROADMAP: RoadmapCondition[] = [
  {
    id: 'dr',
    name: 'Diabetic Retinopathy',
    short: 'Diabetic',
    note: 'Microaneurysms, haemorrhages and neovascularisation graded on the five-step ICDR scale. Closest to release, since the EYEPACS corpus already carries clinician DR grades.',
    modality: 'Either',
  },
  {
    id: 'htn',
    name: 'Hypertensive Retinopathy',
    short: 'Hypertensive',
    note: 'Arteriolar narrowing, AV nicking, flame haemorrhages and disc swelling. Needs calibrated vessel-calibre measurement rather than the disc-region attention this version uses.',
    modality: 'Colour Fundus',
  },
  {
    id: 'rop',
    name: 'Retinopathy of Prematurity',
    short: 'ROP',
    note: 'Zone, stage and plus disease in neonates. Requires wide-field infant imaging — a different camera, a different field of view and its own consented dataset.',
    modality: 'Colour Fundus',
  },
  {
    id: 'detachment',
    name: 'Retinal Detachment',
    short: 'Detachment',
    note: 'Elevated, corrugated retina with a demarcation line. Time-critical: any patient reporting a curtain, new floaters or photopsia needs same-day assessment regardless of what this system reports.',
    modality: 'Colour Fundus',
  },
  {
    id: 'tear',
    name: 'Retinal Tears',
    short: 'Tears',
    note: 'Horseshoe or operculated breaks, usually peripheral. Frequently outside the 45–50° field a screening fundus photograph captures at all.',
    modality: 'Colour Fundus',
  },
  {
    id: 'tumour',
    name: 'Intraocular Tumours',
    short: 'Tumours',
    note: 'Choroidal melanoma, naevus and metastasis. Separating benign from malignant needs ultrasound and thickness data that no photograph contains.',
    modality: 'Either',
  },
  {
    id: 'neuritis',
    name: 'Optic Neuritis',
    short: 'Neuritis',
    note: 'Disc swelling with pain on eye movement and a relative afferent pupillary defect. Shares the optic disc with glaucoma but is inflammatory, and the two must not be conflated.',
    modality: 'Either',
  },
];

/**
 * Held-out sensitivity for referable glaucoma across four evaluation rounds,
 * against a ResNet-50 trained on the same splits. Two series, so the chart that
 * reads this carries a legend.
 */
export const QUARTERLY_SENSITIVITY: QuarterPoint[] = [
  { quarter: 'R1', confidence: 88.4, baseline: 84.1 },
  { quarter: 'R2', confidence: 91.7, baseline: 86.0 },
  { quarter: 'R3', confidence: 94.6, baseline: 87.2 },
  { quarter: 'R4', confidence: 96.4, baseline: 88.5 },
];

/**
 * Mock weekly trend for the console's statistics panel — the mean glaucoma risk
 * score across each day's screened images, not a per-patient reading.
 */
export const WEEKLY_RISK: RiskPoint[] = [
  { day: 'Mon', label: 'Monday', risk: 34, scans: 22 },
  { day: 'Tue', label: 'Tuesday', risk: 41, scans: 26 },
  { day: 'Wed', label: 'Wednesday', risk: 38, scans: 24 },
  { day: 'Thu', label: 'Thursday', risk: 57, scans: 29 },
  { day: 'Fri', label: 'Friday', risk: 66, scans: 31 },
  { day: 'Sat', label: 'Saturday', risk: 52, scans: 19 },
  { day: 'Sun', label: 'Sunday', risk: 44, scans: 14 },
];

/** Images analysed per day, for the hero activity card. */
export const WEEKLY_ACTIVITY = WEEKLY_RISK.map(({ day, label, scans }) => ({
  day,
  label,
  scans,
}));
