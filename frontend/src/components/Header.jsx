import React from 'react';
import { Utensils, LayoutDashboard, Calculator, History, LineChart, Cpu, Info, Home } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, isBackendConnected }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predict', label: 'Predict', icon: Calculator },
    { id: 'history', label: 'History', icon: History },
    { id: 'insights', label: 'Model Insights', icon: LineChart },
    { id: 'system', label: 'System Info', icon: Cpu },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700/60 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Brand Header - Clean Title */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/30 group-hover:scale-105 transition">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Food Delivery Time Prediction
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* API Status Badge */}
        <div className="hidden xl:flex items-center space-x-2 text-xs">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
            isBackendConnected 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            <span className="font-medium">
              {isBackendConnected ? 'API Online' : 'API Offline'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
