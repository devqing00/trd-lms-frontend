// ============================================
// Mock Data — TRD Hybrid LMS
// Training Research & Development, ITeMS
// University of Ibadan
// ============================================

import type {
  User,
  Course,
  Enrollment,
  WaitlistEntry,
  Cohort,
  Certificate,
  AttendanceRecord,
  PaginatedResponse,
  FilterConfig,
} from "@/lib/types";

// --- Helpers ---

function randomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function randomDate(start: Date, end: Date): string {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// --- Seed: Users (Nigerian names, University of Ibadan context) ---

const FIRST_NAMES = [
  "Adebayo",
  "Chinelo",
  "Emeka",
  "Folake",
  "Gbenga",
  "Halima",
  "Ibrahim",
  "Jumoke",
  "Kunle",
  "Ladi",
  "Musa",
  "Ngozi",
  "Oluwaseun",
  "Patience",
  "Rasheed",
  "Sade",
  "Tunde",
  "Uche",
  "Victoria",
  "Wale",
  "Yetunde",
  "Zainab",
  "Adetola",
  "Blessing",
];

const LAST_NAMES = [
  "Adeyemi",
  "Ogundimu",
  "Nwachukwu",
  "Akinola",
  "Olayinka",
  "Balogun",
  "Eze",
  "Oladipo",
  "Abdullahi",
  "Fagbemi",
  "Okonkwo",
  "Ajayi",
  "Obaseki",
  "Adegoke",
  "Onyekachi",
  "Shokunbi",
  "Chukwuma",
  "Oyelaran",
  "Bakare",
  "Amaechi",
];

const ORGANIZATIONS = [
  "University of Ibadan",
  "ITeMS, University of Ibadan",
  "College of Medicine, UI",
  "Faculty of Technology, UI",
  "Faculty of Science, UI",
  "Oyo State Civil Service",
  "UI Teaching Hospital",
  "Faculty of Education, UI",
];

export const CATEGORIES = [
  "ICT & Digital Literacy",
  "Research & Academic Writing",
  "Health & Safety",
  "Leadership & Management",
  "Laboratory & Technical Skills",
  "Data & Analytics",
  "Professional Development",
];

const COURSE_TITLES: {
  title: string;
  description: string;
  category: string;
  duration: string;
}[] = [
  {
    title: "ICT Proficiency Certification",
    description:
      "Comprehensive digital literacy programme covering office productivity tools (Word, Excel, PowerPoint), email management, cloud collaboration, and basic cybersecurity awareness. Designed for University of Ibadan staff seeking ICT competency certification.",
    category: "ICT & Digital Literacy",
    duration: "5 Days",
  },
  {
    title: "Research Methodology & Academic Writing",
    description:
      "Intensive workshop on research design, literature review techniques, citation management with Mendeley/Zotero, and scientific writing standards. Includes hands-on sessions on using Google Scholar, Scopus, and Web of Science databases.",
    category: "Research & Academic Writing",
    duration: "3 Days",
  },
  {
    title: "Laboratory Safety & Chemical Handling",
    description:
      "Mandatory safety training for laboratory personnel covering hazard identification, MSDS interpretation, proper PPE usage, chemical storage protocols, spill response procedures, and emergency evacuation drills specific to UI laboratories.",
    category: "Health & Safety",
    duration: "2 Days",
  },
  {
    title: "Data Analysis with Python & SPSS",
    description:
      "Practical course on statistical analysis using Python (pandas, matplotlib, scipy) and SPSS. Covers descriptive statistics, hypothesis testing, regression analysis, and data visualisation for research and institutional reporting.",
    category: "Data & Analytics",
    duration: "5 Days",
  },
  {
    title: "Fire Safety & Emergency Response",
    description:
      "Hands-on training on fire prevention, extinguisher operation (ABC types), evacuation procedures, first aid basics, and emergency assembly point protocols aligned with University of Ibadan campus safety standards.",
    category: "Health & Safety",
    duration: "1 Day",
  },
  {
    title: "Leadership & Administrative Excellence",
    description:
      "Professional development programme for senior non-academic staff and heads of units. Covers strategic planning, conflict resolution, team management, performance appraisal techniques, and effective committee leadership.",
    category: "Leadership & Management",
    duration: "3 Days",
  },
  {
    title: "E-Learning Content Development",
    description:
      "Training on creating engaging digital learning materials using Moodle, Canva, and OBS Studio. Participants learn instructional design principles, video recording techniques, and how to structure blended learning modules.",
    category: "ICT & Digital Literacy",
    duration: "3 Days",
  },
  {
    title: "Advanced Excel & Data Management",
    description:
      "Intermediate-to-advanced Microsoft Excel training covering pivot tables, VLOOKUP/XLOOKUP, conditional formatting, data validation, macros, and dashboard creation for administrative and research data management.",
    category: "Data & Analytics",
    duration: "3 Days",
  },
  {
    title: "Biosafety & Infection Prevention",
    description:
      "Specialised training for healthcare and laboratory workers on biosafety levels (BSL-1 to BSL-3), proper specimen handling, autoclave operation, waste segregation, and infection prevention protocols per WHO guidelines.",
    category: "Health & Safety",
    duration: "2 Days",
  },
  {
    title: "Grant Writing & Research Funding",
    description:
      "Workshop on identifying funding opportunities (TETFund, NRF, PTDF, international grants), writing competitive grant proposals, developing budgets, and understanding reporting and compliance requirements for funded projects.",
    category: "Research & Academic Writing",
    duration: "2 Days",
  },
  {
    title: "Network & Systems Administration",
    description:
      "Technical training on LAN/WAN configuration, server management (Windows Server & Linux), Active Directory, DNS/DHCP setup, network security practices, and troubleshooting for ITeMS and faculty IT support staff.",
    category: "ICT & Digital Literacy",
    duration: "5 Days",
  },
  {
    title: "Occupational Health & Ergonomics",
    description:
      "Training on workplace ergonomics, repetitive strain injury prevention, proper workstation setup, mental health awareness, and stress management techniques for office-based and laboratory personnel at the University of Ibadan.",
    category: "Health & Safety",
    duration: "1 Day",
  },
  // === NEW: Real TRD Specialized Workshop Courses ===
  {
    title: "LAMP Stack Web Development",
    description:
      "Hands-on workshop on building dynamic web applications using Linux, Apache, MySQL, and PHP (LAMP). Covers server setup, database design, RESTful APIs, authentication, and deploying applications to production servers.",
    category: "ICT & Digital Literacy",
    duration: "5 Days",
  },
  {
    title: "Linux & Unix System Administration",
    description:
      "Comprehensive training on Linux and Unix operating systems covering shell scripting, file system management, user administration, package management, cron automation, SSH, and server hardening best practices.",
    category: "ICT & Digital Literacy",
    duration: "5 Days",
  },
  {
    title: "Routing & Wireless Network Configuration",
    description:
      "Practical course on configuring routers, switches, and wireless access points. Covers OSPF, EIGRP, BGP routing protocols, VLAN management, wireless security (WPA3), and campus network design principles using Cisco and MikroTik equipment.",
    category: "ICT & Digital Literacy",
    duration: "5 Days",
  },
  {
    title: "Computer Networks Fundamentals",
    description:
      "Entry-level to intermediate course covering OSI model, TCP/IP stack, IP addressing, subnetting, DNS, DHCP, network troubleshooting tools (ping, traceroute, Wireshark), and basic network security concepts.",
    category: "ICT & Digital Literacy",
    duration: "3 Days",
  },
  {
    title: "Image Processing, Graphics & Animation",
    description:
      "Training on digital image editing with Adobe Photoshop, vector graphics with Illustrator/Inkscape, and 2D animation fundamentals. Participants create flyers, banners, logos, and animated presentations for academic and professional use.",
    category: "Professional Development",
    duration: "5 Days",
  },
  {
    title: "Web Design & Graphics",
    description:
      "Comprehensive course on modern web design using HTML5, CSS3, JavaScript, and responsive frameworks. Includes UI/UX design principles, Adobe XD/Figma prototyping, and deploying websites to cloud hosting platforms.",
    category: "ICT & Digital Literacy",
    duration: "5 Days",
  },
  {
    title: "ICT in Course Registration & Records",
    description:
      "Specialised training for university registry and academic staff on using ICT systems for course registration, student records management, transcript generation, and integrating with the university portal and student information systems.",
    category: "ICT & Digital Literacy",
    duration: "2 Days",
  },
  {
    title: "Exam Preparation & Result Processing",
    description:
      "Training on using ICT tools for exam management including computer-based test (CBT) setup, OMR sheet processing, result computation, grade-point calculation, and automated transcript generation for faculties and departments.",
    category: "ICT & Digital Literacy",
    duration: "2 Days",
  },
  {
    title: "Mail Management & Professional Communication",
    description:
      "Training on corporate email management using Microsoft Outlook and Google Workspace. Covers email etiquette, calendar management, mail merge, digital correspondence protocols, and managing shared mailboxes for departmental communication.",
    category: "Professional Development",
    duration: "1 Day",
  },
  {
    title: "Learning Management System (LMS) Module",
    description:
      "In-depth training on using and administering the TRD Learning Management System. Covers course creation, enrollment management, attendance tracking via QR codes, assessment setup, certificate generation, and analytics dashboards.",
    category: "ICT & Digital Literacy",
    duration: "2 Days",
  },
  {
    title: "Microsoft Excel for Professionals",
    description:
      "Structured Excel training from basics to advanced level. Covers data entry, formatting, formulas (SUM, IF, VLOOKUP), pivot tables, charts, data validation, conditional formatting, and introduction to Power Query for data transformation.",
    category: "Data & Analytics",
    duration: "3 Days",
  },
  {
    title: "Microsoft Word Mastery",
    description:
      "Complete Microsoft Word training covering document formatting, styles & templates, table of contents, mail merge, track changes, referencing, and creating professional reports, memos, and academic documents to university standards.",
    category: "Professional Development",
    duration: "2 Days",
  },
  {
    title: "Microsoft PowerPoint for Impactful Presentations",
    description:
      "Training on creating compelling presentations with PowerPoint. Covers slide design principles, master slides, animations, transitions, embedding multimedia, presenter view, and delivering effective academic and boardroom presentations.",
    category: "Professional Development",
    duration: "1 Day",
  },
  {
    title: "Data Processing & Information Management",
    description:
      "Course on data collection, cleaning, coding, entry, and processing using spreadsheets, Google Forms, KoBoToolbox, and ODK. Covers data quality assurance, validation rules, and preparing datasets for analysis in research and administrative contexts.",
    category: "Data & Analytics",
    duration: "3 Days",
  },
  {
    title: "Desktop Publishing & Document Design",
    description:
      "Training on professional document layout and design using Microsoft Publisher, Adobe InDesign, and Canva. Participants learn to create newsletters, brochures, posters, certificates, annual reports, and branded materials for departments.",
    category: "Professional Development",
    duration: "2 Days",
  },
  {
    title: "Research Tools & Data Analysis (SPSS, STATA, R)",
    description:
      "Advanced research data analysis workshop covering SPSS, STATA, and R. Includes data import/cleaning, descriptive and inferential statistics, regression, factor analysis, and generating publication-ready tables and charts for theses and journals.",
    category: "Data & Analytics",
    duration: "5 Days",
  },
  {
    title: "CSPRO & EPIDATA for Survey Data Management",
    description:
      "Specialised course on using CSPro and EpiData for designing data entry screens, implementing skip patterns, validation checks, and batch editing for large-scale surveys. Covers data export to SPSS/STATA and basic tabulation.",
    category: "Data & Analytics",
    duration: "3 Days",
  },
  {
    title: "EPI INFO & SAS for Epidemiological Research",
    description:
      "Training on epidemiological data analysis using Epi Info and SAS. Covers outbreak investigation workflows, 2×2 tables, odds ratios, relative risk calculations, survival analysis, and report generation for public health research at UI and UCH.",
    category: "Data & Analytics",
    duration: "3 Days",
  },
];

const VENUES = [
  { address: "ITeMS Building, University of Ibadan", room: "Training Lab 1" },
  { address: "CBN Building, University of Ibadan", room: "Lecture Hall A" },
  { address: "Faculty of Technology, UI", room: "Computer Lab 2" },
  { address: "Alexander Brown Hall, UI", room: "Seminar Room B" },
  { address: "College of Medicine Auditorium, UCH", room: "Workshop Hall" },
  { address: "Kenneth Dike Library, UI", room: "Digital Centre" },
];

// Generate users
export const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => {
  const firstName = i === 8 ? "Oluwaseun" : randomItem(FIRST_NAMES);
  const lastName = i === 8 ? "Adeyemi" : randomItem(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomItem(["ui.edu.ng", "stu.ui.edu.ng", "oysga.gov.ng", "uniibadan.edu.ng"])}`;

  let role: User["role"] = "student";
  if (i < 3) role = "admin";
  else if (i < 8) role = "instructor";

  return {
    id: i === 8 ? "usr-0" : `usr_${randomId()}`,
    name,
    email,
    phone: `+234 ${randomItem(["803", "805", "806", "807", "808", "810", "813", "814", "816", "903", "906", "915"])} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
    organization: i === 8 ? "ITeMS, University of Ibadan" : randomItem(ORGANIZATIONS),
    role,
    status: i < 48 ? "active" : randomItem(["suspended", "pending"] as const),
    avatarUrl: undefined,
    lastLoginAt: randomDate(new Date("2025-01-01"), new Date()),
    createdAt: randomDate(new Date("2024-01-01"), new Date("2025-01-01")),
    updatedAt: randomDate(new Date("2025-01-01"), new Date()),
  };
});

