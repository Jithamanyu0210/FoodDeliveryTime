import React, { useState } from 'react';
import axios from 'axios';
import DeliveryForm from '../components/DeliveryForm';
import PredictionCard from '../components/PredictionCard';
import { Calculator } from 'lucide-react';

export default function PredictionPage({ API_BASE_URL, availableModels, onRecordPrediction }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);

    // Front-end numeric range validation check
    if (formData.Delivery_person_Age < 18 || formData.Delivery_person_Age > 60) {
      setError("Courier Age must be between 18 and 60 years.");
      setLoading(false);
      return;
    }
    if (formData.Delivery_person_Ratings < 1.0 || formData.Delivery_person_Ratings > 5.0) {
      setError("Courier Rating must be between 1.0 and 5.0.");
      setLoading(false);
      return;
    }
    if (formData.distance_km <= 0 || formData.distance_km > 100) {
      setError("Delivery Distance must be between 0.1 and 100 km.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/predict`, formData);
      if (response.data && response.data.success) {
        setPrediction(response.data);
        if (onRecordPrediction) {
          onRecordPrediction({
            selected_model: response.data.selected_model,
            predicted_time_min: response.data.predicted_time_min,
            distance_km: response.data.distance_km,
            weather: formData.Weather_conditions,
            traffic: formData.Road_traffic_density,
            rating: formData.Delivery_person_Ratings,
            age: formData.Delivery_person_Age,
            exp: formData.Delivery_person_Experience,
            vehicle: formData.Type_of_vehicle,
            order_type: formData.Type_of_order,
            multiple_deliveries: formData.multiple_deliveries,
            city: formData.City
          });
        }
      } else {
        setError(response.data.error || 'Failed to generate prediction');
      }
    } catch (err) {
      try {
        const directRes = await axios.post('http://127.0.0.1:5000/api/predict', formData);
        if (directRes.data && directRes.data.success) {
          setPrediction(directRes.data);
          if (onRecordPrediction) {
            onRecordPrediction({
              selected_model: directRes.data.selected_model,
              predicted_time_min: directRes.data.predicted_time_min,
              distance_km: directRes.data.distance_km,
              weather: formData.Weather_conditions,
              traffic: formData.Road_traffic_density,
              rating: formData.Delivery_person_Ratings,
              age: formData.Delivery_person_Age,
              exp: formData.Delivery_person_Experience,
              vehicle: formData.Type_of_vehicle,
              order_type: formData.Type_of_order,
              multiple_deliveries: formData.multiple_deliveries,
              city: formData.City
            });
          }
        } else {
          setError(directRes.data.error || 'API Error');
        }
      } catch (e) {
        setError(err.response?.data?.error || err.message || 'Cannot reach Flask backend server. Ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="space-y-6 py-4">
      <div className="border-b border-slate-700/60 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-orange-400" />
          Food Delivery Time Prediction
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter delivery distance between restaurant & home, specify environmental factors, then click Predict.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <DeliveryForm 
            onSubmit={handlePredict} 
            loading={loading} 
            onClear={handleClear} 
            availableModels={availableModels} 
          />
        </div>

        {/* Right Column: Prediction Result & Explanation */}
        <div className="lg:col-span-5">
          <PredictionCard prediction={prediction} error={error} />
        </div>
      </div>
    </div>
  );
}
