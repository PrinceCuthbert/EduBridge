/**
 * MOCK_MAJORS — standalone MAJOR entity
 * Schema: MAJOR table { id, name, country, language, description, created_at }
 *
 * Backend: GET /api/majors  → returns this list
 * Previously: these were embedded arrays inside each MOCK_PROGRAMS[].departments[]
 * Now they are independent records, joinable via MOCK_DEPARTMENT_MAJORS
 */
export const MOCK_MAJORS = [
  // --- Arts & Design (used by Daegu Arts University) ---
  { id: 1,  name: "Arts Therapy",               country: "South Korea", language: "english", description: "Therapeutic use of visual art forms.",       created_at: "2024-01-01" },
  { id: 2,  name: "Fashion Design",              country: "South Korea", language: "english", description: "Creative and technical fashion design.",      created_at: "2024-01-01" },
  { id: 3,  name: "Digital Animation",           country: "South Korea", language: "english", description: "2D/3D digital animation and VFX.",            created_at: "2024-01-01" },
  { id: 4,  name: "Piano Pedagogy",              country: "South Korea", language: "korean",  description: "Music education focused on piano teaching.", created_at: "2024-01-01" },
  { id: 5,  name: "Jazz & Commercial Music",     country: "South Korea", language: "korean",  description: "Jazz performance and commercial music.",      created_at: "2024-01-01" },
  { id: 6,  name: "Visual Communication Design", country: "South Korea", language: "korean",  description: "Graphic, brand, and UX design.",             created_at: "2024-01-01" },

  // --- Language & Business (used by Tongmyong University) ---
  { id: 7,  name: "Korean Language",             country: "South Korea", language: "korean",  description: "Korean language immersion program.",         created_at: "2024-01-01" },
  { id: 8,  name: "International Studies",        country: "South Korea", language: "english", description: "Global politics, economics, and culture.",   created_at: "2024-01-01" },
  { id: 9,  name: "Business Administration",      country: "South Korea", language: "english", description: "Management, finance, and strategy.",         created_at: "2024-01-01" },

  // --- Technology (used by Seoul Women's University) ---
  { id: 10, name: "Computer Science",            country: "South Korea", language: "english", description: "Algorithms, systems, and software.",          created_at: "2024-01-01" },
  { id: 11, name: "Digital Media",               country: "South Korea", language: "english", description: "Digital content, broadcasting, and media.",  created_at: "2024-01-01" },
  { id: 12, name: "Information Security",        country: "South Korea", language: "korean",  description: "Cybersecurity and network protection.",       created_at: "2024-01-01" },
];

/**
 * MOCK_DEPARTMENT_MAJORS — join table between PROGRAM departments and MAJOR
 * Schema: DEPARTMENT_MAJOR table { id, department_id (≈ program_id), major_id }
 *
 * Backend: GET /api/programs/:id/majors  → joins via this table
 *
 * Each entry links one program (department_id) to one major (major_id),
 * and adds the degree, duration, credits, and language requirement
 * (these are attributes of the offering, not the major itself).
 */
export const MOCK_DEPARTMENT_MAJORS = [
  // Program 1: Daegu Arts University
  { id: 1,  program_id: 1, major_id: 1,  degree: "B.A.", duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOEFL / IELTS" },
  { id: 2,  program_id: 1, major_id: 2,  degree: "B.A.", duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOEFL / IELTS" },
  { id: 3,  program_id: 1, major_id: 3,  degree: "B.A.", duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOEFL / IELTS" },
  { id: 4,  program_id: 1, major_id: 4,  degree: "B.A.", duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOPIK Level 3+" },
  { id: 5,  program_id: 1, major_id: 5,  degree: "B.A.", duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOPIK Level 3+" },
  { id: 6,  program_id: 1, major_id: 6,  degree: "B.A.", duration: "4 years / 8 semesters", credits: "140 credits", languageRequirement: "TOPIK Level 3+" },

  // Program 2: Tongmyong University
  { id: 7,  program_id: 2, major_id: 7,  degree: "Certificate", duration: "1 year / 2 semesters",  credits: "60 credits",  languageRequirement: "None (beginner welcome)" },
  { id: 8,  program_id: 2, major_id: 8,  degree: "B.A.",        duration: "4 years / 8 semesters", credits: "130 credits", languageRequirement: "TOEFL 80+ / IELTS 6.0+" },
  { id: 9,  program_id: 2, major_id: 9,  degree: "B.B.A.",      duration: "4 years / 8 semesters", credits: "130 credits", languageRequirement: "TOEFL 80+ / IELTS 6.0+" },

  // Program 3: Seoul Women's University
  { id: 10, program_id: 3, major_id: 10, degree: "B.Sc.", duration: "4 years / 8 semesters", credits: "135 credits", languageRequirement: "TOEFL 85+ / IELTS 6.5+" },
  { id: 11, program_id: 3, major_id: 11, degree: "B.A.",  duration: "4 years / 8 semesters", credits: "130 credits", languageRequirement: "TOEFL 80+ / IELTS 6.0+" },
  { id: 12, program_id: 3, major_id: 12, degree: "B.Sc.", duration: "4 years / 8 semesters", credits: "135 credits", languageRequirement: "TOPIK Level 4+" },
];

/**
 * Helper: get all majors offered by a program (with their offering details)
 * Usage: getProgramMajors(1) → array of { ...major, degree, duration, credits, languageRequirement }
 *
 * Backend equivalent: GET /api/programs/:programId/majors
 */
export function getProgramMajors(programId) {
  return MOCK_DEPARTMENT_MAJORS
    .filter(dm => dm.program_id === programId)
    .map(dm => {
      const major = MOCK_MAJORS.find(m => m.id === dm.major_id);
      return { ...major, ...dm };
    });
}