// Generate courses with comprehensive modules
export const mockCourses: Course[] = COURSE_TITLES.map((seed, i) => {
  const capacity = randomItem([15, 20, 25, 30]);
  const enrolled = Math.floor(Math.random() * (capacity + 5));
  const waitlistCap = randomItem([5, 10, 15]);

  // Build comprehensive modules per course
  const modulesByTitle: Record<string, Course["modules"]> = {
    "ICT Proficiency Certification": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Digital Foundations",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Course Handbook & Schedule",
            url: "/mock/ict-handbook.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Introduction to Digital Literacy",
            url: "/mock/ict-intro.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Understanding Operating Systems (Windows & Linux)",
            content:
              "An overview of how modern operating systems work, file management, and basic terminal commands.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Word Processing & Document Design",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Microsoft Word — Formatting, Styles & Templates",
            url: "/mock/word-tutorial.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Document Formatting Best Practices",
            url: "/mock/word-guide.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Creating Professional Reports & Letters",
            url: "/mock/reports-slides.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Spreadsheets & Data Entry",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Excel Fundamentals — Cells, Formulas & Charts",
            url: "/mock/excel-basics.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Common Excel Functions Reference Sheet",
            url: "/mock/excel-ref.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Practice Exercise: Budget Spreadsheet",
            content:
              "Create a departmental budget spreadsheet with SUM, AVERAGE, and conditional formatting.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: Presentations & Visual Communication",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "PowerPoint — Design Principles & Delivery",
            url: "/mock/ppt-tutorial.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Sample Presentation: Academic Conference Template",
            url: "/mock/sample-ppt.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 4: Email, Cloud & Cybersecurity Basics",
        order: 4,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Professional Email Etiquette & Gmail/Outlook Setup",
            url: "/mock/email-video.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Google Workspace & Cloud Collaboration Guide",
            url: "/mock/cloud-guide.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Cybersecurity Awareness — Phishing, Passwords & 2FA",
            content:
              "Learn to identify phishing emails, create strong passwords, and enable two-factor authentication on all university accounts.",
          },
        ],
      },
    ],
    "Research Methodology & Academic Writing": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Academic Writing Foundations",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Workshop Outline & Reading List",
            url: "/mock/research-handbook.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Academic Integrity & Plagiarism Policy",
            content:
              "University of Ibadan academic integrity standards, plagiarism detection tools, and proper attribution practices.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Research Design & Proposal Writing",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Formulating Research Questions & Hypotheses",
            url: "/mock/research-design.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Research Proposal Template (UI Format)",
            url: "/mock/proposal-template.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Quantitative vs Qualitative Methods",
            url: "/mock/methods-slides.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Literature Review & Citation Management",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Systematic Literature Review Process",
            url: "/mock/lit-review.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Using Mendeley & Zotero for Reference Management",
            url: "/mock/citation-tools.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "APA 7th Edition Quick Reference",
            content:
              "Formatting guide for in-text citations, reference lists, tables, and figures following APA 7th edition standards.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: Scientific Writing & Journal Submission",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Structuring a Journal Article (IMRaD Format)",
            url: "/mock/journal-writing.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Peer Review Process & Responding to Reviewers",
            url: "/mock/peer-review.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Common Pitfalls in Academic Manuscript Submission",
            url: "/mock/submission-tips.pptx",
          },
        ],
      },
    ],
    "Laboratory Safety & Chemical Handling": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Lab Safety Orientation",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "UI Laboratory Safety Manual",
            url: "/mock/lab-safety-manual.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Welcome & Safety Culture Overview",
            url: "/mock/lab-orientation.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Hazard Identification & MSDS",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Reading Material Safety Data Sheets",
            url: "/mock/msds-tutorial.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "GHS Hazard Symbols & Pictograms",
            url: "/mock/ghs-symbols.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Chemical Compatibility Chart",
            content:
              "Quick reference for chemical storage groups — which chemicals can be stored together safely and which require separate containment.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: PPE & Emergency Procedures",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Selecting & Using Personal Protective Equipment",
            url: "/mock/ppe-video.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Chemical Spill Response Flowchart",
            url: "/mock/spill-response.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Emergency Evacuation Routes — UI Science Campus",
            url: "/mock/evacuation-slides.pptx",
          },
        ],
      },
    ],
    "Data Analysis with Python & SPSS": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Getting Started",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Course Syllabus & Software Installation Guide",
            url: "/mock/data-analysis-syllabus.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Setting Up Python (Anaconda) & SPSS",
            url: "/mock/setup-tutorial.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Sample Datasets for Practice",
            content:
              "Download links for practice datasets: UI Student Survey 2024, Oyo State Health Data, and a sample experimental results dataset.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Descriptive Statistics & Data Cleaning",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Data Cleaning with pandas — Missing Values & Outliers",
            url: "/mock/pandas-cleaning.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Descriptive Statistics in SPSS — Step by Step",
            url: "/mock/spss-descriptive.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Measures of Central Tendency & Dispersion",
            url: "/mock/stats-fundamentals.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Hypothesis Testing & Inferential Statistics",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "T-Tests, ANOVA & Chi-Square in Python",
            url: "/mock/hypothesis-testing.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Running Inferential Tests in SPSS",
            url: "/mock/spss-inferential.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "When to Use Which Statistical Test — Decision Tree",
            content:
              "A flowchart guide helping you select the right statistical test based on your data type, sample size, and research question.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: Regression Analysis",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Linear & Logistic Regression with scipy & statsmodels",
            url: "/mock/regression-python.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Interpreting Regression Output — R², p-values & Coefficients",
            url: "/mock/regression-interpretation.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 4: Data Visualisation & Reporting",
        order: 4,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Creating Publication-Ready Charts with matplotlib & seaborn",
            url: "/mock/visualisation.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Exporting Results for Academic Papers & Reports",
            url: "/mock/export-results.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Dashboard Design Principles",
            url: "/mock/dashboard-slides.pptx",
          },
        ],
      },
    ],
    "Fire Safety & Emergency Response": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Pre-Training Self-Assessment",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Fire Safety Awareness Checklist",
            url: "/mock/fire-checklist.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Know Your Campus — Emergency Assembly Points",
            content:
              "Map and directions to all emergency assembly points across the University of Ibadan main campus.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Fire Prevention & Extinguisher Operation",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Types of Fire Extinguishers — ABC Classification",
            url: "/mock/extinguisher-types.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "PASS Technique — Pull, Aim, Squeeze, Sweep",
            url: "/mock/pass-technique.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Live Extinguisher Drill Demonstration",
            url: "/mock/drill-demo.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: First Aid & Evacuation",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Basic First Aid — Burns, Fractures & CPR",
            url: "/mock/first-aid.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Campus Evacuation Procedures & Fire Warden Duties",
            url: "/mock/evacuation-plan.pdf",
          },
        ],
      },
    ],
    "Leadership & Administrative Excellence": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Programme Overview",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Leadership Development Programme Guide",
            url: "/mock/leadership-guide.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Self-Assessment: Leadership Style Inventory",
            content:
              "Complete this questionnaire before the first session to identify your dominant leadership style and areas for growth.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Strategic Planning & Decision Making",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "SWOT Analysis for University Departments",
            url: "/mock/strategic-planning.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Decision-Making Frameworks — RAPID & RACI",
            url: "/mock/decision-frameworks.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Conflict Resolution & Team Management",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Managing Workplace Conflicts Constructively",
            url: "/mock/conflict-resolution.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Performance Appraisal Best Practices — UI HR Guidelines",
            url: "/mock/appraisal-guide.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Case Study: Restructuring a University Administrative Unit",
            content:
              "Analyse a real-world scenario of departmental restructuring at a Nigerian university and propose an action plan.",
          },
        ],
      },
    ],
    "E-Learning Content Development": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Instructional Design Basics",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Course Guide & Tool Requirements",
            url: "/mock/elearning-guide.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Introduction to ADDIE & SAM Models",
            url: "/mock/instructional-design.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Moodle Course Setup & Management",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Setting Up a Moodle Course — Activities & Resources",
            url: "/mock/moodle-setup.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Moodle Quick Reference for Instructors",
            url: "/mock/moodle-reference.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Video & Multimedia Production",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Recording Lectures with OBS Studio",
            url: "/mock/obs-tutorial.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Creating Infographics with Canva",
            url: "/mock/canva-slides.pptx",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Audio & Lighting Tips for Home Recording",
            content:
              "Practical tips for achieving good audio quality and lighting when recording from your office or home.",
          },
        ],
      },
    ],
    "Advanced Excel & Data Management": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Prerequisites Check",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Course Outline & Sample Data Files",
            url: "/mock/excel-adv-outline.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Excel Skills Self-Assessment",
            content:
              "Test your current Excel knowledge before the course — covers basic formulas, formatting, and simple charts.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Advanced Formulas & Lookup Functions",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "VLOOKUP, XLOOKUP, INDEX-MATCH Deep Dive",
            url: "/mock/lookup-functions.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Nested IF, COUNTIFS & SUMIFS Reference",
            url: "/mock/advanced-formulas.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Pivot Tables & Data Analysis",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Pivot Tables — From Raw Data to Insights",
            url: "/mock/pivot-tables.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Slicers, Timelines & Calculated Fields",
            url: "/mock/pivot-advanced.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: Macros & Dashboard Design",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Introduction to VBA Macros — Automating Repetitive Tasks",
            url: "/mock/macros-intro.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Building Interactive Dashboards in Excel",
            url: "/mock/dashboard-guide.pdf",
          },
        ],
      },
    ],
    "Biosafety & Infection Prevention": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Orientation",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Biosafety Training Manual — UCH/UI",
            url: "/mock/biosafety-manual.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Why Biosafety Matters — Case Studies",
            url: "/mock/biosafety-intro.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Biosafety Levels & Containment",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "BSL-1 through BSL-3 — Requirements & Practices",
            url: "/mock/bsl-levels.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Biological Risk Assessment Worksheet",
            url: "/mock/risk-assessment.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Containment Equipment — Biosafety Cabinets & Autoclaves",
            url: "/mock/containment-slides.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Waste Management & Decontamination",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Biohazard Waste Segregation & Colour Coding",
            url: "/mock/waste-mgmt.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Autoclave Operation & Validation Log",
            url: "/mock/autoclave-guide.pdf",
          },
        ],
      },
    ],
    "Grant Writing & Research Funding": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Funding Landscape",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Workshop Overview & Facilitator Bios",
            url: "/mock/grant-overview.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Nigerian & International Funding Bodies Directory",
            content:
              "TETFund, NRF, PTDF, NEEDS Assessment, Wellcome Trust, Bill & Melinda Gates Foundation, USAID — eligibility criteria and application windows.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Proposal Development",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Anatomy of a Winning Grant Proposal",
            url: "/mock/grant-proposal.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "TETFund IBR Grant Application Template",
            url: "/mock/tetfund-template.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Budget Preparation & Justification",
            url: "/mock/budget-slides.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Compliance & Reporting",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Post-Award Management & Financial Reporting",
            url: "/mock/post-award.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Ethics Committee Approval — IRB Process at UI",
            url: "/mock/irb-process.pdf",
          },
        ],
      },
    ],
    "Network & Systems Administration": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Course Foundations",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Course Outline & Lab Environment Setup",
            url: "/mock/network-outline.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Networking Fundamentals Refresher",
            url: "/mock/networking-basics.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: LAN/WAN & TCP/IP",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Subnetting, VLANs & Routing Protocols",
            url: "/mock/lan-wan.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "IP Addressing & Subnet Mask Cheat Sheet",
            url: "/mock/subnetting-ref.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Lab Exercise: Configure a Small Office Network",
            content:
              "Step-by-step instructions to set up a virtual network with a router, switch, DHCP server, and 5 client machines using Packet Tracer.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Server Administration",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Windows Server — Active Directory & Group Policy",
            url: "/mock/windows-server.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Linux Server — SSH, Apache & Cron Jobs",
            url: "/mock/linux-server.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "DNS & DHCP Configuration Guide",
            url: "/mock/dns-dhcp.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: Network Security & Troubleshooting",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Firewalls, IDS/IPS & Network Monitoring",
            url: "/mock/network-security.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Network Troubleshooting Methodology — OSI Layer Approach",
            url: "/mock/troubleshooting.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "UI Campus Network Architecture Overview",
            url: "/mock/ui-network-arch.pptx",
          },
        ],
      },
    ],
    "Occupational Health & Ergonomics": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Self-Assessment",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Training Agenda & Wellness Questionnaire",
            url: "/mock/ergonomics-agenda.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Workstation Self-Audit Checklist",
            content:
              "Evaluate your current desk setup, chair height, monitor distance, keyboard position, and lighting conditions.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Ergonomic Principles & Workstation Setup",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Setting Up an Ergonomic Workstation",
            url: "/mock/ergonomic-setup.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Repetitive Strain Injury Prevention Guide",
            url: "/mock/rsi-prevention.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Stretching Exercises for Desk Workers",
            url: "/mock/stretching-slides.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Mental Health & Stress Management",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Recognising & Managing Workplace Stress",
            url: "/mock/stress-mgmt.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "UI Employee Wellness Resources & Support Lines",
            url: "/mock/wellness-resources.pdf",
          },
        ],
      },
    ],
    // === NEW COURSE MODULES ===
    "LAMP Stack Web Development": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Environment Setup",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "LAMP Stack Installation Guide (Ubuntu/CentOS)",
            url: "/mock/lamp-setup.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Setting Up Your Development Environment",
            url: "/mock/lamp-env.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Linux Server & Apache Configuration",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Apache Virtual Hosts & Configuration",
            url: "/mock/apache-config.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Linux Command Line Essentials",
            url: "/mock/linux-cli.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: MySQL Database Design",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Relational Database Design & SQL",
            url: "/mock/mysql-design.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "SQL Query Reference Sheet",
            url: "/mock/sql-ref.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "text",
            title: "Lab: Student Records Database",
            content:
              "Design and implement a student records database with tables for students, courses, enrollments, and grades.",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: PHP & Dynamic Web Pages",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "PHP Fundamentals — Forms, Sessions & Authentication",
            url: "/mock/php-basics.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Building RESTful APIs with PHP",
            url: "/mock/php-api.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 4: Deployment & Security",
        order: 4,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Deploying LAMP Applications to Production",
            url: "/mock/lamp-deploy.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Web Application Security Best Practices",
            url: "/mock/web-security.pdf",
          },
        ],
      },
    ],
    "Linux & Unix System Administration": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Introduction to Linux",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Linux Distributions Overview & Lab Guide",
            url: "/mock/linux-intro.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Installing Ubuntu Server & CentOS",
            url: "/mock/linux-install.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Shell Scripting & Automation",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Bash Scripting — Variables, Loops & Functions",
            url: "/mock/bash-scripting.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Shell Script Examples for SysAdmins",
            url: "/mock/shell-examples.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: User & File System Management",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "User Accounts, Groups & Permissions",
            url: "/mock/user-mgmt.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "File System Hierarchy & Disk Management",
            url: "/mock/filesystem.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: Server Hardening & Monitoring",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Firewall (iptables/firewalld) & SSH Security",
            url: "/mock/server-hardening.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "System Monitoring with top, htop & journalctl",
            url: "/mock/monitoring.pdf",
          },
        ],
      },
    ],
    "Routing & Wireless Network Configuration": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Networking Refresher",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Course Lab Topology & Equipment List",
            url: "/mock/routing-lab.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "OSI Model & TCP/IP Review",
            url: "/mock/osi-review.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Static & Dynamic Routing",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Configuring OSPF, EIGRP & BGP",
            url: "/mock/routing-protocols.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Router Configuration Cheat Sheet (Cisco IOS)",
            url: "/mock/cisco-ref.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Wireless Network Design & Security",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Wireless Standards, Channels & WPA3 Configuration",
            url: "/mock/wireless-config.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Campus Wi-Fi Planning & Site Survey Guide",
            url: "/mock/wifi-planning.pdf",
          },
        ],
      },
    ],
    "Computer Networks Fundamentals": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Introduction to Networking",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Networking Fundamentals Handbook",
            url: "/mock/net-fundamentals.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "What is a Computer Network?",
            url: "/mock/net-intro.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: IP Addressing & Subnetting",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "IPv4 Addressing, Subnet Masks & CIDR",
            url: "/mock/ip-subnetting.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Subnetting Practice Worksheets",
            url: "/mock/subnet-worksheets.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Network Troubleshooting",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Using ping, traceroute & Wireshark",
            url: "/mock/troubleshoot-tools.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Network Troubleshooting Flowchart",
            url: "/mock/net-troubleshoot.pdf",
          },
        ],
      },
    ],
    "Image Processing, Graphics & Animation": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Digital Image Basics",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Image Formats, Resolution & Colour Theory",
            url: "/mock/image-basics.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Introduction to Adobe Photoshop Interface",
            url: "/mock/photoshop-intro.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Photo Editing & Retouching",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Layers, Masks & Adjustment Tools in Photoshop",
            url: "/mock/photoshop-editing.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Photo Retouching Techniques Guide",
            url: "/mock/retouching-guide.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Vector Graphics & Logo Design",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Creating Logos & Icons with Illustrator/Inkscape",
            url: "/mock/vector-design.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "Design Principles for University Branding",
            url: "/mock/branding-slides.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: 2D Animation & Motion Graphics",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Animation Principles & Keyframe Basics",
            url: "/mock/animation-basics.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Creating Animated Presentations & GIFs",
            url: "/mock/animation-guide.pdf",
          },
        ],
      },
    ],
    "Web Design & Graphics": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: HTML & CSS Foundations",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Web Design Course Outline & Tools Setup",
            url: "/mock/webdesign-outline.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "HTML5 Structure & Semantic Elements",
            url: "/mock/html5-basics.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Responsive Design & CSS3",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Flexbox, Grid & Media Queries",
            url: "/mock/css-responsive.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "CSS3 Properties Reference",
            url: "/mock/css-ref.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: JavaScript & Interactivity",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "JavaScript Fundamentals for Web Designers",
            url: "/mock/js-basics.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "DOM Manipulation & Event Handling",
            url: "/mock/js-dom.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: UI/UX Design & Prototyping",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Designing with Figma — Wireframes to Prototypes",
            url: "/mock/figma-tutorial.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "slides",
            title: "UI/UX Design Principles for Academic Websites",
            url: "/mock/uiux-slides.pptx",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 4: Deployment & Hosting",
        order: 4,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Deploying to Netlify, Vercel & cPanel",
            url: "/mock/deploy-hosting.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Domain Management & SSL Certificate Setup",
            url: "/mock/domain-ssl.pdf",
          },
        ],
      },
    ],
    "ICT in Course Registration & Records": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Overview of University ICT Systems",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "UI Student Information System Overview",
            url: "/mock/sis-overview.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Navigating the University Portal",
            url: "/mock/portal-nav.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Course Registration Workflows",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Processing Course Registration Online",
            url: "/mock/course-reg.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Common Registration Issues & Troubleshooting",
            url: "/mock/reg-troubleshoot.pdf",
          },
        ],
      },
    ],
    "Exam Preparation & Result Processing": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: CBT System Overview",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Computer-Based Testing Administration Guide",
            url: "/mock/cbt-guide.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Setting Up CBT Exam Environments",
            url: "/mock/cbt-setup.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Result Computation & Grading",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Grade-Point Calculation & Result Processing in Excel",
            url: "/mock/result-processing.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Automated Transcript Generation Workflow",
            url: "/mock/transcript-workflow.pdf",
          },
        ],
      },
    ],
    "Mail Management & Professional Communication": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Email Essentials",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Professional Email Etiquette Guide",
            url: "/mock/email-etiquette.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Outlook & Gmail Setup and Configuration",
            url: "/mock/email-setup.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Calendar & Mail Merge",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Managing Shared Calendars & Scheduling",
            url: "/mock/calendar-mgmt.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Mail Merge for Bulk Correspondence",
            url: "/mock/mail-merge.pdf",
          },
        ],
      },
    ],
    "Learning Management System (LMS) Module": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: LMS Platform Overview",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "TRD LMS User Guide",
            url: "/mock/lms-guide.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Navigating the TRD LMS Dashboard",
            url: "/mock/lms-navigation.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Course & Enrollment Management",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Creating Courses & Managing Enrollments",
            url: "/mock/lms-course-mgmt.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "QR Code Attendance & Certificate Generation",
            url: "/mock/lms-features.pdf",
          },
        ],
      },
    ],
    "Microsoft Excel for Professionals": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Excel Interface & Basics",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Excel Training Workbook",
            url: "/mock/excel-workbook.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Navigating Excel & Data Entry Best Practices",
            url: "/mock/excel-nav.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Formulas & Functions",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "SUM, IF, COUNTIF, VLOOKUP & XLOOKUP",
            url: "/mock/excel-formulas.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Excel Formula Quick Reference Card",
            url: "/mock/formula-ref.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Pivot Tables & Charts",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Creating Pivot Tables & Dynamic Charts",
            url: "/mock/excel-pivot.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Data Visualisation with Excel Charts",
            url: "/mock/excel-charts.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: Power Query & Data Transformation",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Introduction to Power Query for Data Cleaning",
            url: "/mock/power-query.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Connecting to External Data Sources",
            url: "/mock/data-connections.pdf",
          },
        ],
      },
    ],
    "Microsoft Word Mastery": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Word Essentials",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Word Training Manual",
            url: "/mock/word-manual.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Document Setup, Styles & Templates",
            url: "/mock/word-styles.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Advanced Formatting & Referencing",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Table of Contents, Headers, Footnotes & Citations",
            url: "/mock/word-referencing.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Track Changes & Collaboration Features",
            url: "/mock/word-collab.pdf",
          },
        ],
      },
    ],
    "Microsoft PowerPoint for Impactful Presentations": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Presentation Design Basics",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "PowerPoint Design Principles Guide",
            url: "/mock/ppt-design.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Master Slides, Themes & Layout Design",
            url: "/mock/ppt-master.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Animations & Delivery",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Animations, Transitions & Presenter View",
            url: "/mock/ppt-animations.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Tips for Effective Presentation Delivery",
            url: "/mock/ppt-delivery.pdf",
          },
        ],
      },
    ],
    "Data Processing & Information Management": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Data Collection Methods",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Data Collection Tools Overview",
            url: "/mock/data-collection.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Designing Surveys with Google Forms & KoBoToolbox",
            url: "/mock/survey-design.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Data Cleaning & Validation",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Data Cleaning Techniques in Excel & ODK",
            url: "/mock/data-cleaning.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Data Quality Assurance Checklist",
            url: "/mock/data-qa.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Preparing Data for Analysis",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Coding, Recoding & Exporting Data for SPSS/STATA",
            url: "/mock/data-prep.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Codebook Design & Documentation",
            url: "/mock/codebook.pdf",
          },
        ],
      },
    ],
    "Desktop Publishing & Document Design": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Desktop Publishing Basics",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "DTP Software Overview — Publisher, InDesign, Canva",
            url: "/mock/dtp-overview.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Layout Principles & Typography",
            url: "/mock/layout-typography.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Creating Professional Documents",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Designing Newsletters, Brochures & Certificates",
            url: "/mock/dtp-documents.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Print-Ready File Preparation Guide",
            url: "/mock/print-ready.pdf",
          },
        ],
      },
    ],
    "Research Tools & Data Analysis (SPSS, STATA, R)": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Research Data Preparation",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Workshop Guide & Software Installation",
            url: "/mock/research-tools-guide.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Importing & Cleaning Data in SPSS, STATA & R",
            url: "/mock/data-import.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: SPSS for Statistical Analysis",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Descriptive Stats, T-Tests & ANOVA in SPSS",
            url: "/mock/spss-analysis.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "SPSS Output Interpretation Guide",
            url: "/mock/spss-output.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: STATA for Research",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "STATA Commands — Regression, Factor Analysis & Graphs",
            url: "/mock/stata-analysis.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "STATA Do-File Best Practices",
            url: "/mock/stata-dofile.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 3: R for Data Science",
        order: 3,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "R & RStudio — tidyverse, ggplot2 & rmarkdown",
            url: "/mock/r-analysis.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "R Cheat Sheets Collection",
            url: "/mock/r-cheatsheets.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 4: Publication-Ready Output",
        order: 4,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Generating APA Tables & Charts for Journal Submission",
            url: "/mock/pub-output.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Exporting Tables — SPSS to Word, STATA to LaTeX, R to HTML",
            url: "/mock/export-guide.pdf",
          },
        ],
      },
    ],
    "CSPRO & EPIDATA for Survey Data Management": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Software Setup & Overview",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "CSPro & EpiData Installation Guide",
            url: "/mock/cspro-setup.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Introduction to Census & Survey Processing",
            url: "/mock/cspro-intro.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Data Entry Screen Design",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Designing Data Entry Forms with Skip Patterns",
            url: "/mock/entry-forms.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Validation Checks & Batch Editing in CSPro",
            url: "/mock/cspro-validation.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: Data Export & Tabulation",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Exporting CSPro/EpiData to SPSS & STATA",
            url: "/mock/data-export.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Frequency Tables & Cross-Tabulation",
            url: "/mock/tabulation.pdf",
          },
        ],
      },
    ],
    "EPI INFO & SAS for Epidemiological Research": [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Epidemiology & Software Intro",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Course Outline & Software Downloads",
            url: "/mock/epiinfo-outline.pdf",
          },
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "Introduction to Epi Info 7 Interface",
            url: "/mock/epiinfo-intro.mp4",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 1: Outbreak Investigation with Epi Info",
        order: 1,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "2×2 Tables, Odds Ratios & Relative Risk",
            url: "/mock/outbreak-analysis.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Epi Info Analysis Commands Reference",
            url: "/mock/epiinfo-commands.pdf",
          },
        ],
      },
      {
        id: `mod_${randomId()}`,
        title: "Module 2: SAS for Advanced Analysis",
        order: 2,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "video",
            title: "SAS Programming — DATA Step & PROC Procedures",
            url: "/mock/sas-basics.mp4",
          },
          {
            id: `ci_${randomId()}`,
            type: "pdf",
            title: "Survival Analysis & Logistic Regression in SAS",
            url: "/mock/sas-advanced.pdf",
          },
        ],
      },
    ],
  };

  return {
    id: `crs_${randomId()}`,
    title: seed.title,
    description: seed.description,
    category: seed.category,
    duration: seed.duration,
    venue: randomItem(VENUES),
    capacity,
    waitlistCap,
    instructorIds: mockUsers
      .filter((u) => u.role === "instructor")
      .slice(0, Math.floor(1 + Math.random() * 2))
      .map((u) => u.id),
    status: i < 10 ? "published" : randomItem(["draft", "archived"] as const),
    prerequisiteTestId: Math.random() > 0.3 ? `test_${randomId()}` : undefined,
    postCourseTestId: `posttest_${randomId()}`,
    modules: modulesByTitle[seed.title] ?? [
      {
        id: `mod_${randomId()}`,
        title: "Module 0: Foundation",
        order: 0,
        contentItems: [
          {
            id: `ci_${randomId()}`,
            type: "pdf" as const,
            title: "Course Overview",
            url: "/mock/overview.pdf",
          },
        ],
      },
    ],
    enrolledCount: Math.min(enrolled, capacity),
    waitlistCount: enrolled > capacity ? Math.min(enrolled - capacity, waitlistCap) : 0,
    createdAt: randomDate(new Date("2024-06-01"), new Date("2025-01-01")),
    updatedAt: randomDate(new Date("2025-01-01"), new Date()),
  };
});

