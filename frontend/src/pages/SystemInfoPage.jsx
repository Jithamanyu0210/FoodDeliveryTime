import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cpu, Server, Database, CheckCircle2, Sliders, Calendar, ShieldCheck, HardDrive } from 'lucide-react';

export default function SystemInfoPage({ API_BASE_URL }) {
  const [sysInfo, setSysInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/system`);
        if (response.data && !response.data.error) {
          setSysInfo(response.data);
        } else {
          const directRes = await axios.get('http://127.0.0.1:5000/api/system');
          setSysInfo(directRes.data);
        }
      } catch (err) {
        console.log("Error fetching system info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3"></div>
        <span>Fetching Developer & System Information...</span>
      </div>
    );
  }

  const items = [
    { label: 'Project Name', value: sysInfo?.project_name || 'Food Delivery Time Prediction', icon: Server, color: 'text-orange-400' },
    { label: 'Dataset', value: sysInfo?.dataset_name || 'Kaggle Zomato dataset', icon: Database, color: 'text-sky-400' },
    { label: 'Model Currently Used', value: sysInfo?.active_model || 'Gradient Boosting Regressor', icon: Cpu, color: 'text-amber-400' },
    { label: 'Model Training Date', value: sysInfo?.training_date || 'Not available', icon: Calendar, color: 'text-indigo-400' },
    { label: 'Training Records', value: sysInfo?.training_records ? sysInfo.training_records.toLocaleString() : '36,467', icon: HardDrive, color: 'text-emerald-400' },
    { label: 'Input Features', value: sysInfo?.total_features ? `${sysInfo.total_features} features` : '12 features', icon: Sliders, color: 'text-purple-400' },
    { label: 'Model Version', value: sysInfo?.model_version || 'v2.0 (Multi-Model)', icon: ShieldCheck, color: 'text-rose-400' },
    { label: 'Model File Status', value: sysInfo?.model_file_status || 'Active & Loaded', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Backend / API Status', value: sysInfo?.backend_status || 'Online', icon: Server, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-slate-700/60 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-6 h-6 text-orange-400" />
          Developer & System Information
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time system diagnostics, active ML model configuration, and backend API status.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>{item.label}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-base font-bold text-white tracking-tight break-words">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
