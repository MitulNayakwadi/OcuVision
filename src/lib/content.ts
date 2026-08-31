import type { PipelineStep, TeamMember } from '@/types';

export const BRAND = {
  name: 'OcuVision',
  tagline: 'Vision Transformer Glaucoma Screening',
  researchTitle:
    'Vision Transformer-Based Ophthalmic Disease Detection and Advisory System',
  domain: 'Medical Image Analysis',
};

export const HERO = {
  eyebrow: 'Vision Transformer · Glaucoma Screening',
  headline: 'CLARITY BEGINS HERE',
  // How the headline breaks on a phone, where one fitted line would set too small.
  headlineLines: ['CLARITY', 'BEGINS HERE'],
  subhead:
    'Detect glaucomatous optic neuropathy earlier, with transformer-grade analysis of the optic disc and the nerve fibre layer around it.',
  chip: 'Binary screen · Cup-to-disc ratio · Severity stage · Triage advisory',
  primaryCta: 'Initiate Scan Sequence',
  secondaryCta: 'How the model works',
};

export const INTELLIGENCE = {
  eyebrow: 'Architecture',
  title: 'Precision Glaucoma Screening',
  body: 'A Vision Transformer divides the fundus photograph into a grid of patches and lets every patch attend to every other one, so the optic cup is weighed against the rim, the peripapillary atrophy and the arcuate nerve fibre bundles in the same layer. Convolutional networks build that context slowly through stacked local receptive fields, which is precisely why they under-read the disc-to-surround relationship that defines early glaucomatous damage.',
  points: [
    {
      title: 'Global receptive field from layer one',
      body: 'Self-attention relates every patch pair directly, so the cup measured against its own rim — and against the nerve fibre layer two disc diameters away — is a first-class feature rather than something recovered by depth.',
    },
    {
      title: 'One question, answered properly',
      body: 'A binary head trained on a single condition can spend its whole capacity on the disc. There is no class list to hedge across and no threshold to pick per disease.',
    },
    {
      title: 'Attention maps as evidence',
      body: 'The attention rollout that drives the prediction is the same map shown to the clinician, centred on the disc region that decided it, so the output is auditable instead of opaque.',
    },
    {
      title: 'An advisory, not just a label',
      body: 'Every positive screen is mapped to a severity stage, a triage window and a concrete next action, which is the part that actually changes what happens to the patient.',
    },
  ],
};

export const HERO_STATS = [
  { value: 0.982, label: 'AUC-ROC', suffix: '', decimals: 3, note: 'Held-out test split' },
  { value: 120, label: 'Inference', suffix: 'ms', decimals: 0, note: 'Single image, one GPU' },
  { value: 3, label: 'Severity stages', suffix: '', decimals: 0, note: 'Early · Moderate · Advanced' },
];

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'patch',
    index: '01',
    title: 'Patch Extraction',
    summary: 'The fundus image is cut into a grid of fixed-size, non-overlapping patches.',
    detail:
      'A 224×224 pixel fundus image is divided into 196 non-overlapping 16×16 patches, each of which becomes one element of an input sequence. Treating the retina as a sequence of regions rather than a single dense grid is what lets the encoder compare the optic disc directly against tissue far outside it, and it is why the disc no longer has to be localised before it can be assessed.',
    tensor: '224×224×3  →  196 × (16×16×3)',
  },
  {
    id: 'embed',
    index: '02',
    title: 'Linear Embedding',
    summary: 'Each flattened patch is projected to a token and given a positional embedding.',
    detail:
      'Every patch is flattened to a 768-dimensional vector and passed through a single learned linear projection, producing one token per patch. A learnable positional embedding is added so the encoder retains where each patch sat on the retina, and a prepended classification token is carried through the network to aggregate evidence for the final verdict.',
    tensor: '196 × 768  +  1 [CLS]  +  positional',
  },
  {
    id: 'encoder',
    index: '03',
    title: 'Transformer Encoder',
    summary: 'Stacked multi-head self-attention and MLP blocks relate every patch to every other.',
    detail:
      'Twelve encoder blocks each apply layer normalisation, twelve-head self-attention and an MLP, with residual connections around both sub-layers. Within a single block every patch attends to all 196 others, so an enlarged cup, a thinned inferior rim and a wedge-shaped nerve fibre layer defect are integrated as one pattern rather than assembled from local features.',
    tensor: '12 × [MSA(12 heads) → MLP] , residual',
  },
  {
    id: 'head',
    index: '04',
    title: 'Classification Head',
    summary: 'The classification token is mapped to a two-class verdict with a calibrated probability.',
    detail:
      'The final-layer classification token is layer-normalised and passed through a linear head to two logits — glaucoma present or absent — then softmaxed to a calibrated probability. Attention rollout across the twelve blocks produces the disc-centred spatial map surfaced to the clinician as the visual justification for that verdict.',
    tensor: '768  →  2 logits  →  softmax',
  },
  {
    id: 'advisory',
    index: '05',
    title: 'Advisory Layer',
    summary: 'Verdict and cup-to-disc ratio are resolved into a stage, a triage window and a next action.',
    detail:
      'A rule layer combines the verdict, the estimated vertical cup-to-disc ratio and the model confidence into a severity stage — early, moderate or advanced — and one of three triage tiers: routine recall, referral within three months, or urgent review this week. This is the step existing screening tools omit; it converts a probability into something a clinician can act on, with the source image and attention map attached to the referral.',
    tensor: 'verdict + CDR + confidence  →  stage + triage tier',
  },
];

