import React from 'react';
import { Search, MapPin, Sparkles, Filter, ArrowUpDown } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDomain: string;
  setSelectedDomain: (d: string) => void;
  selectedLocation: string;
  setSelectedLocation: (l: string) => void;
  selectedWorkMode: string;
  setSelectedWorkMode: (w: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  totalCount: number;
}

const DOMAINS = [
  'All',
  'Software Development',
  'Artificial Intelligence and Machine Learning',
  'Data Analytics',
  'Web Development',
  'Cybersecurity'
];

const LOCATIONS = ['All', 'San Francisco', 'New York', 'Los Gatos', 'Boston'];
const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-site'];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDomain,
  setSelectedDomain,
  selectedLocation,
  setSelectedLocation,
  selectedWorkMode,
  setSelectedWorkMode,
  sortBy,
  setSortBy,
  totalCount
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white py-14 px-6 rounded-3xl my-6 shadow-xl">
      {/* Background Image Scrim */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="/src/assets/images/hero_internship_banner_1793171832115.jpg"
          alt="Workspace"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Capstone Edition — AI Resume Matching & Internship Board</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance">
          Discover Elite College Internships Across Tech Domains
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Search by title, company, and skills. Filter by domain, location, and work mode. Track applications and prepare with Gemini AI.
        </p>

        {/* Search & Primary Filters */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 bg-white/90 text-slate-900 px-4 py-3 rounded-xl">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by title, company, or skills (e.g. React, Python, SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500 text-slate-900 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white/90 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium outline-none cursor-pointer"
            >
              <option value="All">All Locations</option>
              {LOCATIONS.filter(l => l !== 'All').map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="bg-white/90 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium outline-none cursor-pointer"
            >
              <option value="All">All Work Modes</option>
              {WORK_MODES.filter(w => w !== 'All').map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/90 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="deadline">Sort: Deadline</option>
            </select>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Domains:
          </span>
          {DOMAINS.map(domain => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedDomain === domain
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
