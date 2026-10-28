import React, { useEffect, useState } from 'react';
import { Application } from '../types';
import { Briefcase, Calendar, CheckCircle2, Clock, XCircle, ChevronRight, Building, FileText } from 'lucide-react';

export const ApplicationTracker: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Offer Received':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">Offer Received</span>;
      case 'Interview Scheduled':
        return <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">Interview Scheduled</span>;
      case 'Shortlisted':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Shortlisted</span>;
      case 'Rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Not Selected</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-full">Applied</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Internship Applications</h1>
          <p className="text-sm text-slate-500 mt-1">Track your recruitment pipeline, interview schedules, and offer statuses.</p>
        </div>
        <div className="text-xs font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200">
          Total Active Applications: <span className="font-bold text-slate-900">{applications.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No applications submitted yet</h3>
          <p className="text-xs text-slate-500">Explore available internships and submit your applications to track them here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Company & Role</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">AI Match Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Recruiter Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-sm">
                          <img
                            src={app.internship?.logo || '/src/assets/images/company_logo_tech_1793171832038.jpg'}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-snug">{app.internship?.title || 'Engineering Intern'}</span>
                          <span className="text-xs text-slate-500">{app.internship?.company || 'Tech Corp'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 tabular-nums">
                      {app.appliedDate}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 tabular-nums">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
                        {app.matchScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                      {app.notes}
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
};
