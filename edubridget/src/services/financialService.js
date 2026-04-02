// ─────────────────────────────────────────────────────────────
//  src/services/financialService.js
//
//  Single source of truth for all financial analytics data.
//  Reads from visaService (live metadata) and Firestore.
// ─────────────────────────────────────────────────────────────

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { getVisaRequests } from "./visaService";
import { getApplications } from "./applicationService";
import {
  parseFee,
  sumVisaFees,
  countByField,
  formatCurrency,
  groupByMonth,
  shortMonthFromKey,
} from "../utils/financialUtils";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

/**
 * Compute the KPI stats cards:
 *   - Total Visa Revenue (sum of all paid consultation fees)
 *   - Total Transactions (total count of PAID cases)
 *   - Average Fee per Case (based on paid cases)
 *   - Pending Fees count (feeStatus = "Unpaid" but fee is set)
 */
export const getFinancialStats = async () => {
  await delay();
  const visaRequests = await getVisaRequests();

  // Cases that have a fee set
  const casesWithFee = visaRequests.filter((r) => r.consultationFee && parseFee(r.consultationFee) > 0);

  // Paid cases only → actual revenue and transactions
  const paidCases = casesWithFee.filter((r) => r.feeStatus === "Paid");

  const totalRevenue = sumVisaFees(paidCases);
  const totalTransactions = paidCases.length;
  const avgFee = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const pendingCount = countByField(casesWithFee, "feeStatus", "Unpaid");

  return {
    totalRevenue,
    totalTransactions,
    avgFee,
    pendingCount,
    formatted: {
      totalRevenue: formatCurrency(totalRevenue),
      avgFee: formatCurrency(avgFee),
    },
  };
};

/**
 * Monthly revenue chart data.
 * Computes from live visa requests where fee is Paid.
 */
export const getRevenueByMonth = async () => {
  await delay(150);
  const visaRequests = await getVisaRequests();
  const paidCases = visaRequests.filter(
    (r) => r.feeStatus === "Paid" && r.consultationFee && r.submissionDate
  );

  const grouped = groupByMonth(paidCases, "submissionDate");

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, records]) => ({
      month: shortMonthFromKey(monthKey),
      revenue: sumVisaFees(records),
      cases: records.length,
    }));
};

/**
 * Monthly application breakdown chart data.
 * Groups visa requests by submission month and status.
 */
export const getApplicationsByMonth = async () => {
  await delay(150);
  const applications = await getApplications();
  const withDates = applications.filter((r) => r.submissionDate);

  const grouped = groupByMonth(withDates, "submissionDate");

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, records]) => ({
      month: shortMonthFromKey(monthKey),
      Pending: countByField(records, "status", "Pending"),
      Reviewing: countByField(records, "status", "Reviewing"),
      "Needs Changes": countByField(records, "status", "Needs Changes"),
      Approved: countByField(records, "status", "Approved"),
      Rejected: countByField(records, "status", "Rejected"),
    }));
};

/**
 * Monthly visitor chart data.
 * Fetches actual login activity from Firestore and aggregates by month.
 */
export const getVisitorsByMonth = async () => {
  await delay(100);
  const snap = await getDocs(collection(db, "loginActivity"));
  const logs = snap.docs.map((doc) => doc.data());

  // Filter out any without timestamps
  const validLogs = logs.filter((l) => l.timestamp);

  // Group by "YYYY-MM"
  const grouped = groupByMonth(validLogs, "timestamp");

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, records]) => ({
      month: shortMonthFromKey(monthKey),
      visitors: records.length,
    }));
};
