import React from 'react';
import { ArrowRight, Clock, ShieldCheck, Cpu, Zap, BarChart2 } from 'lucide-react';

export default function HomePage({ onNavigateToPredict }) {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-900 border border-slate-700/80 p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Machine Learning Logistics Engine</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Food Delivery Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">Prediction System</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            An end-to-end Machine Learning application that predicts food delivery duration in minutes based on real-world delivery distance, road traffic density, weather conditions, courier rating, and order parameters.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onNavigateToPredict}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-7 rounded-xl shadow-lg transition flex items-center space-x-2 text-sm"
            >
              <span>Test Live Prediction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Why Delivery Time Prediction is Useful */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">Why Predict Food Delivery Time?</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Accurate estimated time of arrival (ETA) is the single most critical factor in customer satisfaction and food quality management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl w-fit border border-orange-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Customer Satisfaction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Providing realistic ETAs prevents customer anxiety, reduces customer support calls, and sets reliable expectations for food delivery.
            </p>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit border border-sky-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Resource & Fleet Optimization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enables delivery platforms to dispatch couriers at optimal times, avoiding unnecessary restaurant waiting time and reducing fuel waste.
            </p>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit border border-emerald-500/20">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic Pricing & Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Helps operational algorithms account for adverse weather, traffic jams, and high-volume surge times to adjust delivery zones dynamically.
            </p>
          </div>
        </div>
      </div>

      {/* How The System Works */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/60 p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-orange-400" />
          How The System Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/50 space-y-2">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">1</span>
            <h4 className="font-bold text-white text-sm">Coordinates & Form Input</h4>
            <p className="text-slate-400">Processes order inputs: courier rating, age, experience, traffic, weather, city, vehicle type, and coordinates.</p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/50 space-y-2">
            <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">2</span>
            <h4 className="font-bold text-white text-sm">Auto-Distance Calculation</h4>
            <p className="text-slate-400">Uses the Haversine formula to compute great-circle distance in km between restaurant and delivery location.</p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/50 space-y-2">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">3</span>
            <h4 className="font-bold text-white text-sm">Multi-Model Selection</h4>
            <p className="text-slate-400">Runs inference through your selected regression model (Gradient Boosting, Decision Tree, Linear Regression, KNN).</p>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/50 space-y-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">4</span>
            <h4 className="font-bold text-white text-sm">Prediction & Explanation</h4>
            <p className="text-slate-400">Returns estimated time in minutes, logs to history, and presents a feature impact breakdown.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
