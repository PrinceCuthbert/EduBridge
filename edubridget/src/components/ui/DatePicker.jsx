import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Since I don't have the original code, and DatePicker usually relies on "date-fns" and "react-day-picker",
// I will create a simple HTML date input wrapper for now to verify functionality. 
// If "react-day-picker" is in package.json, I could do better, but it's not in the dependencies list I saw earlier! 
// Wait, Step 608 package.json does NOT list "react-day-picker".
// So the original DatePicker must have been using something else or was a custom implementation.
// Or maybe it was using native input?
// I see "@radix-ui/react-popover" is NOT in package.json either??
// Wait, I missed checking for popover.
// Let's fallback to a native date picker tailored to look like shadcn.

// Accepts two calling conventions:
//   Legacy:  <DatePicker date={d} setDate={fn} />
//   Standard:<DatePicker value={str} onChange={fn} />
export default function DatePicker({ date, setDate, value, onChange, className }) {
  // Normalise incoming value to a YYYY-MM-DD string
  const controlled = value ?? date;
  const dateStr =
    controlled instanceof Date
      ? controlled.toISOString().split("T")[0]
      : controlled
      ? String(controlled).split("T")[0]
      : "";

  const handleChange = (e) => {
    const raw = e.target.value; // "YYYY-MM-DD" or ""
    if (onChange) {
      // Standard API: pass the string directly (matches updateTimeline usage)
      onChange(raw);
    } else if (setDate) {
      // Legacy API: pass a Date object
      const d = new Date(raw);
      setDate(!isNaN(d.getTime()) ? d : undefined);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="date"
        value={dateStr}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
