import { useState, useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Cpu, RefreshCw, Upload, Check, AlertTriangle, Layers } from '@/components/ui/Icons';
import type { ModelStatus } from '@/types';
import { uploadModelCheckpoint } from '@/lib/api';
import { cn } from '@/lib/cn';

interface ModelManagerCardProps {
  status: ModelStatus | null;
  loading: boolean;
  onRefresh: () => void;
  onSelectCheckpoint: (name: string) => void;
  isSwitching: boolean;
}

export function ModelManagerCard({
  status,
  loading,
  onRefresh,
  onSelectCheckpoint,
  isSwitching,
}: ModelManagerCardProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [targetSlot, setTargetSlot] = useState<'best_model.pth' | 'latest_checkpoint.pth'>('best_model.pth');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pth') && !file.name.endsWith('.pt')) {
      setUploadError('Please select a valid PyTorch model file with .pth or .pt extension.');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(null);

      // Determine saved filename: prefer user's chosen slot or preserve best_model/latest_checkpoint
      let saveName = targetSlot;
      if (file.name === 'best_model.pth' || file.name === 'latest_checkpoint.pth') {
        saveName = file.name;
      }

      const res = await uploadModelCheckpoint(file, saveName);
      if (res.success) {
        setUploadSuccess(`Successfully linked ${saveName} (${(file.size / (1024 * 1024)).toFixed(1)} MB) to frontend!`);
        onRefresh();
      } else {
        setUploadError(res.error || 'Failed to upload and load model.');
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isConnected = status?.connected ?? false;
  const isModelLoaded = isConnected && (status?.model_loaded ?? false);
  const activeName = status?.active_checkpoint;
  const checkpoints = status?.available_checkpoints ?? [];

  return (
    <GlassCard radius="panel" className="relative overflow-hidden p-5 sm:p-7">
      {/* Decorative top accent line */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-[2px] transition-colors duration-500',
          isModelLoaded ? 'bg-vitality' : isConnected ? 'bg-amber-500' : 'bg-slate-300',
        )}
      />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'relative flex h-3 w-3 items-center justify-center rounded-full',
              isModelLoaded
                ? 'bg-emerald-500'
                : isConnected
                  ? 'bg-amber-500'
                  : 'bg-slate-400',
            )}
          >
            {isModelLoaded && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
          </span>

          <div>
            <h3 className="font-display text-[14px] uppercase tracking-[0.02em] text-charcoal sm:text-[15px]">
              PyTorch Model Engine (.pth)
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-cool">
              {isModelLoaded
                ? `Active checkpoint: ${activeName} · ${status?.device}`
                : isConnected
                  ? 'Waiting for best_model.pth or latest_checkpoint.pth'
                  : 'Backend server offline · Showing demonstration simulation'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading || isSwitching}
          className="inline-flex h-8 items-center gap-2 rounded-chip border border-slate-hair bg-white/70 px-3.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-charcoal transition-all hover:border-vitality/50 hover:bg-white active:scale-95 disabled:opacity-50"
          title="Rescan models/ folder for new or updated .pth files"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', (loading || isSwitching) && 'animate-spin')} />
          Sync models/
        </button>
      </div>

      {/* Checkpoints in folder */}
      <div className="mt-5 sm:mt-6">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-vitality-ink">
          Detected Checkpoints in <code className="lowercase bg-black/5 px-1 py-0.5 rounded font-mono">/models</code>
        </p>

        {checkpoints.length > 0 ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {checkpoints.map((cp) => {
              const isActive = cp.name === activeName;
              return (
                <button
                  key={cp.name}
                  type="button"
                  onClick={() => onSelectCheckpoint(cp.name)}
                  disabled={isSwitching || isActive}
                  className={cn(
                    'group relative flex flex-col items-start rounded-card border p-4 text-left transition-all duration-200',
                    isActive
                      ? 'border-vitality/60 bg-vitality-soft/60 shadow-sm ring-1 ring-vitality/30'
                      : 'border-slate-hair bg-white/50 hover:border-charcoal/20 hover:bg-white',
                    isSwitching && 'opacity-60 cursor-not-allowed',
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="font-mono text-[12px] font-semibold text-charcoal group-hover:text-vitality-ink">
                      {cp.name}
                    </span>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-chip bg-vitality px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white">
                        <Check className="h-2.5 w-2.5" />
                        Active
                      </span>
                    ) : (
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-slate-cool group-hover:text-charcoal">
                        Click to activate
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex w-full items-center justify-between font-mono text-[10px] text-slate-warm">
                    <span>Size: {cp.size_formatted}</span>
                    <span>Modified: {cp.modified_at ? cp.modified_at.slice(0, 10) : 'Recent'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 rounded-card border border-dashed border-slate-hair bg-white/40 p-5 text-center">
            <Layers className="mx-auto h-6 w-6 text-slate-cool" />
            <p className="mt-2 font-display text-[13px] uppercase text-charcoal">
              No .pth model found in <code className="lowercase font-mono text-slate-warm">/models</code> folder
            </p>
            <p className="mt-1 text-[12px] text-slate-warm">
              Drop <code className="font-mono font-medium text-charcoal">best_model.pth</code> or{' '}
              <code className="font-mono font-medium text-charcoal">latest_checkpoint.pth</code> into the{' '}
              <code className="font-mono text-charcoal">models/</code> directory on disk, or upload below.
            </p>
          </div>
        )}
      </div>

      {/* Model Direct Upload or Drop */}
      <div className="mt-5 border-t border-slate-hair pt-4 sm:mt-6 sm:pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-vitality-ink">
              Upload .pth model to folder:
            </span>
            <div className="inline-flex rounded-chip border border-slate-hair bg-white/70 p-0.5">
              <button
                type="button"
                onClick={() => setTargetSlot('best_model.pth')}
                className={cn(
                  'rounded-chip px-2.5 py-0.5 font-mono text-[9.5px] uppercase transition-colors',
                  targetSlot === 'best_model.pth'
                    ? 'bg-charcoal text-white font-medium'
                    : 'text-slate-cool hover:text-charcoal',
                )}
              >
                best_model.pth
              </button>
              <button
                type="button"
                onClick={() => setTargetSlot('latest_checkpoint.pth')}
                className={cn(
                  'rounded-chip px-2.5 py-0.5 font-mono text-[9.5px] uppercase transition-colors',
                  targetSlot === 'latest_checkpoint.pth'
                    ? 'bg-charcoal text-white font-medium'
                    : 'text-slate-cool hover:text-charcoal',
                )}
              >
                latest_checkpoint.pth
              </button>
            </div>
          </div>

          <label
            htmlFor="pth-file-upload"
            className={cn(
              'inline-flex h-8 cursor-pointer items-center gap-2 rounded-chip bg-charcoal px-3.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-white transition-all hover:bg-vitality-ink active:scale-95',
              uploading && 'opacity-60 cursor-not-allowed',
            )}
          >
            <Upload className="h-3 w-3" />
            {uploading ? 'Uploading & linking...' : `Upload to ${targetSlot}`}
          </label>
          <input
            ref={fileInputRef}
            id="pth-file-upload"
            type="file"
            accept=".pth,.pt"
            disabled={uploading}
            onChange={handleFileUpload}
            className="sr-only"
          />
        </div>

        {uploadSuccess && (
          <p className="mt-3 flex items-center gap-2 rounded-card border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 font-mono text-[11px] text-emerald-800">
            <Check className="h-3.5 w-3.5 shrink-0" />
            {uploadSuccess}
          </p>
        )}

        {uploadError && (
          <p className="mt-3 flex items-center gap-2 rounded-card border border-red-500/20 bg-red-500/10 px-3.5 py-2 font-mono text-[11px] text-red-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {uploadError}
          </p>
        )}
      </div>

      {/* Model Architecture Specifications Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-slate-hair/60 pt-3.5 font-mono text-[10px] text-slate-cool">
        <span className="flex items-center gap-1.5">
          <Cpu className="h-3 w-3 text-slate-warm" />
          Architecture: <strong className="text-charcoal">{status?.architecture || 'ViT-Base/16'}</strong>
        </span>
        <span>
          Parameters: <strong className="text-charcoal">{status?.total_parameters || '85.8M'}</strong>
        </span>
        <span>
          Input: <strong className="text-charcoal">224 × 224 RGB (196 patches)</strong>
        </span>
        <span>
          Folder: <code className="lowercase text-charcoal font-semibold">models/</code>
        </span>
      </div>
    </GlassCard>
  );
}