// Generate enrollments
export const mockEnrollments: Enrollment[] = mockUsers
  .filter((u) => u.role === "student")
  .slice(0, 30)
  .map((user) => {
    const course = randomItem(mockCourses);
    const status = randomItem([
      "enrolled",
      "enrolled",
      "enrolled",
      "completed",
      "waitlisted",
      "cancelled",
    ] as const);

    return {
      id: `enr_${randomId()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      courseId: course.id,
      courseName: course.title,
      status,
      enrolledAt: randomDate(new Date("2025-01-01"), new Date()),
      completedAt:
        status === "completed" ? randomDate(new Date("2025-03-01"), new Date()) : undefined,
      qrCode: status === "enrolled" ? `QR_${randomId()}_${Date.now()}` : undefined,
      createdAt: randomDate(new Date("2025-01-01"), new Date()),
      updatedAt: randomDate(new Date("2025-03-01"), new Date()),
    };
  });

// Generate waitlist entries
export const mockWaitlist: WaitlistEntry[] = mockUsers
  .filter((u) => u.role === "student")
  .slice(20, 35)
  .map((user, i) => {
    const course = randomItem(mockCourses.filter((c) => c.waitlistCount > 0));
    return {
      id: `wl_${randomId()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      courseId: course?.id ?? mockCourses[0]!.id,
      courseName: course?.title ?? mockCourses[0]!.title,
      position: i + 1,
      status: i < 12 ? "waiting" : randomItem(["offered", "expired"] as const),
      offeredAt: i >= 12 ? randomDate(new Date("2025-04-01"), new Date()) : undefined,
      expiresAt: i >= 12 ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined,
      createdAt: randomDate(new Date("2025-02-01"), new Date()),
      updatedAt: randomDate(new Date("2025-03-01"), new Date()),
    };
  });

// Generate cohorts
export const mockCohorts: Cohort[] = mockCourses.slice(0, 6).map((course) => {
  const instructor = mockUsers.find((u) => u.role === "instructor")!;
  const startDate = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);

  return {
    id: `coh_${randomId()}`,
    courseId: course.id,
    courseName: course.title,
    instructorId: instructor.id,
    instructorName: instructor.name,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    status: randomItem(["scheduled", "in-progress"] as const),
    enrolledCount: course.enrolledCount,
    capacity: course.capacity,
    createdAt: randomDate(new Date("2025-01-01"), new Date()),
    updatedAt: randomDate(new Date("2025-03-01"), new Date()),
  };
});

