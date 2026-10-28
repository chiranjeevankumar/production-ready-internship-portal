Internship Portal - Capstone Edition

Live Application: "Open the Internship Portal" (https://career-opportunity-hub.ai.studio)

A comprehensive, production-grade full-stack internship portal designed for college capstone demonstrations. Features multi-role access (Student, Employer, Admin), advanced search and filtering across core technical domains, AI-powered resume matching, automated cover letter generation, AI mock interview coaching, application tracking, and secure administrative CRUD management.

---

Features

- Internship Board: Explore internships across five technical domains: Software Development, Artificial Intelligence and Machine Learning, Data Analytics, Web Development, and Cybersecurity.
- Advanced Search and Filters: Search by title, company, or skills; filter by domain, location, and work mode (Remote, Hybrid, On-site); sort by newest or deadline.
- Bookmarks: Save internships with persistence across refreshes using "localStorage".
- AI-Powered Career Tools (Gemini API):
  - Resume Match Analyzer: Evaluates resumes against role requirements and provides match scores and improvement suggestions.
  - Cover Letter Generator: Generates cover letters tailored to internship roles.
  - AI Mock Interview Coach: Generates technical and behavioral interview questions and evaluation rubrics.
- Application Management: Submit applications with client-side and server-side validation, duplicate prevention, and application status tracking.
- Admin and Employer Dashboard: Manage internship listings, review applications, update application statuses, and filter applications by status.

---

Application Screenshots

Add screenshots of your running application to a folder named "screenshots" in this repository. Then update the image filenames below to match your uploaded files.

<!-- Uncomment the image references below after uploading the screenshots. --><!--
### Internship Portal Homepage
![Internship Portal Homepage](screenshots/homepage.png)

### Internship Listings
![Internship Listings](screenshots/internships.png)

### Application Form
![Application Form](screenshots/application-form.png)
-->---

Technology Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Lucide React.
- Backend: Node.js, Express, TypeScript ("tsx").
- AI Integration: Google GenAI SDK.
- Storage: Application storage implementation with Supabase/PostgreSQL schema documentation.

---

Project Structure

├── DATABASE_SETUP.md
├── CAPSTONE_EVIDENCE.md
├── SECURITY_CHECKLIST.md
├── server.ts
├── package.json
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── types.ts
    └── components/
        ├── Navbar.tsx
        ├── Hero.tsx
        ├── InternshipCard.tsx
        ├── InternshipDetailModal.tsx
        ├── AiPrepModal.tsx
        ├── ApplicationTracker.tsx
        ├── StudentProfile.tsx
        ├── EmployerDashboard.tsx
        └── AdminDashboard.tsx

---

Setup Instructions

1. Clone the repository.

2. Install dependencies:
   
   npm install

3. Copy the example environment file:
   
   cp .env.example .env

4. Add your Gemini API key to ".env" if required:
   
   GEMINI_API_KEY=your_api_key_here

5. Start the development server:
   
   npm run dev

Use placeholder values in ".env.example". Never commit actual API keys, passwords, or other secrets.

---

Database Configuration

See ""DATABASE_SETUP.md"" (DATABASE_SETUP.md) for PostgreSQL/Supabase schema definitions, Row Level Security policies, and database setup instructions.

Note: Confirm that the deployed application uses the configured database before describing its production persistence guarantees.

---

API Documentation

- "GET /api/health" — Check service health.
- "GET /api/internships" — Retrieve internships with search and filtering.
- "GET /api/internships/:id" — Retrieve a specific internship.
- "POST /api/internships" — Create an internship (admin authorization required).
- "PUT /api/internships/:id" — Update an internship (admin authorization required).
- "DELETE /api/internships/:id" — Delete an internship (admin authorization required).
- "GET /api/applications" — Retrieve applications, subject to authorization rules.
- "GET /api/admin/applications" — Retrieve all applications (admin authorization required).
- "POST /api/applications" — Submit an application.
- "PATCH /api/applications/:id" — Update an application's status (authorization required).

---

Security Notes

- Admin Authorization: Administrative endpoints should require valid authorization credentials.
- Privacy Protection: Applicant personal information should not be exposed through public endpoints.
- Input Validation: Incoming request data should be validated on the server.
- Secrets Management: API keys and passwords must be stored in environment variables and excluded from version control.

---

Testing and Capstone Evidence

See ""CAPSTONE_EVIDENCE.md"" (CAPSTONE_EVIDENCE.md) for the project's recorded build results and test evidence.

See ""SECURITY_CHECKLIST.md"" (SECURITY_CHECKLIST.md) for the security review checklist.

---

Project Repository

GitHub: https://github.com/chiranjeevankumar/production-ready-internship-portal

Live Application: https://career-opportunity-hub.ai.studio
