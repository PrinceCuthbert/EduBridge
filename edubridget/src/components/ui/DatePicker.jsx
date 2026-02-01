
import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Custom DatePicker component mimicking Shadcn UI.
 * Does not rely on date-fns or react-day-picker to keep dependencies low.
 */
export default function DatePicker({ value, onChange, placeholder = "Pick a date" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = (e) => {
    e.preventDefault();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Adjust for timezone offset to ensure the string matches the local date
    const offset = selectedDate.getTimezoneOffset();
    const adjustedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    const dateString = adjustedDate.toISOString().split('T')[0];
    
    onChange(dateString);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty slots for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateToCheck = new Date(year, month, day);
        // Simple comparison string
        const checkStr = dateToCheck.toISOString().split('T')[0];
        // Handle value date string comparison
        const isSelected = value === checkStr; 
        // Today check
        const isToday = new Date().toDateString() === dateToCheck.toDateString();

        days.push(
            <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day)}
                className={`
                    h-9 w-9 rounded-md text-sm p-0 font-normal aria-selected:opacity-100 transition-colors
                    ${isSelected ? 'bg-primary text-white hover:bg-primary hover:text-white' : 'hover:bg-slate-100 text-slate-900'}
                    ${isToday && !isSelected ? 'bg-slate-100 text-slate-900 border border-slate-200' : ''}
                `}
            >
                {day}
            </button>
        );
    }

    return days;
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
            w-full flex items-center justify-start text-left font-normal
            px-3 py-2 text-sm border rounded-lg transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            ${!value ? 'text-slate-500' : 'text-slate-900'}
            border-slate-300 bg-white
        `}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
        {value ? formatDate(value) : <span>{placeholder}</span>}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 p-3 bg-white border border-slate-200 rounded-lg shadow-lg w-auto min-w-[280px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 space-x-2">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-md transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                <div className="text-sm font-semibold text-slate-900">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-md transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>

            {/* Weekdays */}
            <div className="flex mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="h-9 w-9 text-[0.8rem] font-normal text-slate-500 flex items-center justify-center">
                        {d}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
            </div>
        </div>
      )}
    </div>
  );
}
