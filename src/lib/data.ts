/**
 * All site content lives here. Everything comes from Preyou's résumé,
 * plus the details she gave in chat (marks, and the certificate she designed).
 * Components only read from this file. Nothing here is invented.
 */

export const PROFILE = {
  name: "Preyou Sharma",
  firstName: "Preyou",
  initials: "PS",
  role: "HR Executive",
  dept: "HR",
  email: "sharmapreyou@gmail.com",
  phone: "7000660666",
  phoneHref: "tel:+917000660666", // +91 assumed (India); the résumé gives no country code
  location: "Gwalior, Madhya Pradesh",
  city: "Gwalior",
  resumeSummary:
    "HR Executive with 2.5+ years of experience in end-to-end recruitment, including job posting, resume screening, cold calling, interview coordination and onboarding. Hired for operations and trading roles at Timberwings. Experienced in maintaining employee records, coordinating client meetings and managing employer branding on LinkedIn and Instagram. MBA (HR & Finance) candidate, comfortable with AI tools and quick to learn HR systems and payroll processes.",
  extraLine: "Hired the majority of the company's workforce, primarily for operations and trader roles.",
  quote: "I pick up new HR systems and payroll processes quickly, and I'm comfortable working with AI tools.",
  linkedin: "https://www.linkedin.com/in/preyou-sharma-4b0825296",
  linkedinLabel: "linkedin.com/in/preyou-sharma-4b0825296",
  github: undefined as string | undefined, // none in the résumé
  resume: "/Preyou_Sharma_Resume.pdf",
  languages: ["Hindi", "English"],
  company: "Timberwings",
} as const;

/**
 * Text equivalent of the hero video's voice. IMPORTANT: this must match what the video says.
 * It is the script from the video prompt; edit it if your video says something different.
 */
export const HERO_TRANSCRIPT =
  "Hi, I'm Preyou. I'm an HR Executive. I handle end-to-end recruitment, employer branding, and onboarding.";

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/* ---------------------------------------------------------------- skills */

export type SkillGroupId = "hr" | "platforms" | "software" | "branding" | "ai" | "payroll" | "other";

export interface Skill {
  id: string;
  name: string;
  symbol: string; // two-letter element symbol
  group: SkillGroupId;
}

export const SKILL_GROUPS: { id: SkillGroupId; label: string }[] = [
  { id: "hr", label: "HR & Recruitment" },
  { id: "platforms", label: "Platforms" },
  { id: "software", label: "Software" },
  { id: "branding", label: "Branding & Content" },
  { id: "ai", label: "AI Tools" },
  { id: "payroll", label: "Payroll & Compliance" },
  { id: "other", label: "Other" },
];

const s = (id: string, name: string, symbol: string, group: SkillGroupId): Skill => ({ id, name, symbol, group });

export const SKILLS: Skill[] = [
  // HR & Recruitment
  s("end-to-end-recruitment", "End-to-End Recruitment", "Er", "hr"),
  s("job-posting", "Job Posting", "Jp", "hr"),
  s("resume-screening", "Resume Screening", "Rs", "hr"),
  s("cold-calling", "Cold Calling", "Cc", "hr"),
  s("candidate-sourcing", "Candidate Sourcing", "Cs", "hr"),
  s("interview-scheduling", "Interview Scheduling", "Is", "hr"),
  s("interviews", "Online and Offline Interviews", "Oi", "hr"),
  s("offer-letter-prep", "Offer Letter Preparation", "Ol", "hr"),
  s("onboarding", "Onboarding", "Ob", "hr"),
  s("employee-records", "Employee Records Management", "Em", "hr"),
  // Platforms
  s("naukri", "Naukri", "Nk", "platforms"),
  s("internshala", "Internshala", "In", "platforms"),
  s("indeed", "Indeed", "Id", "platforms"),
  s("linkedin", "LinkedIn", "Li", "platforms"),
  // Software
  s("excel", "MS Excel", "Xl", "software"),
  s("word", "MS Word", "Wd", "software"),
  s("powerpoint", "MS PowerPoint", "Pp", "software"),
  s("google-drive", "Google Drive", "Gd", "software"),
  // Employer branding and content
  s("linkedin-page", "LinkedIn Page Management", "Lp", "branding"),
  s("instagram-page", "Instagram Page Management", "Ip", "branding"),
  s("reel-creation", "Reel Creation", "Rc", "branding"),
  s("content-creation", "Content Creation", "Ct", "branding"),
  s("logo-design", "Logo Design", "Lg", "branding"),
  s("offer-letter-design", "Offer Letter Design", "Od", "branding"),
  // AI tools
  s("claude", "Claude", "Cl", "ai"),
  s("chatgpt", "ChatGPT", "Cg", "ai"),
  s("heygen", "HeyGen", "Hg", "ai"),
  s("elevenlabs", "ElevenLabs", "El", "ai"),
  // Payroll and compliance
  s("salary-structure", "Salary Structure (CTC, Gross, In-hand)", "Ss", "payroll"),
  s("payslip", "Payslip Preparation", "Ps", "payroll"),
  s("lop", "LOP", "Lo", "payroll"),
  s("pf", "PF", "Pf", "payroll"),
  s("esi", "ESI", "Es", "payroll"),
  s("professional-tax", "Professional Tax", "Pt", "payroll"),
  s("tds", "TDS on Salary", "Td", "payroll"),
  // Other
  s("client-coordination", "Client Coordination", "Cd", "other"),
  s("meeting-scheduling", "Meeting Scheduling", "Ms", "other"),
  s("communication", "Communication", "Cm", "other"),
  s("stakeholder-coordination", "Stakeholder Coordination", "Sc", "other"),
];

