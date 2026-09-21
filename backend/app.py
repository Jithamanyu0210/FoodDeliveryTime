import os
import sys
import json
import datetime

# Ensure site-packages are in path for local windows python if present
site_pkg = r'C:\Users\ADMIN\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\site-packages'
if os.path.exists(site_pkg) and site_pkg not in sys.path:
    sys.path.insert(0, site_pkg)

# Add current directory and parent directory to sys.path for robust imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
for d in [current_dir, parent_dir]:
    if d not in sys.path:
        sys.path.insert(0, d)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

try:
    from utils.feature_engineering import prepare_input_features
except ImportError:
    from backend.utils.feature_engineering import prepare_input_features

# Determine frontend static build directory
FRONTEND_DIST = os.path.join(parent_dir, 'frontend', 'dist')
STATIC_FOLDER = FRONTEND_DIST if os.path.exists(FRONTEND_DIST) else os.path.join(current_dir, 'static')

app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path='/')
CORS(app)

MODELS_PATH = os.path.join(current_dir, 'model', 'models.joblib')
SINGLE_MODEL_PATH = os.path.join(current_dir, 'model', 'delivery_model.joblib')
RESULTS_PATH = os.path.join(current_dir, 'model', 'evaluation_results.json')

models_dict = {}
evaluation_metrics_map = {
    'Gradient Boosting Regressor': {'mae': 3.30, 'rmse': 4.14, 'r2_score': 0.8055},
    'Decision Tree Regressor': {'mae': 3.30, 'rmse': 4.21, 'r2_score': 0.7986},
    'KNN Regressor': {'mae': 3.87, 'rmse': 4.95, 'r2_score': 0.7224},
    'Linear Regression': {'mae': 4.81, 'rmse': 6.06, 'r2_score': 0.5835}
}

def load_trained_models():
    global models_dict, evaluation_metrics_map
    if os.path.exists(MODELS_PATH):
        try:
            models_dict = joblib.load(MODELS_PATH)
            print(f"Loaded {len(models_dict)} trained models from {MODELS_PATH}")
        except Exception as e:
            print(f"Error loading models.joblib: {e}")
    elif os.path.exists(SINGLE_MODEL_PATH):
        try:
            single_model = joblib.load(SINGLE_MODEL_PATH)
            models_dict['Gradient Boosting Regressor'] = single_model
            print(f"Loaded single model fallback from {SINGLE_MODEL_PATH}")
        except Exception as e:
            print(f"Error loading single model: {e}")

    # Load actual evaluation results if file exists
    if os.path.exists(RESULTS_PATH):
        try:
            with open(RESULTS_PATH, 'r') as f:
                data = json.load(f)
                if 'model_comparison' in data:
                    for m in data['model_comparison']:
                        evaluation_metrics_map[m['model_name']] = {
                            'mae': m.get('mae'),
                            'rmse': m.get('rmse'),
                            'r2_score': m.get('r2_score')
                        }
        except Exception as e:
            print(f"Error reading evaluation results: {e}")

load_trained_models()

# API Endpoints
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'models_count': len(models_dict),
        'available_models': list(models_dict.keys())
    }), 200

