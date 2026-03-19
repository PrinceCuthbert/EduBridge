// ─────────────────────────────────────────────────────────────
//  src/utils/financialUtils.js
//
//  Pure helper functions for financial data processing.
//  Used by financialService.js and FinancialReports.jsx.
//  No side effects, no imports needed — safe to test in isolation.
// ─────────────────────────────────────────────────────────────

/**
 * Parse a fee string like "$150" or "150" into a number.
 * Returns 0 if the string is empty, null, or unparseable.
 *
 * @param {string|number} feeString
 * @returns {number}
 */
export const parseFee = (feeString) => {
  if (!feeString) return 0;
  if (typeof feeString === "number") return feeString;
  const num = parseFloat(String(feeString).replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
};

/**
 * Format a number as a USD currency string.
 * e.g.  1500    → "$1,500"
 *        86.72  → "$86.72"
 *
 * @param {number} amount
 * @param {string} [currency="USD"]
 * @returns {string}
 */
export const formatCurrency = (amount, currency = "USD") => {
  if (amount == null || isNaN(amount)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a large number compactly.
 * e.g.  1240  → "1.2K"
 *       4100  → "4.1K"
 *
 * @param {number} n
 * @returns {string}
 */
export const formatCompact = (n) => {
  if (!n || isNaN(n)) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

/**
 * Group an array of records by the month extracted from a date field.
 * Returns a Map: monthKey (e.g. "2024-02") → array of records.
 *
 * @param {Array}  records  - array of objects
 * @param {string} dateKey  - key to extract the date from (e.g. "submissionDate")
 * @returns {Map<string, Array>}
 */
export const groupByMonth = (records, dateKey) => {
  const map = new Map();
  records.forEach((record) => {
    const val = record[dateKey];
    if (!val) return;
    const monthKey = String(val).slice(0, 7); // "YYYY-MM"
    if (!map.has(monthKey)) map.set(monthKey, []);
    map.get(monthKey).push(record);
  });
  return map;
};

/**
 * Sum all consultationFee values (parsed from strings) in a records array.
 *
 * @param {Array} records - visa request records with .consultationFee
 * @returns {number}
 */
export const sumVisaFees = (records) =>
  records.reduce((total, r) => total + parseFee(r.consultationFee), 0);

/**
 * Count records by a specific field value.
 * e.g. countByField(records, "status", "Approved") → 12
 *
 * @param {Array}  records
 * @param {string} field
 * @param {string} value
 * @returns {number}
 */
export const countByField = (records, field, value) =>
  records.filter((r) => r[field] === value).length;

/**
 * Calculate percentage: (part / total) * 100, rounded to 1 decimal.
 * Returns 0 if total is 0.
 *
 * @param {number} part
 * @param {number} total
 * @returns {number}
 */
export const pct = (part, total) =>
  total === 0 ? 0 : Math.round((part / total) * 10) / 10;

/**
 * Get the short month name from a "YYYY-MM" key.
 * e.g. "2024-02" → "Feb"
 *
 * @param {string} monthKey
 * @returns {string}
 */
export const shortMonthFromKey = (monthKey) => {
  const [year, month] = monthKey.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleString(
    "en-US",
    { month: "short" }
  );
};
