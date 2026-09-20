import React from 'react';
import { Utensils, Clock, Cpu } from 'lucide-react';

export default function Header({ isBackendConnected }) {
  return (
    <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/30">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Food Delivery Time Predictor
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-medium">
                ML Pipeline
              </span>
            </h1>
            <p className="text-xs text-slate-400">Powered by Random Forest Regressor & Real Kaggle Dataset</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${
            isBackendConnected 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            <span className="font-medium">
              {isBackendConnected ? 'Flask API Online' : 'Flask API Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
