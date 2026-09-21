import os
import sys
import json
import datetime
import numpy as np
import pandas as pd
import joblib

# Ensure site-packages are in path
site_pkg = r'C:\Users\ADMIN\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\site-packages'
if os.path.exists(site_pkg) and site_pkg not in sys.path:
    sys.path.insert(0, site_pkg)

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.feature_engineering import calculate_haversine_distance

def generate_full_insights():
    cache_dataset_path = r'C:\Users\ADMIN\.cache\kagglehub\datasets\saurabhbadole\zomato-delivery-operations-analytics-dataset\versions\1\Zomato Dataset.csv'
    local_dataset_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'Zomato Dataset.csv')
    
    if os.path.exists(cache_dataset_path):
        dataset_path = cache_dataset_path
    elif os.path.exists(local_dataset_path):
        dataset_path = local_dataset_path
    else:
        raise FileNotFoundError("Zomato Dataset.csv not found!")

    df = pd.read_csv(dataset_path)

    # Compute distance
    df['distance_km'] = calculate_haversine_distance(
        df['Restaurant_latitude'],
        df['Restaurant_longitude'],
        df['Delivery_location_latitude'],
        df['Delivery_location_longitude']
    )
    df['distance_km'] = df['distance_km'].apply(lambda x: np.nan if x <= 0 or x > 300 else round(x, 2))

    df_clean = df.dropna(subset=['Time_taken (min)']).copy()
    df_clean['Time_taken (min)'] = df_clean['Time_taken (min)'].astype(float)

    total_records = int(len(df_clean))
    avg_delivery_time = float(round(df_clean['Time_taken (min)'].mean(), 2))

    # EDA Distribution Bins
    time_bins = [10, 20, 30, 40, 50, 60]
    time_labels = ['10-20 min', '20-30 min', '30-40 min', '40-50 min', '50-60 min']
    df_clean['time_group'] = pd.cut(df_clean['Time_taken (min)'], bins=time_bins, labels=time_labels, right=False)
    time_dist_list = [{'range': k, 'count': int(v)} for k, v in df_clean['time_group'].value_counts().sort_index().to_dict().items() if not pd.isna(k)]

    traffic_avg = df_clean.groupby('Road_traffic_density')['Time_taken (min)'].mean().round(2).to_dict()
    traffic_list = [{'traffic': k, 'avg_time': float(v)} for k, v in traffic_avg.items() if isinstance(k, str) and k != 'NaN']

    weather_avg = df_clean.groupby('Weather_conditions')['Time_taken (min)'].mean().round(2).to_dict()
    weather_list = [{'weather': k, 'avg_time': float(v)} for k, v in weather_avg.items() if isinstance(k, str) and k != 'NaN']

    vehicle_avg = df_clean.groupby('Type_of_vehicle')['Time_taken (min)'].mean().round(2).to_dict()
    vehicle_list = [{'vehicle': k, 'avg_time': float(v)} for k, v in vehicle_avg.items() if isinstance(k, str) and k != 'NaN']

    dist_bins = [0, 5, 10, 15, 25]
    dist_labels = ['0-5 km', '5-10 km', '10-15 km', '15+ km']
    df_clean['dist_group'] = pd.cut(df_clean['distance_km'], bins=dist_bins, labels=dist_labels, right=False)
    dist_avg = df_clean.groupby('dist_group', observed=False)['Time_taken (min)'].mean().round(2).to_dict()
    dist_list = [{'distance_range': str(k), 'avg_time': float(v)} for k, v in dist_avg.items() if not pd.isna(v)]

    # Load existing results to merge system info and model comparison
    results_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'evaluation_results.json')
    existing_data = {}
    if os.path.exists(results_path):
        with open(results_path, 'r') as f:
            existing_data = json.load(f)

    insights = {
        'system_info': existing_data.get('system_info', {
            'project_name': 'Food Delivery Time Prediction',
            'dataset_name': 'Kaggle Zomato Delivery Dataset',
            'default_model': 'Gradient Boosting Regressor',
            'training_date': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'total_records': total_records,
            'training_records': 36467,
            'test_records': 9117,
            'total_features': 12,
            'model_version': 'v2.0 (Multi-Model System)',
            'model_status': 'Active & Operational',
            'api_status': 'Online'
        }),
        'dataset_summary': {
            'total_records': total_records,
            'total_features': 12,
            'target_variable': 'Time_taken (min)',
            'avg_delivery_time_min': avg_delivery_time,
            'min_time_min': float(df_clean['Time_taken (min)'].min()),
            'max_time_min': float(df_clean['Time_taken (min)'].max())
        },
        'model_comparison': existing_data.get('model_comparison', []),
        'feature_importances': existing_data.get('feature_importances', {}),
        'eda_charts': {
            'delivery_time_distribution': time_dist_list,
            'traffic_vs_time': traffic_list,
            'weather_vs_time': weather_list,
            'vehicle_vs_time': vehicle_list,
            'distance_vs_time': dist_list
        }
    }

    with open(results_path, 'w') as f:
        json.dump(insights, f, indent=2)
    print(f"Updated insights saved to: {results_path}")

if __name__ == '__main__':
    generate_full_insights()
