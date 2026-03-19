export const MOCK_PROGRAMS = [
  // --- Program 1 ---
  {
    id: 1,
    publisher_id: 1, // PROGRAM.publisher_id → PUBLISHERS table (Publisher: "TM EduBridge")
    representative_id: null, // FK → USER table (staff contact for this institution)
    name: "Daegu Arts University",
    visaType: "D-2",
    tags: ["ON SALE", "BEST"],
    country: "South Korea",
    location: "Chilgok County, Daegu",
    description:
      "Daegu Arts University (DGAU), located in Chilgok County near Daegu, South Korea, is a private institution specialized in fine arts, design, and practical art education. It focuses on fostering creative professionals through industry-tailored curricula and student-oriented support programs.",
    logo: "https://ui-avatars.com/api/?name=Daegu+Arts&background=E11D48&color=fff&size=128",
    images: [
      "https://placehold.co/600x400/1e40af/ffffff/png?text=Daegu+Arts+University&font=roboto",
      "https://placehold.co/600x400/2563eb/ffffff/png?text=Campus+View&font=roboto",
    ],
    // REFACTORED (Priority 2): departments[] replaced with department_major_ids[]
    // These IDs reference MOCK_DEPARTMENT_MAJORS in mockMajors.js
    // Old: departments: [{ language, degree, major, duration, credits, languageRequirement }, ...]
    // New: resolve with getProgramMajors(1) from mockMajors.js
    // Backend: GET /api/programs/1/majors
    department_major_ids: [1, 2, 3, 4, 5, 6],
    // Structured timeline: each row = one application stage
    timeline: [
      {
        stage: "Stage 1",
        registrationStart: "2025-12-01",
        registrationEnd: "2025-12-23",
        examDate: "2025-12-26",
        resultDate: "2026-01-12",
      },
      {
        stage: "Stage 2",
        registrationStart: "2025-12-24",
        registrationEnd: "2025-12-30",
        examDate: "2026-01-05",
        resultDate: "2026-01-12",
      },
      {
        stage: "Registration",
        registrationStart: "2026-01-29",
        registrationEnd: "2026-02-02",
        examDate: "—",
        resultDate: "—",
      },
    ],
    // Tuition fees per degree level
    tuitionFees: [
      {
        level: "Bachelor's",
        item: "Entrance Fee (one-time)",
        amount: 300000,
        currency: "KRW",
      },
      {
        level: "Bachelor's",
        item: "Tuition (per semester)",
        amount: 2500000,
        currency: "KRW",
      },
    ],
    // Categorized required documents
    requiredDocuments: [
      {
        category: "All Applicants",
        items: [
          "Application (prescribed form)",
          "Photograph (3cm x 4cm) — 2 copies",
          "Resume (prescribed form)",
          "Copy of Passport",
          "Certificate of High School Graduation",
          "Official Academic Transcripts (all years)",
          "Pledge for Expense Payment",
        ],
      },
      {
        category: "References",
        items: ["Letter of Reference (one from Korea, one from home country)"],
      },
    ],
    status: "Active",
    applicationLink: "https://docs.google.com/forms",
    applicationFile: null,
  },

  // --- Program 2 ---
  {
    id: 2,
    publisher_id: 1, // PROGRAM.publisher_id → PUBLISHERS.id
    representative_id: null,
    name: "Tongmyong University",
    visaType: "D-4",
    tags: ["NEW", "ON SALE"],
    country: "South Korea",
    location: "Busan",
    description:
      "Leading university in Busan with strong industry connections and practical training programs.",
    logo: "https://ui-avatars.com/api/?name=Tongmyong&background=2563EB&color=fff&size=128",
    images: [],
    // REFACTORED (Priority 2): resolve with getProgramMajors(2) from mockMajors.js
    // Backend: GET /api/programs/2/majors
    department_major_ids: [7, 8, 9],
    timeline: [
      {
        stage: "Stage 1",
        registrationStart: "2025-08-01",
        registrationEnd: "2025-08-31",
        examDate: "2025-09-10",
        resultDate: "2025-09-15",
      },
      {
        stage: "Stage 2",
        registrationStart: "2025-09-01",
        registrationEnd: "2025-09-20",
        examDate: "2025-09-28",
        resultDate: "2025-09-30",
      },
    ],
    tuitionFees: [
      {
        level: "Certificate",
        item: "Entrance Fee (one-time)",
        amount: 200000,
        currency: "KRW",
      },
      {
        level: "Certificate",
        item: "Tuition (per semester)",
        amount: 1800000,
        currency: "KRW",
      },
      {
        level: "Bachelor's",
        item: "Entrance Fee (one-time)",
        amount: 300000,
        currency: "KRW",
      },
      {
        level: "Bachelor's",
        item: "Tuition (per semester)",
        amount: 2200000,
        currency: "KRW",
      },
    ],
    requiredDocuments: [
      {
        category: "All Applicants",
        items: [
          "Completed Application Form",
          "Copy of Passport",
          "Official Academic Transcripts",
          "Bank Balance Certificate (USD 20,000+)",
          "Study Plan",
        ],
      },
      {
        category: "English Track",
        items: ["TOEFL / IELTS Score Certificate"],
      },
    ],
    status: "Active",
    applicationFile:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    applicationLink: null,
  },

  // --- Program 3 ---
  {
    id: 3,
    publisher_id: 1, // PROGRAM.publisher_id → PUBLISHERS.id
    representative_id: null,
    name: "Seoul Women's University",
    visaType: "D-2",
    tags: ["BEST"],
    country: "South Korea",
    location: "Nowon-gu, Seoul",
    description:
      "Prestigious women's university in Seoul focusing on leadership and innovation.",
    logo: "https://ui-avatars.com/api/?name=SWU&background=D946EF&color=fff&size=128",
    images: [],
    // REFACTORED (Priority 2): resolve with getProgramMajors(3) from mockMajors.js
    // Backend: GET /api/programs/3/majors
    department_major_ids: [10, 11, 12],
    timeline: [
      {
        stage: "Stage 1",
        registrationStart: "2025-10-01",
        registrationEnd: "2025-10-20",
        examDate: "2025-10-27",
        resultDate: "2025-11-05",
      },
      {
        stage: "Stage 2",
        registrationStart: "2025-10-25",
        registrationEnd: "2025-11-05",
        examDate: "2025-11-15",
        resultDate: "2025-11-20",
      },
    ],
    tuitionFees: [
      {
        level: "Bachelor's",
        item: "Entrance Fee (one-time)",
        amount: 400000,
        currency: "KRW",
      },
      {
        level: "Bachelor's",
        item: "Tuition (per semester)",
        amount: 2800000,
        currency: "KRW",
      },
      {
        level: "Master's",
        item: "Entrance Fee (one-time)",
        amount: 500000,
        currency: "KRW",
      },
      {
        level: "Master's",
        item: "Tuition (per semester)",
        amount: 3200000,
        currency: "KRW",
      },
    ],
    requiredDocuments: [
      {
        category: "All Applicants",
        items: [
          "Completed Application Form",
          "Copy of Passport",
          "Official Academic Transcripts",
          "Bank Balance Certificate (USD 20,000+)",
          "Study Plan / Personal Statement",
        ],
      },
      {
        category: "English Track",
        items: ["TOEFL / IELTS Score Certificate"],
      },
      {
        category: "Korean Track",
        items: ["TOPIK Certificate (Level 4 minimum)"],
      },
    ],
    status: "Active",
    applicationLink: null,
    applicationFile: null,
  },
];

