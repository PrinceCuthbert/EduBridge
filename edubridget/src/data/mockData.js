export const MOCK_PROGRAMS = [
  // --- Program 1 ---
  {
    id: 1,
    universityName: "Daegu Arts University",
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
    // Structured departments: each row = one program track
    departments: [
      { language: "English", degree: "B.A.", major: "Arts Therapy",               duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOEFL / IELTS" },
      { language: "English", degree: "B.A.", major: "Fashion Design",             duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOEFL / IELTS" },
      { language: "English", degree: "B.A.", major: "Digital Animation",          duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOEFL / IELTS" },
      { language: "Korean",  degree: "B.A.", major: "Piano Pedagogy",             duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOPIK Level 3+" },
      { language: "Korean",  degree: "B.A.", major: "Jazz & Commercial Music",    duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOPIK Level 3+" },
      { language: "Korean",  degree: "B.A.", major: "Visual Communication Design",duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOPIK Level 3+" },
    ],
    // Structured timeline: each row = one application stage
    timeline: [
      { stage: "Stage 1",    registrationStart: "2025-12-01", registrationEnd: "2025-12-23", examDate: "2025-12-26", resultDate: "2026-01-12" },
      { stage: "Stage 2",    registrationStart: "2025-12-24", registrationEnd: "2025-12-30", examDate: "2026-01-05", resultDate: "2026-01-12" },
      { stage: "Registration", registrationStart: "2026-01-29", registrationEnd: "2026-02-02", examDate: "—",        resultDate: "—" },
    ],
    // Tuition fees per degree level
    tuitionFees: [
      { level: "Bachelor's", item: "Entrance Fee (one-time)",    amount: "300,000 KRW" },
      { level: "Bachelor's", item: "Tuition (per semester)",     amount: "2,500,000 KRW" },
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
        items: [
          "Letter of Reference (one from Korea, one from home country)",
        ],
      },
    ],
    status: "Active",
    applicationLink: "https://docs.google.com/forms",
    applicationFile: null,
  },

  // --- Program 2 ---
  {
    id: 2,
    universityName: "Tongmyong University",
    visaType: "D-4",
    tags: ["NEW", "ON SALE"],
    country: "South Korea",
    location: "Busan",
    description:
      "Leading university in Busan with strong industry connections and practical training programs.",
    logo: "https://ui-avatars.com/api/?name=Tongmyong&background=2563EB&color=fff&size=128",
    images: [],
    departments: [
      { language: "Korean",  degree: "Certificate", major: "Korean Language",         duration: "1 year / 2 semesters",  credits: "60 credits",  languageRequirement: "None (beginner welcome)" },
      { language: "English", degree: "B.A.",        major: "International Studies",    duration: "4 years / 8 semesters", credits: "130 credits", languageRequirement: "TOEFL 80+ / IELTS 6.0+" },
      { language: "English", degree: "B.B.A.",      major: "Business Administration",  duration: "4 years / 8 semesters", credits: "130 credits", languageRequirement: "TOEFL 80+ / IELTS 6.0+" },
    ],
    timeline: [
      { stage: "Stage 1", registrationStart: "2025-08-01", registrationEnd: "2025-08-31", examDate: "2025-09-10", resultDate: "2025-09-15" },
      { stage: "Stage 2", registrationStart: "2025-09-01", registrationEnd: "2025-09-20", examDate: "2025-09-28", resultDate: "2025-09-30" },
    ],
    tuitionFees: [
      { level: "Certificate", item: "Entrance Fee (one-time)",  amount: "200,000 KRW" },
      { level: "Certificate", item: "Tuition (per semester)",   amount: "1,800,000 KRW" },
      { level: "Bachelor's",  item: "Entrance Fee (one-time)",  amount: "300,000 KRW" },
      { level: "Bachelor's",  item: "Tuition (per semester)",   amount: "2,200,000 KRW" },
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
    applicationFile: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    applicationLink: null,
  },

  // --- Program 3 ---
  {
    id: 3,
    universityName: "Seoul Women's University",
    visaType: "D-2",
    tags: ["BEST"],
    country: "South Korea",
    location: "Nowon-gu, Seoul",
    description:
      "Prestigious women's university in Seoul focusing on leadership and innovation.",
    logo: "https://ui-avatars.com/api/?name=SWU&background=D946EF&color=fff&size=128",
    images: [],
    departments: [
      { language: "English", degree: "B.Sc.", major: "Computer Science",    duration: "4 years / 8 semesters", credits: "135 credits", languageRequirement: "TOEFL 85+ / IELTS 6.5+" },
      { language: "English", degree: "B.A.",  major: "Digital Media",       duration: "4 years / 8 semesters", credits: "130 credits", languageRequirement: "TOEFL 80+ / IELTS 6.0+" },
      { language: "Korean",  degree: "B.Sc.", major: "Information Security", duration: "4 years / 8 semesters", credits: "135 credits", languageRequirement: "TOPIK Level 4+" },
    ],
    timeline: [
      { stage: "Stage 1", registrationStart: "2025-10-01", registrationEnd: "2025-10-20", examDate: "2025-10-27", resultDate: "2025-11-05" },
      { stage: "Stage 2", registrationStart: "2025-10-25", registrationEnd: "2025-11-05", examDate: "2025-11-15", resultDate: "2025-11-20" },
    ],
    tuitionFees: [
      { level: "Bachelor's", item: "Entrance Fee (one-time)",  amount: "400,000 KRW" },
      { level: "Bachelor's", item: "Tuition (per semester)",   amount: "2,800,000 KRW" },
      { level: "Master's",   item: "Entrance Fee (one-time)",  amount: "500,000 KRW" },
      { level: "Master's",   item: "Tuition (per semester)",   amount: "3,200,000 KRW" },
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

export const MOCK_APPLICATIONS = [
  {
    id: "APP-2024-001",
    studentName: "Alice Mutesi",
    scholarship: "Global Excellence Scholarship",
    programId: "1", 
    date: "2024-02-01",
    status: "Pending",
    email: "alice@example.com",
    documents: ["Passport.pdf", "Transcript.pdf"],
    firstName: "Alice",
    lastName: "Mutesi",
    description: "I am highly motivated to study...",
    paperTitle: "Impact of AI in Education"
  },
  {
    id: "APP-2024-002",
    studentName: "David Kwizera",
    scholarship: "DAAD Master Studies",
    programId: "2",
    date: "2024-01-28",
    status: "Reviewing",
    email: "david@example.com",
    documents: ["Passport.pdf"],
    firstName: "David",
    lastName: "Kwizera",
    description: "Seeking to expand my knowledge in...",
    paperTitle: "Sustainable Energy Solutions"
  },
  {
    id: "APP-2024-003", 
    studentName: "Sarah Uwase",
    scholarship: "Fullbright Program",
    programId: "3",
    date: "2024-01-25",
    status: "Needs Changes",
    email: "sarah@example.com",
    documents: ["Passport.pdf"],
    firstName: "Sarah",
    lastName: "Uwase",
    description: "Passionate about public health...",
    paperTitle: "Community Health Initiatives"
  },
  {
    id: "APP-2024-004",
    studentName: "John Doe",
    scholarship: "Global Excellence Scholarship",
    programId: "1",
    date: "2024-02-02",
    status: "Approved",
    email: "john@example.com",
    documents: ["Passport.pdf"],
    firstName: "John",
    lastName: "Doe",
    description: "Experienced researcher...",
    paperTitle: "Advanced Machine Learning"
  },
];


export  const applications = [
    {
      id: "CAM001234",
      university: "University of Cambridge",
      program: "MPhil in Advanced Computer Science",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg/1200px-Coat_of_Arms_of_the_University_of_Cambridge.svg.png",
      date: "2023-01-15",
      status: "Accepted",
      statusColor: "bg-green-50 text-green-700 border-green-100",
    },
    {
      id: "OXF005678",
      university: "University of Oxford",
      program: "MSc in Financial Economics",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Coat_of_arms_of_the_University_of_Oxford.svg/1200px-Coat_of_arms_of_the_University_of_Oxford.svg.png",
      date: "2023-02-20",
      status: "Under Review",
      statusColor: "bg-orange-50 text-orange-700 border-orange-100",
    },
    {
      id: "LSE009012",
      university: "London School of Economics",
      program: "MSc in International Relations",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/42/LSE_Coat_of_Arms.svg/1200px-LSE_Coat_of_Arms.svg.png",
      date: "2023-03-10",
      status: "Under Review",
      statusColor: "bg-orange-50 text-orange-700 border-orange-100",
    },
    {
      id: "IMP003456",
      university: "Imperial College London",
      program: "MEng Aeronautical Engineering",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shield_of_Imperial_College_London.svg/1200px-Shield_of_Imperial_College_London.svg.png",
      date: "2023-04-01",
      status: "Declined",
      statusColor: "bg-red-50 text-red-700 border-red-100",
    },
    {
      id: "UCL007890",
      university: "University College London",
      program: "BSc Computer Science",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/University_College_London_coat_of_arms.svg/1200px-University_College_London_coat_of_arms.svg.png",
      date: "2023-04-25",
      status: "Under Review",
      statusColor: "bg-orange-50 text-orange-700 border-orange-100",
    },
  ];