export const METRICS = [
  {
    id: 'auc',
    label: 'AUC-ROC',
    display: '0.982',
    value: 98.2,
    caption: 'Glaucoma versus no glaucoma on the held-out test split.',
  },
  {
    id: 'latency',
    label: 'Inference Time',
    display: '120 ms',
    value: 84,
    caption: 'Median end-to-end latency per image, batch size 1, single GPU.',
    inverted: true,
  },
  {
    id: 'sensitivity',
    label: 'Sensitivity',
    display: '96.4%',
    value: 96.4,
    caption: 'Proportion of glaucomatous discs correctly flagged — the metric that governs screening safety.',
  },
  {
    id: 'specificity',
    label: 'Specificity',
    display: '93.1%',
    value: 93.1,
    caption: 'Proportion of healthy discs correctly returned to routine recall.',
  },
];

export const WHY_WE_BUILT = [
  {
    number: '01',
    title: 'Glaucoma is silent until it is advanced',
    body: 'Peripheral field loss is not noticed, and the fellow eye fills in the gap. Patients routinely present having already lost a large share of their retinal ganglion cells, at which point treatment can only protect what remains — the damage itself is permanent.',
  },
  {
    number: '02',
    title: 'Screening demand outruns the specialist workforce',
    body: 'Much of the world has fewer than one ophthalmologist per 200,000 people, and glaucoma assessment is specialist work. The bottleneck is not treatment capacity — it is the reading of the disc, which is exactly the step that can be shifted upstream to a camera and a primary care clinic.',
  },
  {
    number: '03',
    title: 'Convolutional models under-read the disc in context',
    body: 'A CNN builds context through stacked local receptive fields, so the relationship between the cup, its own rim and the nerve fibre layer arcing away from it is integrated late and weakly. Glaucoma is defined by exactly that relationship, not by any single dramatic finding inside the disc.',
  },
  {
    number: '04',
    title: 'A label is not clinical advice',
    body: 'Systems that output a class and a probability leave the hardest question unanswered: what should happen to this patient, and by when. Without an explicit severity stage and triage window the result gets filed rather than acted upon.',
  },
];

export const SOLUTION_INTRO =
  'OcuVision is one Vision Transformer encoder feeding a two-class head and a rule-based advisory layer. The five stages below are the full inference path from raw fundus photograph to a staged triage recommendation.';

/**
 * The scope statement. Written to be quotable and hard to misread, because the
 * failure mode here is a clinician treating a negative glaucoma screen as a clear
 * retina.
 */
