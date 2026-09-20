import os
import sys

# Ensure site-packages and local packages are in path
site_pkg = r'C:\Users\ADMIN\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\site-packages'
if os.path.exists(site_pkg) and site_pkg not in sys.path:
    sys.path.insert(0, site_pkg)

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

from utils.feature_engineering import prepare_input_features

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'delivery_model.joblib')
model_pipeline = None

def load_model():
    global model_pipeline
    if os.path.exists(MODEL_PATH):
        try:
            model_pipeline = joblib.load(MODEL_PATH)
            print(f"Loaded model successfully from {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading model file: {e}")
    else:
        print(f"Warning: Model file not found at {MODEL_PATH}")

load_model()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_pipeline is not None
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict_delivery_time():
    global model_pipeline
    if model_pipeline is None:
        load_model()
        if model_pipeline is None:
            return jsonify({
                'error': 'Model is not loaded. Please train or provide model.joblib file.'
            }), 500

    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        # Transform raw input to feature dataframe & compute Haversine distance
        X_input, distance_km = prepare_input_features(data)

        # Make prediction
        prediction = model_pipeline.predict(X_input)
        predicted_min = float(np.round(prediction[0], 1))

        # Format clean response
        response = {
            'success': True,
            'predicted_time_min': predicted_min,
            'distance_km': round(float(distance_km), 2),
            'inputs_summary': {
                'weather': data.get('Weather_conditions', 'Sunny'),
                'traffic': data.get('Road_traffic_density', 'Low'),
                'vehicle': data.get('Type_of_vehicle', 'motorcycle'),
                'city': data.get('City', 'Metropolitian')
            }
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
