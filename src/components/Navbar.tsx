import React from 'react';
import { Briefcase, UserCheck, Shield, Sparkles, BookmarkCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: 'explore' | 'applications' | 'profile' | 'employer' | 'admin') => void;
  role: 'student' | 'employer' | 'admin';
  setRole: (role: 'student' | 'employer' | 'admin') => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  role,
  setRole,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('explore')}>
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              InternCraft
            </span>
            <span className="text-[11px] text-slate-500 font-medium tracking-wide">
              Capstone Portal
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('explore')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'explore' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Explore Jobs
          </button>
          
          {role === 'student' && (
            <>
              <button
                onClick={() => setActiveTab('applications')}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                  activeTab === 'applications' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                  activeTab === 'profile' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'
                }`}
              >
                My Profile & AI
              </button>
            </>
          )}

          {role === 'employer' && (
            <button
              onClick={() => setActiveTab('employer')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'employer' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Employer Dashboard
            </button>
          )}

          {role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                activeTab === 'admin' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'
              }`}
            >
              Admin Analytics
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action & Role Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {role === 'student' && savedCount > 0 && (
            <button
              onClick={() => setActiveTab('explore')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <BookmarkCheck className="w-4 h-4 text-indigo-600" />
              <span>Saved ({savedCount})</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => { setRole('student'); setActiveTab('explore'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                role === 'student' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => { setRole('employer'); setActiveTab('employer'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                role === 'employer' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Employer
            </button>
            <button
              onClick={() => { setRole('admin'); setActiveTab('admin'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                role === 'admin' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
