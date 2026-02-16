# Setting Up Model Weights

This guide explains how to convert your AI Basics model weights for use in the portfolio site.

## Quick Start

1. **Convert the .npz file to JSON:**
   ```bash
   python scripts/convert_npz_to_json.py
   ```

   This will:
   - Read the model from `project_raw/AI Basics/models/mnist_model.npz`
   - Convert it to JSON format
   - Save it to `public/model_weights.json`

2. **The API route will automatically serve the weights:**
   - The page at `/projects/handwritten-digit-recognizer` will fetch from `/api/model-weights`
   - The API route serves the converted JSON file from the `public` folder

## How It Works

1. **Conversion Script** (`scripts/convert_npz_to_json.py`):
   - Loads your `.npz` file (W1, W2, W3, b1, b2, b3)
   - Converts NumPy arrays to JavaScript-compatible JSON
   - Saves to `public/model_weights.json`

2. **API Route** (`app/api/model-weights/route.ts`):
   - Serves the JSON file from the `public` folder
   - Handles caching and error messages

3. **Frontend** (`app/projects/handwritten-digit-recognizer/page.tsx`):
   - Fetches weights from the API route
   - Runs forward propagation matching your `main.py` implementation:
     - `W1.T @ X + b1` → ReLU
     - `W2.T @ a1 + b2` → ReLU  
     - `W3.T @ a2 + b3` → Sigmoid

## Updating Weights

If you retrain your model and want to update the weights:

1. Replace `project_raw/AI Basics/models/mnist_model.npz` with your new model
2. Run the conversion script again:
   ```bash
   python scripts/convert_npz_to_json.py
   ```
3. The site will automatically use the new weights

## Requirements

- Python 3.x
- NumPy (`pip install numpy`)

The conversion script only needs NumPy - it doesn't require TensorFlow or other ML libraries.