// Generate certificates
export const mockCertificates: Certificate[] = mockEnrollments
  .filter((e) => e.status === "completed")
  .map((enrollment) => {
    const course = mockCourses.find((c) => c.id === enrollment.courseId);
    const instructor = course
      ? mockUsers.find((u) => course.instructorIds.includes(u.id))
      : undefined;
    return {
      id: `cert_${randomId()}`,
      userId: enrollment.userId,
      userName: enrollment.userName,
      courseId: enrollment.courseId,
      courseName: enrollment.courseName,
      instructorId: instructor?.id,
      instructorName: instructor?.name,
      certificateNumber: `TRD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "ready" as const,
      issuedAt: enrollment.completedAt,
      verificationUrl: `https://trd.ui.edu.ng/verify/cert_${randomId()}`,
      createdAt: enrollment.completedAt ?? new Date().toISOString(),
      updatedAt: enrollment.completedAt ?? new Date().toISOString(),
    };
  });

// ============================================
// Mock API Functions (simulates network delay)
// ============================================

const DELAY_MS = 300;

function delay(ms: number = DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return {
    data,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

// --- Users ---

export async function fetchUsers(filters: FilterConfig): Promise<PaginatedResponse<User>> {
  await delay();
  let filtered = [...mockUsers];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.organization?.toLowerCase().includes(q)
    );
  }

  if (filters.role) {
    filtered = filtered.filter((u) => u.role === filters.role);
  }

  if (filters.status) {
    filtered = filtered.filter((u) => u.status === filters.status);
  }

  if (filters.sort) {
    const { key, direction } = filters.sort;
    filtered.sort((a, b) => {
      const aVal = String((a as unknown as Record<string, unknown>)[key] ?? "");
      const bVal = String((b as unknown as Record<string, unknown>)[key] ?? "");
      return direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }

  return paginate(filtered, filters.page, filters.pageSize);
}

export async function createUser(
  payload: Omit<User, "id" | "createdAt" | "updatedAt" | "lastLoginAt">
): Promise<User> {
  await delay();
  const user: User = {
    ...payload,
    id: `usr_${randomId()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockUsers.unshift(user);
  return user;
}

export async function updateUser(id: string, payload: Partial<User>): Promise<User> {
  await delay();
  const idx = mockUsers.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  mockUsers[idx] = { ...mockUsers[idx]!, ...payload, updatedAt: new Date().toISOString() };
  return mockUsers[idx]!;
}

export async function deleteUser(id: string): Promise<void> {
  await delay();
  const idx = mockUsers.findIndex((u) => u.id === id);
  if (idx !== -1) mockUsers.splice(idx, 1);
}

// --- Courses ---

export async function fetchCourses(filters: FilterConfig): Promise<PaginatedResponse<Course>> {
  await delay();
  let filtered = [...mockCourses];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }

  if (filters.status) {
    filtered = filtered.filter((c) => c.status === filters.status);
  }

  if (filters.category) {
    filtered = filtered.filter((c) => c.category === filters.category);
  }

  if (filters.sort) {
    const { key, direction } = filters.sort;
    filtered.sort((a, b) => {
      const aVal = String((a as unknown as Record<string, unknown>)[key] ?? "");
      const bVal = String((b as unknown as Record<string, unknown>)[key] ?? "");
      return direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }

  return paginate(filtered, filters.page, filters.pageSize);
}

export async function fetchCourse(id: string): Promise<Course> {
  await delay();
  const course = mockCourses.find((c) => c.id === id);
  if (!course) throw new Error("Course not found");
  return course;
}

export async function createCourse(
  payload: Omit<
    Course,
    "id" | "createdAt" | "updatedAt" | "enrolledCount" | "waitlistCount" | "modules"
  >
): Promise<Course> {
  await delay();
  const course: Course = {
    ...payload,
    id: `crs_${randomId()}`,
    enrolledCount: 0,
    waitlistCount: 0,
    modules: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockCourses.unshift(course);
  return course;
}

export async function updateCourse(id: string, payload: Partial<Course>): Promise<Course> {
  await delay();
  const idx = mockCourses.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Course not found");
  mockCourses[idx] = { ...mockCourses[idx]!, ...payload, updatedAt: new Date().toISOString() };
  return mockCourses[idx]!;
}

export async function deleteCourse(id: string): Promise<void> {
  await delay();
  const idx = mockCourses.findIndex((c) => c.id === id);
  if (idx !== -1) mockCourses.splice(idx, 1);
}

// --- Enrollments ---

export async function fetchEnrollments(
  filters: FilterConfig & { courseId?: string }
): Promise<PaginatedResponse<Enrollment>> {
  await delay();
  let filtered = [...mockEnrollments];

  if (filters.courseId) {
    filtered = filtered.filter((e) => e.courseId === filters.courseId);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (e) => e.userName.toLowerCase().includes(q) || e.courseName.toLowerCase().includes(q)
    );
  }

  if (filters.status) {
    filtered = filtered.filter((e) => e.status === filters.status);
  }

  return paginate(filtered, filters.page, filters.pageSize);
}

// --- Waitlist ---

export async function fetchWaitlist(
  filters: FilterConfig & { courseId?: string }
): Promise<PaginatedResponse<WaitlistEntry>> {
  await delay();
  let filtered = [...mockWaitlist];

  if (filters.courseId) {
    filtered = filtered.filter((w) => w.courseId === filters.courseId);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (w) => w.userName.toLowerCase().includes(q) || w.courseName.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => a.position - b.position);
  return paginate(filtered, filters.page, filters.pageSize);
}

export async function promoteWaitlistEntry(id: string): Promise<WaitlistEntry> {
  await delay();
  const idx = mockWaitlist.findIndex((w) => w.id === id);
  if (idx === -1) throw new Error("Waitlist entry not found");
  mockWaitlist[idx] = {
    ...mockWaitlist[idx]!,
    status: "promoted",
    updatedAt: new Date().toISOString(),
  };
  return mockWaitlist[idx]!;
}

export async function removeWaitlistEntry(id: string): Promise<void> {
  await delay();
  const idx = mockWaitlist.findIndex((w) => w.id === id);
  if (idx !== -1) mockWaitlist.splice(idx, 1);
}

// --- Stats ---

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  activeEnrollments: number;
  waitlistTotal: number;
  certificatesIssued: number;
  usersByRole: Record<string, number>;
  coursesByStatus: Record<string, number>;
  recentEnrollments: Enrollment[];
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay();
  return {
    totalUsers: mockUsers.length,
    totalCourses: mockCourses.length,
    activeEnrollments: mockEnrollments.filter((e) => e.status === "enrolled").length,
    waitlistTotal: mockWaitlist.filter((w) => w.status === "waiting").length,
    certificatesIssued: mockCertificates.length,
    usersByRole: {
      admin: mockUsers.filter((u) => u.role === "admin").length,
      instructor: mockUsers.filter((u) => u.role === "instructor").length,
      student: mockUsers.filter((u) => u.role === "student").length,
    },
    coursesByStatus: {
      published: mockCourses.filter((c) => c.status === "published").length,
      draft: mockCourses.filter((c) => c.status === "draft").length,
      archived: mockCourses.filter((c) => c.status === "archived").length,
    },
    recentEnrollments: mockEnrollments.slice(0, 5),
  };
}

// ============================================
// Student-Specific API Functions (Phase 3)
// ============================================

// Simulated current student user (id "usr-0" from mockUsers)
const CURRENT_STUDENT_ID = "usr-0";

export function getCurrentStudent(): User {
  return mockUsers.find((u) => u.id === CURRENT_STUDENT_ID) ?? mockUsers[0]!;
}

export async function fetchStudentEnrollments(): Promise<Enrollment[]> {
  await delay();
  return mockEnrollments.filter((e) => e.userId === CURRENT_STUDENT_ID);
}

export async function fetchStudentWaitlist(): Promise<WaitlistEntry[]> {
  await delay();
  return mockWaitlist.filter((w) => w.userId === CURRENT_STUDENT_ID);
}

export async function fetchStudentCertificates(): Promise<Certificate[]> {
  await delay();
  return mockCertificates.filter((c) => c.userId === CURRENT_STUDENT_ID);
}

export async function fetchPublishedCourses(filters?: {
  search?: string;
  category?: string;
}): Promise<Course[]> {
  await delay();
  let filtered = mockCourses.filter((c) => c.status === "published");
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)
    );
  }
  if (filters?.category) {
    filtered = filtered.filter((c) => c.category === filters.category);
  }
  return filtered;
}

export async function enrollInCourse(courseId: string): Promise<Enrollment> {
  await delay();
  const course = mockCourses.find((c) => c.id === courseId);
  if (!course) throw new Error("Course not found");
  const student = getCurrentStudent();
  const enrollment: Enrollment = {
    id: `enr-${randomId()}`,
    userId: student.id,
    userName: student.name,
    userEmail: student.email,
    courseId: course.id,
    courseName: course.title,
    status: course.enrolledCount >= course.capacity ? "waitlisted" : "enrolled",
    enrolledAt: new Date().toISOString(),
    qrCode: `QR-${randomId().toUpperCase()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockEnrollments.push(enrollment);
  return enrollment;
}

export async function fetchCertificateByNumber(certNumber: string): Promise<Certificate | null> {
  await delay();
  return mockCertificates.find((c) => c.certificateNumber === certNumber) ?? null;
}

// --- Mock Test Data ---

import type { Test, TestAttempt, Question, TestCategory } from "@/lib/types";

const QUESTION_TOPICS = [
  "ICT Fundamentals",
  "Research Methods",
  "Laboratory Safety",
  "Data Analysis",
  "Leadership",
];

function generateMockQuestions(count: number, courseId: string): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `q-${randomId()}`,
    courseId,
    text: [
      "What is the keyboard shortcut to save a document in Microsoft Word?",
      "Which of the following is NOT a valid research design?",
      "What colour bin is used for biohazard waste disposal?",
      "In SPSS, which menu contains the option for running a T-Test?",
      "What does the acronym PPE stand for in laboratory safety?",
      "Which citation style uses (Author, Year) for in-text references?",
      "What is the primary function of a VLOOKUP formula in Excel?",
      "Which fire extinguisher type is appropriate for electrical fires?",
      "What is the correct order of the scientific method?",
      "In Python, which library is commonly used for data manipulation?",
      "What is the purpose of a biosafety cabinet?",
      "Which statistical test compares means of three or more groups?",
      "What does IRB stand for in research ethics?",
      "Which network protocol assigns IP addresses automatically?",
      "What is the PASS technique used for?",
    ][i % 15]!,
    type: "mcq" as const,
    options: [
      { id: `opt-${i}-a`, text: "Option A — Correct answer" },
      { id: `opt-${i}-b`, text: "Option B — Plausible distractor" },
      { id: `opt-${i}-c`, text: "Option C — Another distractor" },
      { id: `opt-${i}-d`, text: "Option D — Clearly wrong" },
    ],
    correctOptionId: `opt-${i}-a`,
    tags: [randomItem(QUESTION_TOPICS)],
    difficulty: randomItem(["easy", "medium", "hard"] as const),
  }));
}

