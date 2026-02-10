import React from "react";
import { Search } from "lucide-react";

export default function AdminFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterOptions = [],
  activeFilter,
  onFilterChange,
  secondaryActions // For export buttons etc.
}) {
  return (
    <div className="bg-white p-2.5 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/10 flex flex-col xl:flex-row items-center gap-3">
      <div className="relative flex-1 group w-full">
        <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-300 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent border-0 text-[#0F172A] text-[15px] focus:ring-0 block pl-16 py-4.5 transition-all placeholder:text-slate-300 font-medium"
        />
      </div>

      {(filterOptions.length > 0 || secondaryActions) && (
        <div className="h-10 w-px bg-slate-100 hidden lg:block mx-4" />
      )}

      {filterOptions.length > 0 && (
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100 w-full xl:w-auto overflow-x-auto scrollbar-hide">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => onFilterChange(option)}
              className={`px-5 py-2.5 rounded-xl text-[10px] whitespace-nowrap font-bold uppercase tracking-[0.15em] transition-all ${
                activeFilter === option
                  ? "bg-white text-[#0F172A] shadow-md border border-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      
      {secondaryActions && (
        <div className="flex pl-2">
            {secondaryActions}
        </div>
      )}
    </div>
  );
}
