import React, { useEffect, useState } from 'react';
import { Internship, StudentProfile as StudentProfileType } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InternshipCard } from './components/InternshipCard';
import { InternshipDetailModal } from './components/InternshipDetailModal';
import { AiPrepModal } from './components/AiPrepModal';
import { ApplicationTracker } from './components/ApplicationTracker';
import { StudentProfile } from './components/StudentProfile';
import { EmployerDashboard } from './components/EmployerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Loader2, Briefcase } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'applications' | 'profile' | 'employer' | 'admin'>('explore');
  const [role, setRole] = useState<'student' | 'employer' | 'admin'>('student');

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Bookmarks with localStorage persistence
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('interncraft_bookmarks');
      return stored ? JSON.parse(stored) : ['int-sd-01', 'int-aiml-02'];
    } catch {
      return ['int-sd-01', 'int-aiml-02'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('interncraft_bookmarks', JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  // Modals
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [aiPrepInternship, setAiPrepInternship] = useState<Internship | null>(null);

  // Student profile state
  const [studentProfile, setStudentProfile] = useState<StudentProfileType>({
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    university: 'Stanford University',
    major: 'B.S. Computer Science',
    graduationYear: '2027',
    gpa: '3.85',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    bio: 'Senior undergraduate passionate about software engineering.',
    resumeText: 'Alex Rivera | Stanford CS '
  });

  const fetchInternships = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedDomain !== 'All') params.append('domain', selectedDomain);
    if (selectedLocation !== 'All') params.append('location', selectedLocation);
    if (selectedWorkMode !== 'All') params.append('workMode', selectedWorkMode);
    if (searchQuery) params.append('search', searchQuery);
    if (sortBy) params.append('sortBy', sortBy);

    fetch(`/api/internships?${params.toString()}`)
      .then(res => res.json())
      .then(data => setInternships(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInternships();
  }, [selectedDomain, selectedLocation, selectedWorkMode, searchQuery, sortBy]);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setStudentProfile(data))
      .catch(err => console.error(err));
  }, []);

  const handleToggleSave = (id: string) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        setRole={setRole}
        savedCount={savedIds.length}
      />

      <main className="pb-16">
        {activeTab === 'explore' && (
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedWorkMode={selectedWorkMode}
              setSelectedWorkMode={setSelectedWorkMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalCount={internships.length}
            />

            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Available Internships ({internships.length})
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  Showing verified roles across 5 core technical domains
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                  <p className="text-sm text-slate-600 font-medium">Loading internships...</p>
                </div>
              ) : internships.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No internships found</h3>
                  <p className="text-xs text-slate-500">Try adjusting your search query, domain, or location filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {internships.map(internship => (
                    <InternshipCard
                      key={internship.id}
                      internship={internship}
                      onSelect={setSelectedInternship}
                      isSaved={savedIds.includes(internship.id)}
                      onToggleSave={handleToggleSave}
                      onOpenAiPrep={setAiPrepInternship}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'applications' && <ApplicationTracker />}
        {activeTab === 'profile' && <StudentProfile />}
        {activeTab === 'employer' && <EmployerDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals */}
      {selectedInternship && (
        <InternshipDetailModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
          studentProfile={studentProfile}
          onApplySuccess={() => {
            setActiveTab('applications');
          }}
        />
      )}

      {aiPrepInternship && (
        <AiPrepModal
          internship={aiPrepInternship}
          onClose={() => setAiPrepInternship(null)}
        />
      )}
    </div>
  );
}
