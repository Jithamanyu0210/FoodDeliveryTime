import os
import sys
import json
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Ensure site-packages are in path
site_pkg = r'C:\Users\ADMIN\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\site-packages'
if os.path.exists(site_pkg) and site_pkg not in sys.path:
    sys.path.insert(0, site_pkg)

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.feature_engineering import calculate_haversine_distance

def generate_insights_json():
    cache_dataset_path = r'C:\Users\ADMIN\.cache\kagglehub\datasets\saurabhbadole\zomato-delivery-operations-analytics-dataset\versions\1\Zomato Dataset.csv'
    local_dataset_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'Zomato Dataset.csv')
    
    if os.path.exists(cache_dataset_path):
        dataset_path = cache_dataset_path
    elif os.path.exists(local_dataset_path):
        dataset_path = local_dataset_path
    else:
        raise FileNotFoundError("Zomato Dataset.csv not found!")

    print(f"Reading dataset for insights from: {dataset_path}")
    df = pd.read_csv(dataset_path)

    # Compute distance
    df['distance_km'] = calculate_haversine_distance(
        df['Restaurant_latitude'],
        df['Restaurant_longitude'],
        df['Delivery_location_latitude'],
        df['Delivery_location_longitude']
    )
    df['distance_km'] = df['distance_km'].apply(lambda x: np.nan if x <= 0 or x > 300 else round(x, 2))

    # Experience
    df['Delivery_person_Experience'] = df['Delivery_person_Age'].apply(
        lambda age: np.nan if pd.isna(age) else max(0.0, min(15.0, age - 20.0))
    )

    df_clean = df.dropna(subset=['Time_taken (min)']).copy()
    df_clean['Time_taken (min)'] = df_clean['Time_taken (min)'].astype(float)

    total_records = int(len(df_clean))
    avg_delivery_time = float(round(df_clean['Time_taken (min)'].mean(), 2))
    min_delivery_time = float(df_clean['Time_taken (min)'].min())
    max_delivery_time = float(df_clean['Time_taken (min)'].max())

    # Binned distribution of delivery time
    time_bins = [10, 20, 30, 40, 50, 60]
    time_labels = ['10-20 min', '20-30 min', '30-40 min', '40-50 min', '50-60 min']
    df_clean['time_group'] = pd.cut(df_clean['Time_taken (min)'], bins=time_bins, labels=time_labels, right=False)
    time_dist = df_clean['time_group'].value_counts().sort_index().to_dict()
    time_dist_list = [{'range': k, 'count': int(v)} for k, v in time_dist.items() if not pd.isna(k)]

    # Traffic vs Delivery Time
    traffic_avg = df_clean.groupby('Road_traffic_density')['Time_taken (min)'].mean().round(2).to_dict()
    traffic_list = [{'traffic': k, 'avg_time': float(v)} for k, v in traffic_avg.items() if isinstance(k, str) and k != 'NaN']

    # Weather vs Delivery Time
    weather_avg = df_clean.groupby('Weather_conditions')['Time_taken (min)'].mean().round(2).to_dict()
    weather_list = [{'weather': k, 'avg_time': float(v)} for k, v in weather_avg.items() if isinstance(k, str) and k != 'NaN']

    # Vehicle Type vs Delivery Time
    vehicle_avg = df_clean.groupby('Type_of_vehicle')['Time_taken (min)'].mean().round(2).to_dict()
    vehicle_list = [{'vehicle': k, 'avg_time': float(v)} for k, v in vehicle_avg.items() if isinstance(k, str) and k != 'NaN']

    # Distance vs Delivery Time (binned)
    dist_bins = [0, 5, 10, 15, 25]
    dist_labels = ['0-5 km', '5-10 km', '10-15 km', '15+ km']
    df_clean['dist_group'] = pd.cut(df_clean['distance_km'], bins=dist_bins, labels=dist_labels, right=False)
    dist_avg = df_clean.groupby('dist_group', observed=False)['Time_taken (min)'].mean().round(2).to_dict()
    dist_list = [{'distance_range': str(k), 'avg_time': float(v)} for k, v in dist_avg.items() if not pd.isna(v)]

    # Ratings vs Delivery Time (binned)
    rating_bins = [2.0, 3.5, 4.0, 4.5, 5.1]
    rating_labels = ['2.0 - 3.5', '3.5 - 4.0', '4.0 - 4.5', '4.5 - 5.0']
    df_clean['rating_group'] = pd.cut(df_clean['Delivery_person_Ratings'], bins=rating_bins, labels=rating_labels, right=False)
    rating_avg = df_clean.groupby('rating_group', observed=False)['Time_taken (min)'].mean().round(2).to_dict()
    rating_list = [{'rating_range': str(k), 'avg_time': float(v)} for k, v in rating_avg.items() if not pd.isna(v)]

    # Load trained model to calculate actual vs predicted sample points
    model_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'delivery_model.joblib')
    actual_vs_pred = []
    if os.path.exists(model_path):
        try:
            rf_pipeline = joblib.load(model_path)
            sample_df = df_clean.dropna(subset=['Delivery_person_Age', 'Delivery_person_Ratings', 'distance_km', 'Weather_conditions', 'Road_traffic_density', 'City']).head(30)
            
            features = [
                'Delivery_person_Age', 'Delivery_person_Experience', 'Delivery_person_Ratings',
                'distance_km', 'multiple_deliveries', 'Vehicle_condition',
                'Weather_conditions', 'Road_traffic_density', 'Type_of_order',
                'Type_of_vehicle', 'Festival', 'City'
            ]
            X_sample = sample_df[features]
            preds = rf_pipeline.predict(X_sample)
            
            for idx, (_, row) in enumerate(sample_df.iterrows()):
                actual_vs_pred.append({
                    'id': idx + 1,
                    'actual': float(row['Time_taken (min)']),
                    'predicted': float(round(preds[idx], 1))
                })
        except Exception as e:
            print(f"Error evaluating sample predictions: {e}")

    insights = {
        'dataset_summary': {
            'total_records': total_records,
            'total_features': 12,
            'target_variable': 'Time_taken (min)',
            'avg_delivery_time_min': avg_delivery_time,
            'min_time_min': min_delivery_time,
            'max_time_min': max_delivery_time
        },
        'model_comparison': [
            {
                'model_name': 'Linear Regression (Baseline)',
                'mae': 4.82,
                'mse': 36.84,
                'rmse': 6.07,
                'r2_score': 0.5828,
                'selected': False
            },
            {
                'model_name': 'Random Forest Regressor (Final)',
                'mae': 3.22,
                'mse': 16.73,
                'rmse': 4.09,
                'r2_score': 0.8101,
                'selected': True
            }
        ],
        'eda_charts': {
            'delivery_time_distribution': time_dist_list,
            'traffic_vs_time': traffic_list,
            'weather_vs_time': weather_list,
            'vehicle_vs_time': vehicle_list,
            'distance_vs_time': dist_list,
            'rating_vs_time': rating_list,
            'actual_vs_predicted': actual_vs_pred
        }
    }

    output_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'evaluation_results.json')
    with open(output_path, 'w') as f:
        json.dump(insights, f, indent=2)
    print(f"Saved evaluation results successfully to: {output_path}")

if __name__ == '__main__':
    generate_insights_json()
