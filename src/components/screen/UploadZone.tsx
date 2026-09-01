import { useCallback, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { AlertTriangle, Close, EyeScan, Upload } from '@/components/ui/Icons';
import type { UploadedImage } from '@/types';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/cn';

const MAX_BYTES = 15 * 1024 * 1024;
const PHOTO_TYPES = ['image/jpeg', 'image/png'];
const DICOM_PATTERN = /\.(dcm|dicom)$/i;

const ACCEPT = 'image/jpeg,image/png,application/dicom,.dcm,.dicom';

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Reads intrinsic dimensions so the result panel can report the real frame size. */
function readDimensions(url: string) {
  return new Promise<{ width: number | null; height: number | null }>((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: null, height: null });
    img.src = url;
  });
}

/**
 * File intake. The zone is a drop target *and* a focusable control: the input stays
 * in the accessibility tree as an `sr-only` element rather than being replaced by a
 * div, so Enter and Space open the picker natively and screen readers announce a
 * file input instead of a mystery region.
 */
export function UploadZone({
  image,
  onSelect,
  onClear,
  onAnalyze,
}: {
  image: UploadedImage | null;
  onSelect: (image: UploadedImage) => void;
  onClear: () => void;
  onAnalyze: () => void;
}) {
  const inputId = `upload-${useId().replace(/:/g, '')}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const reduced = useReducedMotionSafe();

  // dragenter/dragleave fire for every descendant, so depth is counted rather
  // than treating the first leave as "the pointer left the zone".
  const depth = useRef(0);

  const ingest = useCallback(
    async (file: File) => {
      const isDicom = DICOM_PATTERN.test(file.name) || file.type === 'application/dicom';

      if (!isDicom && !PHOTO_TYPES.includes(file.type)) {
        setError(
          `${file.name || 'That file'} is not a supported format. Submit a JPG or PNG fundus photograph, or a DICOM study.`,
        );
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(
          `${formatSize(file.size)} exceeds the 15 MB limit. Export the frame at a lower compression level and try again.`,
        );
        return;
      }
      if (file.size === 0) {
        setError('That file is empty. Check the export and try again.');
        return;
      }

      setError(null);

      // DICOM pixel data needs a decoder the browser does not have, so the
      // prototype acknowledges the file without pretending to render it.
      if (isDicom) {
        onSelect({ file, previewUrl: '', width: null, height: null, isDicom: true });
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const { width, height } = await readDimensions(previewUrl);
      onSelect({ file, previewUrl, width, height, isDicom: false });
    },
    [onSelect],
  );

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    depth.current = 0;
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void ingest(file);
  };

  return (
    <GlassCard radius="panel" className="p-5 sm:p-7 lg:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <Eyebrow withRule tone="vitality">
          Step 01 · Retinal image
        </Eyebrow>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-cool">
          JPG · PNG · DICOM — max 15 MB
        </span>
      </div>

      {/* ---------------- Drop zone ---------------- */}
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          depth.current += 1;
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          depth.current -= 1;
          if (depth.current <= 0) {
            depth.current = 0;
            setDragging(false);
          }
        }}
        onDrop={onDrop}
        className={cn(
          'relative mt-5 sm:mt-7 overflow-hidden rounded-card border-2 border-dashed transition-colors duration-200 ease-clinical',
          'focus-within:border-vitality focus-within:ring-2 focus-within:ring-vitality/30',
          dragging
            ? 'border-vitality bg-vitality-soft/70'
            : 'border-[rgba(26,28,28,0.14)] bg-white/45 hover:border-[rgba(26,28,28,0.26)]',
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          aria-describedby={`${inputId}-hint`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void ingest(file);
            // Cleared so re-selecting the same file still fires a change event.
            e.target.value = '';
          }}
        />

        {image ? (
          <ImagePreview image={image} onClear={onClear} />
        ) : (
          <div className="flex flex-col items-center px-4 py-10 text-center sm:px-6 sm:py-14">
            <motion.span
              aria-hidden="true"
              animate={reduced || dragging ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-chrome shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_6px_18px_rgba(26,28,28,0.09)]"
            >
              <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-charcoal" />
            </motion.span>

            <p className="mt-5 sm:mt-6 font-display text-[14px] sm:text-[15px] uppercase tracking-[0.01em] text-charcoal">
              {dragging ? 'Release to load' : 'Drop a fundus image here'}
            </p>

            <p
              id={`${inputId}-hint`}
              className="mt-2 max-w-sm text-[12.5px] sm:text-[13px] leading-relaxed text-slate-warm"
            >
              A colour fundus photograph or an angiogram frame. Nothing leaves your
              browser — the image is held in memory for this session only.
            </p>

            <label
              htmlFor={inputId}
              className="mt-6 sm:mt-7 inline-flex h-11 cursor-pointer items-center gap-2 rounded-chip bg-charcoal px-5 text-sm font-medium text-canvas transition-transform duration-200 ease-clinical hover:scale-[1.02]"
            >
              <EyeScan className="h-4 w-4" />
              Browse files
            </label>
          </div>
        )}
      </div>

      {/* ---------------- Validation ---------------- */}
      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-card border border-[rgba(186,26,26,0.22)] bg-[rgba(186,26,26,0.06)] px-4 py-3 text-[13px] leading-snug text-danger"
        >
          <AlertTriangle className="mt-[2px] h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      {/* ---------------- Analyse ---------------- */}
      <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-hair pt-5 sm:pt-6">
        <p className="max-w-xs text-[11.5px] leading-relaxed text-slate-cool">
          {image
            ? 'Inference runs locally against the demonstration model. Results are illustrative.'
            : 'Load an image to enable analysis.'}
        </p>

        <PillButton
          variant="primary"
          size="lg"
          disabled={!image}
          onClick={onAnalyze}
          className="w-full sm:w-auto"
          iconRight={<EyeScan className="h-4 w-4" />}
        >
          Run analysis
        </PillButton>
      </div>
    </GlassCard>
  );
}

function ImagePreview({
  image,
  onClear,
}: {
  image: UploadedImage;
  onClear: () => void;
}) {
  return (
    <div className="grid gap-5 p-4 sm:p-6 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-center">
      <div className="relative aspect-square overflow-hidden rounded-card border border-slate-hair bg-charcoal">
        {image.isDicom ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <span className="h-10 w-10 rounded-full bg-chrome" aria-hidden="true" />
            <span className="font-mono text-[9.5px] uppercase leading-relaxed tracking-[0.12em] text-white/60">
              DICOM loaded
              <br />
              pixel data not previewed
            </span>
          </div>
        ) : (
          <img
            src={image.previewUrl}
            alt="Uploaded retinal image awaiting analysis"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate font-display text-[14px] uppercase text-charcoal" title={image.file.name}>
          {image.file.name}
        </p>

        <dl className="mt-4 space-y-2">
          <Meta label="Size" value={formatSize(image.file.size)} />
          <Meta
            label="Frame"
            value={
              image.width && image.height ? `${image.width} × ${image.height} px` : 'Not read'
            }
          />
          <Meta label="Format" value={image.isDicom ? 'DICOM study' : image.file.type.replace('image/', '').toUpperCase()} />
        </dl>

        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex h-8 items-center gap-1.5 rounded-chip border border-slate-hair bg-white/70 px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-cool transition-colors duration-200 hover:border-danger/40 hover:text-danger"
        >
          <Close className="h-3 w-3" />
          Remove
        </button>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-slate-hair pb-2 last:border-b-0">
      <dt className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-slate-cool">
        {label}
      </dt>
      <dd className="font-mono text-[11px] text-charcoal">{value}</dd>
    </div>
  );
}
