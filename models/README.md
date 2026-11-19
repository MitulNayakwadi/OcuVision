# OcuVision Model Weights Directory

Place your PyTorch Vision Transformer (ViT-Base/16) checkpoint files here:

- `best_model.pth`: Checkpoint with the best validation performance (highest AUC-ROC / sensitivity).
- `latest_checkpoint.pth`: Most recent training checkpoint.

### Supported formats:
1. PyTorch `state_dict`: `torch.save(model.state_dict(), 'best_model.pth')`
2. Training checkpoint dictionary:
   ```python
   torch.save({
       'epoch': epoch,
       'model_state_dict': model.state_dict(),
       'optimizer_state_dict': optimizer.state_dict(),
       'best_acc': best_acc,
   }, 'best_model.pth')
   ```
3. Full model object: `torch.save(model, 'best_model.pth')`
4. TorchScript module: `torch.jit.save(scripted_model, 'best_model.pth')`

When either `best_model.pth` or `latest_checkpoint.pth` is added or updated in this folder, the OcuVision backend automatically links it directly to the frontend.
