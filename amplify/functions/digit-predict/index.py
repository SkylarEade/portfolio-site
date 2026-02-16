"""
Lambda handler for digit prediction.
Called by Amplify Data custom query; uses AI Basics main.py + mnist_model.npz.
Event from AppSync: { "arguments": { "pixelsJson": "[0.1, 0.2, ...]" } }
Returns JSON string: { "prediction": 0-9, "confidences": [...] }
"""
import json
import os

# Lambda loads code from the deployment package root
import main as nn_module

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "mnist_model.npz")

def handler(event, context):
    try:
        args = event.get("arguments") or event
        pixels_json = args.get("pixelsJson")
        if not pixels_json:
            return json.dumps({"error": "Missing pixelsJson", "prediction": 0, "confidences": [0.0] * 10})

        pixels = json.loads(pixels_json)
        if not isinstance(pixels, list) or len(pixels) != 784:
            return json.dumps({"error": "Expected 784 pixels", "prediction": 0, "confidences": [0.0] * 10})

        import numpy as np
        X = np.array(pixels, dtype=np.float64).reshape(784, 1)

        nn = nn_module.NeuralNetwork()
        nn.load_model(MODEL_PATH)

        _, _, _, a3, _ = nn.forward_propagation(X)
        prediction = int(np.argmax(a3))
        confidences = a3.flatten().tolist()

        return json.dumps({"prediction": prediction, "confidences": confidences})
    except Exception as e:
        return json.dumps({
            "error": str(e),
            "prediction": 0,
            "confidences": [0.0] * 10,
        })
