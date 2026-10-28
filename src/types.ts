export interface Internship {
  id: string;
  title: string;
  company: string;
  logo: string;
  description: string;
  domain: string;
  location: string;
  workMode: string;
  duration: string;
  stipend: string;
  eligibility: string;
  requirements: string[];
  deadline: string;
  postedDate: string;
  featured: boolean;
  applicantCount: number;
}

export interface Application {
  id: string;
  internshipId: string;
  applicantName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string;
  status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Offer Received' | 'Rejected';
  appliedDate: string;
  matchScore: number;
  notes: string;
  internship?: Internship;
}

export interface StudentProfile {
  name: string;
  email: string;
  university: string;
  major: string;
  graduationYear: string;
  gpa: string;
  skills: string[];
  bio: string;
  resumeText: string;
}

export interface DashboardStats {
  totalInternships: number;
  totalApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  averageMatchScore: number;
}