export const SCOPE = {
  eyebrow: 'Scope',
  title: 'One condition, stated plainly',
  detects:
    'This version screens for glaucomatous optic neuropathy and nothing else. It returns a binary verdict, an estimated vertical cup-to-disc ratio, a severity stage and a triage window.',
  excludes:
    'The conditions below are on the roadmap and are not detected. A negative glaucoma screen says nothing about any of them — the model was never trained to see them, so it cannot miss them quietly, and it cannot flag them either.',
  note: 'Any patient with symptoms — sudden visual loss, a curtain across the field, new floaters or photopsia — needs urgent assessment on those symptoms alone, whatever this system reports about the optic disc.',
};

export const MISSION_TABS = {
  mission: {
    title: 'Mission',
    body: [
      'To make competent glaucoma screening available wherever a fundus camera can reach, by removing disc interpretation as the rate-limiting step. A non-invasive photograph, read in about a second, is a lower bar for a patient to clear than a specialist appointment they may never be offered.',
      'That means a system accurate enough to be trusted with a negative result, transparent enough for a clinician to audit, and specific enough about next steps that its output changes a patient pathway rather than adding to a backlog.',
    ],
  },
  vision: {
    title: 'Vision',
    body: [
      'Glaucoma is the first condition, not the only intended one. Diabetic retinopathy is nearest — the EYEPACS corpus already carries clinician ICDR grades — followed by hypertensive retinopathy, retinopathy of prematurity, retinal detachment and tears, intraocular tumours and optic neuritis, each of which needs its own consented dataset and, in several cases, its own imaging modality.',
      'None of those are detected in this version, and the site says so on every page that shows a result. Adding a class list before the evidence exists for it is how screening tools end up trusted for things they were never evaluated on.',
    ],
  },
  team: {
    title: 'Team',
    body: [
      'Two people, one building the model and the platform around it, the other owning the security posture of a system that handles biometric imaging.',
      'Retinal photographs are uniquely identifying, which makes the data-protection work part of the clinical safety case rather than an afterthought bolted on at deployment.',
    ],
  },
  research: {
    title: 'Research',
    body: [
      'A ViT-Base/16 backbone is pretrained on ImageNet-21k and fine-tuned on colour fundus photographs from EYEPACS, loaded through the Hugging Face datasets library. Class-balanced sampling counters the heavy skew toward normal discs that any real screening corpus carries.',
      'Splits are made at patient level with iterative stratification, so no eye appears in both training and test and the class balance survives the split. Evaluation reports AUC-ROC alongside sensitivity and specificity, with sensitivity treated as the primary safety metric — a missed glaucomatous disc costs irreversible field loss, while a false positive costs one specialist appointment.',
    ],
  },
};

/** The fine-tuning stack, listed on the research tab. */
export const RESEARCH_STACK = [
  { name: 'transformers>=4.45,<5', role: 'ViT-Base/16 backbone and training loop' },
  { name: 'datasets', role: 'EYEPACS loading and streaming' },
  { name: 'accelerate', role: 'Mixed-precision and device placement' },
  { name: 'iterative-stratification', role: 'Patient-level stratified splits' },
  { name: 'scikit-learn', role: 'AUC-ROC, sensitivity and specificity' },
  { name: 'pandas · pillow', role: 'Label tables and image decoding' },
  { name: 'matplotlib · seaborn', role: 'ROC curves and confusion matrices' },
  { name: 'tqdm', role: 'Training and evaluation progress' },
];

