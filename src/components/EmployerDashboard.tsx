import React, { useEffect, useState } from 'react';
import { Internship, Application } from '../types';
import { PlusCircle, Building, Users, CheckCircle, Clock, X, Loader2, Sparkles, Edit3, Trash2, Filter, AlertTriangle } from 'lucide-react';

export const EmployerDashboard: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'internships' | 'applications'>('internships');
  
  // Modals
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Application status filter
  const [statusFilter, setStatusFilter] = useState('All');

  // Form state
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [domain, setDomain] = useState('Software Development');
  const [location, setLocation] = useState('San Francisco, CA');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [duration, setDuration] = useState('12 Weeks');
  const [stipend, setStipend] = useState('$8,000 / month');
  const [eligibility, setEligibility] = useState('B.S. in Computer Science');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('React, TypeScript, Node.js');
  const [deadline, setDeadline] = useState('2026-06-01');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [intRes, appRes] = await Promise.all([
        fetch('/api/internships'),
        fetch('/api/admin/applications'),
      ]);
      const ints = await intRes.json();
      const apps = await appRes.json();
      setInternships(ints);
      setApplications(apps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingInternship(null);
    setTitle('');
    setCompany('');
    setDomain('Software Development');
    setLocation('San Francisco, CA');
    setWorkMode('Hybrid');
    setDuration('12 Weeks');
    setStipend('$8,000 / month');
    setEligibility('B.S. in Computer Science');
    setDescription('');
    setRequirements('React, TypeScript, Node.js');
    setDeadline('2026-06-01');
    setShowPostModal(true);
  };

  const openEditModal = (int: Internship) => {
    setEditingInternship(int);
    setTitle(int.title);
    setCompany(int.company);
    setDomain(int.domain);
    setLocation(int.location);
    setWorkMode(int.workMode);
    setDuration(int.duration);
    setStipend(int.stipend);
    setEligibility(int.eligibility);
    setDescription(int.description);
    setRequirements(int.requirements.join(', '));
    setDeadline(int.deadline);
    setShowPostModal(true);
  };

  const handleSaveInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        company,
        domain,
        location,
        workMode,
        duration,
        stipend,
        eligibility,
        description,
        requirements: requirements.split(',').map(s => s.trim()),
        deadline,
      };

      const url = editingInternship ? `/api/internships/${editingInternship.id}` : '/api/internships';
      const method = editingInternship ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save internship');

      setShowPostModal(false);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInternship = async (id: string) => {
    try {
      const res = await fetch(`/api/internships/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setDeletingId(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredApplications = statusFilter === 'All' 
    ? applications 
    : applications.filter(a => a.status === statusFilter);

  if (loading) {
    return <div className="py-20 text-center text-slate-500 text-sm">Loading employer & admin dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Employer & Admin Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Manage internship listings, review applications, and update candidate statuses securely.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Internship</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('internships')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'internships' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Manage Internships ({internships.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'applications' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Review Applications ({applications.length})
        </button>
      </div>

      {/* TAB 1: MANAGE INTERNSHIPS */}
      {activeTab === 'internships' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider bg-slate-50/50">
                  <th className="px-6 py-3">Title & Company</th>
                  <th className="px-6 py-3">Domain</th>
                  <th className="px-6 py-3">Location / Mode</th>
                  <th className="px-6 py-3">Applicants</th>
                  <th className="px-6 py-3">Deadline</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {internships.map(int => (
                  <tr key={int.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-950 block">{int.title}</span>
                      <span className="text-xs text-slate-500">{int.company}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md">
                        {int.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {int.location} ({int.workMode})
                    </td>
                    <td className="px-6 py-4 font-bold text-indigo-600 tabular-nums">
                      {int.applicantCount || 0}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 tabular-nums">
                      {int.deadline}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(int)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(int.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REVIEW APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Filter by Status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Offer Received', 'Rejected'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    statusFilter === st ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider bg-slate-50/50">
                    <th className="px-6 py-3">Candidate</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Match Score</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredApplications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-950 block">{app.applicantName}</span>
                        <span className="text-xs text-slate-500">{app.email}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {app.internship?.title || 'Engineering Intern'}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 tabular-nums">
                        {app.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-600 tabular-nums">
                        {app.matchScore}%
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-full">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Offer Received">Offer Received</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT INTERNSHIP MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {editingInternship ? 'Edit Internship Listing' : 'Post New Internship Listing'}
              </h3>
              <button onClick={() => setShowPostModal(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInternship} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Junior Backend Systems Engineer"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Stripe"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Domain *</label>
                  <select
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                  >
                    <option>Software Development</option>
                    <option>Artificial Intelligence and Machine Learning</option>
                    <option>Data Analytics</option>
                    <option>Web Development</option>
                    <option>Cybersecurity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
                  <select
                    value={workMode}
                    onChange={e => setWorkMode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                  >
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stipend</label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={e => setStipend(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={eligibility}
                  onChange={e => setEligibility(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={requirements}
                  onChange={e => setRequirements(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-sm flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingInternship ? 'Save Changes' : 'Publish Listing'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Internship Listing?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this internship? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteInternship(deletingId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
