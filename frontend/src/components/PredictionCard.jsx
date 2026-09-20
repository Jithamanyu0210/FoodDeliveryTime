import React from 'react';
import { Clock, Navigation, CheckCircle2, AlertCircle, Sparkles, AlertTriangle } from 'lucide-react';

export default function PredictionCard({ prediction, error }) {
  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-rose-300 flex items-start space-x-3">
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
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[320px]">
        <div className="p-4 bg-slate-800 rounded-full border border-slate-700 mb-4">
          <Sparkles className="w-8 h-8 text-orange-400" />
        </div>
        <h3 className="text-base font-semibold text-white">No Prediction Yet</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Adjust the order parameters on the left and click <b>Predict Delivery Time</b> to calculate ML estimate.
        </p>
      </div>
    );
  }

  const { predicted_time_min, distance_km, inputs_summary } = prediction;

  // Simple traffic status color mapping
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
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
        <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ML Model Prediction
        </span>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
          Inference Ready
        </span>
      </div>

      {/* Main Time display */}
      <div className="text-center py-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
        <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs font-medium mb-1">
          <Clock className="w-4 h-4 text-orange-400" />
          <span>ESTIMATED DELIVERY TIME</span>
        </div>
        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
          {predicted_time_min} <span className="text-2xl font-bold text-slate-300">mins</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Range estimate: ~{(predicted_time_min - 3.2).toFixed(0)} to {(predicted_time_min + 3.2).toFixed(0)} mins (MAE ± 3.2m)
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
          <span className="text-slate-400 text-[11px] block">Calculated Distance</span>
          <span className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
            <Navigation className="w-4 h-4 text-sky-400" />
            {distance_km} km
          </span>
        </div>

        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
          <span className="text-slate-400 text-[11px] block">Traffic Level</span>
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border mt-1 ${getTrafficColor(inputs_summary?.traffic)}`}>
            {inputs_summary?.traffic || 'Low'}
          </span>
        </div>
      </div>

      {/* Inputs Summary Pill List */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 font-medium">Order Environment:</span>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-slate-700/40 text-slate-300 border border-slate-600/50 px-2.5 py-1 rounded-lg">
            Weather: <b>{inputs_summary?.weather}</b>
          </span>
          <span className="bg-slate-700/40 text-slate-300 border border-slate-600/50 px-2.5 py-1 rounded-lg">
            Vehicle: <b>{inputs_summary?.vehicle}</b>
          </span>
          <span className="bg-slate-700/40 text-slate-300 border border-slate-600/50 px-2.5 py-1 rounded-lg">
            City: <b>{inputs_summary?.city}</b>
          </span>
        </div>
      </div>
    </div>
  );
}