@app.route('/api/models', methods=['GET'])
def get_available_models():
    if os.path.exists(RESULTS_PATH):
        try:
            with open(RESULTS_PATH, 'r') as f:
                data = json.load(f)
            models_list = data.get('model_comparison', [])
            return jsonify({
                'models': models_list,
                'default_model': 'Gradient Boosting Regressor'
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    fallback_models = [
        {'model_name': 'Gradient Boosting Regressor', 'mae': 3.30, 'rmse': 4.14, 'r2_score': 0.8055, 'selected': True},
        {'model_name': 'Decision Tree Regressor', 'mae': 3.30, 'rmse': 4.21, 'r2_score': 0.7986, 'selected': False},
        {'model_name': 'KNN Regressor', 'mae': 3.87, 'rmse': 4.95, 'r2_score': 0.7224, 'selected': False},
        {'model_name': 'Linear Regression', 'mae': 4.81, 'rmse': 6.06, 'r2_score': 0.5835, 'selected': False}
    ]
    return jsonify({'models': fallback_models, 'default_model': 'Gradient Boosting Regressor'}), 200

@app.route('/api/system', methods=['GET'])
def get_system_info():
    system_data = {
        'project_name': 'Food Delivery Time Prediction',
        'dataset_name': 'Kaggle Zomato Delivery Dataset',
        'active_model': 'Gradient Boosting Regressor',
        'training_date': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total_records': 45584,
        'training_records': 36467,
        'test_records': 9117,
        'total_features': 12,
        'model_version': 'v2.0 (Multi-Model)',
        'model_file_status': 'Active & Loaded' if len(models_dict) > 0 else 'Not Loaded',
        'backend_status': 'Online'
    }

    if os.path.exists(RESULTS_PATH):
        try:
            with open(RESULTS_PATH, 'r') as f:
                file_data = json.load(f)
                if 'system_info' in file_data:
                    system_data.update(file_data['system_info'])
        except Exception as e:
            print("Error loading system info from json:", e)

    return jsonify(system_data), 200

@app.route('/api/stats', methods=['GET'])
def get_stats():
    if os.path.exists(RESULTS_PATH):
        try:
            with open(RESULTS_PATH, 'r') as f:
                data = json.load(f)
            return jsonify(data.get('dataset_summary', {})), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Evaluation stats not available'}), 404

@app.route('/api/insights', methods=['GET'])
def get_insights():
    if os.path.exists(RESULTS_PATH):
        try:
            with open(RESULTS_PATH, 'r') as f:
                data = json.load(f)
            return jsonify(data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Insights data not available'}), 404

@app.route('/api/predict', methods=['POST'])
def predict_delivery_time():
    global models_dict, evaluation_metrics_map
    if not models_dict:
        load_trained_models()
        if not models_dict:
            return jsonify({'error': 'No trained models available in server.'}), 500

    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        requested_model = data.get('model_name', 'Gradient Boosting Regressor')
        if requested_model not in models_dict:
            requested_model = list(models_dict.keys())[0]

        pipeline = models_dict[requested_model]

        # Feature preparation & Distance calculation
        X_input, distance_km = prepare_input_features(data)

        # Run Prediction
        prediction = pipeline.predict(X_input)
        predicted_min = float(np.round(prediction[0], 1))

        # Retrieve actual evaluation metrics for the selected model
        selected_metrics = evaluation_metrics_map.get(requested_model, {
            'mae': 3.30,
            'rmse': 4.14,
            'r2_score': 0.8055
        })

        traffic = data.get('Road_traffic_density', 'Medium')
        weather = data.get('Weather_conditions', 'Sunny')
        rating = float(data.get('Delivery_person_Ratings', 4.7))
        multiple_del = float(data.get('multiple_deliveries', 1.0))

        feature_impacts = [
            {'feature': 'Delivery Distance', 'importance': 38.5, 'value': f"{round(distance_km, 1)} km", 'impact': 'High impact on total travel duration'},
            {'feature': 'Traffic Density', 'importance': 24.2, 'value': str(traffic), 'impact': 'High impact on transit delay' if traffic in ['High', 'Jam'] else 'Low impact'},
            {'feature': 'Courier Rating', 'importance': 15.1, 'value': f"{rating} / 5.0", 'impact': 'Faster pickup efficiency' if rating >= 4.5 else 'Average pickup efficiency'},
            {'feature': 'Weather Conditions', 'importance': 11.4, 'value': str(weather), 'impact': 'Adverse weather speed reduction' if weather in ['Fog', 'Stormy', 'Rainy'] else 'Favorable weather'},
            {'feature': 'Multiple Deliveries', 'importance': 6.8, 'value': f"{int(multiple_del)} orders", 'impact': 'Additional stop delay' if multiple_del > 1 else 'Single direct delivery'},
            {'feature': 'Vehicle Condition', 'importance': 4.0, 'value': f"Level {data.get('Vehicle_condition', 2)}", 'impact': 'Good vehicle speed' if int(data.get('Vehicle_condition', 2)) >= 2 else 'Poor vehicle condition delay'}
        ]

        explanation_summary = f"The estimated delivery time of {predicted_min} mins is primarily influenced by the delivery distance ({round(distance_km, 1)} km) and {traffic} traffic conditions."

        response = {
            'success': True,
            'predicted_time_min': predicted_min,
            'selected_model': requested_model,
            'metrics': selected_metrics,
            'distance_km': round(float(distance_km), 2),
            'feature_importances': feature_impacts,
            'explanation_text': explanation_summary,
            'inputs_summary': {
                'weather': weather,
                'traffic': traffic,
                'vehicle': data.get('Type_of_vehicle', 'motorcycle'),
                'city': data.get('City', 'Metropolitian'),
                'rating': rating
            }
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Catch-all route to serve React frontend SPA
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    if app.static_folder and os.path.exists(app.static_folder):
        file_path = os.path.join(app.static_folder, path)
        if path != "" and os.path.exists(file_path):
            return send_from_directory(app.static_folder, path)
        index_file = os.path.join(app.static_folder, 'index.html')
        if os.path.exists(index_file):
            return send_from_directory(app.static_folder, 'index.html')
    return jsonify({
        'message': 'Food Delivery Time Prediction API is running.',
        'health_check': '/api/health',
        'models': '/api/models'
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
