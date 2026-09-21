import React from 'react';
import { History, Download, Trash2, Calendar, Clock, Navigation, Cpu } from 'lucide-react';

export default function PredictionHistoryPage({ history, onDeleteRecord, onClearAllHistory }) {

  const exportToCSV = () => {
    if (!history || history.length === 0) return;

    const headers = [
      'ID', 'Timestamp', 'Selected_Model', 'Predicted_Time_Min', 'Distance_KM',
      'Weather', 'Traffic', 'Courier_Rating', 'Courier_Age', 'Courier_Experience',
      'Vehicle_Type', 'Order_Type', 'Multiple_Deliveries', 'City'
    ];

    const csvRows = [headers.join(',')];

    history.forEach(item => {
      const row = [
        item.id,
        `"${item.timestamp}"`,
        `"${item.selected_model || 'Gradient Boosting Regressor'}"`,
        item.predicted_time_min,
        item.distance_km,
        `"${item.weather || 'Sunny'}"`,
        `"${item.traffic || 'Medium'}"`,
        item.rating || 4.7,
        item.age || 28,
        item.exp || 3.5,
        `"${item.vehicle || 'motorcycle'}"`,
        `"${item.order_type || 'Meal'}"`,
        item.multiple_deliveries || 1.0,
        `"${item.city || 'Metropolitian'}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `prediction_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Page Header */}
      <div className="border-b border-slate-700/60 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-orange-400" />
            Prediction History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past food delivery predictions, timestamp logs, and export records as CSV.
          </p>
        </div>

        {history && history.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={exportToCSV}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClearAllHistory}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold py-2 px-3 rounded-xl text-xs flex items-center space-x-1.5 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* History Table */}
      {!history || history.length === 0 ? (
        <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-12 text-center text-slate-400 space-y-3">
          <History className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Prediction History Found</h3>
          <p className="text-xs max-w-sm mx-auto">
            Generate your first prediction on the Predict page and it will be recorded here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-slate-800/90 rounded-2xl border border-slate-700/70 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Model Used</th>
                  <th className="py-3.5 px-4">Distance</th>
                  <th className="py-3.5 px-4">Traffic & Weather</th>
                  <th className="py-3.5 px-4">Courier</th>
                  <th className="py-3.5 px-4">Predicted Time</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-700/30 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-400" />
                        <span>{record.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-white">
                      <div className="flex items-center space-x-1">
                        <Cpu className="w-3.5 h-3.5 text-sky-400" />
                        <span>{record.selected_model || 'Gradient Boosting Regressor'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-sky-300">
                      <div className="flex items-center space-x-1">
                        <Navigation className="w-3.5 h-3.5 text-sky-400" />
                        <span>{record.distance_km} km</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span>{record.traffic} Traffic • {record.weather}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span>Rating {record.rating}★ ({record.exp} yrs exp)</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-base text-orange-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <span>{record.predicted_time_min} mins</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onDeleteRecord(record.id)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition"
                        title="Delete this record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
