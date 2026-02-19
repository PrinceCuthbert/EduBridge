import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified native datetime-local wrapper
export default function DateTimePicker({ date, setDate, className }) {
  const handleChange = (e) => {
     const d = new Date(e.target.value);
     if (!isNaN(d.getTime())) {
        setDate(d);
     }
  };
  
  // Format to YYYY-MM-DDTHH:mm
  const format = (d) => {
     if (!(d instanceof Date) || isNaN(d)) return '';
     const pad = (n) => n < 10 ? '0'+n : n;
     return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div className={cn("relative", className)}>
       <input 
         type="datetime-local" 
         value={date instanceof Date ? format(date) : ''}
         onChange={handleChange}
         className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
       />
    </div>
  )
}
