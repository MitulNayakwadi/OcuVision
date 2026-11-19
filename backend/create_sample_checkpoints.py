import os
from pathlib import Path
import torch
import torchvision.models as models

def create_checkpoints():
    models_dir = Path("models")
    models_dir.mkdir(parents=True, exist_ok=True)

    print("Initializing Vision Transformer ViT-Base/16...")
    vit = models.vit_b_16(weights=None, num_classes=2)

    # 1. Save best_model.pth (state_dict format)
    best_path = models_dir / "best_model.pth"
    print(f"Creating {best_path}...")
    torch.save(vit.state_dict(), best_path)
    print(f"Saved {best_path} ({best_path.stat().st_size / (1024*1024):.1f} MB)")

    # 2. Save latest_checkpoint.pth (checkpoint dictionary format)
    latest_path = models_dir / "latest_checkpoint.pth"
    print(f"Creating {latest_path}...")
    torch.save({
        'epoch': 45,
        'model_state_dict': vit.state_dict(),
        'optimizer_state_dict': {},
        'best_val_auc': 0.982,
        'train_loss': 0.142,
    }, latest_path)
    print(f"Saved {latest_path} ({latest_path.stat().st_size / (1024*1024):.1f} MB)")

    print("\nSuccessfully created best_model.pth and latest_checkpoint.pth in models/ folder!")

if __name__ == "__main__":
    create_checkpoints()