export const TEAM: TeamMember[] = [
  {
    id: 'mitul',
    name: 'Mitul Nayakwadi',
    role: 'Developer / Head',
    initials: 'MN',
    focus: 'Model architecture & platform',
    bio: 'Mitul leads OcuVision end to end, from the Vision Transformer training pipeline through to the screening interface clinicians actually touch. His work centres on making the attention rollout genuinely legible at the point of care, so that a verdict on the optic disc arrives with its own visual justification rather than as a bare probability.',
    responsibilities: [
      'Vision Transformer architecture, training and evaluation',
      'Attention-rollout explainability pipeline',
      'Screening platform and clinical interface',
      'Dataset curation and patient-level split integrity',
    ],
  },
  {
    id: 'sreenath',
    name: 'P. Sai Sreenath',
    role: 'Cybersecurity Expert',
    initials: 'SS',
    focus: 'Data protection & clinical governance',
    bio: 'Sreenath owns the security posture around retinal imaging data, which is biometric and identifying by nature and cannot be treated as ordinary application data. He designed the encryption, retention and access-control model that lets the platform process a fundus image without ever retaining an identifiable copy of it.',
    responsibilities: [
      'Threat modelling for medical imaging pipelines',
      'Encryption in transit and at rest, key management',
      'De-identification and retention policy',
      'Access control, audit logging and incident response',
    ],
  },
];

export const DATASET = {
  eyebrow: 'Training data',
  title: 'Grounded in clinician-graded retinal imaging',
  body: 'Fine-tuning runs on EYEPACS — a large corpus of colour fundus photographs captured under real screening conditions and graded by clinicians. Variable illumination, artefacts and imperfect framing are kept in rather than filtered out, because that is what a screening camera actually produces, and a model that only reads clean images is no use in a clinic.',
  snippet: `from datasets import load_dataset

ds = load_dataset("ctmedtech/EYEPACS")`,
  facts: [
    { label: 'Primary corpus', value: 'EYEPACS colour fundus photography' },
    { label: 'Loader', value: 'Hugging Face datasets' },
    { label: 'Split strategy', value: 'Patient-level, iterative stratification' },
    { label: 'Target', value: 'Glaucomatous optic neuropathy, binary' },
  ],
  note: 'EYEPACS is a diabetic retinopathy screening corpus; its photographs carry the optic disc in every frame, which is what makes it usable for glaucoma pretraining. Disc-specific labels come from complementary public glaucoma datasets, and no submitted image is ever added to any corpus.',
};

export const MODALITIES = [
  {
    id: 'cfp',
    name: 'Colour Fundus Photography',
    body: 'The workhorse of retinal screening: a single flash image of the posterior pole showing the optic disc, macula and vascular arcades. Fast, non-invasive and the modality most screening programmes already own — and the only input this version accepts for a verdict.',
    detail: ['45–50° field of view', 'No dye required', 'Optic disc present in every frame'],
  },
  {
    id: 'ffa',
    name: 'Fundus Fluorescein Angiography',
    body: 'Sodium fluorescein is injected intravenously and a timed image sequence records the dye transit through the retinal circulation. It reveals perfusion and barrier failure a colour photograph cannot show at all, and it is where the vascular conditions on the roadmap will be read.',
    detail: [
      'Arterial, arteriovenous and late phases',
      'Capillary non-perfusion and leakage',
      'Roadmap modality — not used for the glaucoma verdict',
    ],
  },
];

export const PIPELINE_STAGES = [
  { label: 'Image acquired', done: true },
  { label: 'Quality gate', done: true },
  { label: 'Patch embedding', done: true },
  { label: 'Attention encoding', done: true },
  { label: 'Disc verdict', done: false },
  { label: 'Severity staging', done: false },
  { label: 'Clinician sign-off', done: false },
];

export const HOW_IT_WORKS = [
  {
    index: '01',
    title: 'Upload',
    body: 'Drop in a colour fundus photograph — JPG, PNG or DICOM, up to 15 MB. The file is read in this browser tab and never leaves it.',
  },
  {
    index: '02',
    title: 'ViT Analysis',
    body: 'The image is cut into 196 patches and passed through twelve transformer blocks, each relating the optic disc to every other region of the retina.',
  },
  {
    index: '03',
    title: 'Advisory Report',
    body: 'You get a verdict, a confidence figure, an estimated cup-to-disc ratio, a severity stage and a triage window — with the attention map that produced them.',
  },
];

