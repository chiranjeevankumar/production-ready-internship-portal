# Database Setup & Architecture Guide

This document describes the database schema, SQL DDL migrations, Row Level Security (RLS) policies, and seed scripts for the **Internship Portal** capstone project.

---

## 1. Database Schema DDL (PostgreSQL / Supabase)

### A. Internships Table
Stores all verified internship listings across the 5 core technical domains.

```sql
CREATE TABLE IF NOT EXISTS internships (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    logo TEXT,
    description TEXT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    work_mode VARCHAR(50) NOT NULL, -- Remote, Hybrid, On-site
    duration VARCHAR(100) NOT NULL,
    stipend VARCHAR(100) NOT NULL,
    eligibility TEXT NOT NULL,
    required_skills JSONB NOT NULL DEFAULT '[]',
    application_deadline DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### B. Applications Table
Stores student applications submitted to internships with strict privacy constraints.

```sql
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY,
    internship_id VARCHAR(64) REFERENCES internships(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    resume_url TEXT,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'Applied', -- Applied, Shortlisted, Interview Scheduled, Offer Received, Rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_internship ON applications(internship_id);
CREATE INDEX idx_applications_email ON applications(email);
```

### C. Profiles Table (Optional)
Stores student academic credentials and resume texts.

```sql
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    university VARCHAR(255),
    major VARCHAR(255),
    graduation_year VARCHAR(10),
    gpa VARCHAR(10),
    skills JSONB DEFAULT '[]',
    bio TEXT,
    resume_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### D. Admin Roles Table
Stores administrative user permissions.

```sql
CREATE TABLE IF NOT EXISTS admin_roles (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Row Level Security (RLS) Policies (Supabase)

To protect applicant privacy so that public users cannot read other applicants' private personal data:

```sql
-- Enable RLS
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Internships are publicly readable by everyone
CREATE POLICY "Public internships are viewable by everyone" 
ON internships FOR SELECT USING (true);

-- Only authenticated admins can insert/update/delete internships
CREATE POLICY "Admins can manage internships" 
ON internships FOR ALL 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_roles));

-- Applications: Students can insert their own application
CREATE POLICY "Students can submit applications" 
ON applications FOR INSERT 
WITH CHECK (true);

-- Students can only view their own applications
CREATE POLICY "Students can view their own applications" 
ON applications FOR SELECT 
USING (email = auth.jwt() ->> 'email' OR auth.jwt() ->> 'email' IN (SELECT email FROM admin_roles));

-- Only admins can update application statuses
CREATE POLICY "Admins can update applications" 
ON applications FOR UPDATE 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_roles));
```

---

## 3. Repeatable Seed Migration

When initializing the database, execute the seed script to populate the initial 5 core internships:

```sql
INSERT INTO internships (id, title, company, description, domain, location, work_mode, duration, stipend, eligibility, required_skills, application_deadline)
VALUES 
('int-sd-01', 'Junior Backend Systems Engineering Intern', 'Stripe', 'Design and scale high-throughput distributed payment processing microservices.', 'Software Development', 'San Francisco, CA', 'Hybrid', '12 Weeks', '$8,500 / month', 'B.S. in Computer Science', '["Java", "Go", "Distributed Systems"]', '2026-05-15'),
('int-aiml-02', 'AI / Machine Learning Research Intern', 'OpenAI', 'Collaborate with research scientists on multi-modal model architectures.', 'Artificial Intelligence and Machine Learning', 'San Francisco, CA', 'On-site', '12 Weeks', '$10,000 / month', 'Ph.D. or top undergrad in CS', '["Python", "PyTorch", "Transformers"]', '2026-05-01')
ON CONFLICT (id) DO NOTHING;
```