export const DESTINATIONS = [
  {
    name: "Australia",
    description: "World-class education with work opportunities",
    tuition: "$20,000 - $45,000/year",
    living: "$18,000 - $24,000/year",
    features: [
      "Post-study work visa",
      "High quality of life",
      "Multicultural environment",
    ],
    image:
      "https://images.unsplash.com/photo-1540448051910-09cfadd5df61?auto=format&fit=crop&w=600&q=80", // Sydney Opera House
  },
  {
    name: "United States",
    description: "Top-ranked universities and research opportunities",
    tuition: "$25,000 - $55,000/year",
    living: "$15,000 - $25,000/year",
    features: [
      "Flexible education system",
      "Diverse programs",
      "Innovation hub",
    ],
    image:
      "https://images.unsplash.com/photo-1543783207-c13fad267277?q=80&w=1470&auto=format&fit=crop", // Statue of Liberty
  },
  {
    name: "Canada",
    description: "Affordable education with immigration pathways",
    tuition: "$15,000 - $35,000/year",
    living: "$12,000 - $18,000/year",
    features: [
      "Post-graduation work permit",
      "Safe and welcoming",
      "Quality education",
    ],
    image:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=600&q=80", // CN Tower
  },
  {
    name: "Europe",
    description: "Affordable/free education with cultural diversity",
    tuition: "€0 - €20,000/year",
    living: "€8,000 - €15,000/year",
    features: [
      "Many programs in English",
      "Cultural experience",
      "Travel opportunities",
    ],
    image:
      "https://images.unsplash.com/photo-1511739001486-9608275626ba?auto=format&fit=crop&w=600&q=80", // Eiffel Tower
  },
  {
    name: "South Korea",
    description: "Advanced technology with scholarship opportunities",
    tuition: "$3,000 - $10,000/year",
    living: "$8,000 - $12,000/year",
    features: ["KGSP scholarships", "Tech industry", "Dynamic culture"],
    image:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&q=80", // Gyeongbokgung Palace
  },
  {
    name: "Japan",
    description: "Cutting-edge technology and traditional culture",
    tuition: "$5,000 - $12,000/year",
    living: "$10,000 - $15,000/year",
    features: ["MEXT scholarships", "Advanced technology", "Safe environment"],
    image:
      "https://images.unsplash.com/photo-1490806843928-2666d632c318?auto=format&fit=crop&w=600&q=80", // Mt Fuji
  },
];

