import io
import os
import sys
import time
import shutil
from pathlib import Path
from typing import Optional

from starlette.applications import Starlette
from starlette.routing import Route
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from PIL import Image
import uvicorn

# Ensure project root is in sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from backend.model_manager import ModelManager, MODELS_DIR

# Initialize singleton ModelManager
manager = ModelManager(MODELS_DIR)

async def health(request: Request) -> JSONResponse:
    return JSONResponse({"status": "ok", "service": "OcuVision Model API", "timestamp": time.time()})

async def get_model_status(request: Request) -> JSONResponse:
    """Returns current active model, available checkpoints, and device status."""
    try:
        status = manager.get_status()
        return JSONResponse(status)
    except Exception as e:
        return JSONResponse({"connected": True, "model_loaded": False, "error": str(e)}, status_code=500)

async def select_model(request: Request) -> JSONResponse:
    """Switches active checkpoint between best_model.pth and latest_checkpoint.pth."""
    try:
        data = await request.json()
        target_name = data.get("name")
        if not target_name:
            return JSONResponse({"success": False, "error": "Missing 'name' in request body"}, status_code=400)

        success = manager.load_checkpoint(target_name)
        status = manager.get_status()
        return JSONResponse({"success": success, "status": status})
    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)

async def reload_model(request: Request) -> JSONResponse:
    """Forces reloading the active model or scanning for updated checkpoints."""
    try:
        if manager.active_checkpoint:
            manager.load_checkpoint(manager.active_checkpoint)
        else:
            manager.check_and_load_preferred()
        status = manager.get_status()
        return JSONResponse({"success": True, "status": status})
    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)

async def upload_model(request: Request) -> JSONResponse:
    """
    Allows uploading a .pth checkpoint (best_model.pth, latest_checkpoint.pth)
    directly through the frontend, saving it to the models/ folder and activating it.
    """
    try:
        form = await request.form()
        upload_file = form.get("file")
        target_name = form.get("name")

        if not upload_file or not hasattr(upload_file, "read"):
            return JSONResponse({"success": False, "error": "No model file provided in 'file' field"}, status_code=400)

        filename = target_name or getattr(upload_file, "filename", "best_model.pth")
        if not filename.endswith(".pth") and not filename.endswith(".pt"):
            filename = f"{filename}.pth"

        # Save into models folder
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        dest_path = MODELS_DIR / filename
        content = await upload_file.read()

        with open(dest_path, "wb") as f:
            f.write(content)

        print(f"[Server] Saved uploaded model to {dest_path} ({len(content)} bytes)")

        # Load the newly uploaded model
        loaded = manager.load_checkpoint(filename)
        status = manager.get_status()

        return JSONResponse({
            "success": loaded,
            "message": f"Successfully uploaded and {'loaded' if loaded else 'saved'} {filename}",
            "status": status
        })
    except Exception as e:
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)

async def predict(request: Request) -> JSONResponse:
    """
    Runs model inference on an uploaded retinal fundus image.
    Returns prediction verdicts, clinical advisory measurements, and attention rollout.
    """
    try:
        form = await request.form()
        image_field = form.get("file") or form.get("image")

        if not image_field or not hasattr(image_field, "read"):
            return JSONResponse({
                "error": "No image file provided in form-data. Please provide 'file' field."
            }, status_code=400)

        image_bytes = await image_field.read()
        try:
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            return JSONResponse({
                "error": f"Invalid image format: {str(e)}. Please upload a valid JPG or PNG."
            }, status_code=400)

        result = manager.predict(image)
        return JSONResponse(result)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse({"error": str(e)}, status_code=500)

routes = [
    Route("/api/health", health, methods=["GET"]),
    Route("/api/model/status", get_model_status, methods=["GET"]),
    Route("/api/model/select", select_model, methods=["POST"]),
    Route("/api/model/reload", reload_model, methods=["POST"]),
    Route("/api/model/upload", upload_model, methods=["POST"]),
    Route("/api/predict", predict, methods=["POST"]),
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )
]

app = Starlette(debug=True, routes=routes, middleware=middleware)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"============================================================")
    print(f"  OcuVision Model API Server")
    print(f"  Watching folder: {MODELS_DIR.resolve()}")
    print(f"  Active model:    {manager.active_checkpoint or 'None'}")
    print(f"  API running on:  http://localhost:{port}")
    print(f"============================================================")
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)
