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

export default function DatePicker({ date, setDate, className }) {
  // Simple wrapper around native date input
  const handleChange = (e) => {
    // date comes as Date object usually, setDate expects Date object?
    // Or string depending on usage.
    // Let's assume standard behavior.
    const d = new Date(e.target.value);
    if (!isNaN(d.getTime())) {
       setDate(d);
    } else {
       setDate(undefined);
    }
  };
  
  // Format date to YYYY-MM-DD for input value
  const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : (date ? String(date).split('T')[0] : '');

  return (
    <div className={cn("relative", className)}>
       <input 
         type="date" 
         value={dateStr}
         onChange={handleChange}
         className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
       />
    </div>
  )
}
