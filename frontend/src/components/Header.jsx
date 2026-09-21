import React from 'react';
import { Utensils, LayoutDashboard, Calculator, LineChart, Info, Home } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, isBackendConnected }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predict', label: 'Predict', icon: Calculator },
    { id: 'insights', label: 'Model Insights', icon: LineChart },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700/60 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Header */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/30 group-hover:scale-105 transition">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Food Delivery Time Predictor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-medium">
                ML Project
              </span>
            </h1>
            <p className="text-xs text-slate-400">Random Forest Regressor • Kaggle Zomato Dataset</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* API Status Badge */}
        <div className="hidden lg:flex items-center space-x-2 text-xs">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
            isBackendConnected 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            <span className="font-medium">
              {isBackendConnected ? 'Flask API Online' : 'Flask Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
