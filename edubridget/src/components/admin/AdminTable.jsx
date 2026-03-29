import React, { useState } from "react";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminTable({
  columns,
  data,
  isLoading,
  emptyState,
  onRowClick,
  itemsPerPage = 3,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    // CHANGED: rounded-[2.5rem] -> rounded-xl
    // CHANGED: shadow-2xl -> shadow-sm
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto scrollbar-hover">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            {/* CHANGED: Removed tracking-[0.25em], uppercase. Reduced py-7 -> py-3 */}
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 whitespace-nowrap ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={columns.length} className="px-6 py-4">
                    {/* CHANGED: rounded-[1.5rem] -> rounded-lg */}
                    <div className="h-8 bg-slate-100 rounded-lg w-full" />
                  </td>
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr
                  key={item.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(item)}
                  // CHANGED: hover:bg-[#F8FAFC] -> hover:bg-slate-50
                  // CHANGED: duration-500 -> duration-150 (snappier feel)
                  className={`hover:bg-slate-50 transition-colors duration-150 group ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((col, colIndex) => (
                    // CHANGED: px-10 py-7 -> px-6 py-4 (Standard density)
                    <td
                      key={colIndex}
                      className={`px-6 py-4 ${col.className || ""}`}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center max-w-sm mx-auto">
                      {/* CHANGED: Simplified empty state icon container */}
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <FileText size={24} className="text-slate-400" />
                      </div>
                      {/* CHANGED: font-serif -> font-sans */}
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">
                        No records found
                      </h4>
                      <p className="text-sm text-slate-500">
                        There are no records to display at the moment.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(startIndex + itemsPerPage, data.length)}
            </span>{" "}
            of <span className="font-semibold">{data.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