// Prerequisite tests
const prereqTests: Test[] = mockCourses
  .filter((c) => c.prerequisiteTestId)
  .map((course) => ({
    id: course.prerequisiteTestId!,
    title: `${course.title} - Prerequisite Test`,
    courseId: course.id,
    category: "prerequisite" as TestCategory,
    questions: generateMockQuestions(10, course.id),
    passingScore: 70,
    maxAttempts: 3,
    timeLimitMinutes: 30,
  }));

// Post-course tests (PRD §2.5)
const postCourseTests: Test[] = mockCourses
  .filter((c) => c.postCourseTestId)
  .map((course) => ({
    id: course.postCourseTestId!,
    title: `${course.title} - Final Assessment`,
    courseId: course.id,
    category: "post-course" as TestCategory,
    questions: generateMockQuestions(15, course.id),
    passingScore: 75,
    maxAttempts: 2,
    timeLimitMinutes: 45,
  }));

export const mockTests: Test[] = [...prereqTests, ...postCourseTests];

export const mockTestAttempts: TestAttempt[] = (() => {
  // Seed mock test attempts from enrolled students
  const attempts: TestAttempt[] = [];
  const enrolledStudents = mockEnrollments.filter(
    (e) => e.status === "enrolled" || e.status === "completed"
  );

  enrolledStudents.forEach((enrollment, idx) => {
    const course = mockCourses.find((c) => c.id === enrollment.courseId);
    if (!course) return;
    const user = mockUsers.find((u) => u.id === enrollment.userId);
    if (!user) return;

    // Each enrolled student has a chance of having taken the prerequisite test
    if (course.prerequisiteTestId && idx % 3 !== 2) {
      const test = mockTests.find((t) => t.id === course.prerequisiteTestId);
      if (test) {
        const score = 50 + Math.floor(seededRandom(idx * 997) * 50);
        attempts.push({
          id: `att-pre-${idx}`,
          testId: test.id,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          score,
          passed: score >= test.passingScore,
          attemptNumber: 1,
          answers: [],
          createdAt: randomDate(new Date("2025-03-01"), new Date("2025-06-01")),
          updatedAt: randomDate(new Date("2025-03-01"), new Date("2025-06-01")),
        });
      }
    }

    // Completed students have taken the post-course test
    if (course.postCourseTestId && enrollment.status === "completed") {
      const test = mockTests.find((t) => t.id === course.postCourseTestId);
      if (test) {
        const score = 55 + Math.floor(seededRandom(idx * 1103) * 45);
        attempts.push({
          id: `att-post-${idx}`,
          testId: test.id,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          score,
          passed: score >= test.passingScore,
          attemptNumber: 1,
          answers: [],
          createdAt: randomDate(new Date("2025-04-01"), new Date("2025-06-15")),
          updatedAt: randomDate(new Date("2025-04-01"), new Date("2025-06-15")),
        });
      }
    }
  });

  return attempts;
})();

