import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import ModelInsightsPage from './pages/ModelInsightsPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  // Check Flask API health on mount
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
  }, [API_BASE_URL]);

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
          <PredictionPage API_BASE_URL={API_BASE_URL} />
        )}
        {activeTab === 'insights' && (
          <ModelInsightsPage API_BASE_URL={API_BASE_URL} />
        )}
        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-center text-xs text-slate-400 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Food Delivery Time Prediction — Full-Stack Machine Learning Project</span>
          <span className="text-slate-500">Python • Scikit-Learn • Flask • React + Vite</span>
        </div>
      </footer>
    </div>
  );
}
