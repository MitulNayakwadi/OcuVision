# OcuVision — Vision Transformer Glaucoma Screening & Advisory System

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)

> **Research Title**: *Vision Transformer-Based Ophthalmic Disease Detection and Advisory System*  
> **Domain**: Medical Image Analysis & Explainable Deep Learning

---

## 👁️ Overview

**OcuVision** is an advanced ophthalmic decision-support system designed to detect glaucomatous optic neuropathy earlier and more reliably than standard convolutional models. 

By leveraging a **Vision Transformer (ViT-Base/16)** backbone, OcuVision relates every retinal patch to all other patches across the fundus photograph from layer one. This global receptive field enables the model to weigh the optic cup against its neuroretinal rim, peripapillary atrophy, and retinal nerve fiber layer (RNFL) bundles—capturing the structural relationships that define early glaucomatous damage.

Beyond a binary classification label, OcuVision generates an **Explainable Attention Rollout Map**, estimates the **Vertical Cup-to-Disc Ratio (CDR)**, classifies the condition into **Severity Stages**, and produces a concrete **Triage Advisory Window** for clinical follow-up.

---

## ✨ Key Features

- **🌐 Global Self-Attention (ViT-Base/16)**:
  - 196 non-overlapping patches ($16 \times 16$) processed across 12 Multi-Head Self-Attention (MSA) blocks.
  - Relates the optic disc directly against distant arcuate nerve fiber bundles without needing prior manual disc localization.
- **🔍 Explainable Attention Rollout**:
  - Surfaces the multi-layer attention rollout directly onto the clinician's viewport as an auditable heat map over the optic disc.
- **📊 Cup-to-Disc Ratio (CDR) & Severity Staging**:
  - Evaluates disc excavation and rim thinning, classifying findings into *Early*, *Moderate*, or *Advanced* glaucomatous optic neuropathy.
- **⏱️ Actionable Clinical Triage Advisory**:
  - Maps predictions into concrete clinical actions: Routine recall, Referral within 3 months, or Urgent review within 1 week.
- **🎨 Immersive 3D Eyeball Visualization**:
  - Interactive, real-time 3D anatomical eye model rendered via Three.js and `@react-three/fiber` with custom lighting and mouse-tracking parallax.
- **🔒 Privacy-First & Client-Side Processing**:
  - Fundus photographs are processed safely inside the browser tab; raw biometric images are never permanently stored or shared without consent.
- **📱 Responsive & Accessible UI**:
  - Built with Tailwind CSS, Framer Motion, Recharts, and Lenis smooth scrolling for a modern medical interface.

---

## 📈 Benchmark Performance

Evaluated on held-out test splits with patient-level iterative stratification:

| Metric | Score | Note |
| :--- | :---: | :--- |
| **AUC-ROC** | **0.982** | Held-out test split evaluation |
| **Sensitivity** | **96.4%** | Primary safety metric (minimizing missed cases) |
| **Specificity** | **93.1%** | Healthy discs correctly returned to routine recall |
| **Inference Latency** | **~120 ms** | Median end-to-end latency per single image |

---

## 🔬 Model Architecture Pipeline

```text
Fundus Image (224×224×3)
   │
   ▼
[ 01. Patch Extraction ]    ── 196 non-overlapping patches (16×16×3)
   │
   ▼
[ 02. Linear Embedding ]    ── 768-dim projection + Positional Embeddings + [CLS] token
   │
   ▼
[ 03. Transformer Encoder]  ── 12 Blocks: Multi-Head Self-Attention (12 heads) + MLP + Residuals
   │
   ▼
[ 04. Classification Head]  ── [CLS] LayerNorm → Linear Head → 2 Logits → Softmax + Attention Rollout
   │
   ▼
[ 05. Clinical Advisory ]   ── Verdict + Cup-to-Disc Ratio (CDR) → Severity Stage + Triage Window
```

---

## 🛠️ Tech Stack

### Frontend & UI
- **Framework**: [React 18](https://reactjs.org/) + [Vite 5](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + [Lenis](https://lenis.darkroom.engineering/) (Smooth Scroll)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons & UI Utilities**: Lucide React / Custom SVG, `clsx`, `tailwind-merge`

### ML & Research Fine-Tuning Stack
- `transformers (>=4.45,<5)` — ViT-Base/16 backbone and fine-tuning pipeline
- `datasets` — EYEPACS fundus photography streaming and batching
- `accelerate` — Mixed-precision training and hardware acceleration
- `iterative-stratification` — Patient-level stratified split preservation
- `scikit-learn` — AUC-ROC, confusion matrix, sensitivity and specificity metrics

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MitulNayakwadi/OcuVision.git
   cd OcuVision
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 👥 Authors & Team

- **Mitul Nayakwadi** — *Developer / Project Head*  
  Model architecture, Vision Transformer training, explainability pipeline, and screening platform interface.
- **P. Sai Sreenath** — *Cybersecurity Specialist*  
  Biometric data protection, de-identification architecture, access control, and clinical data governance.
- **Md.Mudabbir Ali khan** — *Developer*  
   
---

## ⚠️ Medical Disclaimer

**OcuVision is an academic research prototype and not a certified medical device.**  
It is developed strictly for research and educational purposes. It screens specifically for glaucomatous optic neuropathy and does not clear a patient for other ocular conditions (such as diabetic retinopathy, retinal detachment, or macular degeneration). All automated outputs and advisories must be independently validated by a qualified ophthalmologist or eyecare professional before any clinical diagnosis or treatment decision is made.
