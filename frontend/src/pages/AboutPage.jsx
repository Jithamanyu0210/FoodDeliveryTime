import React from 'react';
import { Info, HelpCircle, Layers, Cpu, Code2, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-700/60 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Info className="w-6 h-6 text-orange-400" />
          About Project — Academic Presentation & Technical Reference
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete project documentation prepared for college viva presentations, project reports, and technical demonstrations.
        </p>
      </div>

      {/* 1. Problem Statement & Objective */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-orange-400" />
            1. Problem Statement
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            In modern online food delivery services (like Zomato and Swiggy), food delivery time varies drastically due to unpredictable traffic conditions, weather disruptions, order preparation time, vehicle condition, and delivery distance. Providing inaccurate delivery estimates leads to customer dissatisfaction, cold food complaints, and poor fleet efficiency.
          </p>
        </div>

        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            2. Project Objective
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To build a machine learning regression model and full-stack web application capable of accurately predicting food delivery time in minutes (<code className="text-orange-300">Time_taken (min)</code>) based on real-world operational parameters, environmental weather factors, road traffic density, courier experience, and geodesic delivery distance.
          </p>
        </div>
      </div>

      {/* 2. Dataset & Important Columns */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-4 shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-400" />
          3. Dataset & Key Operational Columns
        </h3>
        <p className="text-xs text-slate-300">
          Trained on the real-world <b>Zomato Delivery Operations Analytics Dataset</b> from Kaggle comprising <b>45,584 records</b>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <b className="text-orange-400 block mb-1">Target Variable</b>
            <span className="text-slate-300">Time_taken (min) — Continuous delivery duration in minutes (10 - 54 min)</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <b className="text-orange-400 block mb-1">Geodesic Distance</b>
            <span className="text-slate-300">distance_km — Calculated via Haversine formula from latitude & longitude</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <b className="text-orange-400 block mb-1">Courier Details</b>
            <span className="text-slate-300">Delivery_person_Age, Delivery_person_Ratings & Delivery_person_Experience</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <b className="text-orange-400 block mb-1">Environment</b>
            <span className="text-slate-300">Weather_conditions (Sunny, Fog, Stormy, etc.), Road_traffic_density (Low to Jam)</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <b className="text-orange-400 block mb-1">Vehicle Logistics</b>
            <span className="text-slate-300">Type_of_vehicle (motorcycle, scooter, electric_scooter, bicycle) & Vehicle_condition</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">
            <b className="text-orange-400 block mb-1">City & Order Type</b>
            <span className="text-slate-300">City (Metropolitian, Urban, Semi-Urban), Type_of_order & Festival season</span>
          </div>
        </div>
      </div>

      {/* 3. Preprocessing, Feature Engineering & Algorithms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            4. Preprocessing & Feature Engineering
          </h3>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li><b>Haversine Formula:</b> Used spherical trigonometry to calculate great-circle distance between restaurant and customer coordinates in kilometers.</li>
            <li><b>Simple Imputer:</b> Imputed missing numerical values with column median and missing categorical variables with mode.</li>
            <li><b>Standard Scaling & One-Hot Encoding:</b> Scaled numerical features to zero mean and unit variance; applied one-hot encoding to environmental strings.</li>
          </ul>
        </div>

        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            5. Machine Learning Algorithms & Metrics
          </h3>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li><b>Linear Regression (Baseline):</b> MAE = 4.82 min, RMSE = 6.07 min, R² = 58.28%.</li>
            <li><b>Random Forest Regressor (Final):</b> Ensemble of 100 decision trees. MAE = <b>3.22 min</b>, RMSE = <b>4.09 min</b>, R² = <b>81.01%</b>.</li>
            <li><b>Evaluation Metrics:</b> Mean Absolute Error (MAE), Root Mean Square Error (RMSE), Coefficient of Determination ($R^2$).</li>
          </ul>
        </div>
      </div>

      {/* 4. Tech Stack */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-4 shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-orange-400" />
          6. Technology Stack
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
            <b className="text-white block mb-1">Python 3.13</b>
            <span className="text-slate-400">Core Programming</span>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
            <b className="text-white block mb-1">Scikit-Learn</b>
            <span className="text-slate-400">ML Pipelines & Models</span>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
            <b className="text-white block mb-1">Flask & Flask-CORS</b>
            <span className="text-slate-400">Backend REST API</span>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
            <b className="text-white block mb-1">React + Vite + Tailwind</b>
            <span className="text-slate-400">Frontend Web UI</span>
          </div>
        </div>
      </div>

      {/* 5. Limitations & Future Enhancements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            7. Project Limitations
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Does not include live GPS tracking of delivery drivers in real time.</li>
            <li>Weather conditions are selected manually or from cached static values rather than live weather APIs.</li>
            <li>Static traffic levels (Low, Medium, High, Jam) instead of live Google Maps traffic APIs.</li>
          </ul>
        </div>

        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 space-y-3 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            8. Future Enhancements
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Integrate OpenStreetMap / Nominatim API for interactive map address picking.</li>
            <li>Integrate OpenWeatherMap API for automatic weather detection.</li>
            <li>Deploy XGBoost / LightGBM models and implement model drift tracking with SQLite / MongoDB.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
