/**
 * applicationTimelines.js — APPLICATION_TIMELINE entity (Priority 5)
 * Schema: APPLICATION_TIMELINE { id, student_id, app_program_id, status1, status2, file_del_app_tl_fc, timestamp }
 *
 * This is PER-STUDENT tracking, not per-program.
 * Each record = one step in a student's application journey for a specific program.
 *
 * Backend: GET /api/students/:id/timeline → student's full history
 *          GET /api/applications/:id/timeline → timeline for one application
 */
export const MOCK_APP_TIMELINES = [
  // --- John Doe (student_01) — APP-2024-004 (Daegu Arts, Approved) ---
  { id: 1, student_id: "student_01", application_id: "APP-2024-004", app_program_id: 1,
    status1: "Submitted",    status2: "On Time",              timestamp: "2024-02-02T08:00:00Z", note: "Application received" },
  { id: 2, student_id: "student_01", application_id: "APP-2024-004", app_program_id: 1,
    status1: "Under Review", status2: "Documents Verified",   timestamp: "2024-02-08T10:00:00Z", note: "All documents cleared" },
  { id: 3, student_id: "student_01", application_id: "APP-2024-004", app_program_id: 1,
    status1: "Decision",     status2: "Approved",             timestamp: "2024-02-15T14:00:00Z", note: "Congratulations! Application approved." },
  { id: 4, student_id: "student_01", application_id: "APP-2024-004", app_program_id: 1,
    status1: "Enrolled",     status2: "Registered",           timestamp: "2024-03-01T09:00:00Z", note: "Student registered for semester" },

  // --- John Doe (student_01) — APP-2024-001 (duplicate entry for different app) ---
  { id: 5, student_id: "student_01", application_id: "APP-2024-001", app_program_id: 1,
    status1: "Submitted",    status2: "Pending Review",       timestamp: "2024-02-01T09:15:00Z", note: "Application queued" },

  // --- David Kwizera (student_02) — APP-2024-002 (Tongmyong, Reviewing) ---
  { id: 6, student_id: "student_02", application_id: "APP-2024-002", app_program_id: 2,
    status1: "Submitted",    status2: "On Time",              timestamp: "2024-01-28T14:30:00Z", note: "Application received" },
  { id: 7, student_id: "student_02", application_id: "APP-2024-002", app_program_id: 2,
    status1: "Under Review", status2: "Documents Requested",  timestamp: "2024-02-05T09:00:00Z", note: "Awaiting bank statement" },

  // --- Sarah Uwase (student_03) — APP-2024-003 (Seoul Women's, Needs Changes) ---
  { id: 8, student_id: "student_03", application_id: "APP-2024-003", app_program_id: 3,
    status1: "Submitted",    status2: "On Time",              timestamp: "2024-01-25T11:00:00Z", note: "Application received" },
  { id: 9, student_id: "student_03", application_id: "APP-2024-003", app_program_id: 3,
    status1: "Under Review", status2: "In Progress",          timestamp: "2024-02-01T10:00:00Z", note: "Documents under evaluation" },
  { id: 10, student_id: "student_03", application_id: "APP-2024-003", app_program_id: 3,
    status1: "Decision",     status2: "Changes Required",     timestamp: "2024-02-10T16:00:00Z", note: "Transcript needs official stamp" },
];

/**
 * Helper: get timeline entries for a specific application
 */
export function getApplicationTimeline(applicationId) {
  return MOCK_APP_TIMELINES.filter(t => t.application_id === applicationId);
}

/**
 * Helper: get all timeline entries for a student
 */
export function getStudentTimeline(studentId) {
  return MOCK_APP_TIMELINES.filter(t => t.student_id === studentId);
}
