export const MOCK_PROGRAMS = [
  {
    id: 1,
    universityName: 'Daegu Arts University',
    visaType: 'D-2',
    tags: ['ON SALE', 'BEST'],
    country: 'South Korea',
    description: 'Daegu Arts University (DGAU), located in Chilgok County near Daegu, South Korea, is a private institution specialized in fine arts, design, and practical art education. It focuses on fostering creative professionals through industry-tailored curricula and student-oriented support programs.',
    tuition: '$100.00', // Application fee or tuition placeholder
    logo: 'https://ui-avatars.com/api/?name=Daegu+Arts&background=E11D48&color=fff&size=128',
    images: [
      'https://images.unsplash.com/photo-1525921429649-4a2336280620?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80'
    ],
    departments: [
      'Arts Therapy', 'Piano Pedagogy', 'Fashion Design',
      'Practical Dance', 'Jazz & Commercial Music', 'Digital Animation',
      'Security Service & Management', 'Music & Performing Arts', 'Visual Communication Design',
      'Social Sports', 'Beauty Arts', 'Photography & Related Media',
      'Contemporary Christian Music', 'Architecture Interior Design'
    ],
    timeline: [
      { step: 'Document reception', date: '01th~23th of December' },
      { step: 'Application reception', date: '24th~30th of December' },
      { step: 'Announcement of admitted applicants', date: '12th of January' },
      { step: 'Issue of admission certificate', date: '12th of January ~ 28th of Feb.' },
      { step: 'Registration', date: '29st of January ~2st of February' }
    ],
    requiredDocuments: [
      'Application (prescribed form)', 'Photograph (3cm x 4cm) 2', 'Resume (prescribed form)',
      'References (one Korean and one of same country)', 'Certificate of high school graduation', 'School records at third countries',
      'Pledge for expense payment', 'School records for all courses', 'Certificate of high school qualification'
    ],
    status: 'Active'
  },
  {
    id: 2,
    universityName: 'Tongmyong University',
    visaType: 'D-4',
    tags: ['NEW', 'ON SALE'],
    country: 'South Korea',
    description: 'Leading university in Busan with strong industry connections and practical training programs.',
    tuition: '$150.00',
    logo: 'https://ui-avatars.com/api/?name=Tongmyong&background=2563EB&color=fff&size=128',
    departments: ['Korean Language', 'International Studies', 'Business Administration'],
    timeline: [
      { step: 'Application Period', date: 'Aug 01 - Aug 31' },
      { step: 'Interview', date: 'Sep 15' },
      { step: 'Result Announcement', date: 'Sep 30' }
    ],
    status: 'Active',
    images: []
  },
  {
    id: 3,
    universityName: 'Seoul Women\'s University',
    visaType: 'D-2',
    tags: ['BEST'],
    country: 'South Korea',
    description: 'Prestigious women\'s university in Seoul focusing on leadership and innovation.',
    tuition: '$120.00',
    logo: 'https://ui-avatars.com/api/?name=SWU&background=D946EF&color=fff&size=128',
    departments: ['Computer Science', 'Digital Media', 'Information Security'],
    timeline: [
      { step: 'Application', date: 'Oct 01 - Oct 20' },
      { step: 'Document Review', date: 'Oct 25 - Nov 05' },
      { step: 'Final Result', date: 'Nov 20' }
    ],
    status: 'Active',
    images: []
  }
];

export const MOCK_SCHOLARSHIPS = [
  {
    id: 1,
    title: "Global Excellence Scholarship",
    amount: "Up to $10,000",
    deadline: "2024-03-31",
    location: "Global",
    type: "Merit-based",
    description: "Awarded to high-achieving international students demonstrating academic excellence.",
    tags: ["Undergraduate", "Postgraduate"],
    status: "Active"
  },
  {
    id: 2,
    title: "STEM Future Leaders",
    amount: "Full Tuition",
    deadline: "2024-04-15",
    location: "USA, UK, Canada",
    type: "Subject-specific",
    description: "Supporting the next generation of leaders in Science, Technology, Engineering, and Math.",
    tags: ["Masters", "PhD", "research"],
    status: "Active"
  },
  {
    id: 3,
    title: "Women in Tech Grant",
    amount: "$5,000",
    deadline: "2024-05-01",
    location: "Europe",
    type: "Diversity",
    description: "Encouraging diversity in technology fields through financial support for female students.",
    tags: ["Undergraduate", "Computer Science"],
    status: "Active"
  },
  {
    id: 4,
    title: "East Africa Merit Award",
    amount: "Partial Funding",
    deadline: "2024-06-20",
    location: "East Africa",
    type: "Regional",
    description: "Specific opportunities for students from East African community member states.",
    tags: ["Any Degree"],
    status: "Active"
  },
  {
    id: 5,
    title: "Research Innovation Fellowship",
    amount: "$15,000 + Stipend",
    deadline: "Rolling",
    location: "South Korea",
    type: "Research",
    description: "For advanced research projects in partnership with leading Korean universities.",
    tags: ["PhD", "Post-doc"],
    status: "Active"
  },
  {
    id: 6,
    title: "Arts & Humanities Scholarship",
    amount: "$3,000",
    deadline: "2024-07-01",
    location: "UK",
    type: "Arts",
    description: "Supporting creative minds in pursuing degrees in arts, humanities, and social sciences.",
    tags: ["Bachelor", "Master"],
    status: "Active"
  }
];