export const MOCK_SCHOLARSHIPS = [
  {
    id: 1,
    title: "Global Excellence Scholarship",
    amount: "Up to $10,000",
    deadline: "2024-03-31",
    location: "Global",
    type: "Merit-based",
    description:
      "Awarded to high-achieving international students demonstrating academic excellence.",
    tags: ["Undergraduate", "Postgraduate"],
    status: "Active",
  },
  {
    id: 2,
    title: "STEM Future Leaders",
    amount: "Full Tuition",
    deadline: "2024-04-15",
    location: "USA, UK, Canada",
    type: "Subject-specific",
    description:
      "Supporting the next generation of leaders in Science, Technology, Engineering, and Math.",
    tags: ["Masters", "PhD", "research"],
    status: "Active",
  },
  {
    id: 3,
    title: "Women in Tech Grant",
    amount: "$5,000",
    deadline: "2024-05-01",
    location: "Europe",
    type: "Diversity",
    description:
      "Encouraging diversity in technology fields through financial support for female students.",
    tags: ["Undergraduate", "Computer Science"],
    status: "Active",
  },
  {
    id: 4,
    title: "East Africa Merit Award",
    amount: "Partial Funding",
    deadline: "2024-06-20",
    location: "East Africa",
    type: "Regional",
    description:
      "Specific opportunities for students from East African community member states.",
    tags: ["Any Degree"],
    status: "Active",
  },
  {
    id: 5,
    title: "Research Innovation Fellowship",
    amount: "$15,000 + Stipend",
    deadline: "Rolling",
    location: "South Korea",
    type: "Research",
    description:
      "For advanced research projects in partnership with leading Korean universities.",
    tags: ["PhD", "Post-doc"],
    status: "Active",
  },
  {
    id: 6,
    title: "Arts & Humanities Scholarship",
    amount: "$3,000",
    deadline: "2024-07-01",
    location: "UK",
    type: "Arts",
    description:
      "Supporting creative minds in pursuing degrees in arts, humanities, and social sciences.",
    tags: ["Bachelor", "Master"],
    status: "Active",
  },
];

export const MOCK_LIBRARY_RESOURCES = [
  {
    id: 1,
    title: "Introduction to Business Management",
    type: "E-book",
    author: "Dr. John Smith",
    year: "2023",
    pages: 452,
    category: "Business",
  },
  {
    id: 2,
    title: "Advanced Mathematics for Sciences",
    type: "E-book",
    author: "Prof. Maria Garcia",
    year: "2024",
    pages: 680,
    category: "Mathematics",
  },
  {
    id: 3,
    title: "Molecular Biology Research Methods",
    type: "Journal",
    author: "Multiple Authors",
    year: "2024",
    pages: 85,
    category: "Biology",
  },
  {
    id: 4,
    title: "Climate Change and East Africa",
    type: "Research Paper",
    author: "Dr. James Ochieng",
    year: "2023",
    pages: 45,
    category: "Environmental Science",
  },
];

