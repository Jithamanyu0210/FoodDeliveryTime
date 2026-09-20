import numpy as np
import pandas as pd

def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees) in kilometers.
    """
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2.0)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2.0)**2
    c = 2 * np.arcsin(np.sqrt(a))
    r = 6371.0
    return r * c

def prepare_input_features(raw_data):
    """
    Takes a raw dictionary of inputs from the frontend/API and converts it
    into a pandas DataFrame with all required engineered features.
    """
    # Check if direct distance_km is provided, else fallback to lat/lon Haversine calculation
    if 'distance_km' in raw_data and float(raw_data['distance_km']) > 0:
        distance_km = float(raw_data['distance_km'])
    else:
        rest_lat = float(raw_data.get('Restaurant_latitude', 0.0))
        rest_lon = float(raw_data.get('Restaurant_longitude', 0.0))
        del_lat = float(raw_data.get('Delivery_location_latitude', 0.0))
        del_lon = float(raw_data.get('Delivery_location_longitude', 0.0))
        distance_km = calculate_haversine_distance(rest_lat, rest_lon, del_lat, del_lon)

    # Experience & Age mapping
    courier_exp = float(raw_data.get('Delivery_person_Experience', 3.0))
    age = float(raw_data.get('Delivery_person_Age', 20.0 + courier_exp))

    feature_dict = {
        'Delivery_person_Age': float(age),
        'Delivery_person_Experience': float(courier_exp),
        'Delivery_person_Ratings': float(raw_data.get('Delivery_person_Ratings', 4.7)),
        'distance_km': float(distance_km),
        'Weather_conditions': str(raw_data.get('Weather_conditions', 'Sunny')),
        'Road_traffic_density': str(raw_data.get('Road_traffic_density', 'Low')),
        'Vehicle_condition': int(raw_data.get('Vehicle_condition', 2)),
        'Type_of_order': str(raw_data.get('Type_of_order', 'Meal')),
        'Type_of_vehicle': str(raw_data.get('Type_of_vehicle', 'motorcycle')),
        'multiple_deliveries': float(raw_data.get('multiple_deliveries', 1.0)),
        'Festival': str(raw_data.get('Festival', 'No')),
        'City': str(raw_data.get('City', 'Metropolitian'))
    }
    
    return pd.DataFrame([feature_dict]), distance_km
