import React, { useState } from 'react';
import { Internship } from '../types';
import { X, Sparkles, Loader2, HelpCircle, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface AiPrepModalProps {
  internship: Internship;
  onClose: () => void;
}

export const AiPrepModal: React.FC<AiPrepModalProps> = ({ internship, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [prepData, setPrepData] = useState<any>(null);
  const [error, setError] = useState('');

  React.useEffect(() => {
    fetch('/api/ai/interview-prep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internshipId: internship.id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setPrepData(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [internship.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">AI Interview Coach</span>
              <h2 className="text-lg font-bold text-slate-900">{internship.company} — {internship.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {loading && (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
              <p className="text-sm text-slate-600 font-medium">Generating technical & behavioral interview prep guide with Gemini AI...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && prepData && (
            <>
              {/* Insider Tips */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">Insider Interview Tips</h3>
                <ul className="space-y-1.5 text-xs text-indigo-950">
                  {prepData.interviewTips?.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Questions */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Technical Questions</h3>
                <div className="space-y-4">
                  {prepData.technicalQuestions?.map((q: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-bold text-indigo-600 uppercase">Q{idx + 1} · {q.category}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{q.question}</p>
                      <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800 block mb-0.5">Evaluation & Sample Answer Guide:</span>
                        <p className="leading-relaxed">{q.sampleAnswerGuide}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavioral Questions */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Behavioral & Culture Fit</h3>
                <div className="space-y-4">
                  {prepData.behavioralQuestions?.map((q: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-bold text-emerald-700 uppercase">Behavioral {idx + 1} · Purpose: {q.purpose}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{q.question}</p>
                      <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800 block mb-0.5">Suggested Approach (STAR method):</span>
                        <p className="leading-relaxed">{q.sampleAnswerGuide}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
