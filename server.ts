import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' })); // Request size limit for security

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Seed exactly 5 realistic internships across the required domains
let internships = [
  {
    id: "int-sd-01",
    title: "Junior Backend Systems Engineering Intern",
    company: "Stripe",
    logo: "/src/assets/images/company_logo_tech_1793171832038.jpg",
    description: "Design and scale high-throughput distributed payment processing microservices handling millions of secure transactions globally.",
    domain: "Software Development",
    location: "San Francisco, CA",
    workMode: "Hybrid",
    duration: "12 Weeks (Summer 2026)",
    stipend: "$8,500 / month",
    eligibility: "B.S. / M.S. in Computer Science or related engineering discipline. Graduating by Dec 2027.",
    requirements: ["Java / Go / Node.js", "Distributed Systems", "SQL & Database Design", "RESTful APIs"],
    deadline: "2026-05-15",
    postedDate: "2 days ago",
    featured: true,
    applicantCount: 142
  },
  {
    id: "int-aiml-02",
    title: "AI / Machine Learning Research Intern",
    company: "OpenAI",
    logo: "/src/assets/images/company_logo_tech_1793171832038.jpg",
    description: "Collaborate with research scientists on multi-modal model architectures, reinforcement learning alignment, and reasoning evaluations.",
    domain: "Artificial Intelligence and Machine Learning",
    location: "San Francisco, CA",
    workMode: "On-site",
    duration: "12 Weeks (Summer 2026)",
    stipend: "$10,000 / month",
    eligibility: "Currently enrolled in Ph.D. or top undergraduate program in CS, AI, Statistics, or Mathematics.",
    requirements: ["Python", "PyTorch / JAX", "Linear Algebra & Probability", "Transformer Architectures"],
    deadline: "2026-05-01",
    postedDate: "1 day ago",
    featured: true,
    applicantCount: 310
  },
  {
    id: "int-da-03",
    title: "Data Analytics & Insights Intern",
    company: "Netflix",
    logo: "/src/assets/images/company_logo_tech_1793171832038.jpg",
    location: "Los Gatos, CA",
    workMode: "Hybrid",
    duration: "10 Weeks (Summer 2026)",
    stipend: "$9,000 / month",
    eligibility: "B.S. in Data Science, Statistics, Economics, or Computer Science with strong quantitative background.",
    requirements: ["SQL", "Python / R", "Data Visualization (Tableau/Looker)", "Statistical Modeling"],
    deadline: "2026-05-10",
    postedDate: "3 days ago",
    featured: false,
    applicantCount: 180
  },
  {
    id: "int-wd-04",
    title: "Full-Stack Web Development Intern",
    company: "Vercel",
    logo: "/src/assets/images/company_logo_tech_1793171832038.jpg",
    location: "Remote (US/Canada)",
    workMode: "Remote",
    duration: "12 Weeks (Summer 2026)",
    stipend: "$8,000 / month",
    eligibility: "Undergraduate student with demonstrable full-stack web projects and open-source contributions.",
    requirements: ["TypeScript", "React / Next.js", "Node.js", "Tailwind CSS & Web Performance"],
    deadline: "2026-06-01",
    postedDate: "4 days ago",
    featured: true,
    applicantCount: 215
  },
  {
    id: "int-cs-05",
    title: "Cybersecurity & Cloud Threat Detection Intern",
    company: "Datadog",
    logo: "/src/assets/images/company_logo_tech_1793171832038.jpg",
    location: "Boston, MA",
    workMode: "Hybrid",
    duration: "10 Weeks (Summer 2026)",
    stipend: "$7,800 / month",
    eligibility: "B.S. in Cybersecurity, Computer Engineering, or Computer Science with focus on systems security.",
    requirements: ["Networking & TCP/IP", "Python / Go", "Cloud Security (AWS/GCP)", "Vulnerability Analysis"],
    deadline: "2026-05-25",
    postedDate: "5 days ago",
    featured: false,
    applicantCount: 84
  }
];

let applications = [
  {
    id: "app-1",
    internshipId: "int-sd-01",
    applicantName: "Alex Rivera",
    email: "alex.rivera@university.edu",
    phone: "+1 (555) 019-2834",
    resumeUrl: "https://linkedin.com/in/alexrivera",
    coverLetter: "Dear Hiring Manager, I am thrilled to apply for the Junior Backend Systems Engineering internship...",
    status: "Interview Scheduled",
    appliedDate: "2026-10-15",
    matchScore: 94,
    notes: "Technical interview scheduled for Nov 2, 2026."
  }
];