export const MOCK_BLOGS = [
  {
    id: 1,
    title: "10 Tips for a Successful Visa Interview",
    category: "Visa Guide",
    date: "Jan 15, 2024",
    author: "Visa Team",
    excerpt:
      "Preparing for your student visa interview? Here are the top 10 tips to ensure you make a great impression and secure your visa.",
    image:
      "https://images.unsplash.com/photo-1569091791842-7cf9646552dd?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Top 5 Scholarships for African Students in 2024",
    category: "Scholarships",
    date: "Jan 10, 2024",
    author: "Scholarship Desk",
    excerpt:
      "Discover the most prestigious and fully funded scholarships available for African students looking to study abroad this year.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Life in South Korea: A Student's Perspective",
    category: "Student Life",
    date: "Jan 05, 2024",
    author: "Sarah M.",
    excerpt:
      "Sarah shares her experience of adapting to Korean culture, food, and university life as an international student.",
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2006&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Understanding the IELTS Exam Structure",
    category: "Exam Prep",
    date: "Dec 28, 2023",
    author: "Academic Team",
    excerpt:
      "Break down the four sections of the IELTS exam: Listening, Reading, Writing, and Speaking, with expert strategies for each.",
    image:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Why Study in Germany? Free Education Explained",
    category: "Study Destinations",
    date: "Dec 20, 2023",
    author: "EduBridge Team",
    excerpt:
      "Did you know public universities in Germany are tuition-free? Learn how you can access world-class education for free.",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Packing List for International Students",
    category: "Travel Guide",
    date: "Dec 15, 2023",
    author: "Student Support",
    excerpt:
      "Don't forget the essentials! Here is the ultimate packing checklist for students moving abroad for the first time.",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "The Benefits of Learning a Second Language",
    category: "Education",
    date: "Dec 10, 2023",
    author: "Language Dept",
    excerpt:
      "Learning a new language opens up career opportunities and enhances cognitive abilities. Here's why you should start today.",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "How to Write a Winning Statement of Purpose",
    category: "Application Tips",
    date: "Dec 05, 2023",
    author: "Admissions Coach",
    excerpt:
      "Your SOP is your story. Learn how to write a compelling narrative that convinces admissions officers you are the perfect candidate.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop",
  },
];

export const MOCK_MEDIA = [
  {
    id: 1,
    studentName: "Sarah Mitesio",
    university: "University of Toronto",
    country: "Canada",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop",
    testimony:
      "EduBridge made my dream of studying in Canada a reality. The visa process was smooth, and they guided me every step of the way.",
    program: "Computer Science",
  },
  {
    id: 2,
    studentName: "John Doe",
    university: "University of Melbourne",
    country: "Australia",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
    testimony:
      "I never thought I could get a scholarship to study in Australia. The team at EduBridge helped me find the perfect opportunity.",
    program: "Business Administration",
  },
  {
    id: 3,
    studentName: "Emily Davis",
    university: "Seoul National University",
    country: "South Korea",
    image:
      "https://images.unsplash.com/photo-1596423984534-722a944fb401?q=80&w=1964&auto=format&fit=crop",
    testimony:
      "Studying in Korea has been an amazing cultural experience. Thank you EduBridge for the support!",
    program: "International Relations",
  },
  {
    id: 4,
    studentName: "Michael Brown",
    university: "Technical University of Munich",
    country: "Germany",
    image:
      "https://images.unsplash.com/photo-1565034946487-077786996e27?q=80&w=2070&auto=format&fit=crop",
    testimony:
      "The guidance on German student visas was invaluable. I'm now pursuing my Masters in Engineering at a top university.",
    program: "Mechanical Engineering",
  },
  {
    id: 5,
    studentName: "Lisa Wang",
    university: "University of Manchester",
    country: "UK",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049&auto=format&fit=crop",
    testimony:
      "From application to arrival, EduBridge was there. The pre-departure orientation really helped me prepare for life in the UK.",
    program: "Psychology",
  },
  {
    id: 6,
    studentName: "David Kim",
    university: "University of Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1624813583594-526cb3b925b9?q=80&w=1934&auto=format&fit=crop",
    testimony:
      "Highly recommend EduBridge for anyone looking to study in Asia. They have great connections and knowledge.",
    program: "Robotics",
  },
];

