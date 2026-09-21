import React, { useState } from 'react';
import { MapPin, User, CloudSun, ShieldAlert, Send, RotateCcw, Navigation } from 'lucide-react';

const INITIAL_FORM_STATE = {
  model_name: 'Gradient Boosting Regressor',
  distance_km: 8.5,
  Delivery_person_Age: 28,
  Delivery_person_Experience: 3.5,
  Delivery_person_Ratings: 4.8,
  Weather_conditions: 'Sunny',
  Road_traffic_density: 'Medium',
  Vehicle_condition: 2,
  Type_of_order: 'Meal',
  Type_of_vehicle: 'motorcycle',
  multiple_deliveries: 1.0,
  Festival: 'No',
  City: 'Metropolitian'
};

export default function DeliveryForm({ onSubmit, loading, onClear }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    if (onClear) onClear();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/70 shadow-xl space-y-6">

      {/* Distance between Restaurant and Home */}
      <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
        <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5" />
          Distance between Restaurant and Home
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Delivery Distance (in Kilometers)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              name="distance_km"
              value={formData.distance_km}
              onChange={handleChange}
              placeholder="e.g. 8.5"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition pl-10"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-orange-400" />
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 my-1 mr-1 rounded-md border border-slate-700/50">
              km
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Enter the direct road travel distance in km between the food restaurant and delivery address.
          </p>
        </div>
      </div>

      {/* Grid Section 2: Courier Details */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          Courier Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Age (18-60 yrs)</label>
            <input
              type="number"
              name="Delivery_person_Age"
              min="18"
              max="60"
              value={formData.Delivery_person_Age}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Experience (0-25 yrs)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="25"
              name="Delivery_person_Experience"
              value={formData.Delivery_person_Experience}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Rating (1.0-5.0)</label>
            <input
              type="number"
              step="0.1"
              min="1.0"
              max="5.0"
              name="Delivery_person_Ratings"
              value={formData.Delivery_person_Ratings}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              required
            />
          </div>
        </div>
      </div>

      {/* Grid Section 3: Weather & Traffic Conditions */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
          <CloudSun className="w-3.5 h-3.5" />
          Weather & Environment
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Weather</label>
            <select
              name="Weather_conditions"
              value={formData.Weather_conditions}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="Sunny">Sunny</option>
              <option value="Cloudy">Cloudy</option>
              <option value="Windy">Windy</option>
              <option value="Fog">Fog</option>
              <option value="Stormy">Stormy</option>
              <option value="Sandstorms">Sandstorms</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Traffic Density</label>
            <select
              name="Road_traffic_density"
              value={formData.Road_traffic_density}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Jam">Jam</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">City Type</label>
            <select
              name="City"
              value={formData.City}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="Metropolitian">Metropolitian</option>
              <option value="Urban">Urban</option>
              <option value="Semi-Urban">Semi-Urban</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Section 4: Vehicle & Order Details */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          Vehicle & Order Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Vehicle Type</label>
            <select
              name="Type_of_vehicle"
              value={formData.Type_of_vehicle}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="motorcycle">Motorcycle</option>
              <option value="scooter">Scooter</option>
              <option value="electric_scooter">Electric Scooter</option>
              <option value="bicycle">Bicycle</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Order Type</label>
            <select
              name="Type_of_order"
              value={formData.Type_of_order}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="Meal">Meal</option>
              <option value="Snack">Snack</option>
              <option value="Drinks">Drinks</option>
              <option value="Buffet">Buffet</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Vehicle Condition</label>
            <select
              name="Vehicle_condition"
              value={formData.Vehicle_condition}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value={0}>0 (Poor)</option>
              <option value={1}>1 (Average)</option>
              <option value={2}>2 (Good)</option>
              <option value={3}>3 (Excellent)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Multiple Deliveries</label>
            <select
              name="multiple_deliveries"
              value={formData.multiple_deliveries}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value={0.0}>0 Deliveries</option>
              <option value={1.0}>1 Delivery</option>
              <option value={2.0}>2 Deliveries</option>
              <option value={3.0}>3 Deliveries</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Festival Season?</label>
            <select
              name="Festival"
              value={formData.Festival}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Calculating Prediction...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Predict Delivery Time</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="bg-slate-700/80 hover:bg-slate-700 text-slate-300 font-medium py-3 px-4 rounded-xl border border-slate-600/50 transition flex items-center space-x-1.5 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Form</span>
        </button>
      </div>
    </form>
  );
}