export async function fetchTest(testId: string): Promise<Test | null> {
  await delay();
  return mockTests.find((t) => t.id === testId) ?? null;
}

export async function fetchTestAttempts(testId: string, userId?: string): Promise<TestAttempt[]> {
  await delay();
  return mockTestAttempts.filter(
    (a) => a.testId === testId && (userId ? a.userId === userId : a.userId === CURRENT_STUDENT_ID)
  );
}

export async function submitTestAttempt(
  testId: string,
  answers: { questionId: string; selectedOptionId: string }[]
): Promise<TestAttempt> {
  await delay();
  const test = mockTests.find((t) => t.id === testId);
  if (!test) throw new Error("Test not found");

  const correctCount = answers.reduce((count, ans) => {
    const question = test.questions.find((q) => q.id === ans.questionId);
    return question?.correctOptionId === ans.selectedOptionId ? count + 1 : count;
  }, 0);

  const score = Math.round((correctCount / test.questions.length) * 100);
  const previousAttempts = mockTestAttempts.filter(
    (a) => a.testId === testId && a.userId === CURRENT_STUDENT_ID
  );

  const currentUser = getCurrentStudent();
  const attempt: TestAttempt = {
    id: `att-${randomId()}`,
    testId,
    userId: CURRENT_STUDENT_ID,
    userName: currentUser.name,
    userEmail: currentUser.email,
    score,
    passed: score >= test.passingScore,
    attemptNumber: previousAttempts.length + 1,
    answers,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockTestAttempts.push(attempt);
  return attempt;
}

// --- Notifications ---

export interface Notification {
  id: string;
  type: "enrollment" | "waitlist" | "reminder" | "certificate" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "enrollment",
    title: "Enrollment Confirmed",
    message:
      "You have been enrolled in ICT Proficiency Certification. Training begins Monday at ITeMS Building.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "notif-2",
    type: "certificate",
    title: "Certificate Ready",
    message: "Your certificate for Fire Safety & Emergency Response is ready to download.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "notif-3",
    type: "reminder",
    title: "Class Tomorrow",
    message:
      "Reminder: Data Analysis with Python & SPSS starts tomorrow at 9:00 AM, Faculty of Technology Computer Lab 2.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "notif-4",
    type: "waitlist",
    title: "Seat Available!",
    message:
      "A seat has opened in Research Methodology & Academic Writing. Confirm your spot within 24 hours.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "notif-5",
    type: "system",
    title: "Profile Updated",
    message: "Your profile information has been updated successfully.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export async function fetchNotifications(): Promise<Notification[]> {
  await delay();
  return mockNotifications;
}

export async function markNotificationRead(id: string): Promise<void> {
  await delay();
  const notif = mockNotifications.find((n) => n.id === id);
  if (notif) notif.read = true;
}

export async function markAllNotificationsRead(): Promise<void> {
  await delay();
  mockNotifications.forEach((n) => (n.read = true));
}

// ============================================
// Attendance APIs (PRD §3.2 - Instructor marks attendance)
// ============================================

export const mockAttendanceRecords: AttendanceRecord[] = mockEnrollments
  .filter((e) => e.status === "enrolled")
  .slice(0, 15)
  .flatMap((enrollment) => {
    const dates = Array.from({ length: 3 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0]!;
    });
    return dates.map((date) => ({
      id: `att_${randomId()}`,
      enrollmentId: enrollment.id,
      userId: enrollment.userId,
      userName: enrollment.userName,
      courseId: enrollment.courseId,
      date,
      status: randomItem(["present", "present", "present", "absent", "excused"] as const),
      scannedBy: randomItem(mockUsers.filter((u) => u.role === "instructor")).id,
      method: randomItem(["qr", "manual"] as const),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  });

export async function fetchAttendance(
  filters: FilterConfig & { courseId?: string; date?: string }
): Promise<PaginatedResponse<AttendanceRecord>> {
  await delay();
  let filtered = [...mockAttendanceRecords];
  if (filters.courseId) filtered = filtered.filter((a) => a.courseId === filters.courseId);
  if (filters.date) filtered = filtered.filter((a) => a.date === filters.date);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((a) => a.userName.toLowerCase().includes(q));
  }
  return paginate(filtered, filters.page, filters.pageSize);
}

export async function markAttendance(
  enrollmentId: string,
  userId: string,
  courseId: string,
  date: string,
  status: AttendanceRecord["status"],
  method: AttendanceRecord["method"]
): Promise<AttendanceRecord> {
  await delay();
  const user = mockUsers.find((u) => u.id === userId);
  const record: AttendanceRecord = {
    id: `att_${randomId()}`,
    enrollmentId,
    userId,
    userName: user?.name ?? "Unknown",
    courseId,
    date,
    status,
    method,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockAttendanceRecords.push(record);
  return record;
}

// ============================================
// Cohort CRUD APIs (PRD §2.1)
// ============================================

export async function fetchCohorts(
  filters: FilterConfig & { courseId?: string }
): Promise<PaginatedResponse<Cohort>> {
  await delay();
  let filtered = [...mockCohorts];
  if (filters.courseId) filtered = filtered.filter((c) => c.courseId === filters.courseId);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) => c.courseName.toLowerCase().includes(q) || c.instructorName.toLowerCase().includes(q)
    );
  }
  if (filters.status) filtered = filtered.filter((c) => c.status === filters.status);
  return paginate(filtered, filters.page, filters.pageSize);
}

