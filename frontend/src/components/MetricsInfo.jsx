import React from 'react';
import { BarChart3, Database, Award, Layers } from 'lucide-react';

export default function MetricsInfo() {
  return (
    <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-orange-400" />
          Model Performance & Evaluation Metrics
        </h3>
        <span className="text-xs text-slate-400">Test Set Evaluation (9,117 samples)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>MAE (Mean Abs Error)</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">3.22 <span className="text-xs font-normal text-slate-400">min</span></div>
          <p className="text-[11px] text-slate-400 mt-1">Average deviation per delivery</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>RMSE (Root Mean Sq Error)</span>
            <Layers className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">4.10 <span className="text-xs font-normal text-slate-400">min</span></div>
          <p className="text-[11px] text-slate-400 mt-1">Penalizes larger prediction errors</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>R² Score (Accuracy)</span>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">80.97%</div>
          <p className="text-[11px] text-slate-400 mt-1">Variance explained by Random Forest</p>
        </div>
      </div>
    </div>
  );
}
