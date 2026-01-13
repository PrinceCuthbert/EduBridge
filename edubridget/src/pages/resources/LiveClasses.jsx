import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faCalendar, faUsers, faClock, faBell } from "@fortawesome/free-solid-svg-icons";

function LiveClassesTab() {
  const [loading, setLoading] = useState(true);

  // Simulate async data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const liveClasses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      instructor: "Prof. Sarah Johnson",
      date: "Today",
      time: "2:00 PM - 3:30 PM",
      students: 45,
      platform: "Google Meet",
      platformIcon: "📹",
      isLive: true,
      joinLink: "#",
    },
    {
      id: 2,
      title: "Korean Language Basics",
      instructor: "Kim Min-jun",
      date: "Tomorrow",
      time: "4:00 PM - 5:00 PM",
      students: 32,
      platform: "Zoom",
      platformIcon: "💻",
      isLive: false,
      calendarLink: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Korean+Language+Basics&dates=20250620T150000Z/20250620T160000Z",
    },
    {
      id: 3,
      title: "Python Programming",
      instructor: "Dr. Michael Chen",
      date: "Dec 2",
      time: "6:00 PM - 7:30 PM",
      students: 28,
      platform: "Google Meet",
      platformIcon: "📹",
      isLive: false,
      calendarLink: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Python+Programming&dates=20250620T150000Z/20250620T160000Z",
    },
  ];

  return (
    <div className="container mx-auto px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Live Classes & Schedule
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Join interactive live sessions with expert instructors from around the world.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-slate-200 rounded-lg w-2/3"></div>
                <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded-lg mb-3 w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded-lg mb-2 w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded-lg mb-2 w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded-lg mb-6 w-1/2"></div>
              <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Live Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {liveClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white rounded-[2rem] p-6 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col"
              >
                {/* Header with Title and Platform */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors flex-1 pr-2">
                    {classItem.title}
                  </h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full whitespace-nowrap flex items-center gap-1">
                    {classItem.platformIcon} {classItem.platform}
                  </span>
                </div>

                {/* Instructor */}
                <p className="text-sm text-slate-600 mb-3">
                  {classItem.instructor}
                </p>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-xs" />
                  <span>{classItem.date}</span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-xs" />
                  <span>{classItem.time}</span>
                </div>

                {/* Students Enrolled */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-grow">
                  <FontAwesomeIcon icon={faUsers} className="text-xs" />
                  <span>{classItem.students} students enrolled</span>
                </div>

                {/* Action Button */}
                {classItem.isLive ? (
                  <a
                    href={classItem.joinLink}
                    className="w-full px-6 py-3 bg-primary text-white hover:bg-primary-dark font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2 no-underline"
                  >
                    <FontAwesomeIcon icon={faVideo} className="text-sm" />
                    Join Now
                  </a>
                ) : (
                  <a
                    href={classItem.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2 no-underline"
                  >
                    <FontAwesomeIcon icon={faBell} className="text-sm" />
                    Set Reminder
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Upcoming Classes Calendar Section */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faCalendar} className="text-3xl text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-3 font-serif">
                Upcoming Classes Calendar
              </h3>
              
              <p className="text-slate-600 mb-6">
                View all scheduled live classes and set up reminders
              </p>

              <div className="bg-slate-50 rounded-2xl p-8 mb-6">
                <p className="text-slate-500 mb-4">📆 Calendar integration coming soon</p>
              </div>

              <a
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Live+Classes&dates=20250620T150000Z/20250620T160000Z&details=Join+us+for+live+sessions&location=Online"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary/5 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all border border-primary/20 hover:shadow-lg hover:shadow-primary/20 no-underline"
              >
                <FontAwesomeIcon icon={faCalendar} className="text-sm" />
                Add to Google Calendar
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LiveClassesTab;
