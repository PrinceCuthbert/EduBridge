// ─────────────────────────────────────────────────────────────
//  src/data/mockFinancialData.js
//
//  WHY THIS FILE EXISTS:
//  Seed data for the Financial Reports charts.
//  Represents 12 months of simulated business activity
//  (visa fee revenue, application counts, website visitors).
//  All numbers are plausible for a small-to-mid education agency.
//
//  BACKEND SWAP:
//  Delete this file once real analytics endpoints exist.
//  The financialService.js will fetch() instead of using these.
// ─────────────────────────────────────────────────────────────

/** Revenue earned from visa consultation fees each month (USD) */
export const MOCK_MONTHLY_REVENUE = [
  { month: "Jan", revenue: 2250, cases: 15 },
  { month: "Feb", revenue: 3000, cases: 20 },
  { month: "Mar", revenue: 2700, cases: 18 },
  { month: "Apr", revenue: 3750, cases: 25 },
  { month: "May", revenue: 4200, cases: 28 },
  { month: "Jun", revenue: 5250, cases: 35 },
  { month: "Jul", revenue: 4800, cases: 32 },
  { month: "Aug", revenue: 6000, cases: 40 },
  { month: "Sep", revenue: 5550, cases: 37 },
  { month: "Oct", revenue: 6750, cases: 45 },
  { month: "Nov", revenue: 7200, cases: 48 },
  { month: "Dec", revenue: 8100, cases: 54 },
];

/**
 * Visa application counts grouped by status each month.
 * Simulates seasonal patterns (e.g. big intake in Sep, Dec).
 */
export const MOCK_MONTHLY_APPLICATIONS = [
  { month: "Jan", New: 8,  Approved: 5,  Rejected: 1, "Pending Documents": 3 },
  { month: "Feb", New: 12, Approved: 7,  Rejected: 2, "Pending Documents": 4 },
  { month: "Mar", New: 10, Approved: 6,  Rejected: 1, "Pending Documents": 3 },
  { month: "Apr", New: 15, Approved: 9,  Rejected: 2, "Pending Documents": 5 },
  { month: "May", New: 18, Approved: 11, Rejected: 2, "Pending Documents": 6 },
  { month: "Jun", New: 22, Approved: 14, Rejected: 3, "Pending Documents": 7 },
  { month: "Jul", New: 20, Approved: 12, Rejected: 2, "Pending Documents": 6 },
  { month: "Aug", New: 26, Approved: 17, Rejected: 3, "Pending Documents": 8 },
  { month: "Sep", New: 24, Approved: 15, Rejected: 3, "Pending Documents": 7 },
  { month: "Oct", New: 30, Approved: 19, Rejected: 4, "Pending Documents": 9 },
  { month: "Nov", New: 32, Approved: 21, Rejected: 4, "Pending Documents": 9 },
  { month: "Dec", New: 36, Approved: 24, Rejected: 5, "Pending Documents": 10 },
];

/** Unique monthly visitors to the EduBridge platform (simulated analytics) */
export const MOCK_MONTHLY_VISITORS = [
  { month: "Jan", visitors: 1240 },
  { month: "Feb", visitors: 1580 },
  { month: "Mar", visitors: 1420 },
  { month: "Apr", visitors: 1890 },
  { month: "May", visitors: 2100 },
  { month: "Jun", visitors: 2650 },
  { month: "Jul", visitors: 2300 },
  { month: "Aug", visitors: 2950 },
  { month: "Sep", visitors: 2740 },
  { month: "Oct", visitors: 3300 },
  { month: "Nov", visitors: 3580 },
  { month: "Dec", visitors: 4100 },
];

/** Payment method distribution for visa consultation fees */
export const MOCK_PAYMENT_METHODS = [
  { name: "Mobile Money", value: 45, color: "#3b82f6" },
  { name: "Card Payment",  value: 32, color: "#8b5cf6" },
  { name: "Bank Transfer", value: 18, color: "#10b981" },
  { name: "Cash",          value: 5,  color: "#f59e0b" },
];

/** Destination country distribution for visa applications */
export const MOCK_DESTINATION_DISTRIBUTION = [
  { country: "Canada",       count: 38, flag: "🇨🇦" },
  { country: "South Korea",  count: 28, flag: "🇰🇷" },
  { country: "UK",           count: 15, flag: "🇬🇧" },
  { country: "Australia",    count: 10, flag: "🇦🇺" },
  { country: "Germany",      count: 6,  flag: "🇩🇪" },
  { country: "USA",          count: 3,  flag: "🇺🇸" },
];