/* ---------------------------------------------------------------- projects */

export type ProjectArt = "logo" | "offer" | "certificate" | "branding" | "records";

export interface Project {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: string[]; // skill ids
  art: ProjectArt;
  github?: string;
}

/** What she built at Timberwings. Wording follows the résumé; the certificate was added by her. */
export const PROJECTS: Project[] = [
  {
    id: "logo",
    index: "01",
    title: "Company Logo",
    kicker: "Brand identity",
    description: "Designed the Timberwings company logo.",
    features: ["Created for Timberwings", "Brand identity"],
    tech: ["logo-design"],
    art: "logo",
  },
  {
    id: "offer-letter",
    index: "02",
    title: "Offer Letter Template",
    kicker: "Candidate experience",
    description:
      "Designed the company's standard offer letter template, ensuring a professional candidate experience.",
    features: ["Standard company template", "Professional candidate experience"],
    tech: ["offer-letter-design", "offer-letter-prep"],
    art: "offer",
  },
  {
    id: "certificate",
    index: "03",
    title: "Certificate of Completion",
    kicker: "Training",
    description: "Designed the Certificate of Completion that Timberwings issues to candidates.",
    features: ["Issued to candidates", "Recipient and training details on each certificate"],
    tech: [],
    art: "certificate",
  },
  {
    id: "employer-branding",
    index: "04",
    title: "Employer Branding",
    kicker: "LinkedIn and Instagram",
    description:
      "Managed the company's LinkedIn and Instagram accounts and created reels to strengthen employer brand and visibility.",
    features: ["LinkedIn page management", "Instagram page management", "Reel creation", "Content creation"],
    tech: ["linkedin-page", "instagram-page", "reel-creation", "content-creation"],
    art: "branding",
  },
  {
    id: "employee-records",
    index: "05",
    title: "Employee Records System",
    kicker: "Google Drive",
    description:
      "Maintained employee records in a structured digital system on Google Drive for easy access and accuracy.",
    features: ["Structured digital system", "Easy access", "Accuracy"],
    tech: ["google-drive", "employee-records"],
    art: "records",
  },
];

/* ---------------------------------------------------------- experience */

export const EXPERIENCE = [
  {
    id: "timberwings",
    start: "Mar 2024",
    end: "Present",
    title: "HR Executive",
    place: "Timberwings (Trading Company)",
    points: [
      "Managed end-to-end recruitment: job posting, resume screening, cold calling, and scheduling and conducting online and offline interviews.",
      "Hired the majority of the company's workforce, primarily for operations and trader roles.",
      "Maintained employee records in a structured digital system on Google Drive.",
      "Coordinated and scheduled meetings with company clients.",
      "Designed the company logo and the standard offer letter template.",
      "Managed the company's LinkedIn and Instagram accounts and created reels.",
    ],
  },
  {
    id: "teacher-tree",
    start: "Dec 2023",
    end: "Feb 2024",
    title: "HR Intern",
    place: "Teacher Tree",
    points: [
      "Posted jobs on hiring platforms and sourced candidates through cold calling.",
      "Scheduled and coordinated interviews between candidates and the hiring team.",
    ],
  },
];

export const EDUCATION = [
  {
    id: "mba",
    start: "2023",
    end: "2025",
    title: "MBA in Human Resource and Finance",
    place: "Jiwaji University, Gwalior",
    score: "80%",
  },
  {
    id: "bsc",
    start: "2019",
    end: "2021",
    title: "B.Sc. in Electronics",
    place: "KRG College, Gwalior",
    score: "65%",
  },
];

export interface TimelineStop {
  id: string;
  kind: "Education" | "Experience";
  when: string;
  title: string;
  place: string;
  detail: string[];
  sort: number;
}

/** Education and experience merged into one path, oldest first. */
const TIMELINE_RAW: TimelineStop[] = [
  {
    id: "bsc",
    kind: "Education",
    when: "2019 – 2021",
    title: "B.Sc. in Electronics",
    place: "KRG College, Gwalior",
    detail: ["Scored 65%."],
    sort: 2019,
  },
  {
    id: "mba",
    kind: "Education",
    when: "2023 – 2025",
    title: "MBA in Human Resource and Finance",
    place: "Jiwaji University, Gwalior",
    detail: ["Scored 80%."],
    sort: 2023.0,
  },
  {
    id: "teacher-tree",
    kind: "Experience",
    when: "Dec 2023 – Feb 2024",
    title: "HR Intern",
    place: "Teacher Tree",
    detail: EXPERIENCE[1].points,
    sort: 2023.9,
  },
  {
    id: "timberwings",
    kind: "Experience",
    when: "Mar 2024 – Present",
    title: "HR Executive",
    place: "Timberwings (Trading Company)",
    detail: EXPERIENCE[0].points,
    sort: 2024.2,
  },
];

export const TIMELINE: TimelineStop[] = [...TIMELINE_RAW].sort((a, b) => a.sort - b.sort);

/* -------------------------------------------------------------- misc */

export const FACTS = [
  { label: "Location", value: PROFILE.location },
  { label: "Education", value: "MBA in HR & Finance, Jiwaji University" },
  { label: "Current role", value: "HR Executive, Timberwings" },
  { label: "Email", value: PROFILE.email },
];
