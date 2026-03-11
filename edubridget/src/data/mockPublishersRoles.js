/**
 * mockPublishers.js — PUBLISHERS entity (Priority 7)
 * Schema: PUBLISHERS { id, submission_name }
 *
 * A Publisher is the entity that owns/publishes a PROGRAM.
 * PROGRAMS reference publisher_id → PUBLISHERS.id
 *
 * Backend: GET /api/publishers → returns this list
 *          Admin CMS: POST /api/publishers { submission_name }
 */
export const MOCK_PUBLISHERS = [
  {
    id: 1,
    submission_name: "TM EduBridge",
    description: "Main EduBridge publishing arm — responsible for all Korean university programs.",
    contact_email: "programs@edubridge.africa",
    active: true,
    created_at: "2023-01-01",
  },
  {
    id: 2,
    submission_name: "EduBridge Vietnam",
    description: "Vietnam regional office programs.",
    contact_email: "vietnam@edubridge.africa",
    active: true,
    created_at: "2023-06-01",
  },
];

/**
 * mockPollQuestions.js — POLL_QUESTION entity (Priority 8)
 * Schema: POLL_QUESTION { id, cat_id (category), program_id }
 *
 * Poll questions are pre-application assessments tied to a program.
 * Backend: GET /api/programs/:id/poll-questions
 */
export const MOCK_POLL_QUESTIONS = [
  {
    id: 1,
    program_id: 1,   // Daegu Arts University
    cat_id: 1,       // Category: Language Proficiency
    question: "What is your current Korean language level?",
    options: ["None", "Beginner (TOPIK 1-2)", "Intermediate (TOPIK 3-4)", "Advanced (TOPIK 5-6)"],
    type: "single-choice",
  },
  {
    id: 2,
    program_id: 1,
    cat_id: 2,       // Category: Academic Background
    question: "What is your highest completed education level?",
    options: ["High School", "Certificate/Diploma", "Bachelor's", "Master's"],
    type: "single-choice",
  },
  {
    id: 3,
    program_id: 2,   // Tongmyong University
    cat_id: 1,
    question: "Do you have an English proficiency certificate?",
    options: ["No", "TOEFL (below 79)", "TOEFL 80+", "IELTS 6.0+"],
    type: "single-choice",
  },
];

/**
 * MOCK_ROLES — ROLES entity (Priority 9)
 * Schema: ROLES { id, name }
 *
 * Currently roles are hardcoded strings ('admin', 'student') in AuthContext.
 * This should eventually replace hardcoded role checks with DB-driven role IDs.
 *
 * Backend: GET /api/roles
 *          Admin: POST /api/users/:id/role { role_id }
 */
export const MOCK_ROLES = [
  { id: 1, name: "admin",   description: "Full system access. Can manage all content, users, and applications." },
  { id: 2, name: "student", description: "Can browse programs, submit applications, and track visa status." },
  { id: 3, name: "staff",   description: "Can review applications and update statuses. No admin access." },
];
