import React from "react";
import { Search } from "lucide-react";

export default function AdminFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterOptions = [],
  activeFilter,
  onFilterChange,
  secondaryActions, // For export buttons etc.
}) {
  return (
    // CHANGED CONTAINER STYLES:
    // Added 'transition-all focus-within:border-blue-400 focus-within:shadow-md'
    // This makes the whole box glow gently when typing, instead of a harsh black line on the text.
    <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm transition-all focus-within:border-blue-400 focus-within:shadow-md flex flex-col xl:flex-row items-center gap-2">
      <div className="relative flex-1 group w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search
            size={16}
            className="text-slate-400 group-focus-within:text-blue-500 transition-colors"
          />
        </div>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          // CHANGED INPUT STYLES:
          // Added 'outline-none'. 'border-0' and 'focus:ring-0' ensure no default borders appear.
          className="w-full bg-transparent border-0 text-slate-900 text-sm focus:ring-0 outline-none block pl-10 py-2.5 transition-all placeholder:text-slate-400 font-medium"
        />
      </div>

      {(filterOptions.length > 0 || secondaryActions) && (
        <div className="h-6 w-px bg-slate-200 hidden lg:block mx-2" />
      )}

      {filterOptions.length > 0 && (
        <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-lg overflow-hidden border border-slate-200/50 w-full xl:w-auto overflow-x-auto scrollbar-hide">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => onFilterChange(option)}
              className={`px-3.5 py-1.5 rounded-md text-sm whitespace-nowrap font-medium transition-all ${
                activeFilter === option
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {secondaryActions && <div className="flex pl-2">{secondaryActions}</div>}
    </div>
  );
}
