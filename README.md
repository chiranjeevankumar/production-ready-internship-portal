# Internship Portal - Capstone Edition

A comprehensive, production-grade full-stack internship portal designed for college capstone demonstrations. Features multi-role access (Student, Employer, Admin), advanced search and filtering across core technical domains, AI-powered resume matching, automated cover letter generation, AI mock interview coaching, application tracking, and secure administrative CRUD management.

---

## Features

- **Internship Board**: Explore verified internships across 5 core technical domains (Software Development, Artificial Intelligence and Machine Learning, Data Analytics, Web Development, Cybersecurity).
- **Advanced Search & Filters**: Search by title, company, or skills; filter by domain, location, work mode (Remote, Hybrid, On-site), and sort by newest or deadline.
- **Bookmarks**: Save internships with persistence across refreshes using `localStorage`.
- **AI-Powered Career Tools (Gemini API)**:
  - **Resume Match Analyzer**: Evaluates candidate resumes against role requirements to compute match scores and actionable improvement suggestions.
  - **Cover Letter Generator**: Generates professional cover letters tailored to specific internship roles.
  - **AI Mock Interview Coach**: Generates technical and behavioral interview prep questions and evaluation rubrics.
- **Application Management**: Submit applications with robust client and server validation, email checking, duplicate prevention, and status tracking.
- **Admin & Employer Dashboard**: Full CRUD management of internship listings (Create, Edit, Delete with confirmation), review applicant lists, update application statuses, and filter by status.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React.
- **Backend**: Node.js, Express, TypeScript (`tsx`).
- **AI Integration**: `@google/genai` (Gemini 3.8 Flash SDK).
- **Storage**: In-memory database with persistent store pattern and Supabase/PostgreSQL schema readiness.

---

## Project Structure

```
├── DATABASE_SETUP.md          # Database DDL, RLS policies, and seed instructions
├── CAPSTONE_EVIDENCE.md       # Evidence of executed tests and verification results
├── SECURITY_CHECKLIST.md      # Security review and compliance checklist
├── server.ts                  # Full-stack Express server with Gemini AI and API routes
├── package.json               # Dependencies and scripts
├── src/
│   ├── App.tsx                # Main container component
│   ├── main.tsx               # Entry point
│   ├── index.css              # Tailwind CSS imports
│   ├── types.ts               # TypeScript interfaces
│   └── components/
│       ├── Navbar.tsx         # Top bar contract & role switcher
│       ├── Hero.tsx           # Landing banner, search, and domain filters
│       ├── InternshipCard.tsx # Listing card with unboxed metadata
│       ├── InternshipDetailModal.tsx # Full details & application form
│       ├── AiPrepModal.tsx    # AI mock interview simulator
│       ├── ApplicationTracker.tsx # Kanban/table applicant status tracker
│       ├── StudentProfile.tsx # Resume and skills manager
│       ├── EmployerDashboard.tsx # Admin / Employer CRUD & application review
│       └── AdminDashboard.tsx # Platform analytics & system metrics
```

---

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Provide your `GEMINI_API_KEY`.

3. Run the development server:
   ```bash
   npm run dev
   ```

---

## Database Configuration

See [`DATABASE_SETUP.md`](DATABASE_SETUP.md) for complete PostgreSQL / Supabase SQL DDL schemas, Row Level Security (RLS) policies, and repeatable seed migrations.

---

## API Documentation

- `GET /api/health` - Service status and database connectivity.
- `GET /api/internships` - Retrieve internship records with search & filters.
- `GET /api/internships/:id` - Retrieve one internship record.
- `POST /api/internships` - Create internship (requires admin authorization).
- `PUT /api/internships/:id` - Update internship (requires admin authorization).
- `DELETE /api/internships/:id` - Delete internship (requires admin authorization).
- `GET /api/applications` - Retrieve student applications.
- `GET /api/admin/applications` - Retrieve all applications (requires admin authorization).
- `POST /api/applications` - Validate and store student application.
- `PATCH /api/applications/:id` - Update application status.

---

## Security Notes

- **Admin Authorization**: Administrative endpoints require valid `x-admin-token` headers.
- **Privacy Protection**: Private applicant personal information is isolated from public endpoints.
- **Input Validation**: Server-side validation on all incoming payload bodies.