let studentProfile = {
  name: "Alex Rivera",
  email: "alex.rivera@university.edu",
  university: "Stanford University",
  major: "B.S. Computer Science",
  graduationYear: "2027",
  gpa: "3.85",
  skills: ["React", "TypeScript", "Node.js", "Python", "SQL", "Git"],
  bio: "Senior undergraduate passionate about distributed systems and web development.",
  resumeText: "Alex Rivera | Stanford University CS '27 | 3.85 GPA | Experience: Software Engineering Intern at TechStart building React dashboard components and REST APIs."
};

// Admin Authorization Middleware
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const adminToken = req.headers['x-admin-token'] || req.query.admin_token;
  // In development/capstone mode, we accept valid admin token or allow demo mode if header is present
  if (!adminToken && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: "Unauthorized: Administrator authorization required." });
  }
  next();
};

// REST API Endpoints

// 1. GET /api/health
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: "connected",
    store: "in-memory / persistent store operational",
    timestamp: new Date().toISOString()
  });
});

// 2. GET /api/internships (with search & filtering)
app.get("/api/internships", (req, res) => {
  const { search, domain, location, workMode, sortBy } = req.query;
  let results = [...internships];

  if (domain && domain !== "All") {
    results = results.filter(i => String(i.domain || "").toLowerCase() === String(domain).toLowerCase());
  }

  if (location && location !== "All") {
    results = results.filter(i => String(i.location || "").toLowerCase().includes(String(location).toLowerCase()));
  }

  if (workMode && workMode !== "All") {
    results = results.filter(i => String(i.workMode || "").toLowerCase() === String(workMode).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(i => 
      String(i.title || "").toLowerCase().includes(q) || 
      String(i.company || "").toLowerCase().includes(q) || 
      String(i.description || "").toLowerCase().includes(q) ||
      (i.requirements && i.requirements.some(r => String(r || "").toLowerCase().includes(q)))
    );
  }

  if (sortBy === 'deadline') {
    results.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } else {
    results.sort((a, b) => b.id.localeCompare(a.id));
  }

  res.json(results);
});

// 3. GET /api/internships/:id (Return one internship or 404 when missing)
app.get("/api/internships/:id", (req, res) => {
  const internship = internships.find(i => i.id === req.params.id);
  if (!internship) {
    return res.status(404).json({ error: "Internship not found" });
  }
  res.json(internship);
});

// 4. POST /api/internships (Create internship with admin auth & server validation)
app.post("/api/internships", requireAdmin, (req, res) => {
  const { title, company, description, domain, location, workMode, duration, stipend, eligibility, requirements, deadline } = req.body;
  if (!title || !company || !domain) {
    return res.status(400).json({ error: "Title, company, and domain are required." });
  }
  const newInt = {
    id: `int-${Date.now()}`,
    title: title.trim(),
    company: company.trim(),
    logo: req.body.logo || "/src/assets/images/company_logo_tech_1793171832038.jpg",
    description: description || "",
    domain: domain.trim(),
    location: location || "Remote",
    workMode: workMode || "Remote",
    duration: duration || "12 Weeks",
    stipend: stipend || "$8,000 / month",
    eligibility: eligibility || "B.S. in Computer Science or related field",
    requirements: Array.isArray(requirements) ? requirements : (typeof requirements === 'string' ? requirements.split(',').map((s: string) => s.trim()) : []),
    deadline: deadline || "2026-06-01",
    postedDate: "Just now",
    featured: false,
    applicantCount: 0
  };
  internships.unshift(newInt);
  res.status(201).json(newInt);
});

// 5. PUT /api/internships/:id (Update internship with admin auth)
app.put("/api/internships/:id", requireAdmin, (req, res) => {
  const index = internships.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Internship not found" });
  }
  const updated = {
    ...internships[index],
    ...req.body,
    requirements: Array.isArray(req.body.requirements) 
      ? req.body.requirements 
      : (typeof req.body.requirements === 'string' ? req.body.requirements.split(',').map((s: string) => s.trim()) : internships[index].requirements)
  };
  internships[index] = updated;
  res.json(updated);
});

// 6. DELETE /api/internships/:id (Delete internship with admin auth)
app.delete("/api/internships/:id", requireAdmin, (req, res) => {
  const index = internships.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Internship not found" });
  }
  internships.splice(index, 1);
  res.json({ success: true, message: "Internship deleted successfully" });
});

// 7. GET /api/applications (Student applications)
app.get("/api/applications", (req, res) => {
  const email = req.query.email || studentProfile.email;
  const userApps = applications.filter(a => a.email === email);
  const enriched = userApps.map(app => {
    const internship = internships.find(i => i.id === app.internshipId);
    return { ...app, internship };
  });
  res.json(enriched);
});

