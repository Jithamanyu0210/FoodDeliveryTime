import React from 'react';
import { Clock, Navigation, CheckCircle2, AlertCircle, Sparkles, BarChart2, Info, Cpu } from 'lucide-react';

export default function PredictionCard({ prediction, error }) {
  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-rose-300 flex items-start space-x-3 shadow-lg">
        <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-rose-200">Prediction Request Failed</h3>
          <p className="text-sm mt-1 text-rose-300/80">{error}</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[360px] shadow-lg">
        <div className="p-4 bg-slate-800 rounded-full border border-slate-700 mb-4">
          <Sparkles className="w-8 h-8 text-orange-400" />
        </div>
        <h3 className="text-base font-semibold text-white">No Prediction Generated</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Select your model, fill in the coordinates and order parameters, then click <b>Predict Delivery Time</b> to view the ML prediction & factor explanation.
        </p>
      </div>
    );
  }

  const { predicted_time_min, distance_km, selected_model, inputs_summary, feature_importances, explanation_text } = prediction;

  const getTrafficColor = (traffic) => {
    switch (traffic) {
      case 'Jam': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'High': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Medium': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-6 border border-slate-700/70 shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Model Prediction Result
        </span>
        <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
          <Cpu className="w-3 h-3 text-orange-400" />
          {selected_model || 'Gradient Boosting Regressor'}
        </span>
      </div>

      {/* Main Time display */}
      <div className="text-center py-5 bg-slate-900/70 rounded-xl border border-slate-700/60">
        <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs font-medium mb-1">
          <Clock className="w-4 h-4 text-orange-400" />
          <span>ESTIMATED DELIVERY TIME</span>
        </div>
        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
          {predicted_time_min} <span className="text-2xl font-bold text-slate-300">mins</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Note: This result is an automated machine learning estimation based on operational patterns.
        </p>
      </div>

      {/* Distance & Traffic stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/40">
          <span className="text-slate-400 text-[11px] block">Auto-Calculated Distance</span>
          <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            {distance_km} km
          </span>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/40">
          <span className="text-slate-400 text-[11px] block">Traffic Level</span>
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mt-1 ${getTrafficColor(inputs_summary?.traffic)}`}>
            {inputs_summary?.traffic || 'Low'}
          </span>
        </div>
      </div>

      {/* Prediction Explanation Section (Requirement #3) */}
      <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-orange-400" />
          Prediction Explanation & Contributing Factors
        </h4>
        
        {explanation_text && (
          <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800 leading-relaxed">
            {explanation_text}
          </p>
        )}

        {/* Feature Importance Bar Charts */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 block">Factor Impact Breakdown:</span>
          {feature_importances?.map((item, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-slate-300 text-[11px]">
                <span className="font-medium text-slate-200">{item.feature} (<span className="text-orange-400">{item.value}</span>)</span>
                <span className="text-slate-400">{item.importance}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full" 
                  style={{ width: `${Math.min(100, item.importance * 2.2)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 pl-0.5">{item.impact}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
