#!/usr/bin/env python3
"""
Convert MNIST model weights from .npz to JSON format for JavaScript use.
This script converts the weights from the AI Basics project to JSON format.
"""

import numpy as np
import json
import sys
from pathlib import Path

def convert_npz_to_json(npz_path: str, output_path: str):
    """Convert .npz file to JSON format compatible with the JavaScript model."""
    
    # Load the .npz file
    data = np.load(npz_path)
    
    # Extract weights and biases (matching the structure from main.py)
    weights_dict = {
        'W1': data['W1'].tolist(),  # Shape: [784, 512]
        'W2': data['W2'].tolist(),  # Shape: [512, 128]
        'W3': data['W3'].tolist(),  # Shape: [128, 10]
        'b1': data['b1'].tolist(),  # Shape: [512, 1]
        'b2': data['b2'].tolist(),  # Shape: [128, 1]
        'b3': data['b3'].tolist(),  # Shape: [10, 1]
    }
    
    # Save as JSON
    with open(output_path, 'w') as f:
        json.dump(weights_dict, f)
    
    print(f"Successfully converted {npz_path} to {output_path}")
    print(f"Output contains keys: {list(weights_dict.keys())}")
    
    # Print shape information
    print("\nWeight shapes:")
    print(f"  W1: [{len(weights_dict['W1'])}, {len(weights_dict['W1'][0])}]")
    print(f"  W2: [{len(weights_dict['W2'])}, {len(weights_dict['W2'][0])}]")
    print(f"  W3: [{len(weights_dict['W3'])}, {len(weights_dict['W3'][0])}]")
    print(f"  b1: [{len(weights_dict['b1'])}, {len(weights_dict['b1'][0])}]")
    print(f"  b2: [{len(weights_dict['b2'])}, {len(weights_dict['b2'][0])}]")
    print(f"  b3: [{len(weights_dict['b3'])}, {len(weights_dict['b3'][0])}]")

if __name__ == "__main__":
    # Default paths - using the model from project_raw
    npz_path = Path(__file__).parent.parent / "project_raw" / "AI Basics" / "models" / "mnist_model.npz"
    output_path = Path(__file__).parent.parent / "public" / "model_weights.json"
    
    # Allow command line arguments
    if len(sys.argv) > 1:
        npz_path = Path(sys.argv[1])
    if len(sys.argv) > 2:
        output_path = Path(sys.argv[2])
    
    if not npz_path.exists():
        print(f"Error: {npz_path} not found!")
        print(f"Looking for: {npz_path.absolute()}")
        sys.exit(1)
    
    # Create output directory if it doesn't exist
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    convert_npz_to_json(str(npz_path), str(output_path))
    print(f"\n✅ Conversion complete! Weights are now available at: {output_path}")