export const MOCK_LIBRARY_RESOURCES = [
  {
    id: 1,
    title: 'Introduction to Business Management',
    type: 'E-book',
    author: 'Dr. John Smith',
    year: '2023',
    pages: 452,
    category: 'Business'
  },
  {
    id: 2,
    title: 'Advanced Mathematics for Sciences',
    type: 'E-book',
    author: 'Prof. Maria Garcia',
    year: '2024',
    pages: 680,
    category: 'Mathematics'
  },
  {
    id: 3,
    title: 'Molecular Biology Research Methods',
    type: 'Journal',
    author: 'Multiple Authors',
    year: '2024',
    pages: 85,
    category: 'Biology'
  },
  {
    id: 4,
    title: 'Climate Change and East Africa',
    type: 'Research Paper',
    author: 'Dr. James Ochieng',
    year: '2023',
    pages: 45,
    category: 'Environmental Science'
  }
];

export const MOCK_BLOGS = [
  {
    id: 1,
    title: "10 Tips for a Successful Visa Interview",
    category: "Visa Guide",
    date: "Jan 15, 2024",
    author: "Visa Team",
    excerpt: "Preparing for your student visa interview? Here are the top 10 tips to ensure you make a great impression and secure your visa.",
    image: "https://images.unsplash.com/photo-1576267423445-807c4d3d8551?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    title: "Top 5 Scholarships for African Students in 2024",
    category: "Scholarships",
    date: "Jan 10, 2024",
    author: "Scholarship Desk",
    excerpt: "Discover the most prestigious and fully funded scholarships available for African students looking to study abroad this year.",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    title: "Life in South Korea: A Student's Perspective",
    category: "Student Life",
    date: "Jan 05, 2024",
    author: "Sarah M.",
    excerpt: "Sarah shares her experience of adapting to Korean culture, food, and university life as an international student.",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    title: "Understanding the IELTS Exam Structure",
    category: "Exam Prep",
    date: "Dec 28, 2023",
    author: "Academic Team",
    excerpt: "Break down the four sections of the IELTS exam: Listening, Reading, Writing, and Speaking, with expert strategies for each.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 5,
    title: "Why Study in Germany? Free Education Explained",
    category: "Study Destinations",
    date: "Dec 20, 2023",
    author: "EduBridge Team",
    excerpt: "Did you know public universities in Germany are tuition-free? Learn how you can access world-class education for free.",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    title: "Packing List for International Students",
    category: "Travel Guide",
    date: "Dec 15, 2023",
    author: "Student Support",
    excerpt: "Don't forget the essentials! Here is the ultimate packing checklist for students moving abroad for the first time.",
    image: "https://images.unsplash.com/photo-1565514020176-dbf2277aa768?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 7,
    title: "The Benefits of Learning a Second Language",
    category: "Education",
    date: "Dec 10, 2023",
    author: "Language Dept",
    excerpt: "Learning a new language opens up career opportunities and enhances cognitive abilities. Here's why you should start today.",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 8,
    title: "How to Write a Winning Statement of Purpose",
    category: "Application Tips",
    date: "Dec 05, 2023",
    author: "Admissions Coach",
    excerpt: "Your SOP is your story. Learn how to write a compelling narrative that convinces admissions officers you are the perfect candidate.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=60"
  }
];

export const MOCK_MEDIA = [
  {
    id: 1,
    studentName: "Sarah Mitesio",
    university: "University of Toronto",
    country: "Canada",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop",
    testimony: "EduBridge made my dream of studying in Canada a reality. The visa process was smooth, and they guided me every step of the way.",
    program: "Computer Science"
  },
  {
    id: 2,
    studentName: "John Doe",
    university: "University of Melbourne",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop",
    testimony: "I never thought I could get a scholarship to study in Australia. The team at EduBridge helped me find the perfect opportunity.",
    program: "Business Administration"
  },
  {
    id: 3,
    studentName: "Emily Davis",
    university: "Seoul National University",
    country: "South Korea",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1449&auto=format&fit=crop",
    testimony: "Studying in Korea has been an amazing cultural experience. Thank you EduBridge for the support!",
    program: "International Relations"
  },
   {
    id: 4,
    studentName: "Michael Brown",
    university: "Technical University of Munich",
    country: "Germany",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1470&auto=format&fit=crop",
    testimony: "The guidance on German student visas was invaluable. I'm now pursuing my Masters in Engineering at a top university.",
    program: "Mechanical Engineering"
  },
  {
    id: 5,
    studentName: "Lisa Wang",
    university: "University of Manchester",
    country: "UK",
    image: "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=1470&auto=format&fit=crop",
    testimony: "From application to arrival, EduBridge was there. The pre-departure orientation really helped me prepare for life in the UK.",
    program: "Psychology"
  },
  {
    id: 6,
    studentName: "David Kim",
    university: "University of Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop",
    testimony: "Highly recommend EduBridge for anyone looking to study in Asia. They have great connections and knowledge.",
    program: "Robotics"
  }
];