export const MOCK_PARTNERS = [
  {
    id: 1,
    name: "Kyungsung University",
    enName: "Kyungsung University",
    logo: "https://ui-avatars.com/api/?name=Kyungsung+University&background=1e40af&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    id: 2,
    name: "Geoje University",
    enName: "Geoje University",
    logo: "https://ui-avatars.com/api/?name=Geoje+University&background=2563eb&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    id: 3,
    name: "Seoul Theological",
    enName: "Seoul Theological Univ",
    logo: "https://ui-avatars.com/api/?name=Seoul+Theological&background=7c3aed&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    id: 4,
    name: "Gangseo University",
    enName: "Gangseo University",
    logo: "https://ui-avatars.com/api/?name=Gangseo+University&background=dc2626&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    id: 5,
    name: "Indu University",
    enName: "Indu University",
    logo: "https://ui-avatars.com/api/?name=Indu+University&background=059669&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    id: 6,
    name: "Calvin University",
    enName: "Calvin University",
    logo: "https://ui-avatars.com/api/?name=Calvin+University&background=ea580c&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    id: 7,
    name: "Daejin University",
    enName: "Daejin University",
    logo: "https://ui-avatars.com/api/?name=Daejin+University&background=0891b2&color=fff&size=128&bold=true",
    badge: "BEST",
    type: "D-2",
  },
  {
    id: 8,
    name: "Soongsil University",
    enName: "Soongsil University",
    logo: "https://ui-avatars.com/api/?name=Soongsil+University&background=be123c&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-2",
  },
  {
    id: 9,
    name: "Tongwon University",
    enName: "Tongwon University",
    logo: "https://ui-avatars.com/api/?name=Tongwon+University&background=4f46e5&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
  {
    id: 10,
    name: "Seoul Theological",
    enName: "STU - VIET NAM",
    logo: "https://ui-avatars.com/api/?name=STU+VIETNAM&background=16a34a&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
  {
    id: 11,
    name: "Chungbuk Health",
    enName: "Chungbuk Health Science",
    logo: "https://ui-avatars.com/api/?name=Chungbuk+Health&background=0369a1&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
  {
    id: 12,
    name: "Seoul Theological",
    enName: "STU",
    logo: "https://ui-avatars.com/api/?name=Seoul+Theological&background=7c3aed&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
  {
    id: 13,
    name: "Seoul Women Univ",
    enName: "Seoul Women's Univ",
    logo: "https://ui-avatars.com/api/?name=Seoul+Women&background=db2777&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
  {
    id: 14,
    name: "Kwang Woon",
    enName: "Kwang Woon Univ",
    logo: "https://ui-avatars.com/api/?name=Kwang+Woon&background=0d9488&color=fff&size=128&bold=true",
    badge: "NEW",
    type: "D-4-1",
  },
];

/**
 * MOCK_UNIFIED_APPLICATIONS (The DTO)
 * This represents the joined view of APPLICATION_TRACKER, IDENTITY, USER,
 * DEPARTMENT_MAJOR_APPLICATION, INSTITUTION, and SYSTEM_FILES.
 * Backend equivalent: GET /api/admin/tracker
 */
export const MOCK_UNIFIED_APPLICATIONS = [
  {
    trackerId: "APP-1771461317295-608",
    applicationId: 101,
    submissionDate: "2026-02-19T10:30:00Z",
    status: "Reviewing",

    applicant: {
      identityId: 1,
      firstName: "Prince",
      lastName: "Cuthbert",
      email: "princecuth@gmail.com",
      phone: "+250798697800",
    },

    programDetails: {
      universityName: "Daegu Arts University",
      majorName: "Architecture Interior Design",
    },

    trackerStages: [
      { stage: "Submitted", completed: true, date: "2026-02-19" },
      { stage: "Under Review", completed: true, date: "2026-02-20" },
      { stage: "Decision", completed: false, date: null },
      { stage: "Enrolled", completed: false, date: null },
    ],

    documents: [
      {
        fileId: 1,
        fileName: "ClassDiagram.png",
        size: "313.2 KB",
        uploadDate: "2026-02-19",
      },
      {
        fileId: 2,
        fileName: "Edu Bridge Sequence Flow.jpg",
        size: "55.0 KB",
        uploadDate: "2026-02-19",
      },
    ],
  },
  {
    trackerId: "APP-2024-001",
    applicationId: 102,
    submissionDate: "2026-02-01T09:15:00Z",
    status: "Pending",

    applicant: {
      identityId: 2,
      firstName: "Alice",
      lastName: "Mutesi",
      email: "alice@example.com",
      phone: "+250788123456",
    },

    programDetails: {
      universityName: "Daegu Arts University",
      majorName: "Fine Arts",
    },

    trackerStages: [
      { stage: "Submitted", completed: true, date: "2026-02-01" },
      { stage: "Under Review", completed: false, date: null },
      { stage: "Decision", completed: false, date: null },
      { stage: "Enrolled", completed: false, date: null },
    ],

    documents: [
      {
        fileId: 3,
        fileName: "Passport.pdf",
        size: "1.2 MB",
        uploadDate: "2026-02-01",
      },
      {
        fileId: 4,
        fileName: "Transcript.pdf",
        size: "3.4 MB",
        uploadDate: "2026-02-01",
      },
    ],
  },
];
