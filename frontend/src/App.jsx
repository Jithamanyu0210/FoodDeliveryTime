import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import PredictionHistoryPage from './pages/PredictionHistoryPage';
import ModelInsightsPage from './pages/ModelInsightsPage';
import SystemInfoPage from './pages/SystemInfoPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  
  // LocalStorage prediction history state
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('foodpredict_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foodpredict_history', JSON.stringify(history));
    } catch (e) {
      console.error("Error saving history:", e);
    }
  }, [history]);

  // Check Flask API health and fetch available trained models
  useEffect(() => {
    const checkHealthAndModels = async () => {
      try {
        const healthRes = await axios.get(`${API_BASE_URL}/api/health`);
        if (healthRes.data && healthRes.data.status === 'healthy') {
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }

        const modelsRes = await axios.get(`${API_BASE_URL}/api/models`);
        if (modelsRes.data && modelsRes.data.models) {
          setAvailableModels(modelsRes.data.models);
        }
      } catch (err) {
        try {
          const directHealth = await axios.get('http://127.0.0.1:5000/api/health');
          if (directHealth.data && directHealth.data.status === 'healthy') {
            setIsBackendConnected(true);
          } else {
            setIsBackendConnected(false);
          }

          const directModels = await axios.get('http://127.0.0.1:5000/api/models');
          if (directModels.data && directModels.data.models) {
            setAvailableModels(directModels.data.models);
          }
        } catch {
          setIsBackendConnected(false);
        }
      }
    };

    checkHealthAndModels();
    const interval = setInterval(checkHealthAndModels, 5000);
    return () => clearInterval(interval);
  }, [API_BASE_URL]);

  const handleAddPredictionRecord = (newRecord) => {
    const recordWithId = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      ...newRecord
    };
    setHistory(prev => [recordWithId, ...prev]);
  };

  const handleDeleteRecord = (id) => {
    setHistory(prev => prev.filter(r => r.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isBackendConnected={isBackendConnected} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <HomePage onNavigateToPredict={() => setActiveTab('predict')} />
        )}

        {activeTab === 'dashboard' && <DashboardPage />}

        {activeTab === 'predict' && (
          <PredictionPage 
            API_BASE_URL={API_BASE_URL} 
            availableModels={availableModels}
            onRecordPrediction={handleAddPredictionRecord}
          />
        )}

        {activeTab === 'history' && (
          <PredictionHistoryPage 
            history={history}
            onDeleteRecord={handleDeleteRecord}
            onClearAllHistory={handleClearAllHistory}
          />
        )}

        {activeTab === 'insights' && (
          <ModelInsightsPage API_BASE_URL={API_BASE_URL} />
        )}

        {activeTab === 'system' && (
          <SystemInfoPage API_BASE_URL={API_BASE_URL} />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-center text-xs text-slate-400 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Food Delivery Time Prediction</span>
          <span className="text-slate-500">Python • Scikit-Learn • Flask • React + Vite</span>
        </div>
      </footer>
    </div>
  );
}
