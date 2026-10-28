import React, { useState } from 'react';
import { Internship, StudentProfile } from '../types';
import { X, MapPin, DollarSign, Calendar, Sparkles, CheckCircle, Send, AlertCircle, Loader2, Phone, Link as LinkIcon, User, Mail, FileText } from 'lucide-react';

interface InternshipDetailModalProps {
  internship: Internship;
  onClose: () => void;
  studentProfile: StudentProfile;
  onApplySuccess: () => void;
}

export const InternshipDetailModal: React.FC<InternshipDetailModalProps> = ({
  internship,
  onClose,
  studentProfile,
  onApplySuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'ai-match' | 'apply'>('details');

  // AI Match state
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  // Cover Letter state
  const [loadingCover, setLoadingCover] = useState(false);
  const [tone, setTone] = useState('Professional & Enthusiastic');

  // Application Form state
  const [applicantName, setApplicantName] = useState(studentProfile.name);
  const [email, setEmail] = useState(studentProfile.email);
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [resumeUrl, setResumeUrl] = useState('https://github.com/alexrivera/resume');
  const [coverLetter, setCoverLetter] = useState(`Dear Hiring Manager,\n\nI am thrilled to apply for the ${internship.title} internship at ${internship.company}. With my background in ${studentProfile.major} and hands-on experience in ${studentProfile.skills.slice(0, 3).join(', ')}, I am confident in my ability to contribute effectively to your team.\n\nThank you for considering my application.\n\nSincerely,\n${studentProfile.name}`);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRunAiMatch = async () => {
    setLoadingMatch(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai/resume-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipId: internship.id, resumeText: studentProfile.resumeText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate AI match');
      setMatchResult(data);
      setActiveTab('ai-match');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setLoadingCover(true);
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internshipId: internship.id, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate cover letter');
      setCoverLetter(data.coverLetter);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoadingCover(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Client Validation
    if (!applicantName.trim()) {
      setErrorMsg('Please enter your full applicant name.');
      return;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internshipId: internship.id,
          applicantName,
          email,
          phone,
          resumeUrl,
          coverLetter,
          matchScore: matchResult?.matchScore || 88,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }
      setSuccessMsg(true);
      setTimeout(() => {
        onApplySuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-md">
              <img
                src={internship.logo}
                alt={internship.company}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {internship.company}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-xs font-medium text-slate-500">{internship.domain}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                {internship.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-8 border-b border-slate-100 flex items-center gap-6 text-sm font-medium bg-slate-50/50">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 font-semibold transition-colors ${
              activeTab === 'details' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Full Details
          </button>
          <button
            onClick={() => {
              if (!matchResult) handleRunAiMatch();
              else setActiveTab('ai-match');
            }}
            className={`py-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai-match' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Resume Match</span>
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`py-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'apply' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-indigo-600" />
            <span>Apply Now</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>Application submitted successfully! Redirecting to applications...</span>
            </div>
          )}

          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Key metadata grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Location / Mode</span>
                  <span className="font-semibold text-slate-800">{internship.location} ({internship.workMode})</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Stipend</span>
                  <span className="font-semibold text-emerald-700">{internship.stipend}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Duration</span>
                  <span className="font-semibold text-slate-800">{internship.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Deadline</span>
                  <span className="font-semibold text-slate-800">{internship.deadline}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{internship.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Eligibility Criteria</h4>
                <p className="text-slate-700 text-sm bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 font-medium">
                  {internship.eligibility}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Required Skills & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {internship.requirements.map((req, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={handleRunAiMatch}
                  disabled={loadingMatch}
                  className="px-5 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-2"
                >
                  {loadingMatch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-600" />}
                  <span>Run AI Resume Match Analysis</span>
                </button>

                <button
                  onClick={() => setActiveTab('apply')}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
                >
                  Proceed to Apply
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AI RESUME MATCH */}
          {activeTab === 'ai-match' && (
            <div className="space-y-6">
              {loadingMatch ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                  <p className="text-sm text-slate-600 font-medium">Gemini AI is analyzing your resume against the role...</p>
                </div>
              ) : matchResult ? (
                <>
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shadow-lg">
                    <div>
                      <span className="text-xs text-indigo-300 font-medium tracking-wider uppercase block mb-1">AI Match Suitability Score</span>
                      <h3 className="text-3xl font-extrabold">{matchResult.matchScore}% Match</h3>
                      <p className="text-xs text-slate-300 mt-1">Evaluated by Gemini AI based on required skills & experience.</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-2xl font-bold">
                      {matchResult.matchScore}%
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Key Strengths</h4>
                      <ul className="space-y-1.5 text-xs text-emerald-900">
                        {matchResult.keyStrengths?.map((s: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Skills to Highlight</h4>
                      <ul className="space-y-1.5 text-xs text-amber-900">
                        {matchResult.missingSkills?.map((s: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Recruiter Assessment</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                      {matchResult.feedback}
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
                    >
                      Proceed to Application Form
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* TAB 3: APPLY FORM */}
          {activeTab === 'apply' && (
            <form onSubmit={handleApplySubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Applicant Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. alex.rivera@university.edu"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400" /> Resume URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={e => setResumeUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/my-resume"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Cover Letter or Short Introduction *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateCoverLetter}
                    disabled={loadingCover}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    {loadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Generate with Gemini AI</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  required
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium">
                  Applying for <span className="font-bold text-slate-800">{internship.title}</span> at <span className="font-bold text-slate-800">{internship.company}</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
