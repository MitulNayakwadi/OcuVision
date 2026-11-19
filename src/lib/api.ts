import type { ModelStatus, ScreeningResult } from '@/types';

const API_BASE = '/api';

/**
 * Checks the status of the PyTorch model backend and available checkpoints in models/ folder.
 */
export async function fetchModelStatus(): Promise<ModelStatus> {
  try {
    const res = await fetch(`${API_BASE}/model/status`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    return {
      connected: false,
      model_loaded: false,
      active_checkpoint: null,
      available_checkpoints: [],
      device: 'CPU',
      architecture: 'ViT-Base/16 (Vision Transformer)',
      total_parameters: '85.8M',
      classes: ['Normal', 'Glaucoma'],
      last_loaded_at: null,
      error: err instanceof Error ? err.message : 'Backend connection unavailable',
    };
  }
}

/**
 * Switches the active model checkpoint between best_model.pth and latest_checkpoint.pth.
 */
export async function switchModelCheckpoint(name: string): Promise<{ success: boolean; status?: ModelStatus; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/model/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    return await res.json();
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to switch checkpoint' };
  }
}

/**
 * Triggers a reload of the models directory.
 */
export async function reloadModelDirectory(): Promise<{ success: boolean; status?: ModelStatus; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/model/reload`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });

    return await res.json();
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to reload model' };
  }
}

/**
 * Uploads a .pth model file directly to the models/ folder and activates it.
 */
export async function uploadModelCheckpoint(
  file: File,
  targetName?: string,
): Promise<{ success: boolean; message?: string; status?: ModelStatus; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (targetName) {
      formData.append('name', targetName);
    }

    const res = await fetch(`${API_BASE}/model/upload`, {
      method: 'POST',
      body: formData,
    });

    return await res.json();
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Upload failed' };
  }
}

/**
 * Runs real PyTorch inference on a fundus image via the backend.
 */
export async function runModelInference(imageFile: File): Promise<ScreeningResult> {
  const formData = new FormData();
  formData.append('file', imageFile);

  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: `Server error: ${res.status}` }));
    throw new Error(errorData.error || `Inference request failed with HTTP ${res.status}`);
  }

  const data = await res.json();
  return {
    ...data,
    source: 'pytorch',
  };
}