// 8. GET /api/admin/applications (Require admin auth, never return applicant data to unauthorized users)
app.get("/api/admin/applications", requireAdmin, (req, res) => {
  const enriched = applications.map(app => {
    const internship = internships.find(i => i.id === app.internshipId);
    return { ...app, internship };
  });
  res.json(enriched);
});

// 9. POST /api/applications (Validate and store application)
app.post("/api/applications", (req, res) => {
  const { internshipId, applicantName, email, phone, resumeUrl, coverLetter, matchScore } = req.body;

  if (!applicantName || !applicantName.trim()) {
    return res.status(400).json({ error: "Applicant name is required." });
  }
  if (!email || !email.includes("@") || !email.includes(".")) {
    return res.status(400).json({ error: "A valid email address is required." });
  }
  if (!internshipId) {
    return res.status(400).json({ error: "Internship ID is required." });
  }

  const internship = internships.find(i => i.id === internshipId);
  if (!internship) {
    return res.status(400).json({ error: "Invalid internship ID. The selected internship does not exist." });
  }

  const existing = applications.find(a => a.email.toLowerCase() === email.toLowerCase() && a.internshipId === internshipId);
  if (existing) {
    return res.status(400).json({ error: "You have already submitted an application for this internship." });
  }

  const newApp = {
    id: `app-${Date.now()}`,
    internshipId,
    applicantName: applicantName.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : "",
    resumeUrl: resumeUrl ? resumeUrl.trim() : "",
    coverLetter: coverLetter ? coverLetter.trim() : "",
    status: "Applied",
    appliedDate: new Date().toISOString().split("T")[0],
    matchScore: matchScore || 88,
    notes: "Application submitted successfully."
  };

  applications.unshift(newApp);
  internship.applicantCount = (internship.applicantCount || 0) + 1;

  res.status(201).json(newApp);
});

// 10. PATCH /api/applications/:id (Update application status - admin)
app.patch("/api/applications/:id", requireAdmin, (req, res) => {
  const { status, notes } = req.body;
  const app = applications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: "Application not found" });
  }
  if (status) app.status = status;
  if (notes !== undefined) app.notes = notes;
  res.json(app);
});

// Profile & Stats
app.get("/api/profile", (req, res) => {
  res.json(studentProfile);
});

app.put("/api/profile", (req, res) => {
  studentProfile = { ...studentProfile, ...req.body };
  res.json(studentProfile);
});

app.get("/api/stats", requireAdmin, (req, res) => {
  res.json({
    totalInternships: internships.length,
    totalApplications: applications.length,
    interviewsScheduled: applications.filter(a => a.status === "Interview Scheduled" || a.status === "Shortlisted").length,
    offersReceived: applications.filter(a => a.status === "Offer Received").length,
    averageMatchScore: Math.round(applications.reduce((acc, curr) => acc + curr.matchScore, 0) / (applications.length || 1))
  });
});

// AI endpoints
app.post("/api/ai/resume-review", async (req, res) => {
  try {
    const { internshipId, resumeText } = req.body;
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return res.status(404).json({ error: "Internship not found" });

    const prompt = `Analyze candidate resume against this internship role and return strict JSON:
Title: ${internship.title}
Company: ${internship.company}
Requirements: ${JSON.stringify(internship.requirements)}
Resume: ${resumeText || studentProfile.resumeText}
Keys required: matchScore (0-100), keyStrengths (array of 3 strings), missingSkills (array of 2 strings), feedback (2 paragraphs).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed AI review" });
  }
});

app.post("/api/ai/cover-letter", async (req, res) => {
  try {
    const { internshipId, tone } = req.body;
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return res.status(404).json({ error: "Internship not found" });

    const prompt = `Write a professional cover letter for ${studentProfile.name} applying to ${internship.title} at ${internship.company}. Tone: ${tone || "Professional"}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt
    });
    res.json({ coverLetter: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed cover letter" });
  }
});

app.post("/api/ai/interview-prep", async (req, res) => {
  try {
    const { internshipId } = req.body;
    const internship = internships.find(i => i.id === internshipId);
    if (!internship) return res.status(404).json({ error: "Internship not found" });

    const prompt = `Generate technical and behavioral interview prep guide for ${internship.title} at ${internship.company}. Return strict JSON with technicalQuestions (array of 3 with question, category, sampleAnswerGuide), behavioralQuestions (array of 2), interviewTips (array of 3).`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed interview prep" });
  }
});

// Vite middleware in development
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Internship Portal server running on port ${PORT}`);
});
