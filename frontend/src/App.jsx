import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import DeliveryForm from './components/DeliveryForm';
import PredictionCard from './components/PredictionCard';
import MetricsInfo from './components/MetricsInfo';

export default function App() {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  // Check Flask API connectivity on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/health`);
        if (response.data && response.data.status === 'healthy') {
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }
      } catch (err) {
        try {
          const directRes = await axios.get('http://127.0.0.1:5000/api/health');
          if (directRes.data && directRes.data.status === 'healthy') {
            setIsBackendConnected(true);
          } else {
            setIsBackendConnected(false);
          }
        } catch {
          setIsBackendConnected(false);
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/predict`, formData);
      if (response.data && response.data.success) {
        setPrediction(response.data);
      } else {
        setError(response.data.error || 'Failed to generate prediction');
      }
    } catch (err) {
      // Try direct backend fallback if proxy issues exist
      try {
        const directRes = await axios.post('http://127.0.0.1:5000/api/predict', formData);
        if (directRes.data && directRes.data.success) {
          setPrediction(directRes.data);
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Header isBackendConnected={isBackendConnected} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-7">
            <DeliveryForm onSubmit={handlePredict} loading={loading} />
          </div>

          {/* Right Column: Prediction Result */}
          <div className="lg:col-span-5 space-y-6">
            <PredictionCard prediction={prediction} error={error} />
          </div>
        </div>

        {/* Bottom Section: Model Metrics */}
        <MetricsInfo />
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500 py-4">
        Food Delivery Time Prediction — ML Full-Stack Project | Scikit-Learn • Flask • React + Vite
      </footer>
    </div>
  );
}
