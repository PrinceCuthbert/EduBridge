/**
 * fileRecords.js — FILE entity (Priority 10)
 * Schema: FILE { id, user_id, amount, country, status, created_at, updated_at }
 *
 * The FILE entity is dual-purpose in the EduBridge schema:
 *   1. As a document upload (referenced by SCHOLARSHIP_APPLICATION_CHECKLIST)
 *   2. As a payment/financial record (amount + country + status = payment receipt/tracking)
 *
 * This file represents interpretation (2): financial file records.
 *
 * Backend: GET /api/files → admin sees all; GET /api/users/:id/files → student's own
 */
export const MOCK_FILE_RECORDS = [
  {
    id: 1,
    user_id: "student_01",
    studentName: "John Doe",
    amount: "150.00",
    currency: "USD",
    country: "Rwanda",
    status: "Paid",
    description: "Application processing fee — Daegu Arts University",
    application_id: "APP-2024-004",
    created_at: "2024-02-02T08:00:00Z",
    updated_at: "2024-02-03T10:30:00Z",
  },
  {
    id: 2,
    user_id: "student_02",
    studentName: "David Kwizera",
    amount: "150.00",
    currency: "USD",
    country: "Uganda",
    status: "Paid",
    description: "Application processing fee — Tongmyong University",
    application_id: "APP-2024-002",
    created_at: "2024-01-28T14:30:00Z",
    updated_at: "2024-01-29T09:00:00Z",
  },
  {
    id: 3,
    user_id: "student_03",
    studentName: "Sarah Uwase",
    amount: "150.00",
    currency: "USD",
    country: "Kenya",
    status: "Pending",
    description: "Application processing fee — Seoul Women's University",
    application_id: "APP-2024-003",
    created_at: "2024-01-25T11:00:00Z",
    updated_at: "2024-01-25T11:00:00Z",
  },
  {
    id: 4,
    user_id: "student_01",
    studentName: "John Doe",
    amount: "200.00",
    currency: "USD",
    country: "Rwanda",
    status: "Paid",
    description: "Visa consultation service fee",
    application_id: null,
    created_at: "2024-03-01T09:00:00Z",
    updated_at: "2024-03-01T09:15:00Z",
  },
  {
    id: 5,
    user_id: "student_04",
    studentName: "Alice Mutesi",
    amount: "75.00",
    currency: "USD",
    country: "Tanzania",
    status: "Refunded",
    description: "Application processing fee refund",
    application_id: "APP-2024-001",
    created_at: "2024-02-15T13:00:00Z",
    updated_at: "2024-02-20T16:00:00Z",
  },
];

/**
 * Status badge config for FILE.status values
 * Parallel to EDUC_BRIDGE_APP_TRACKER statuses
 */
export const FILE_STATUS_STYLES = {
  Paid:     { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200"  },
  Pending:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
  Refunded: { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  Failed:   { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200"    },
};
