import React, { useEffect, useState } from 'react';
import { DashboardStats } from '../types';
import { Shield, Users, Briefcase, Award, TrendingUp, CheckCircle2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return <div className="py-20 text-center text-slate-500 text-sm">Loading admin analytics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Capstone Platform Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">System-wide metrics, recruitment conversion rates, and AI utilization metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Internships</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">{stats.totalInternships}</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">100% verified placements</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Applications</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">{stats.totalApplications}</div>
          <p className="text-xs text-blue-600 font-medium mt-1">Across all participating universities</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interviews Scheduled</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">{stats.interviewsScheduled}</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Active technical loops</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg AI Match Score</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">{stats.averageMatchScore}%</div>
          <p className="text-xs text-purple-600 font-medium mt-1">Gemini AI resume evaluation</p>
        </div>
      </div>

      {/* System Status Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">System Integration & Services Status</h3>
        <div className="divide-y divide-slate-100 text-sm">
          <div className="py-3 flex items-center justify-between">
            <span className="font-medium text-slate-700">Express Backend & API Routing</span>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Operational
            </span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <span className="font-medium text-slate-700">Gemini AI SDK (`@google/genai`) Integration</span>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Operational
            </span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <span className="font-medium text-slate-700">In-Memory Persistent Database Store</span>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