export async function createCohort(
  payload: Omit<Cohort, "id" | "createdAt" | "updatedAt" | "enrolledCount">
): Promise<Cohort> {
  await delay();
  const cohort: Cohort = {
    ...payload,
    id: `coh_${randomId()}`,
    enrolledCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockCohorts.push(cohort);
  return cohort;
}

export async function updateCohort(id: string, payload: Partial<Cohort>): Promise<Cohort> {
  await delay();
  const idx = mockCohorts.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Cohort not found");
  mockCohorts[idx] = { ...mockCohorts[idx]!, ...payload, updatedAt: new Date().toISOString() };
  return mockCohorts[idx]!;
}

export async function deleteCohort(id: string): Promise<void> {
  await delay();
  const idx = mockCohorts.findIndex((c) => c.id === id);
  if (idx !== -1) mockCohorts.splice(idx, 1);
}

// ============================================
// Certificate CRUD APIs (PRD §2.6)
// ============================================

export async function fetchCertificates(
  filters: FilterConfig & { courseId?: string }
): Promise<PaginatedResponse<Certificate>> {
  await delay();
  let filtered = [...mockCertificates];
  if (filters.courseId) filtered = filtered.filter((c) => c.courseId === filters.courseId);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.userName.toLowerCase().includes(q) ||
        c.courseName.toLowerCase().includes(q) ||
        c.certificateNumber.toLowerCase().includes(q)
    );
  }
  if (filters.status) filtered = filtered.filter((c) => c.status === filters.status);
  return paginate(filtered, filters.page, filters.pageSize);
}

