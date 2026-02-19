// src/utils/formatDate.js
// Single source of truth for date formatting across the application.
// Import the variant that suits the display context:
//   formatDate     → short month, used in table rows (e.g. "Feb 19, 2026")
//   formatDateLong → full month, used in detail/review pages (e.g. "February 19, 2026")

/**
 * Formats a date string into a short, table-friendly format.
 * @param {string|Date|null} d
 * @returns {string}
 */
export const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day:   "2-digit",
        year:  "numeric",
      })
    : "—";

/**
 * Formats a date string into a long, detail-page-friendly format.
 * @param {string|Date|null} d
 * @returns {string}
 */
export const formatDateLong = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day:   "2-digit",
        year:  "numeric",
      })
    : "—";
