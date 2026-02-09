import React, { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

/**
 * Enhanced DateTimePicker component with clean design
 * Supports both date and time selection with AM/PM toggle
 */
export default function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date & time",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null,
  );
  const [selectedTime, setSelectedTime] = useState({
    hour: value ? new Date(value).getHours() % 12 || 12 : 12,
    minute: value ? new Date(value).getMinutes() : 0,
    period: value && new Date(value).getHours() >= 12 ? "PM" : "AM",
  });
  const [view, setView] = useState("date"); // 'date' or 'time'
  const containerRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const handleDateClick = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    setSelectedDate(date);
    setView("time");
  };

  const handleTimeChange = (type, value) => {
    setSelectedTime((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleConfirm = () => {
    if (!selectedDate) return;

    let hour = selectedTime.hour;
    if (selectedTime.period === "PM" && hour !== 12) {
      hour += 12;
    } else if (selectedTime.period === "AM" && hour === 12) {
      hour = 0;
    }

    const finalDate = new Date(selectedDate);
    finalDate.setHours(hour, selectedTime.minute, 0, 0);

    // Format to datetime-local string: YYYY-MM-DDTHH:mm
    const year = finalDate.getFullYear();
    const month = String(finalDate.getMonth() + 1).padStart(2, "0");
    const day = String(finalDate.getDate()).padStart(2, "0");
    const hours = String(finalDate.getHours()).padStart(2, "0");
    const minutes = String(finalDate.getMinutes()).padStart(2, "0");

    const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    onChange(dateTimeString);
    setIsOpen(false);
    setView("date");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange("");
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    const today = new Date();

    // Empty slots for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateToCheck = new Date(year, month, day);
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;
      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          className={`
            h-9 w-9 rounded-md text-sm p-0 font-medium transition-all
            ${
              isSelected
                ? "bg-primary text-white shadow-md hover:bg-primary/90"
                : "hover:bg-slate-100 text-slate-900"
            }
            ${
              isToday && !isSelected
                ? "bg-slate-100 text-slate-900 ring-2 ring-primary ring-offset-1"
                : ""
            }
          `}>
          {day}
        </button>,
      );
    }

    return days;
  };

  const renderTimePicker = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-2">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Select time"}
          </p>
        </div>

        {/* Time Display */}
        <div className="flex items-center justify-center gap-2 text-4xl font-bold text-slate-900">
          <span>{String(selectedTime.hour).padStart(2, "0")}</span>
          <span>:</span>
          <span>{String(selectedTime.minute).padStart(2, "0")}</span>
          <span className="text-2xl ml-2">{selectedTime.period}</span>
        </div>

        {/* AM/PM Toggle */}
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => handleTimeChange("period", "AM")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              selectedTime.period === "AM"
                ? "bg-primary text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}>
            AM
          </button>
          <button
            type="button"
            onClick={() => handleTimeChange("period", "PM")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              selectedTime.period === "PM"
                ? "bg-primary text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}>
            PM
          </button>
        </div>

        {/* Hour Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            Hour
          </label>
          <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto p-1">
            {hours.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => handleTimeChange("hour", hour)}
                className={`h-9 rounded-md text-sm font-medium transition-all ${
                  selectedTime.hour === hour
                    ? "bg-primary text-white shadow-md"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-900"
                }`}>
                {String(hour).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        {/* Minute Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-2 block">
            Minute
          </label>
          <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
            {minutes
              .filter((m) => m % 5 === 0)
              .map((minute) => (
                <button
                  key={minute}
                  type="button"
                  onClick={() => handleTimeChange("minute", minute)}
                  className={`h-9 rounded-md text-sm font-medium transition-all ${
                    selectedTime.minute === minute
                      ? "bg-primary text-white shadow-md"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-900"
                  }`}>
                  {String(minute).padStart(2, "0")}
                </button>
              ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setView("date")}
            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
            Back to Date
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors shadow-md">
            Confirm
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between text-left font-normal
          px-3 py-2 text-sm border rounded-lg transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          ${!value ? "text-slate-500" : "text-slate-900"}
          border-slate-300 bg-white hover:border-slate-400
        `}>
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
          {value ? formatDateTime(value) : <span>{placeholder}</span>}
        </div>
        {value && (
          <X
            className="h-4 w-4 text-slate-400 hover:text-slate-600"
            onClick={handleClear}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-slate-200 rounded-lg shadow-2xl w-auto">
          {/* Tab Switcher */}
          <div className="flex border-b border-slate-200 bg-slate-50 rounded-t-lg">
            <button
              type="button"
              onClick={() => setView("date")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold transition-colors ${
                view === "date"
                  ? "text-primary border-b-2 border-primary bg-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}>
              <CalendarIcon className="h-4 w-4" />
              Date
            </button>
            <button
              type="button"
              onClick={() => setView("time")}
              disabled={!selectedDate}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-semibold transition-colors ${
                view === "time"
                  ? "text-primary border-b-2 border-primary bg-white"
                  : "text-slate-600 hover:text-slate-900"
              } ${!selectedDate ? "opacity-50 cursor-not-allowed" : ""}`}>
              <Clock className="h-4 w-4" />
              Time
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {view === "date" ? (
              <div className="min-w-[280px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="text-sm font-bold text-slate-900">
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Weekdays */}
                <div className="flex mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div
                      key={d}
                      className="h-9 w-9 text-xs font-semibold text-slate-500 flex items-center justify-center">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleDateClick(new Date().getDate())}
                    className="flex-1 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    Today
                  </button>
                  {selectedDate && (
                    <button
                      type="button"
                      onClick={() => setView("time")}
                      className="flex-1 px-3 py-2 text-xs font-medium bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors">
                      Select Time →
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="min-w-[320px]">{renderTimePicker()}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
