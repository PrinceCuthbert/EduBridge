// ─────────────────────────────────────────────────────────────
//  src/services/financialService.js
//
//  WHY THIS FILE EXISTS:
//  Single source of truth for all financial analytics data.
//  Reads from visaService (live localStorage data) and merges
//  with mockFinancialData for chart seed data.
//
//  THE ONE RULE:
//  FinancialReports.jsx never touches localStorage directly.
//  It only calls functions from this file.
//
//  BACKEND SWAP (future):
//  Replace the bodies with fetch() calls.
//  The page and hooks never change — they already await everything.
// ─────────────────────────────────────────────────────────────

import { getVisaRequests } from "./visaService";
import { MOCK_FILE_RECORDS } from "../data/fileRecords";
import {
  MOCK_MONTHLY_REVENUE,
  MOCK_MONTHLY_APPLICATIONS,
  MOCK_MONTHLY_VISITORS,
  MOCK_PAYMENT_METHODS,
  MOCK_DESTINATION_DISTRIBUTION,
} from "../data/mockFinancialData";
import {
  parseFee,
  sumVisaFees,
  countByField,
  formatCurrency,
  groupByMonth,
  shortMonthFromKey,
} from "../utils/financialUtils";

// ── Helpers ──────────────────────────────────────────────────

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ── Public API ───────────────────────────────────────────────

/**
 * Compute the four KPI stats cards:
 *   - Total Visa Revenue (sum of all paid consultation fees)
 *   - Total Transactions (total visa cases with a fee set)
 *   - Average Fee per Case
 *   - Pending Fees count (feeStatus = "Unpaid")
 *
 * @returns {Promise<{totalRevenue, totalTransactions, avgFee, pendingCount, refundCount, previousRevenue}>}
 */
export const getFinancialStats = async () => {
  await delay();
  const visaRequests = await getVisaRequests();

  // All cases that have a fee set (paid or unpaid)
  const casesWithFee = visaRequests.filter((r) => r.consultationFee && parseFee(r.consultationFee) > 0);

  // Paid cases only → actual revenue
  const paidCases = casesWithFee.filter((r) => r.feeStatus === "Paid");

  const totalRevenue = sumVisaFees(paidCases);
  const totalTransactions = casesWithFee.length;
  const avgFee = totalTransactions > 0 ? totalRevenue / paidCases.length || 0 : 0;
  const pendingCount = countByField(casesWithFee, "feeStatus", "Unpaid");

  // FILE record refunds
  const refundCount = MOCK_FILE_RECORDS.filter((f) => f.status === "Refunded").length;

  return {
    totalRevenue,
    totalTransactions,
    avgFee,
    pendingCount,
    refundCount,
    formatted: {
      totalRevenue: formatCurrency(totalRevenue),
      avgFee: formatCurrency(avgFee),
    },
  };
};

/**
 * Monthly revenue chart data.
 * First tries to compute from live visa requests in localStorage.
 * Falls back to MOCK_MONTHLY_REVENUE if there's not enough data
 * (< 3 months of data) — typical fresh dev install.
 *
 * @returns {Promise<Array<{month, revenue, cases}>>}
 */
export const getRevenueByMonth = async () => {
  await delay(150);
  const visaRequests = await getVisaRequests();
  const paidCases = visaRequests.filter(
    (r) => r.feeStatus === "Paid" && r.consultationFee && r.submissionDate
  );

  const grouped = groupByMonth(paidCases, "submissionDate");

  if (grouped.size >= 2) {
    // Build chart data from actual localStorage records
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, records]) => ({
        month: shortMonthFromKey(monthKey),
        revenue: sumVisaFees(records),
        cases: records.length,
      }));
  }

  // Not enough live data → use mock seed (dev mode)
  return MOCK_MONTHLY_REVENUE;
};

/**
 * Monthly application breakdown chart data.
 * Groups visa requests by submission month and status.
 * Falls back to MOCK_MONTHLY_APPLICATIONS if not enough data.
 *
 * @returns {Promise<Array<{month, New, Approved, Rejected, 'Pending Documents', 'In Progress'}>>}
 */
export const getApplicationsByMonth = async () => {
  await delay(150);
  const visaRequests = await getVisaRequests();
  const withDates = visaRequests.filter((r) => r.submissionDate);

  const grouped = groupByMonth(withDates, "submissionDate");

  if (grouped.size >= 2) {
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, records]) => ({
        month: shortMonthFromKey(monthKey),
        New: countByField(records, "status", "New"),
        Approved: countByField(records, "status", "Approved"),
        Rejected: countByField(records, "status", "Rejected"),
        "Pending Documents": countByField(records, "status", "Pending Documents"),
        "In Progress": countByField(records, "status", "In Progress"),
      }));
  }

  return MOCK_MONTHLY_APPLICATIONS;
};

/**
 * Monthly visitor chart data.
 * Returns simulated traffic data (from mockFinancialData).
 * Future: replace with analytics API (Plausible, GA, etc.)
 *
 * @returns {Promise<Array<{month, visitors}>>}
 */
export const getVisitorsByMonth = async () => {
  await delay(100);
  return MOCK_MONTHLY_VISITORS;
};

/**
 * Payment method distribution for the donut chart.
 *
 * @returns {Promise<Array<{name, value, color}>>}
 */
export const getPaymentMethodBreakdown = async () => {
  await delay(100);
  return MOCK_PAYMENT_METHODS;
};

/**
 * Destination country breakdown (for table/chart).
 *
 * @returns {Promise<Array<{country, count, flag}>>}
 */
export const getDestinationBreakdown = async () => {
  await delay(100);
  return MOCK_DESTINATION_DISTRIBUTION;
};

/**
 * Recent transactions — merges visa fee records + FILE records.
 * Returns the most recent N records, unified shape.
 *
 * @param {number} [limit=10]
 * @returns {Promise<Array>}
 */
export const getRecentTransactions = async (limit = 10) => {
  await delay(200);
  const visaRequests = await getVisaRequests();

  // Visa consultation fee records
  const visaTransactions = visaRequests
    .filter((r) => r.consultationFee && parseFee(r.consultationFee) > 0)
    .map((r) => ({
      id: r.id,
      type: "Visa Consultation",
      studentName: r.fullName,
      destination: r.destination,
      amount: parseFee(r.consultationFee),
      amountFormatted: r.consultationFee,
      status: r.feeStatus === "Paid" ? "Paid" : "Unpaid",
      date: r.submissionDate,
      visaType: r.visaType,
    }));

  // FILE entity records (application processing fees, refunds, etc.)
  const fileTransactions = MOCK_FILE_RECORDS.map((f) => ({
    id: `FILE-${f.id}`,
    type: "Processing Fee",
    studentName: f.studentName,
    destination: f.country,
    amount: parseFloat(f.amount),
    amountFormatted: `${f.currency} ${parseFloat(f.amount).toFixed(2)}`,
    status: f.status,
    date: f.created_at?.slice(0, 10),
    description: f.description,
  }));

  // Merge, sort by date desc, limit
  return [...visaTransactions, ...fileTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};