export const DISCLAIMER =
  'OcuVision is a research prototype, not a registered medical device. It screens for glaucoma only and detects no other condition. Every output requires confirmation by a qualified clinician and must not be used as the sole basis for a diagnosis or treatment decision.';

export const LEGAL = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated 30 August 2026',
    sections: [
      {
        heading: 'What we process',
        body: 'The only data OcuVision needs is the retinal image you submit and the technical metadata attached to it — dimensions, capture settings and, for DICOM files, the acquisition tags. We do not ask for a name, a date of birth or a medical record number, and the interface provides nowhere to enter them.',
      },
      {
        heading: 'Retinal images are biometric data',
        body: 'A fundus photograph is uniquely identifying, so we treat it as biometric data rather than as an ordinary upload. In this research prototype the image is held in your browser for the duration of the session and is never transmitted to a server or written to persistent storage.',
      },
      {
        heading: 'DICOM de-identification',
        body: 'Where a DICOM file is submitted in a deployed configuration, patient-identifying tags are stripped before the pixel data reaches the model, and the original file is never retained. Only the de-identified pixel array and the technical acquisition parameters are used.',
      },
      {
        heading: 'No training on submitted images',
        body: 'Images submitted through this interface are not added to any training corpus. Model development uses separately consented, licensed research datasets, and there is no pathway by which a screening submission becomes training data.',
      },
      {
        heading: 'Your rights',
        body: 'Because nothing is stored, there is no record to export or erase — closing the tab ends the processing. In a deployed clinical configuration, access, correction and erasure requests are handled by the operating institution under its own data protection obligations.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated 30 August 2026',
    sections: [
      {
        heading: 'Research use only',
        body: 'OcuVision is an academic research prototype. It holds no regulatory clearance from any medical device authority and is not approved for clinical diagnosis, triage or treatment planning.',
      },
      {
        heading: 'Glaucoma only',
        body: 'The model is trained and evaluated on glaucomatous optic neuropathy alone. Diabetic and hypertensive retinopathy, retinopathy of prematurity, retinal detachment and tears, intraocular tumours and optic neuritis are not detected. A negative result carries no information whatsoever about those conditions.',
      },
      {
        heading: 'Not a substitute for clinical judgement',
        body: 'Output is decision support and nothing more. A qualified clinician must independently review every image and every advisory, and clinical judgement takes precedence over any model output in all cases.',
      },
      {
        heading: 'A negative result is not a clearance',
        body: 'No screening model has perfect sensitivity. A "no glaucoma detected" result does not exclude glaucoma, and any patient with symptoms — sudden visual loss, a field defect, new floaters or photopsia — requires urgent assessment regardless of what this system reports.',
      },
      {
        heading: 'Acceptable use',
        body: 'Do not submit images you lack the authority to process, and do not attempt to re-identify any individual from an image or an output. Do not present OcuVision output to a patient as a diagnosis.',
      },
      {
        heading: 'No warranty',
        body: 'The platform is provided as-is, without warranty of accuracy, availability or fitness for a particular purpose. Performance figures quoted throughout describe held-out research evaluations and are not a guarantee of behaviour on your imaging equipment or patient population.',
      },
    ],
  },
};

export const FOOTER_LINKS = {
  product: [
    { label: 'Screen an Image', to: '/screen' },
    { label: 'How it works', to: '/about#solution' },
    { label: 'Performance metrics', to: '/about#metrics' },
    { label: 'What we screen for', to: '/#glaucoma' },
  ],
  research: [
    { label: 'Why we built this', to: '/about#why' },
    { label: 'Training data', to: '/#dataset' },
    { label: 'Roadmap conditions', to: '/#scope' },
    { label: 'Team', to: '/about#mission' },
  ],
};

export const CONTACT = {
  title: 'Contact the team',
  body: 'Questions about the architecture, the evaluation protocol or a possible clinical collaboration are all welcome. Please do not send patient-identifiable information or retinal images through this form.',
  affiliation: `${BRAND.researchTitle} · ${BRAND.domain}`,
};
