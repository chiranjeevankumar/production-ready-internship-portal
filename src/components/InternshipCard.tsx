import React from 'react';
import { Internship } from '../types';
import { MapPin, DollarSign, Calendar, Bookmark, BookmarkCheck, Sparkles, Users, Briefcase } from 'lucide-react';

interface InternshipCardProps {
  internship: Internship;
  onSelect: (internship: Internship) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenAiPrep: (internship: Internship) => void;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  onSelect,
  isSaved,
  onToggleSave,
  onOpenAiPrep,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <img
                src={internship.logo}
                alt={internship.company}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                {internship.title}
              </h3>
              <div className="text-sm font-semibold text-slate-700 mt-0.5">
                {internship.company}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(internship.id);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isSaved ? "Remove from bookmarks" : "Save bookmark"}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Domain Badge & Work Mode */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md">
            {internship.domain}
          </span>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
            {internship.workMode}
          </span>
        </div>

        {/* Clean unboxed metadata with · separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {internship.location}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 font-medium text-emerald-700">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            {internship.stipend}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Due {internship.deadline}
          </span>
        </div>

        {/* Description Snippet */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {internship.description}
        </p>

        {/* Requirements Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {internship.requirements.slice(0, 3).map((req, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md"
            >
              {req}
            </span>
          ))}
          {internship.requirements.length > 3 && (
            <span className="px-2 py-1 text-xs text-slate-400 font-medium">
              +{internship.requirements.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Users className="w-4 h-4 text-slate-400" />
          <span>{internship.applicantCount} applicants</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAiPrep(internship)}
            className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Prep</span>
          </button>
          
          <button
            onClick={() => onSelect(internship)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            View Details & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
