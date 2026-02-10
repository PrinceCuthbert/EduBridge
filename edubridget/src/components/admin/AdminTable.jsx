import React from "react";
import { FileText } from "lucide-react";

export default function AdminTable({ 
  columns, 
  data, 
  isLoading, 
  emptyState, 
  onRowClick 
}) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-2xl shadow-slate-200/30 overflow-hidden">
      <div className="overflow-x-auto scrollbar-hover">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/40 border-b border-slate-100 text-[10px] uppercase text-slate-400 font-bold tracking-[0.25em]">
              {columns.map((col, index) => (
                <th key={index} className={`px-10 py-7 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={columns.length} className="px-10 py-7">
                    <div className="h-12 bg-slate-50/50 rounded-[1.5rem] w-full" />
                  </td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr 
                  key={item.id || rowIndex} 
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`hover:bg-[#F8FAFC] transition-all duration-500 group ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`px-10 py-7 ${col.className || ''}`}>
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-10 py-32 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center max-w-sm mx-auto">
                      <div className="w-24 h-24 bg-slate-50/50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100">
                        <FileText size={40} className="text-slate-200" />
                      </div>
                      <h4 className="text-xl font-serif text-[#0F172A] mb-2 tracking-tight">No Records Found</h4>
                      <p className="text-[13px] font-medium text-slate-400 mb-6 leading-relaxed antialiased">
                        The current registry contains no data matching your criteria.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
