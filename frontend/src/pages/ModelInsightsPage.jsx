import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, CheckCircle2, Award, Table, Layers, BarChart, Sliders } from 'lucide-react';

export default function ModelInsightsPage({ API_BASE_URL }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/insights`);
        if (response.data && !response.data.error) {
          setInsights(response.data);
        } else {
          const directRes = await axios.get('http://127.0.0.1:5000/api/insights');
          setInsights(directRes.data);
        }
      } catch (err) {
        console.log("Error fetching insights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3"></div>
        <span>Loading Machine Learning Model Insights & EDA Charts...</span>
      </div>
    );
  }

  const modelComparison = insights?.model_comparison || [
    { model_name: 'Linear Regression (Baseline)', mae: 4.82, mse: 36.84, rmse: 6.07, r2_score: 0.5828, selected: false },
    { model_name: 'Random Forest Regressor (Final)', mae: 3.22, mse: 16.73, rmse: 4.09, r2_score: 0.8101, selected: true }
  ];

  const eda = insights?.eda_charts || {};

  return (
    <div className="space-y-10 py-4">
      {/* Page Header */}
      <div className="border-b border-slate-700/60 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <LineChart className="w-6 h-6 text-orange-400" />
          Model Insights & Exploratory Data Analysis (EDA)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Empirical evaluation results and statistical distributions generated from real Kaggle Zomato operational data.
        </p>
      </div>

      {/* 1. Dataset & Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            Dataset Overview
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li><b>Dataset:</b> Zomato Delivery Analytics (Kaggle)</li>
            <li><b>Total Records:</b> 45,584 records</li>
            <li><b>Target:</b> Time_taken (min)</li>
            <li><b>Mean Time:</b> 26.29 minutes</li>
          </ul>
        </div>

        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            Preprocessing Methods
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li><b>Missing Value Imputation:</b> Median (Numeric) & Mode (Categorical)</li>
            <li><b>Scaling:</b> Standard Scaler (Zero Mean, Unit Variance)</li>
            <li><b>Categorical Encoding:</b> One-Hot Encoder</li>
          </ul>
        </div>

        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Feature Engineering
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li><b>Haversine Distance:</b> Geodesic distance in km calculated from lat/lon</li>
            <li><b>Courier Experience:</b> Derived experience from courier age</li>
            <li><b>Outlier Removal:</b> Coordinate bounds & distance validation</li>
          </ul>
        </div>
      </div>

      {/* 2. Model Comparison Table */}
      <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/70 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-orange-400" />
            Regression Algorithm Comparison Table
          </h3>
          <span className="text-xs text-slate-400">Tested on 9,117 Holdout Samples</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Algorithm / Model</th>
                <th className="py-3 px-4">MAE (min)</th>
                <th className="py-3 px-4">MSE</th>
                <th className="py-3 px-4">RMSE (min)</th>
                <th className="py-3 px-4">R² Score</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {modelComparison.map((m, idx) => (
                <tr key={idx} className={m.selected ? 'bg-orange-500/10 font-medium text-white' : ''}>
                  <td className="py-3.5 px-4 flex items-center gap-2">
                    {m.model_name}
                    {m.selected && <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">Selected</span>}
                  </td>
                  <td className="py-3.5 px-4">{m.mae.toFixed(2)} min</td>
                  <td className="py-3.5 px-4">{m.mse.toFixed(2)}</td>
                  <td className="py-3.5 px-4">{m.rmse.toFixed(2)} min</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{(m.r2_score * 100).toFixed(2)}%</td>
                  <td className="py-3.5 px-4 text-center">
                    {m.selected ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Deployed
                      </span>
                    ) : (
                      <span className="text-slate-500">Baseline</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. EDA Visualizations */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart className="w-5 h-5 text-orange-400" />
          Exploratory Data Analysis (EDA) Distributions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chart A: Delivery Time Distribution Bins */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">1. Delivery Time Distribution (Min)</h4>
            <div className="space-y-2 pt-2">
              {eda.delivery_time_distribution?.map((item, idx) => {
                const percentage = Math.round((item.count / 45584) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{item.range}</span>
                      <span className="text-slate-400">{item.count.toLocaleString()} orders ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full" style={{ width: `${percentage * 2}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart B: Traffic Density vs Avg Delivery Time */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">2. Road Traffic Density vs Avg Delivery Time</h4>
            <div className="space-y-3 pt-2">
              {eda.traffic_vs_time?.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-semibold">{item.traffic} Traffic</span>
                    <span className="text-orange-400 font-bold">{item.avg_time} min</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: `${(item.avg_time / 35) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart C: Weather vs Delivery Time */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">3. Weather Condition vs Avg Delivery Time</h4>
            <div className="space-y-2.5 pt-2">
              {eda.weather_vs_time?.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{item.weather}</span>
                    <span className="text-amber-400 font-bold">{item.avg_time} min</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(item.avg_time / 35) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart D: Distance Range vs Delivery Time */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">4. Delivery Distance vs Avg Delivery Time</h4>
            <div className="space-y-3 pt-2">
              {eda.distance_vs_time?.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Distance: <b>{item.distance_range}</b></span>
                    <span className="text-emerald-400 font-bold">{item.avg_time} min</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(item.avg_time / 35) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 4. Actual vs Predicted Scatter Chart */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">5. Actual vs Model Predicted Delivery Time (Test Samples)</h4>
          <div className="overflow-x-auto">
            <div className="flex items-end gap-2 h-40 pt-6 px-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
              {eda.actual_vs_predicted?.slice(0, 20).map((pt, idx) => {
                const actualH = (pt.actual / 50) * 100;
                const predH = (pt.predicted / 50) * 100;
                return (
                  <div key={idx} className="flex-1 flex items-end justify-center gap-1 group relative">
                    {/* Hover tooltip */}
                    <div className="absolute -top-10 hidden group-hover:block bg-slate-950 text-[10px] text-white px-2 py-1 rounded shadow border border-slate-700 whitespace-nowrap z-20">
                      Actual: {pt.actual}m | Pred: {pt.predicted}m
                    </div>
                    <div className="w-2 bg-slate-500/60 rounded-t" style={{ height: `${actualH}%` }} title={`Actual: ${pt.actual}m`}></div>
                    <div className="w-2 bg-orange-500 rounded-t" style={{ height: `${predH}%` }} title={`Predicted: ${pt.predicted}m`}></div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-500/60 rounded"></span> Actual Target</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-500 rounded"></span> Random Forest Prediction</span>
              </div>
              <span>20 Sample Orders</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