export async function generateCertificate(userId: string, courseId: string): Promise<Certificate> {
  await delay();
  const user = mockUsers.find((u) => u.id === userId);
  const course = mockCourses.find((c) => c.id === courseId);
  const instructor = course
    ? mockUsers.find((u) => course.instructorIds.includes(u.id))
    : undefined;
  if (!user || !course) throw new Error("User or Course not found");
  const cert: Certificate = {
    id: `cert_${randomId()}`,
    userId,
    userName: user.name,
    courseId,
    courseName: course.title,
    instructorId: instructor?.id,
    instructorName: instructor?.name,
    certificateNumber: `TRD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    status: "ready",
    issuedAt: new Date().toISOString(),
    verificationUrl: `https://trd.ui.edu.ng/verify/cert_${randomId()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockCertificates.push(cert);
  return cert;
}

export async function revokeCertificate(id: string): Promise<Certificate> {
  await delay();
  const idx = mockCertificates.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Certificate not found");
  mockCertificates[idx] = {
    ...mockCertificates[idx]!,
    status: "revoked",
    revokedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return mockCertificates[idx]!;
}

// ============================================
// Question Bank & Test Management (PRD §4.2)
// ============================================

// Global question bank across all tests
export const questionBank: Question[] = mockTests.flatMap((t) => t.questions);

export async function fetchQuestionBank(filters?: {
  search?: string;
  difficulty?: string;
  tag?: string;
  courseId?: string;
}): Promise<Question[]> {
  await delay();
  let filtered = [...questionBank];
  if (filters?.courseId) {
    filtered = filtered.filter((q2) => q2.courseId === filters.courseId);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((q2) => q2.text.toLowerCase().includes(q));
  }
  if (filters?.difficulty) {
    filtered = filtered.filter((q2) => q2.difficulty === filters.difficulty);
  }
  if (filters?.tag) {
    filtered = filtered.filter((q2) => q2.tags.includes(filters.tag!));
  }
  return filtered;
}

export async function createQuestion(payload: Omit<Question, "id">): Promise<Question> {
  await delay();
  const question: Question = { ...payload, id: `q-${randomId()}` };
  questionBank.push(question);
  return question;
}

export async function updateQuestion(id: string, payload: Partial<Question>): Promise<Question> {
  await delay();
  const idx = questionBank.findIndex((q) => q.id === id);
  if (idx === -1) throw new Error("Question not found");
  questionBank[idx] = { ...questionBank[idx]!, ...payload };
  return questionBank[idx]!;
}

export async function deleteQuestion(id: string): Promise<void> {
  await delay();
  const idx = questionBank.findIndex((q) => q.id === id);
  if (idx !== -1) questionBank.splice(idx, 1);
}

export async function fetchAllTests(): Promise<Test[]> {
  await delay();
  return [...mockTests];
}

export async function createTest(
  payload: Omit<Test, "id" | "questions"> & { questionIds: string[] }
): Promise<Test> {
  await delay();
  const questions = questionBank.filter((q) => payload.questionIds.includes(q.id));
  const test: Test = {
    id: `test_${randomId()}`,
    title: payload.title,
    courseId: payload.courseId,
    category: payload.category,
    questions,
    passingScore: payload.passingScore,
    maxAttempts: payload.maxAttempts,
    timeLimitMinutes: payload.timeLimitMinutes,
  };
  mockTests.push(test);
  return test;
}

export async function updateTest(id: string, payload: Partial<Test>): Promise<Test> {
  await delay();
  const idx = mockTests.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Test not found");
  mockTests[idx] = { ...mockTests[idx]!, ...payload };
  return mockTests[idx]!;
}

export async function deleteTest(id: string): Promise<void> {
  await delay();
  const idx = mockTests.findIndex((t) => t.id === id);
  if (idx !== -1) mockTests.splice(idx, 1);
}

// --- Admin Test Override (PRD §2.5) ---

export async function overrideTestAttempt(
  attemptId: string,
  passed: boolean,
  adminId: string
): Promise<TestAttempt> {
  await delay();
  const idx = mockTestAttempts.findIndex((a) => a.id === attemptId);
  if (idx === -1) throw new Error("Attempt not found");
  mockTestAttempts[idx] = {
    ...mockTestAttempts[idx]!,
    passed,
    isOverridden: true,
    overriddenBy: adminId,
    overriddenAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return mockTestAttempts[idx]!;
}

export async function fetchAllTestAttempts(
  filters?: FilterConfig & { testId?: string }
): Promise<PaginatedResponse<TestAttempt>> {
  await delay();
  let filtered = [...mockTestAttempts];
  if (filters?.testId) filtered = filtered.filter((a) => a.testId === filters.testId);
  return paginate(filtered, filters?.page ?? 1, filters?.pageSize ?? 20);
}

// ============================================
// Analytics Data (PRD §5.4)
// ============================================

export interface AnalyticsData {
  enrollmentsPerCourse: { courseId: string; courseName: string; count: number }[];
  passFailRates: {
    courseId: string;
    courseName: string;
    passed: number;
    failed: number;
    total: number;
  }[];
  studentActivity: { active: number; inactive: number; total: number };
  instructorPerformance: {
    instructorId: string;
    instructorName: string;
    coursesAssigned: number;
    avgPassRate: number;
  }[];
  monthlyEnrollments: { month: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
}

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
  await delay();

  // Enrollments per course
  const enrollmentsPerCourse = mockCourses
    .map((c) => ({
      courseId: c.id,
      courseName: c.title,
      count: mockEnrollments.filter((e) => e.courseId === c.id).length,
    }))
    .sort((a, b) => b.count - a.count);

  // Pass/fail rates from test attempts
  const passFailRates = mockCourses
    .filter((c) => c.postCourseTestId)
    .map((c) => {
      const testAttempts = mockTestAttempts.filter(
        (a) => a.testId === c.postCourseTestId || a.testId === c.prerequisiteTestId
      );
      const passed = testAttempts.filter((a) => a.passed).length;
      const failed = testAttempts.filter((a) => !a.passed).length;
      return {
        courseId: c.id,
        courseName: c.title,
        passed,
        failed,
        total: passed + failed,
      };
    })
    .filter((r) => r.total > 0);

  // If no real attempts yet, generate sample data for display
  const finalPassFail =
    passFailRates.length > 0
      ? passFailRates
      : mockCourses
          .slice(0, 6)
          .map((c) => ({
            courseId: c.id,
            courseName: c.title,
            passed: Math.floor(5 + Math.random() * 20),
            failed: Math.floor(1 + Math.random() * 8),
            total: 0,
          }))
          .map((r) => ({ ...r, total: r.passed + r.failed }));

  // Student activity
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const students = mockUsers.filter((u) => u.role === "student");
  const activeStudents = students.filter(
    (u) => u.lastLoginAt && u.lastLoginAt > thirtyDaysAgo
  ).length;

  // Instructor performance
  const instructors = mockUsers.filter((u) => u.role === "instructor");
  const instructorPerformance = instructors.map((inst) => {
    const assigned = mockCourses.filter((c) => c.instructorIds.includes(inst.id));
    return {
      instructorId: inst.id,
      instructorName: inst.name,
      coursesAssigned: assigned.length,
      avgPassRate: assigned.length > 0 ? Math.floor(60 + Math.random() * 35) : 0,
    };
  });

  // Monthly enrollments (last 6 months)
  const monthlyEnrollments = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      month: d.toLocaleString("default", { month: "short", year: "2-digit" }),
      count: Math.floor(5 + Math.random() * 30),
    };
  });

  // Category distribution
  const catMap = new Map<string, number>();
  mockCourses.forEach((c) => catMap.set(c.category, (catMap.get(c.category) ?? 0) + 1));
  const categoryDistribution = Array.from(catMap.entries()).map(([category, count]) => ({
    category,
    count,
  }));

  return {
    enrollmentsPerCourse,
    passFailRates: finalPassFail,
    studentActivity: {
      active: activeStudents,
      inactive: students.length - activeStudents,
      total: students.length,
    },
    instructorPerformance,
    monthlyEnrollments,
    categoryDistribution,
  };
}

// ============================================
// Instructor-scoped APIs (PRD §3.2)
// ============================================

// Simulated current instructor = first instructor user
const CURRENT_INSTRUCTOR_ID = mockUsers.find((u) => u.role === "instructor")?.id ?? "usr_inst_1";

export function getCurrentInstructorId(): string {
  return CURRENT_INSTRUCTOR_ID;
}

export function getCurrentInstructor(): User {
  return mockUsers.find((u) => u.id === CURRENT_INSTRUCTOR_ID)!;
}

/** Courses assigned to the current instructor */
export async function fetchInstructorCourses(): Promise<Course[]> {
  await delay();
  return mockCourses.filter((c) => c.instructorIds.includes(CURRENT_INSTRUCTOR_ID));
}

/** Enrollments in instructor's courses */
export async function fetchInstructorEnrollments(courseId?: string): Promise<Enrollment[]> {
  await delay();
  const instrCourseIds = mockCourses
    .filter((c) => c.instructorIds.includes(CURRENT_INSTRUCTOR_ID))
    .map((c) => c.id);
  let filtered = mockEnrollments.filter((e) => instrCourseIds.includes(e.courseId));
  if (courseId) filtered = filtered.filter((e) => e.courseId === courseId);
  return filtered;
}

/** Cohorts for instructor's courses */
export async function fetchInstructorCohorts(): Promise<Cohort[]> {
  await delay();
  return mockCohorts.filter((c) => c.instructorId === CURRENT_INSTRUCTOR_ID);
}

/** Instructor dashboard stats */
export interface InstructorDashboardStats {
  assignedCourses: number;
  totalStudents: number;
  attendanceRate: number;
  upcomingSessionsCount: number;
  recentAttendance: AttendanceRecord[];
}

export async function fetchInstructorDashboardStats(): Promise<InstructorDashboardStats> {
  await delay();
  const courses = mockCourses.filter((c) => c.instructorIds.includes(CURRENT_INSTRUCTOR_ID));
  const courseIds = courses.map((c) => c.id);
  const enrollments = mockEnrollments.filter(
    (e) => courseIds.includes(e.courseId) && e.status === "enrolled"
  );
  const attendance = mockAttendanceRecords.filter((a) => courseIds.includes(a.courseId));
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attendanceRate =
    attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;
  const cohorts = mockCohorts.filter(
    (c) =>
      c.instructorId === CURRENT_INSTRUCTOR_ID &&
      c.status !== "completed" &&
      c.status !== "cancelled"
  );

  return {
    assignedCourses: courses.length,
    totalStudents: enrollments.length,
    attendanceRate,
    upcomingSessionsCount: cohorts.length,
    recentAttendance: attendance.slice(0, 10),
  };
}
