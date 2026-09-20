import os
import sys

# Ensure site-packages are in path
site_pkg = r'C:\Users\ADMIN\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\site-packages'
if os.path.exists(site_pkg) and site_pkg not in sys.path:
    sys.path.insert(0, site_pkg)

import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Ensure local backend packages can be imported
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.feature_engineering import calculate_haversine_distance

def load_and_preprocess_data():
    cache_dataset_path = r'C:\Users\ADMIN\.cache\kagglehub\datasets\saurabhbadole\zomato-delivery-operations-analytics-dataset\versions\1\Zomato Dataset.csv'
    local_dataset_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'Zomato Dataset.csv')
    
    if os.path.exists(cache_dataset_path):
        dataset_path = cache_dataset_path
    elif os.path.exists(local_dataset_path):
        dataset_path = local_dataset_path
    else:
        raise FileNotFoundError("Zomato Dataset.csv not found!")

    print(f"Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)

    # Compute distance feature using Haversine formula
    df['distance_km'] = calculate_haversine_distance(
        df['Restaurant_latitude'],
        df['Restaurant_longitude'],
        df['Delivery_location_latitude'],
        df['Delivery_location_longitude']
    )

    # Filter out invalid distance anomalies
    df['distance_km'] = df['distance_km'].apply(lambda x: np.nan if x <= 0 or x > 300 else x)

    # Derive Courier Experience (years) feature from Delivery Person Age
    df['Delivery_person_Experience'] = df['Delivery_person_Age'].apply(
        lambda age: np.nan if pd.isna(age) else max(0.0, min(15.0, age - 20.0))
    )

    # Clean target variable
    df = df.dropna(subset=['Time_taken (min)'])
    df['Time_taken (min)'] = df['Time_taken (min)'].astype(float)

    # Define feature lists
    numeric_features = [
        'Delivery_person_Age',
        'Delivery_person_Experience',
        'Delivery_person_Ratings',
        'distance_km',
        'multiple_deliveries',
        'Vehicle_condition'
    ]
    
    categorical_features = [
        'Weather_conditions',
        'Road_traffic_density',
        'Type_of_order',
        'Type_of_vehicle',
        'Festival',
        'City'
    ]

    features = numeric_features + categorical_features
    X = df[features]
    y = df['Time_taken (min)']

    return X, y, numeric_features, categorical_features

def build_model_pipeline(numeric_features, categorical_features):
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1))
    ])

    return model_pipeline

def train_and_evaluate():
    X, y, num_cols, cat_cols = load_and_preprocess_data()

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"Training dataset size: {X_train.shape[0]} samples")
    print(f"Testing dataset size: {X_test.shape[0]} samples")

    # Train Random Forest Regressor
    print("\n--- Training Random Forest Regressor ---")
    rf_pipeline = build_model_pipeline(num_cols, cat_cols)
    rf_pipeline.fit(X_train, y_train)
    rf_preds = rf_pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, rf_preds)
    rmse = np.sqrt(mean_squared_error(y_test, rf_preds))
    r2 = r2_score(y_test, rf_preds)

    print(f"\nRandom Forest MAE:  {mae:.2f} min")
    print(f"Random Forest RMSE: {rmse:.2f} min")
    print(f"Random Forest R²:   {r2:.4f}")

    # Save compressed model pipeline (under GitHub 100MB limit)
    model_dir = os.path.dirname(__file__)
    model_save_path = os.path.join(model_dir, 'delivery_model.joblib')
    joblib.dump(rf_pipeline, model_save_path, compress=3)
    print(f"\nSaved compressed model pipeline successfully to: {model_save_path}")

if __name__ == '__main__':
    train_and_evaluate()
