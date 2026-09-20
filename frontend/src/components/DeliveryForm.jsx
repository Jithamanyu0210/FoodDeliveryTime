import React, { useState } from 'react';
import { MapPin, User, CloudSun, Navigation, ShieldAlert, Send, Briefcase } from 'lucide-react';

export default function DeliveryForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    Delivery_person_Age: 28,
    Delivery_person_Experience: 3.5,
    Delivery_person_Ratings: 4.8,
    distance_km: 5.2,
    Weather_conditions: 'Sunny',
    Road_traffic_density: 'Medium',
    Vehicle_condition: 2,
    Type_of_order: 'Meal',
    Type_of_vehicle: 'motorcycle',
    multiple_deliveries: 1.0,
    Festival: 'No',
    City: 'Metropolitian'
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/70 shadow-xl space-y-6">
      <div className="border-b border-slate-700/60 pb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Navigation className="w-5 h-5 text-orange-400" />
          Order & Delivery Parameters
        </h2>
        <span className="text-xs text-slate-400">Fill operational details</span>
      </div>

      {/* Grid Section 1: Delivery Partner & Experience */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          Courier Details & Experience
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Age (Years)</label>
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
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Experience (Years)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="25"
              name="Delivery_person_Experience"
              value={formData.Delivery_person_Experience}
              onChange={handleChange}
              placeholder="e.g. 3.5"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Rating (1.0 - 5.0)</label>
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

      {/* Grid Section 2: Restaurant Distance Input */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          Delivery Distance
        </h3>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Restaurant to Customer Distance (km)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              name="distance_km"
              value={formData.distance_km}
              onChange={handleChange}
              placeholder="e.g. 5.2"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-12 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition"
              required
            />
            <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">km</span>
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

      {/* Grid Section 4: Vehicle & Order Logistics */}
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Calculating ML Prediction...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Predict Delivery Time</span>
          </>
        )}
      </button>
    </form>
  );
}
